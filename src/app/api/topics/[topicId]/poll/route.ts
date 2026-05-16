import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  question: z.string().min(5).max(300),
  options:  z.array(z.string().min(1).max(100)).min(2).max(6),
})

const voteSchema = z.object({
  optionIndex: z.number().int().min(0),
})

/** GET — fetch poll + vote counts + caller's vote */
export async function GET(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)

  const poll = await prisma.poll.findUnique({
    where: { topicId: params.topicId },
    include: {
      votes: { select: { optionIndex: true, userId: true } },
      user:  { select: { id: true, name: true } },
    },
  })

  if (!poll) return NextResponse.json({ poll: null })

  const counts = poll.options.map((_, i) =>
    poll.votes.filter(v => v.optionIndex === i).length
  )
  const userVote = session
    ? poll.votes.find(v => v.userId === session.user.id)?.optionIndex ?? null
    : null

  return NextResponse.json({
    poll: {
      id:       poll.id,
      question: poll.question,
      options:  poll.options,
      counts,
      total:    poll.votes.length,
      userVote,
      createdBy: poll.user,
      createdAt: poll.createdAt,
    },
  })
}

/** POST — create a poll (topic owner or admin only; replaces existing) */
export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { userId: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwnerOrAdmin = topic.userId === session.user.id ||
    session.user.role === 'ADMIN' || session.user.role === 'MODERATOR'
  if (!isOwnerOrAdmin) return NextResponse.json({ error: 'Only the topic creator can add a poll' }, { status: 403 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  // Delete existing poll first (one poll per topic)
  await prisma.poll.deleteMany({ where: { topicId: params.topicId } })

  const poll = await prisma.poll.create({
    data: {
      topicId:  params.topicId,
      userId:   session.user.id,
      question: parsed.data.question,
      options:  parsed.data.options,
    },
  })

  return NextResponse.json({ poll }, { status: 201 })
}

/** PATCH — cast or change a vote */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const poll = await prisma.poll.findUnique({
    where: { topicId: params.topicId },
    select: { id: true, options: true },
  })
  if (!poll) return NextResponse.json({ error: 'No poll found' }, { status: 404 })

  const body = await req.json()
  const parsed = voteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid option' }, { status: 400 })

  if (parsed.data.optionIndex >= poll.options.length) {
    return NextResponse.json({ error: 'Invalid option index' }, { status: 400 })
  }

  await prisma.pollVote.upsert({
    where: { pollId_userId: { pollId: poll.id, userId: session.user.id } },
    create: { pollId: poll.id, userId: session.user.id, optionIndex: parsed.data.optionIndex },
    update: { optionIndex: parsed.data.optionIndex },
  })

  return NextResponse.json({ success: true })
}
