import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'
import { targetSchema } from '@/lib/community'

/** GET ?postId= — which items on this post the signed-in member marked Helpful. */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const postId = new URL(req.url).searchParams.get('postId')
  if (!session || !postId) return NextResponse.json({ voted: [] })
  try {
    const replies = await prisma.communityReply.findMany({ where: { postId }, select: { id: true } })
    const votes = await prisma.communityVote.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { targetType: 'POST', targetId: postId },
          { targetType: 'REPLY', targetId: { in: replies.map((r) => r.id) } },
        ],
      },
      select: { targetId: true },
    })
    return NextResponse.json({ voted: votes.map((v) => v.targetId) })
  } catch {
    return NextResponse.json({ voted: [] })
  }
}

/** POST — toggle a Helpful vote on a post or reply. Members cannot vote on their own writing. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Sign in to mark this helpful.' }, { status: 401 })
  if (!checkRateLimit(`community-vote:${session.user.id}`, 120, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many votes. Please wait a little.' }, { status: 429 })
  }
  const parsed = targetSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { targetType, targetId } = parsed.data

  const target =
    targetType === 'POST'
      ? await prisma.communityPost.findFirst({ where: { id: targetId, isDeleted: false }, select: { userId: true } })
      : await prisma.communityReply.findFirst({ where: { id: targetId, isDeleted: false }, select: { userId: true } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.userId === session.user.id) return NextResponse.json({ error: 'You cannot vote on your own post.' }, { status: 400 })

  const key = { userId_targetType_targetId: { userId: session.user.id, targetType, targetId } }
  const existing = await prisma.communityVote.findUnique({ where: key, select: { id: true } })
  const delta = existing ? -1 : 1
  if (existing) await prisma.communityVote.delete({ where: key })
  else await prisma.communityVote.create({ data: { userId: session.user.id, targetType, targetId } })

  const updated =
    targetType === 'POST'
      ? await prisma.communityPost.update({ where: { id: targetId }, data: { helpfulCount: { increment: delta } }, select: { helpfulCount: true } })
      : await prisma.communityReply.update({ where: { id: targetId }, data: { helpfulCount: { increment: delta } }, select: { helpfulCount: true } })

  return NextResponse.json({ voted: !existing, helpfulCount: Math.max(0, updated.helpfulCount) })
}
