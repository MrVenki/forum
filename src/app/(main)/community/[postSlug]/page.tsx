import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, MapPin, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CategoryChip, KindTag, PostRow } from '@/components/community/PostBits'
import { CommunityReplies, PostActions, type ThreadReply } from '@/components/community/CommunityThread'
import {
  INDEX_MIN_REPLIES,
  MOST_HELPFUL_MIN_VOTES,
  findMentionedProjects,
  getCategory,
  loadProjectNames,
  type PostKind,
  type PostListItem,
} from '@/lib/community'
import { SITE_CONFIG } from '@/lib/constants/config'
import { moderatorEditedIds } from '@/lib/adminEdit'
import { AdminEditLink, ModeratorEditedNote } from '@/components/admin/AdminEditLink'
import { formatRelativeTime } from '@/lib/utils/format'

export const revalidate = 60
export const dynamicParams = true

// Nothing is pre-built; each post page is rendered on first visit and then cached.
export function generateStaticParams() {
  return []
}

interface Props {
  params: Promise<{ postSlug: string }>
}

const getPost = cache(async (slug: string) => {
  try {
    return await prisma.communityPost.findFirst({
      where: { slug, isHidden: false, isDeleted: false },
      include: {
        city: { select: { name: true, slug: true } },
        user: { select: { id: true, name: true, username: true } },
        replies: {
          where: { isDeleted: false, isHidden: false },
          orderBy: { createdAt: 'asc' },
          select: { id: true, parentId: true, content: true, helpfulCount: true, createdAt: true, userId: true, user: { select: { id: true, name: true, username: true } } },
        },
      },
    })
  } catch (err) {
    console.error('[community] post lookup failed:', err)
    return null
  }
})

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

const display = (u: { name: string | null; username: string | null }) => (u.username ? `@${u.username}` : u.name || 'Member')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params
  const post = await getPost(postSlug)
  if (!post) return { title: 'Post not found', robots: { index: false } }
  const othersReplies = post.replies.filter((r) => r.userId !== post.userId).length
  const desc = (post.body || post.title).replace(/\s+/g, ' ').slice(0, 155)
  const url = `${SITE_CONFIG.url}/community/${post.slug}`
  return {
    title: post.title,
    description: desc,
    alternates: { canonical: url },
    // Stays out of search results until members other than the author have replied
    robots: othersReplies >= INDEX_MIN_REPLIES ? undefined : { index: false, follow: true },
    openGraph: { title: post.title, description: desc, url, type: 'article' },
  }
}

export default async function CommunityPostPage({ params }: Props) {
  const { postSlug } = await params
  const post = await getPost(postSlug)
  if (!post) notFound()

  const kind = post.kind as PostKind
  const isQ = kind === 'QUESTION'
  const url = `${SITE_CONFIG.url}/community/${post.slug}`
  const category = getCategory(post.category)

  // Replies under a hidden or deleted answer are hidden with it
  const visibleTopIds = new Set(post.replies.filter((r) => !r.parentId).map((r) => r.id))
  const visible = post.replies.filter((r) => !r.parentId || visibleTopIds.has(r.parentId))

  const projects = await loadProjectNames().catch(() => [])
  const citySlug = post.city?.slug ?? null

  let bestId: string | null = null
  if (isQ) {
    for (const r of visible) {
      if (r.parentId || r.helpfulCount < MOST_HELPFUL_MIN_VOTES) continue
      const best = visible.find((x) => x.id === bestId)
      if (!best || r.helpfulCount > best.helpfulCount) bestId = r.id
    }
  }

  // Wording a moderator changed gets a small note
  const [editedPost, editedReplies] = await Promise.all([
    moderatorEditedIds('COMMUNITY_POST', [{ id: post.id, values: { title: post.title, body: post.body } }]),
    moderatorEditedIds('COMMUNITY_REPLY', visible.map((r) => ({ id: r.id, values: { content: r.content } }))),
  ])

  const replies: ThreadReply[] = visible.map((r) => ({
    id: r.id,
    parentId: r.parentId,
    content: r.content,
    helpfulCount: r.helpfulCount,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
    mentions: findMentionedProjects(r.content, projects, citySlug),
    isMostHelpful: r.id === bestId,
    moderatorEdited: editedReplies.has(r.id),
  }))

  // Projects named in the post or any reply, for the side panel
  const mentioned = findMentionedProjects([post.title, post.body, ...visible.map((r) => r.content)].join('\n'), projects, citySlug, 6)

  let related: PostListItem[] = []
  try {
    const rows = await prisma.communityPost.findMany({
      where: { id: { not: post.id }, isHidden: false, isDeleted: false, OR: [{ category: post.category }, ...(post.cityId ? [{ cityId: post.cityId }] : [])] },
      orderBy: [{ replyCount: 'desc' }, { createdAt: 'desc' }],
      take: 4,
      select: { id: true, kind: true, title: true, slug: true, category: true, replyCount: true, createdAt: true, city: { select: { name: true, slug: true } } },
    })
    related = rows.map((r) => ({ ...r, kind: r.kind as PostKind, createdAt: r.createdAt.toISOString() }))
  } catch {
    related = []
  }

  const author = { '@type': 'Person', name: display(post.user) }
  const topReplies = visible.filter((r) => !r.parentId)
  const answerLd = (r: (typeof visible)[number]) => ({
    '@type': isQ ? 'Answer' : 'Comment',
    text: r.content,
    dateCreated: r.createdAt.toISOString(),
    upvoteCount: r.helpfulCount,
    url: `${url}#reply-${r.id}`,
    author: { '@type': 'Person', name: display(r.user) },
  })
  const jsonLd = isQ
    ? {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: {
          '@type': 'Question',
          name: post.title,
          text: post.body || post.title,
          answerCount: topReplies.length,
          dateCreated: post.createdAt.toISOString(),
          author,
          ...(bestId ? { acceptedAnswer: answerLd(topReplies.find((r) => r.id === bestId)!) } : {}),
          suggestedAnswer: topReplies.filter((r) => r.id !== bestId).slice(0, 20).map(answerLd),
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'DiscussionForumPosting',
        headline: post.title,
        text: post.body,
        url,
        datePublished: post.createdAt.toISOString(),
        author,
        commentCount: visible.length,
        comment: topReplies.slice(0, 20).map(answerLd),
      }

  return (
    <div className="container-forum py-6 sm:py-8">
      {(!isQ || topReplies.length > 0) && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <Breadcrumbs items={[{ label: 'Community', href: '/community' }, { label: category.label, href: `/community?topic=${category.slug}` }]} />
          <article className="card-base mt-3 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <KindTag kind={kind} />
              <CategoryChip slug={post.category} />
              {post.city && (
                <Link href={`/${post.city.slug}`} className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-saffron-600">
                  <MapPin className="h-3.5 w-3.5" /> {post.city.name}
                </Link>
              )}
            </div>
            <h1 className="mt-2 font-heading text-2xl font-bold leading-tight text-navy-500 sm:text-3xl">{post.title}</h1>
            {post.body && <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">{post.body}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
              <span>{isQ ? 'Asked' : 'Shared'} by <b className="text-neutral-700">{display(post.user)}</b></span>
              <time dateTime={post.createdAt.toISOString()}>{formatRelativeTime(post.createdAt)}</time>
              <AdminEditLink href={`/admin/community?edit=${post.id}`} />
            </div>
            {editedPost.has(post.id) && <ModeratorEditedNote />}
            <PostActions post={{ id: post.id, kind, title: post.title, url, authorId: post.userId, helpfulCount: post.helpfulCount }} />
          </article>

          <CommunityReplies post={{ id: post.id, kind, title: post.title, url, authorId: post.userId, helpfulCount: post.helpfulCount }} initialReplies={replies} />
        </div>

        <aside className="space-y-4">
          {mentioned.length > 0 && (
            <div className="card-base p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-saffron-500">Projects mentioned</p>
              <ul className="space-y-3">
                {mentioned.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} className="flex items-center gap-3 hover:opacity-80">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-100"><Building2 className="h-5 w-5 text-navy-500" /></span>
                      <span>
                        <span className="block text-sm font-bold text-navy-500">{m.name}</span>
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          {m.city}
                          {m.ratingCount > 0 && (
                            <>
                              {' · '}<Star className="h-3 w-3 fill-gold text-gold" /> {m.avgRating.toFixed(1)} · {m.ratingCount} review{m.ratingCount === 1 ? '' : 's'}
                            </>
                          )}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {related.length > 0 && (
            <div className="card-base overflow-hidden">
              <p className="px-5 pt-4 text-xs font-bold uppercase tracking-wider text-saffron-500">More from the community</p>
              <div className="divide-y divide-neutral-100">
                {related.map((r) => <PostRow key={r.id} post={r} />)}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
