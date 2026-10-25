import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { getVisitorKey, REFERRAL_COOKIE } from '@/lib/visitor'

/** Records one unique visit that arrived through the poster's share link (?ref=owner). */
export async function POST(req: NextRequest, { params }: { params: { topicId: string } }) {
  if (!checkRateLimit(`referral:${getClientIp(req)}`, 60, 60 * 60 * 1000)) {
    return NextResponse.json({ success: false }, { status: 429 })
  }

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: { id: true, userId: true },
  })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  const session = await getServerSession(authOptions)
  if (session?.user.id === topic.userId) return NextResponse.json({ success: true, counted: false })

  const visitorKey = session ? `u:${session.user.id}` : getVisitorKey()
  await prisma.referralVisit.upsert({
    where: { topicId_visitorKey: { topicId: topic.id, visitorKey } },
    create: { topicId: topic.id, visitorKey },
    update: {},
  })

  const res = NextResponse.json({ success: true, counted: true })
  res.cookies.set(REFERRAL_COOKIE, topic.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
