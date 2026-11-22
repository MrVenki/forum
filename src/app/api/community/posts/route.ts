import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isEmailVerificationEnabled } from '@/lib/features'
import { sendCommunityAdminAlert } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { checkContentRules, createPostSchema, getCategory, uniquePostSlug } from '@/lib/community'

/** GET ?q= — up to 3 existing posts with similar titles, shown while someone types a question. */
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim() ?? ''
  const words = [...new Set(q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 4))].slice(0, 6)
  if (words.length === 0) return NextResponse.json({ posts: [] })
  if (!checkRateLimit(`community-similar:${getClientIp(req)}`, 60, 60 * 1000)) return NextResponse.json({ posts: [] })
  try {
    const rows = await prisma.communityPost.findMany({
      where: { isHidden: false, isDeleted: false, OR: words.map((w) => ({ title: { contains: w, mode: 'insensitive' as const } })) },
      select: { title: true, slug: true, kind: true, replyCount: true },
      take: 30,
      orderBy: { createdAt: 'desc' },
    })
    // Rank by how many of the typed words each title shares
    const scored = rows
      .map((r) => ({ ...r, score: words.filter((w) => r.title.toLowerCase().includes(w)).length }))
      .filter((r) => r.score >= Math.min(2, words.length))
      .sort((a, b) => b.score - a.score || b.replyCount - a.replyCount)
      .slice(0, 3)
      .map(({ score: _score, ...r }) => r)
    return NextResponse.json({ posts: scored })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}

/** POST — create a question or an experience. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Sign in to post.' }, { status: 401 })
  if (isEmailVerificationEnabled() && !session.user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before posting.', requiresVerification: true }, { status: 403 })
  }
  // Loose guard against scripted floods; the per-post limit below only counts posts that pass the checks
  if (!checkRateLimit(`community-attempt:${session.user.id}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a little.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  if (!(await verifyTurnstile(body.cfToken))) {
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 })
  }
  const parsed = createPostSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  const { kind, title, category, citySlug } = parsed.data
  const text = parsed.data.body
  if (kind === 'EXPERIENCE' && text.length < 30) {
    return NextResponse.json({ error: 'Tell members a little more about what happened (at least 30 characters).' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true, isActive: true } })
  if (!user || !user.isActive) return NextResponse.json({ error: 'Your account cannot post right now.' }, { status: 403 })
  const ruleError = checkContentRules(`${title}\n${text}`, user.createdAt)
  if (ruleError) return NextResponse.json({ error: ruleError }, { status: 400 })

  let city: { id: string; name: string } | null = null
  if (citySlug) {
    city = await prisma.city.findUnique({ where: { slug: citySlug }, select: { id: true, name: true } })
    if (!city) return NextResponse.json({ error: 'Pick a city from the list.' }, { status: 400 })
  }

  if (!checkRateLimit(`community-post:${session.user.id}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'You have posted a lot in the last hour. Please wait a little.' }, { status: 429 })
  }
  if (!checkRateLimit(`community-post-ip:${getClientIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests from this IP.' }, { status: 429 })
  }

  const slug = await uniquePostSlug(title)
  const post = await prisma.communityPost.create({
    data: { kind, title, slug, body: text, category, cityId: city?.id ?? null, userId: session.user.id },
    select: { id: true, slug: true },
  })

  // The author follows their own post, so replies reach them by email
  await prisma.communityFollow.create({ data: { postId: post.id, userId: session.user.id } }).catch(() => {})

  revalidatePath('/community')
  revalidatePath('/')
  if (citySlug) revalidatePath(`/${citySlug}`)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiapropertytalk.com'
  sendCommunityAdminAlert({
    type: 'post',
    kind,
    postTitle: title,
    content: text,
    authorName: session.user.username ? `@${session.user.username}` : session.user.name || 'A member',
    cityName: city?.name ?? 'All India',
    categoryLabel: getCategory(category).label,
    url: `${siteUrl}/community/${post.slug}`,
  }).catch((err) => console.error('[community] admin alert failed:', err))

  return NextResponse.json(post, { status: 201 })
}
