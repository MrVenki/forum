import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUnsubscribeToken } from '@/lib/email'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId  = searchParams.get('u')
  const topicId = searchParams.get('t')
  const token   = searchParams.get('token')
  const communityPostId = searchParams.get('c')

  // Community post follow: token is signed over "community:<postId>"
  if (userId && communityPostId && token) {
    if (!verifyUnsubscribeToken(token, userId, `community:${communityPostId}`)) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 403 })
    }
    await prisma.communityFollow.deleteMany({ where: { postId: communityPostId, userId } }).catch(() => {})
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'
    return NextResponse.redirect(`${siteUrl}/?unsubscribed=1`)
  }

  if (!userId || !topicId || !token) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  if (!verifyUnsubscribeToken(token, userId, topicId)) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 403 })
  }

  if (topicId === 'digest') {
    await prisma.user.update({ where: { id: userId }, data: { digestOptOut: true } }).catch(() => {})
  } else {
    await prisma.topicSubscription.deleteMany({ where: { topicId, userId } })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'
  return NextResponse.redirect(`${siteUrl}/?unsubscribed=1`)
}
