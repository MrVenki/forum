import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'

const createSchema = z.object({
  pricePerSqFt:  z.number().min(100).max(1000000),
  configuration: z.string().max(50).optional().nullable(),
  source:        z.string().max(100).optional().nullable(),
  loggedAt:      z.string().datetime(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const logs = await prisma.priceLog.findMany({
    where: { topicId: params.topicId },
    orderBy: { loggedAt: 'asc' },
    include: { user: { select: { id: true, name: true, flairTag: true } } },
  })

  return NextResponse.json(logs)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 5 price logs per user per day
  if (!checkRateLimit(`pricelog:${session.user.id}`, 5, 24 * 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many price entries today. Try again tomorrow.' }, { status: 429 })
  }
  const ip = getClientIp(req)
  if (!checkRateLimit(`pricelog-ip:${ip}`, 10, 24 * 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests from this IP.' }, { status: 429 })
  }

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()

  // Bot protection
  if (!(await verifyTurnstile(body.cfToken))) {
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const log = await prisma.priceLog.create({
    data: {
      topicId:      params.topicId,
      userId:       session.user.id,
      pricePerSqFt: parsed.data.pricePerSqFt,
      configuration: parsed.data.configuration ?? null,
      source:       parsed.data.source ?? null,
      loggedAt:     new Date(parsed.data.loggedAt),
    },
    include: { user: { select: { id: true, name: true, flairTag: true } } },
  })

  return NextResponse.json(log, { status: 201 })
}
