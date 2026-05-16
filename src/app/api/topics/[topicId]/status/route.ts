import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ConstructionStatus } from '@prisma/client'

const voteSchema = z.object({
  status: z.nativeEnum(ConstructionStatus),
})

const updateSchema = z.object({
  constructionStatus: z.nativeEnum(ConstructionStatus).optional(),
  expectedPossession: z.string().datetime().optional().nullable(),
  actualPossession: z.string().datetime().optional().nullable(),
})

/** GET — return tally of all votes + topic's current status fields */
export async function GET(
  _req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const [topic, votes] = await Promise.all([
    prisma.topic.findUnique({
      where: { id: params.topicId },
      select: {
        constructionStatus: true,
        expectedPossession: true,
        actualPossession: true,
      },
    }),
    prisma.statusVote.groupBy({
      by: ['status'],
      where: { topicId: params.topicId },
      _count: { status: true },
    }),
  ])

  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const tally: Record<string, number> = {}
  let total = 0
  for (const v of votes) {
    tally[v.status] = v._count.status
    total += v._count.status
  }

  return NextResponse.json({ ...topic, tally, total })
}

/** POST — cast or change your status vote (toggles off if same) */
export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = voteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: { id: true },
  })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { status } = parsed.data
  const existing = await prisma.statusVote.findUnique({
    where: { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
  })

  if (existing) {
    if (existing.status === status) {
      await prisma.statusVote.delete({ where: { id: existing.id } })
    } else {
      await prisma.statusVote.update({ where: { id: existing.id }, data: { status } })
    }
  } else {
    await prisma.statusVote.create({
      data: { topicId: params.topicId, userId: session.user.id, status },
    })
  }

  // Recompute majority and update topic.constructionStatus
  const votes = await prisma.statusVote.groupBy({
    by: ['status'],
    where: { topicId: params.topicId },
    _count: { status: true },
    orderBy: { _count: { status: 'desc' } },
  })

  if (votes.length > 0) {
    await prisma.topic.update({
      where: { id: params.topicId },
      data: { constructionStatus: votes[0].status },
    })
  } else {
    await prisma.topic.update({
      where: { id: params.topicId },
      data: { constructionStatus: null },
    })
  }

  return NextResponse.json({ success: true })
}

/** PATCH — topic owner or admin sets possession dates */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: { userId: true },
  })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwnerOrAdmin = topic.userId === session.user.id ||
    session.user.role === 'ADMIN' || session.user.role === 'MODERATOR'
  if (!isOwnerOrAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const updated = await prisma.topic.update({
    where: { id: params.topicId },
    data: {
      ...(parsed.data.constructionStatus !== undefined && { constructionStatus: parsed.data.constructionStatus }),
      ...(parsed.data.expectedPossession !== undefined && {
        expectedPossession: parsed.data.expectedPossession ? new Date(parsed.data.expectedPossession) : null,
      }),
      ...(parsed.data.actualPossession !== undefined && {
        actualPossession: parsed.data.actualPossession ? new Date(parsed.data.actualPossession) : null,
      }),
    },
    select: { constructionStatus: true, expectedPossession: true, actualPossession: true },
  })

  return NextResponse.json(updated)
}
