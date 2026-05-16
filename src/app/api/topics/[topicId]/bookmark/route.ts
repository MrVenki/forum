import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/** GET — is this topic bookmarked by the current user? */
export async function GET(
  _req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ bookmarked: false })

  const bm = await prisma.bookmark.findUnique({
    where: { userId_topicId: { userId: session.user.id, topicId: params.topicId } },
    select: { id: true },
  })
  return NextResponse.json({ bookmarked: !!bm })
}

/** POST — toggle bookmark on/off */
export async function POST(
  _req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await prisma.bookmark.findUnique({
    where: { userId_topicId: { userId: session.user.id, topicId: params.topicId } },
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
    return NextResponse.json({ bookmarked: false })
  }

  await prisma.bookmark.create({ data: { userId: session.user.id, topicId: params.topicId } })
  return NextResponse.json({ bookmarked: true }, { status: 201 })
}
