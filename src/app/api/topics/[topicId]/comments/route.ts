import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createCommentSchema } from '@/lib/validations/comment'
import { isEmailVerificationEnabled } from '@/lib/features'
import { generateUnsubscribeToken, sendCommentNotification } from '@/lib/email'

export async function GET(req: NextRequest, { params }: { params: { topicId: string } }) {
  const comments = await prisma.comment.findMany({
    where: { topicId: params.topicId, parentId: null, isDeleted: false },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
      replies: {
        where: { isDeleted: false },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, image: true } },
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

  const body = await req.json()
  const parsed = createCommentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { id: true } })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  const comment = await prisma.comment.create({
    data: {
      topicId: params.topicId,
      userId: session.user.id,
      content: parsed.data.content,
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
    where: { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
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

    // Notify all other subscribers (fire-and-forget)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'
    const topicUrl = `${siteUrl}/${full.city.slug}/${full.slug}`

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

  return NextResponse.json({ ...comment, autoSubscribed: true }, { status: 201 })
}
