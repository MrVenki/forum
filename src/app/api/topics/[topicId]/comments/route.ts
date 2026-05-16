import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createCommentSchema } from '@/lib/validations/comment'
import { isEmailVerificationEnabled } from '@/lib/features'
import { generateUnsubscribeToken, sendCommentNotification, sendAdminNewCommentAlert } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function GET(req: NextRequest, { params }: { params: { topicId: string } }) {
  const comments = await prisma.comment.findMany({
    where: { topicId: params.topicId, parentId: null, isDeleted: false },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { id: true, name: true, image: true, flairTag: true } },
      reactions: true,
      replies: {
        where: { isDeleted: false },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, image: true, flairTag: true } },
          reactions: true,
        },
      },
    },
  })
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (isEmailVerificationEnabled() && !session.user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before commenting.', requiresVerification: true }, { status: 403 })
  }

  // 20 comments per user per hour
  if (!checkRateLimit(`comment:${session.user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'You are posting too frequently. Please wait before commenting again.' }, { status: 429 })
  }
  // Additional IP-level guard (catches multi-account abuse)
  const ip = getClientIp(req)
  if (!checkRateLimit(`comment-ip:${ip}`, 40, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests from this IP.' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = createCommentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  // Validate parentId belongs to this topic — prevents cross-topic reply injection
  if (parsed.data.parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parsed.data.parentId, topicId: params.topicId },
      select: { id: true },
    })
    if (!parent) {
      return NextResponse.json({ error: 'Parent comment not found in this topic.' }, { status: 400 })
    }
  }

  const comment = await prisma.comment.create({
    data: {
      topicId:  params.topicId,
      userId:   session.user.id,
      content:  parsed.data.content,
      parentId: parsed.data.parentId || null,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
  })

  await prisma.topic.update({ where: { id: params.topicId }, data: { commentCount: { increment: 1 } } })

  // Auto-subscribe the commenter
  await prisma.topicSubscription.upsert({
    where:  { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
    create: { topicId: params.topicId, userId: session.user.id },
    update: {},
  })

  const full = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: {
      slug: true,
      propertyName: true,
      city: { select: { slug: true, name: true } },
    },
  })

  if (full) {
    revalidatePath(`/${full.city.slug}/${full.slug}`)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
    const topicUrl = `${siteUrl}/${full.city.slug}/${full.slug}`

    // Notify admin (fire-and-forget)
    sendAdminNewCommentAlert({
      commenterName: session.user.name || 'Anonymous',
      commentContent: parsed.data.content,
      propertyName: full.propertyName,
      cityName: full.city.name,
      topicUrl,
      isReply: !!parsed.data.parentId,
    }).catch(() => {})

    // Only load subscriber emails when SMTP is actually configured —
    // avoids loading PII into memory when it will never be used
    const transporter = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    if (transporter) {
      const subscribers = await prisma.topicSubscription.findMany({
        where: { topicId: params.topicId, userId: { not: session.user.id } },
        include: { user: { select: { id: true, name: true, email: true } } },
      })

      for (const sub of subscribers) {
        const token = generateUnsubscribeToken(sub.user.id, params.topicId)
        const unsubscribeUrl = `${siteUrl}/api/unsubscribe?u=${sub.user.id}&t=${params.topicId}&token=${token}`
        sendCommentNotification({
          subscriberEmail: sub.user.email,
          subscriberName: sub.user.name,
          commenterName: session.user.name || 'Someone',
          commentContent: parsed.data.content,
          propertyName: full.propertyName,
          cityName: full.city.name,
          topicUrl,
          unsubscribeUrl,
        }).catch(() => {})
      }
    }
  }

  return NextResponse.json({ ...comment, autoSubscribed: true }, { status: 201 })
}
