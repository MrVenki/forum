import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { topicId: string } }) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: {
      city: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, ratings: true } },
    },
  })

  if (!topic || !topic.isPublished) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Increment view count (fire and forget)
  prisma.topic.update({ where: { id: params.topicId }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  return NextResponse.json(topic)
}

export async function PATCH(req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { userId: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (topic.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const description = typeof body.description === 'string' ? body.description.trim() : null
  if (!description || description.length < 20) {
    return NextResponse.json({ error: 'Description must be at least 20 characters.' }, { status: 400 })
  }

  const updated = await prisma.topic.update({
    where: { id: params.topicId },
    data: { description },
    select: { description: true },
  })

  return NextResponse.json({ description: updated.description })
}

export async function DELETE(req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = topic.userId === session.user.id
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.topic.update({ where: { id: params.topicId }, data: { isPublished: false } })
  return NextResponse.json({ success: true })
}
