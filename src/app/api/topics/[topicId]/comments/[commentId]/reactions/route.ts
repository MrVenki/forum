import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({ reactionType: z.enum(['LIKE', 'HELPFUL', 'INFORMATIVE', 'DISLIKE']) })

export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string; commentId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })

  // Verify that the comment belongs to the topic in the URL — prevents IDOR
  const comment = await prisma.comment.findFirst({
    where: { id: params.commentId, topicId: params.topicId },
    select: { id: true },
  })
  if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

  const { reactionType } = parsed.data
  const existing = await prisma.commentReaction.findUnique({
    where: { commentId_userId: { commentId: params.commentId, userId: session.user.id } },
  })

  if (existing) {
    if (existing.reactionType === reactionType) {
      // Toggle off
      await prisma.commentReaction.delete({ where: { id: existing.id } })
      return NextResponse.json({ action: 'removed' })
    } else {
      // Change reaction
      const updated = await prisma.commentReaction.update({
        where: { id: existing.id },
        data: { reactionType },
      })
      return NextResponse.json({ action: 'updated', reaction: updated })
    }
  }

  const reaction = await prisma.commentReaction.create({
    data: { commentId: params.commentId, userId: session.user.id, reactionType },
  })
  return NextResponse.json({ action: 'added', reaction }, { status: 201 })
}
