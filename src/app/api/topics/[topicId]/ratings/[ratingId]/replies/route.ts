import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isEmailVerificationEnabled } from '@/lib/features'
import { sendAdminNewCommentAlert } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'

const replySchema = z.object({
  content: z.string().trim().min(2, 'Reply must be at least 2 characters').max(2000, 'Reply must be under 2000 characters'),
})

type Params = { params: Promise<{ topicId: string; ratingId: string }> }

/** POST — reply under a star-rating review */
export async function POST(req: NextRequest, { params: paramsPromise }: Params) {
  const params = await paramsPromise
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Sign in to reply.' }, { status: 401 })
  if (isEmailVerificationEnabled() && !session.user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before replying.', requiresVerification: true }, { status: 403 })
  }

  // Shares the comment limits: 20 per user and 40 per IP each hour
  if (!checkRateLimit(`comment:${session.user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'You are posting too frequently. Please wait a little.' }, { status: 429 })
  }
  if (!checkRateLimit(`comment-ip:${getClientIp(req)}`, 40, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests from this IP.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  if (!(await verifyTurnstile(body.cfToken))) {
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 })
  }
  const parsed = replySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  // The review must belong to this project
  const rating = await prisma.rating.findFirst({
    where: { id: params.ratingId, topicId: params.topicId },
    select: { id: true, topic: { select: { slug: true, propertyName: true, city: { select: { slug: true, name: true } } } } },
  })
  if (!rating) return NextResponse.json({ error: 'Review not found.' }, { status: 404 })

  const reply = await prisma.ratingReply.create({
    data: { ratingId: rating.id, userId: session.user.id, content: parsed.data.content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { name: true, username: true } },
    },
  })

  const path = `/${rating.topic.city.slug}/${rating.topic.slug}`
  revalidatePath(path)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'
  sendAdminNewCommentAlert({
    commenterName: session.user.name || 'Anonymous',
    commentContent: parsed.data.content,
    propertyName: rating.topic.propertyName,
    cityName: rating.topic.city.name,
    topicUrl: `${siteUrl}${path}`,
    isReply: true,
  }).catch(() => {})

  return NextResponse.json(reply, { status: 201 })
}
