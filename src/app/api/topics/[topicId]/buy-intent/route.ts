import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { getVisitorKey, peekVisitorKey } from '@/lib/visitor'

const voteSchema = z.object({
  intent: z.enum(['YES', 'MAYBE', 'NO']),
  audience: z.enum(['CONSIDERING', 'BOOKED', 'RESIDENT', 'EXPLORING']).nullable().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)

  const [grouped, ownKeys] = await Promise.all([
    prisma.buyIntentVote.groupBy({
      by: ['intent'],
      where: { topicId: params.topicId },
      _count: { _all: true },
    }),
    Promise.resolve([session ? `u:${session.user.id}` : null, peekVisitorKey()].filter(Boolean) as string[]),
  ])

  const counts = { YES: 0, MAYBE: 0, NO: 0 }
  for (const g of grouped) counts[g.intent] = g._count._all
  const total = counts.YES + counts.MAYBE + counts.NO

  const mine = ownKeys.length
    ? await prisma.buyIntentVote.findFirst({
        where: { topicId: params.topicId, voterKey: { in: ownKeys } },
        select: { intent: true, audience: true },
      })
    : null

  return NextResponse.json({ counts, total, mine })
}

export async function POST(req: NextRequest, { params }: { params: { topicId: string } }) {
  if (!checkRateLimit(`buy-intent:${getClientIp(req)}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many votes from this network. Try again later.' }, { status: 429 })
  }

  const parsed = voteSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  const session = await getServerSession(authOptions)
  const voterKey = session ? `u:${session.user.id}` : getVisitorKey()

  // A signed-in voter replaces any anonymous vote from the same browser instead of counting twice
  const anonKey = session ? peekVisitorKey() : null
  if (anonKey) {
    await prisma.buyIntentVote.deleteMany({ where: { topicId: params.topicId, voterKey: anonKey } })
  }

  await prisma.buyIntentVote.upsert({
    where: { topicId_voterKey: { topicId: params.topicId, voterKey } },
    create: {
      topicId: params.topicId,
      voterKey,
      userId: session?.user.id ?? null,
      intent: parsed.data.intent,
      audience: parsed.data.audience ?? null,
    },
    update: { intent: parsed.data.intent, audience: parsed.data.audience ?? null },
  })

  return NextResponse.json({ success: true })
}
