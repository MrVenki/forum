import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUnsubscribeToken, sendWeeklyDigest, type DigestItem } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_EMAILS_PER_RUN = 150

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) {
    return NextResponse.json({ skipped: 'SMTP not configured' })
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'

  const recent = await prisma.comment.findMany({
    where: { createdAt: { gte: since }, isDeleted: false },
    select: { topicId: true, userId: true },
  })
  if (recent.length === 0) return NextResponse.json({ sent: 0 })

  const topicIds = Array.from(new Set(recent.map((c) => c.topicId)))
  const topics = await prisma.topic.findMany({
    where: { id: { in: topicIds }, isPublished: true },
    select: { id: true, slug: true, propertyName: true, city: { select: { slug: true, name: true } } },
  })
  const topicById = new Map(topics.map((t) => [t.id, t]))

  const subs = await prisma.topicSubscription.findMany({
    where: {
      topicId: { in: topicIds },
      user: { isActive: true, digestOptOut: false, emailVerified: { not: null } },
    },
    select: { topicId: true, user: { select: { id: true, name: true, email: true } } },
  })

  const byUser = new Map<string, { name: string; email: string; items: DigestItem[] }>()
  for (const sub of subs) {
    const topic = topicById.get(sub.topicId)
    if (!topic) continue
    const newComments = recent.filter((c) => c.topicId === sub.topicId && c.userId !== sub.user.id).length
    if (newComments === 0) continue
    const entry = byUser.get(sub.user.id) ?? { name: sub.user.name, email: sub.user.email, items: [] }
    entry.items.push({
      propertyName: topic.propertyName,
      cityName: topic.city.name,
      url: `${siteUrl}/${topic.city.slug}/${topic.slug}`,
      newComments,
    })
    byUser.set(sub.user.id, entry)
  }

  let sent = 0
  let failed = 0
  for (const [userId, entry] of Array.from(byUser.entries()).slice(0, MAX_EMAILS_PER_RUN)) {
    const token = generateUnsubscribeToken(userId, 'digest')
    try {
      await sendWeeklyDigest({
        email: entry.email,
        name: entry.name,
        items: entry.items.sort((a, b) => b.newComments - a.newComments).slice(0, 8),
        unsubscribeUrl: `${siteUrl}/api/unsubscribe?u=${userId}&t=digest&token=${token}`,
      })
      sent++
    } catch {
      failed++
    }
  }

  return NextResponse.json({ sent, failed, eligible: byUser.size })
}
