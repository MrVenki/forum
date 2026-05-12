import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)

  const count = await prisma.topicSubscription.count({ where: { topicId: params.topicId } })

  if (!session) return NextResponse.json({ subscribed: false, count })

  const existing = await prisma.topicSubscription.findUnique({
    where: { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
  })

  return NextResponse.json({ subscribed: !!existing, count })
}

export async function POST(_req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  await prisma.topicSubscription.upsert({
    where: { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
    create: { topicId: params.topicId, userId: session.user.id },
    update: {},
  })

  const count = await prisma.topicSubscription.count({ where: { topicId: params.topicId } })
  return NextResponse.json({ subscribed: true, count })
}

export async function DELETE(_req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.topicSubscription.deleteMany({
    where: { topicId: params.topicId, userId: session.user.id },
  })

  const count = await prisma.topicSubscription.count({ where: { topicId: params.topicId } })
  return NextResponse.json({ subscribed: false, count })
}
