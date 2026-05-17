import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTopicSchema } from '@/lib/validations/topic'
import { generateTopicSlug } from '@/lib/utils/slugify'
import { PAGINATION } from '@/lib/constants/config'
import { isEmailVerificationEnabled, isNewTopicEnabled } from '@/lib/features'
import { sendAdminNewPostAlert } from '@/lib/email'
import { pingIndexNow } from '@/lib/indexnow'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const citySlug = searchParams.get('city')
  const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const sort     = searchParams.get('sort') || 'latest'
  const type     = searchParams.get('type') || ''
  const check    = searchParams.get('check') === 'true'
  const name     = searchParams.get('name') || ''
  const limit    = PAGINATION.TOPICS_PER_PAGE

  const where: Record<string, unknown> = { isPublished: true }
  if (citySlug) {
    const city = await prisma.city.findUnique({ where: { slug: citySlug }, select: { id: true } })
    if (city) where.cityId = city.id
  }

  // Duplicate-check mode: only look for exact property name match in this city
  if (check && name) {
    const topics = await prisma.topic.findMany({
      where: { ...where, propertyName: { equals: name, mode: 'insensitive' } },
      select: { id: true, propertyName: true },
      take: 1,
    })
    return NextResponse.json({ topics })
  }

  if (type) where.propertyType = type

  const orderBy =
    sort === 'top-rated'      ? { avgRating: 'desc' as const }    :
    sort === 'most-discussed' ? { commentCount: 'desc' as const }  :
                                { createdAt: 'desc' as const }

  // Use an explicit select so internal fields (image pubIds, metaTitle, etc.)
  // are never accidentally exposed to unauthenticated callers.
  const topicSelect = {
    id:           true,
    slug:         true,
    title:        true,
    propertyName: true,
    propertyType: true,
    description:  true,
    address:      true,
    priceMin:     true,
    priceMax:     true,
    image1Url:    true,
    image2Url:    true,
    avgRating:    true,
    ratingCount:  true,
    commentCount: true,
    viewCount:    true,
    createdAt:    true,
    updatedAt:    true,
    developerName: true,
    developerSlug: true,
    city: { select: { id: true, name: true, slug: true } },
    user: { select: { id: true, name: true, image: true } },
  } as const

  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: topicSelect,
    }),
    prisma.topic.count({ where }),
  ])

  return NextResponse.json({ topics, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  if (!isNewTopicEnabled()) {
    return NextResponse.json({ error: 'New topic creation is currently disabled.' }, { status: 403 })
  }

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (isEmailVerificationEnabled() && !session.user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before posting.', requiresVerification: true }, { status: 403 })
  }

  // 5 topics per user per hour
  if (!checkRateLimit(`topic:${session.user.id}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'You are posting too frequently. Please wait before creating another topic.' },
      { status: 429 }
    )
  }
  // IP-level guard
  const ip = getClientIp(req)
  if (!checkRateLimit(`topic-ip:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests from this IP.' }, { status: 429 })
  }

  try {
    const body = await req.json()

    // Bot protection
    if (!(await verifyTurnstile(body.cfToken))) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 })
    }

    const parsed = createTopicSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const d = parsed.data

    // Validate developerSlug against the Developer table to prevent spoofing
    if (d.developerSlug) {
      const dev = await prisma.developer.findUnique({
        where: { slug: d.developerSlug },
        select: { id: true, name: true },
      })
      if (!dev) {
        return NextResponse.json(
          { error: 'Developer not found. Please select a valid developer or leave the field blank.' },
          { status: 400 }
        )
      }
      // Always use the canonical name from DB so it cannot be spoofed
      d.developerName = dev.name
    }

    const baseSlug = generateTopicSlug(d.propertyName)

    // Ensure slug uniqueness within city
    let slug = baseSlug
    let suffix = 0
    while (true) {
      const existing = await prisma.topic.findUnique({ where: { cityId_slug: { cityId: d.cityId, slug } } })
      if (!existing) break
      suffix++
      slug = `${baseSlug}-${suffix}`
    }

    const title = d.title || `${d.propertyName} — Reviews & Discussion`

    const topic = await prisma.topic.create({
      data: {
        cityId:       d.cityId,
        userId:       session.user.id,
        title,
        slug,
        propertyName: d.propertyName,
        propertyType: d.propertyType,
        description:  d.description,
        address:      d.address,
        priceMin:     d.priceMin,
        priceMax:     d.priceMax,
        image1Url:    d.image1Url,
        image1PubId:  d.image1PubId,
        image2Url:    d.image2Url,
        image2PubId:  d.image2PubId,
        developerSlug: d.developerSlug || null,
        developerName: d.developerName || null,
      },
      include: { city: true },
    })

    // Auto-subscribe the creator
    await prisma.topicSubscription.create({ data: { topicId: topic.id, userId: session.user.id } })

    // Notify admin + ping IndexNow (fire-and-forget)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
    const topicFullUrl = `${siteUrl}/${topic.city.slug}/${slug}`
    pingIndexNow([topicFullUrl]).catch(() => {})
    sendAdminNewPostAlert({
      posterName:   session.user.name || 'Anonymous',
      propertyName: topic.propertyName,
      cityName:     topic.city.name,
      description:  topic.description,
      topicUrl:     topicFullUrl,
    }).catch(() => {})

    return NextResponse.json({ topic, slug: `/${topic.city.slug}/${slug}` }, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'This property already has a discussion in this city.' }, { status: 409 })
    }
    console.error('Create topic error:', err)
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
  }
}
