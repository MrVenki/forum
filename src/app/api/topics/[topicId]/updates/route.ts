import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { sendAdminNewUpdateAlert } from '@/lib/email'

const createSchema = z.object({
  content:   z.string().min(10, 'Description must be at least 10 characters').max(2000),
  imageUrl:  z.string().url().startsWith('https://res.cloudinary.com/', 'Must be a Cloudinary URL').optional().nullable(),
  imagePubId: z.string().regex(/^[\w\-/]+$/).max(200).optional().nullable(),
  visitedAt: z.string().datetime('Invalid date'),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const { searchParams } = new URL(req.url)
  const page  = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 10

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [updates, total] = await Promise.all([
    prisma.topicUpdate.findMany({
      where: { topicId: params.topicId },
      orderBy: { visitedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true, image: true, flairTag: true } } },
    }),
    prisma.topicUpdate.count({ where: { topicId: params.topicId } }),
  ])

  return NextResponse.json({ updates, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 5 updates per user per hour
  if (!checkRateLimit(`update:${session.user.id}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many updates. Please wait before posting again.' }, { status: 429 })
  }
  const ip = getClientIp(req)
  if (!checkRateLimit(`update-ip:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests from this IP.' }, { status: 429 })
  }

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: { id: true, propertyName: true, slug: true, city: { select: { name: true, slug: true } } },
  })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const update = await prisma.topicUpdate.create({
    data: {
      topicId:   params.topicId,
      userId:    session.user.id,
      content:   parsed.data.content,
      imageUrl:  parsed.data.imageUrl   ?? null,
      imagePubId: parsed.data.imagePubId ?? null,
      visitedAt: new Date(parsed.data.visitedAt),
    },
    include: { user: { select: { id: true, name: true, image: true, flairTag: true } } },
  })

  // Fire-and-forget admin email alert
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
  sendAdminNewUpdateAlert({
    posterName: session.user.name || 'Anonymous',
    content: parsed.data.content,
    propertyName: topic.propertyName,
    cityName: topic.city.name,
    topicUrl: `${siteUrl}/${topic.city.slug}/${topic.slug}`,
    hasImage: !!(parsed.data.imageUrl),
  }).catch(() => {})

  return NextResponse.json(update, { status: 201 })
}
