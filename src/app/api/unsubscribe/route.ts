import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUnsubscribeToken } from '@/lib/email'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId  = searchParams.get('u')
  const topicId = searchParams.get('t')
  const token   = searchParams.get('token')

  if (!userId || !topicId || !token) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  if (!verifyUnsubscribeToken(token, userId, topicId)) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 403 })
  }

  await prisma.topicSubscription.deleteMany({ where: { topicId, userId } })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
  return NextResponse.redirect(`${siteUrl}/?unsubscribed=1`)
}
