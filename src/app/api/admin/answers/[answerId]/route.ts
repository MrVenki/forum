import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: Awaited<ReturnType<typeof getServerSession<typeof authOptions>>>) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MODERATOR'
}

async function getAnswerWithTopic(answerId: string) {
  return prisma.answer.findUnique({
    where: { id: answerId },
    include: {
      question: {
        include: { topic: { include: { city: { select: { slug: true } } } } },
      },
    },
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const answer = await getAnswerWithTopic(params.answerId)
  if (!answer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof body.body === 'string' && body.body.trim().length >= 10) data.body = body.body.trim()
  if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  await prisma.answer.update({ where: { id: params.answerId }, data })
  const topic = answer.question.topic
  if (topic) revalidatePath(`/${topic.city.slug}/${topic.slug}`)
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { answerId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const answer = await getAnswerWithTopic(params.answerId)
  if (!answer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.answer.delete({ where: { id: params.answerId } })

  // If this was the best answer, mark question as unanswered
  if (answer.isBest) {
    await prisma.question.update({
      where: { id: answer.questionId },
      data: { isAnswered: false },
    })
  }

  const topic = answer.question.topic
  if (topic) revalidatePath(`/${topic.city.slug}/${topic.slug}`)
  return NextResponse.json({ success: true })
}
