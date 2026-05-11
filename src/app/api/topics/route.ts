import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTopicSchema } from '@/lib/validations/topic'
import { generateTopicSlug } from '@/lib/utils/slugify'
import { PAGINATION } from '@/lib/constants/config'
import { isEmailVerificationEnabled } from '@/lib/features'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const citySlug = searchParams.get('city')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const sort = searchParams.get('sort') || 'latest'
  const type = searchParams.get('type') || ''
  const limit = PAGINATION.TOPICS_PER_PAGE

  const where: Record<string, unknown> = { isPublished: true }
  if (citySlug) {
    const city = await prisma.city.findUnique({ where: { slug: citySlug }, select: { id: true } })
    if (city) where.cityId = city.id
  }
  if (type) where.propertyType = type

  const orderBy =
    sort === 'top-rated'
      ? { avgRating: 'desc' as const }
      : sort === 'most-discussed'
      ? { commentCount: 'desc' as const }
      : { createdAt: 'desc' as const }

  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        city: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.topic.count({ where }),
  ])

  return NextResponse.json({ topics, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (isEmailVerificationEnabled() && !session.user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before posting.', requiresVerification: true }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = createTopicSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const d = parsed.data
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
        cityId: d.cityId,
        userId: session.user.id,
        title,
        slug,
        propertyName: d.propertyName,
        propertyType: d.propertyType,
        description: d.description,
        address: d.address,
        priceMin: d.priceMin,
        priceMax: d.priceMax,
        image1Url: d.image1Url,
        image1PubId: d.image1PubId,
        image2Url: d.image2Url,
        image2PubId: d.image2PubId,
      },
      include: { city: true },
    })

    return NextResponse.json({ topic, slug: `/${topic.city.slug}/${slug}` }, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'This property already has a discussion in this city.' }, { status: 409 })
    }
    console.error('Create topic error:', err)
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
  }
}
