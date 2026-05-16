import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/rateLimit'
import { sendAdminNewQuestionAlert } from '@/lib/email'

const createSchema = z.object({
  body: z.string().min(10, 'Question must be at least 10 characters').max(1000),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const questions = await prisma.question.findMany({
    where: { topicId: params.topicId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, flairTag: true } },
      answers: {
        orderBy: [{ isBest: 'desc' }, { createdAt: 'asc' }],
        include: {
          user: { select: { id: true, name: true, flairTag: true } },
        },
      },
    },
  })

  return NextResponse.json(questions)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 5 questions per user per day
  if (!checkRateLimit(`question:${session.user.id}`, 5, 24 * 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many questions today. Try again tomorrow.' }, { status: 429 })
  }

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: { id: true, propertyName: true, slug: true, city: { select: { name: true, slug: true } } },
  })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const question = await prisma.question.create({
    data: {
      topicId: params.topicId,
      userId: session.user.id,
      body: parsed.data.body,
    },
    include: {
      user: { select: { id: true, name: true, flairTag: true } },
      answers: {
        orderBy: [{ isBest: 'desc' }, { createdAt: 'asc' }],
        include: { user: { select: { id: true, name: true, flairTag: true } } },
      },
    },
  })

  // Fire-and-forget admin email alert
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
  sendAdminNewQuestionAlert({
    posterName: session.user.name || 'Anonymous',
    question: parsed.data.body,
    propertyName: topic.propertyName,
    cityName: topic.city.name,
    topicUrl: `${siteUrl}/${topic.city.slug}/${topic.slug}`,
  }).catch(() => {})

  return NextResponse.json(question, { status: 201 })
}
