import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/topics/[topicId]/questions/[questionId]/answers/[answerId]
// Mark an answer as best (only question author can do this)
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { topicId: string; questionId: string; answerId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const question = await prisma.question.findFirst({
    where: { id: params.questionId, topicId: params.topicId },
  })
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  // Only the question author can mark best answer
  if (question.userId !== session.user.id) {
    return NextResponse.json({ error: 'Only the question author can mark a best answer' }, { status: 403 })
  }

  const answer = await prisma.answer.findFirst({
    where: { id: params.answerId, questionId: params.questionId },
  })
  if (!answer) return NextResponse.json({ error: 'Answer not found' }, { status: 404 })

  // Toggle: if this answer is already best, unmark it
  const isBest = !answer.isBest

  await prisma.$transaction([
    // Clear all best answers for this question
    prisma.answer.updateMany({
      where: { questionId: params.questionId },
      data: { isBest: false },
    }),
    // Set the selected one (unless toggling off)
    ...(isBest
      ? [prisma.answer.update({ where: { id: params.answerId }, data: { isBest: true } })]
      : []),
    // Update question's isAnswered flag
    prisma.question.update({
      where: { id: params.questionId },
      data: { isAnswered: isBest },
    }),
  ])

  return NextResponse.json({ success: true, isBest })
}
