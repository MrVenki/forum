import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'

/** GET ?postId= — whether the signed-in member follows this post, and how many members do. */
export async function GET(req: NextRequest) {
  const postId = new URL(req.url).searchParams.get('postId')
  if (!postId) return NextResponse.json({ following: false, count: 0 })
  const session = await getServerSession(authOptions)
  try {
    const [count, mine] = await Promise.all([
      prisma.communityFollow.count({ where: { postId } }),
      session ? prisma.communityFollow.findUnique({ where: { postId_userId: { postId, userId: session.user.id } }, select: { id: true } }) : null,
    ])
    return NextResponse.json({ following: Boolean(mine), count })
  } catch {
    return NextResponse.json({ following: false, count: 0 })
  }
}

/** POST { postId } — follow or unfollow a post (emails for new replies). */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Sign in to follow.' }, { status: 401 })
  if (!checkRateLimit(`community-follow:${session.user.id}`, 60, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a little.' }, { status: 429 })
  }
  const parsed = z.object({ postId: z.string().min(1).max(40) }).safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { postId } = parsed.data

  const post = await prisma.communityPost.findFirst({ where: { id: postId, isDeleted: false }, select: { id: true } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const key = { postId_userId: { postId, userId: session.user.id } }
  const existing = await prisma.communityFollow.findUnique({ where: key, select: { id: true } })
  if (existing) await prisma.communityFollow.delete({ where: key })
  else await prisma.communityFollow.create({ data: { postId, userId: session.user.id } })
  const count = await prisma.communityFollow.count({ where: { postId } })
  return NextResponse.json({ following: !existing, count })
}
