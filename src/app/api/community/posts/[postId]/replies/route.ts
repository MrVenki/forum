import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isEmailVerificationEnabled } from '@/lib/features'
import { sendAdminNewCommentAlert } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { checkContentRules, createReplySchema, findMentionedProjects, loadProjectNames } from '@/lib/community'

type Params = { params: Promise<{ postId: string }> }

/** POST — answer a question, comment on an experience, or reply to one of those. */
export async function POST(req: NextRequest, { params: paramsPromise }: Params) {
  const { postId } = await paramsPromise
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
  const parsed = createReplySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const post = await prisma.communityPost.findFirst({
    where: { id: postId, isDeleted: false, isHidden: false },
    select: { id: true, slug: true, title: true, kind: true, city: { select: { slug: true, name: true } } },
  })
  if (!post) return NextResponse.json({ error: 'This post is no longer available.' }, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true, isActive: true } })
  if (!user || !user.isActive) return NextResponse.json({ error: 'Your account cannot post right now.' }, { status: 403 })
  const ruleError = checkContentRules(parsed.data.content, user.createdAt)
  if (ruleError) return NextResponse.json({ error: ruleError }, { status: 400 })

  // Replies nest one level: a reply to a reply hangs under the same top-level answer
  let parentId: string | null = null
  if (parsed.data.parentId) {
    const parent = await prisma.communityReply.findFirst({
      where: { id: parsed.data.parentId, postId: post.id, isDeleted: false },
      select: { id: true, parentId: true },
    })
    if (!parent) return NextResponse.json({ error: 'That reply is no longer available.' }, { status: 400 })
    parentId = parent.parentId ?? parent.id
  }

  const reply = await prisma.communityReply.create({
    data: { postId: post.id, userId: session.user.id, parentId, content: parsed.data.content },
    select: { id: true, parentId: true, content: true, helpfulCount: true, createdAt: true, user: { select: { id: true, name: true, username: true } } },
  })
  await prisma.communityPost.update({ where: { id: post.id }, data: { replyCount: { increment: 1 } } })

  revalidatePath(`/community/${post.slug}`)
  revalidatePath('/community')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'
  sendAdminNewCommentAlert({
    commenterName: session.user.name || 'Anonymous',
    commentContent: parsed.data.content,
    propertyName: post.title,
    cityName: post.city?.name ?? 'All India',
    topicUrl: `${siteUrl}/community/${post.slug}`,
    isReply: true,
  }).catch(() => {})

  const mentions = findMentionedProjects(parsed.data.content, await loadProjectNames(), post.city?.slug)
  return NextResponse.json({ ...reply, createdAt: reply.createdAt.toISOString(), mentions, isMostHelpful: false }, { status: 201 })
}
