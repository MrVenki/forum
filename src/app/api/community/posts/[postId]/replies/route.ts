import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isEmailVerificationEnabled } from '@/lib/features'
import { generateUnsubscribeToken, sendCommunityAdminAlert, sendCommunityFollowerEmail } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { checkContentRules, createReplySchema, findMentionedProjects, getCategory, loadProjectNames } from '@/lib/community'

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
    select: { id: true, slug: true, title: true, kind: true, category: true, city: { select: { slug: true, name: true } } },
  })
  if (!post) return NextResponse.json({ error: 'This post is no longer available.' }, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true, isActive: true } })
  if (!user || !user.isActive) return NextResponse.json({ error: 'Your account cannot post right now.' }, { status: 403 })
  const ruleError = checkContentRules(parsed.data.content, user.createdAt)
  if (ruleError) return NextResponse.json({ error: ruleError }, { status: 400 })

  // Replies nest one level: a reply to a reply hangs under the same top-level answer
  let parentId: string | null = null
  let repliedToUserId: string | null = null
  if (parsed.data.parentId) {
    const parent = await prisma.communityReply.findFirst({
      where: { id: parsed.data.parentId, postId: post.id, isDeleted: false },
      select: { id: true, parentId: true, userId: true },
    })
    if (!parent) return NextResponse.json({ error: 'That reply is no longer available.' }, { status: 400 })
    parentId = parent.parentId ?? parent.id
    repliedToUserId = parent.userId
  }

  const reply = await prisma.communityReply.create({
    data: { postId: post.id, userId: session.user.id, parentId, content: parsed.data.content },
    select: { id: true, parentId: true, content: true, helpfulCount: true, createdAt: true, user: { select: { id: true, name: true, username: true } } },
  })
  await prisma.communityPost.update({ where: { id: post.id }, data: { replyCount: { increment: 1 } } })
  // Replying follows the post, the same as commenting on a project
  await prisma.communityFollow.upsert({
    where: { postId_userId: { postId: post.id, userId: session.user.id } },
    create: { postId: post.id, userId: session.user.id },
    update: {},
  }).catch(() => {})

  revalidatePath(`/community/${post.slug}`)
  revalidatePath('/community')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'
  const postUrl = `${siteUrl}/community/${post.slug}`
  const replierName = session.user.username ? `@${session.user.username}` : session.user.name || 'A member'
  sendCommunityAdminAlert({
    type: 'reply',
    kind: post.kind === 'EXPERIENCE' ? 'EXPERIENCE' : 'QUESTION',
    postTitle: post.title,
    content: parsed.data.content,
    authorName: replierName,
    cityName: post.city?.name ?? 'All India',
    categoryLabel: getCategory(post.category).label,
    url: `${postUrl}#reply-${reply.id}`,
  }).catch((err) => console.error('[community] admin alert failed:', err))

  // Followers (except the person replying). Seeded demo accounts never get email.
  notifyFollowers({
    postId: post.id,
    postTitle: post.title,
    url: `${postUrl}#reply-${reply.id}`,
    replierId: session.user.id,
    replierName,
    repliedToUserId,
    content: parsed.data.content,
    siteUrl,
  }).catch((err) => console.error('[community] follower emails failed:', err))

  const mentions = findMentionedProjects(parsed.data.content, await loadProjectNames(), post.city?.slug)
  return NextResponse.json({ ...reply, createdAt: reply.createdAt.toISOString(), mentions, isMostHelpful: false }, { status: 201 })
}

async function notifyFollowers(p: {
  postId: string
  postTitle: string
  url: string
  replierId: string
  replierName: string
  repliedToUserId: string | null
  content: string
  siteUrl: string
}) {
  const followers = await prisma.communityFollow.findMany({
    where: { postId: p.postId, userId: { not: p.replierId }, user: { isSeeded: false, isActive: true } },
    select: { user: { select: { id: true, email: true } } },
  })
  for (const { user } of followers) {
    const token = generateUnsubscribeToken(user.id, `community:${p.postId}`)
    await sendCommunityFollowerEmail({
      to: user.email,
      replierName: p.replierName,
      content: p.content,
      postTitle: p.postTitle,
      url: p.url,
      unsubscribeUrl: `${p.siteUrl}/api/unsubscribe?u=${user.id}&c=${p.postId}&token=${token}`,
      isReplyToYou: user.id === p.repliedToUserId,
    }).catch((err) => console.error('[community] follower email failed:', err))
  }
}
