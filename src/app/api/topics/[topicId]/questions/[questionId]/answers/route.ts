import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/rateLimit'
import { sendAdminNewAnswerAlert } from '@/lib/email'

const createSchema = z.object({
  body: z.string().min(10, 'Answer must be at least 10 characters').max(2000),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string; questionId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 10 answers per user per day
  if (!checkRateLimit(`answer:${session.user.id}`, 10, 24 * 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many answers today. Try again tomorrow.' }, { status: 429 })
  }

  const question = await prisma.question.findFirst({
    where: { id: params.questionId, topicId: params.topicId },
    include: { topic: { select: { propertyName: true, slug: true, city: { select: { name: true, slug: true } } } } },
  })
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const answer = await prisma.answer.create({
    data: {
      questionId: params.questionId,
      userId: session.user.id,
      body: parsed.data.body,
    },
    include: {
      user: { select: { id: true, name: true, flairTag: true } },
    },
  })

  // Fire-and-forget admin email alert
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
  if (question.topic) {
    sendAdminNewAnswerAlert({
      posterName: session.user.name || 'Anonymous',
      answer: parsed.data.body,
      question: question.body,
      propertyName: question.topic.propertyName,
      cityName: question.topic.city.name,
      topicUrl: `${siteUrl}/${question.topic.city.slug}/${question.topic.slug}`,
    }).catch(() => {})
  }

  return NextResponse.json(answer, { status: 201 })
}
