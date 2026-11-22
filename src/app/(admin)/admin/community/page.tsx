import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CommunityModeration, type ModItem } from '@/components/admin/CommunityModeration'
import { COMMUNITY_CATEGORIES } from '@/lib/community'

export const revalidate = 0

const name = (u: { name: string | null; username: string | null }) => (u.username ? `@${u.username}` : u.name || 'Member')

export default async function AdminCommunityPage({ searchParams }: { searchParams: Promise<{ edit?: string; reply?: string }> }) {
  const { edit, reply: replyId } = await searchParams
  let flagged: ModItem[] = []
  let recent: ModItem[] = []
  let editItems: ModItem[] = []
  let error = ''
  try {
    const reports = await prisma.communityReport.findMany({ where: { isResolved: false }, select: { targetType: true, targetId: true, reason: true } })
    const byTarget = new Map<string, Map<string, number>>()
    for (const r of reports) {
      const key = `${r.targetType}:${r.targetId}`
      const m = byTarget.get(key) ?? new Map<string, number>()
      m.set(r.reason, (m.get(r.reason) ?? 0) + 1)
      byTarget.set(key, m)
    }
    const reportsFor = (type: string, id: string) => [...(byTarget.get(`${type}:${id}`) ?? new Map<string, number>())].map(([reason, count]) => ({ reason, count }))
    const idsOf = (type: string) => [...byTarget.keys()].filter((k) => k.startsWith(`${type}:`)).map((k) => k.slice(type.length + 1))

    const [posts, replies, recentPosts] = await Promise.all([
      prisma.communityPost.findMany({
        where: { isDeleted: false, OR: [{ isHidden: true }, { id: { in: idsOf('POST') } }] },
        include: { user: { select: { name: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communityReply.findMany({
        where: { isDeleted: false, OR: [{ isHidden: true }, { id: { in: idsOf('REPLY') } }] },
        include: { user: { select: { name: true, username: true } }, post: { select: { slug: true, title: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communityPost.findMany({
        where: { isDeleted: false, isHidden: false },
        include: { user: { select: { name: true, username: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])
    flagged = [
      ...posts.map((p) => ({ targetType: 'POST' as const, id: p.id, postSlug: p.slug, title: p.title, text: p.body, author: name(p.user), createdAt: p.createdAt.toISOString(), isHidden: p.isHidden, reports: reportsFor('POST', p.id), category: p.category, cityId: p.cityId })),
      ...replies.map((r) => ({ targetType: 'REPLY' as const, id: r.id, postSlug: r.post.slug, title: `On: ${r.post.title}`, text: r.content, author: name(r.user), createdAt: r.createdAt.toISOString(), isHidden: r.isHidden, reports: reportsFor('REPLY', r.id) })),
    ]
    recent = recentPosts.map((p) => ({ targetType: 'POST' as const, id: p.id, postSlug: p.slug, title: p.title, text: p.body, author: name(p.user), createdAt: p.createdAt.toISOString(), isHidden: false, reports: [], category: p.category, cityId: p.cityId }))

    // Opened from an "Edit" link on the site: the post, or one reply on it
    if (edit) {
      if (replyId) {
        const r = await prisma.communityReply.findFirst({ where: { id: replyId, postId: edit }, include: { user: { select: { name: true, username: true } }, post: { select: { slug: true, title: true } } } })
        if (r) editItems = [{ targetType: 'REPLY', id: r.id, postSlug: r.post.slug, title: `On: ${r.post.title}`, text: r.content, author: name(r.user), createdAt: r.createdAt.toISOString(), isHidden: r.isHidden, reports: reportsFor('REPLY', r.id) }]
      } else {
        const p = await prisma.communityPost.findUnique({ where: { id: edit }, include: { user: { select: { name: true, username: true } } } })
        if (p) editItems = [{ targetType: 'POST', id: p.id, postSlug: p.slug, title: p.title, text: p.body, author: name(p.user), createdAt: p.createdAt.toISOString(), isHidden: p.isHidden, reports: reportsFor('POST', p.id), category: p.category, cityId: p.cityId }]
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'The community tables are not available yet.'
  }

  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }).catch(() => [])
  const categories = COMMUNITY_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }))

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-500">Community moderation</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Reported and hidden posts and replies. Three reports from different members hide an item until you restore or delete it.{' '}
          <Link href="/community" className="text-saffron-600 hover:underline">Open the community page</Link>
        </p>
        {error && <p className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
      {editItems.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-lg font-bold text-navy-500">Editing</h2>
          <CommunityModeration items={editItems} emptyText="" cities={cities} categories={categories} autoEditId={editItems[0].id} />
        </section>
      )}
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold text-navy-500">Needs review ({flagged.length})</h2>
        <CommunityModeration items={flagged} emptyText="Nothing reported or hidden." cities={cities} categories={categories} />
      </section>
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold text-navy-500">Latest posts</h2>
        <CommunityModeration items={recent} emptyText="No posts yet." cities={cities} categories={categories} />
      </section>
    </div>
  )
}
