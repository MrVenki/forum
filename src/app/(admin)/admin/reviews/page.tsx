import { prisma } from '@/lib/prisma'
import { ReviewsTable, type ReviewRow } from '@/components/admin/ReviewsTable'

export const revalidate = 0

const select = {
  id: true, score: true, review: true, pros: true, cons: true, ownership: true,
  promisedPossession: true, actualPossession: true, maintenancePerSqFt: true, createdAt: true,
  user: { select: { name: true, username: true, isSeeded: true } },
  topic: { select: { propertyName: true, slug: true, city: { select: { name: true, slug: true } } } },
} as const

const month = (d: Date | null) => (d ? d.toISOString().slice(0, 7) : null)

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  const ratings = await prisma.rating.findMany({ orderBy: { createdAt: 'desc' }, take: 300, select })
  if (edit && !ratings.some((r) => r.id === edit)) {
    const extra = await prisma.rating.findUnique({ where: { id: edit }, select })
    if (extra) ratings.unshift(extra)
  }

  // Replies to reviews live in their own table, which may be missing on an old database
  const repliesBy = new Map<string, ReviewRow['replies']>()
  try {
    const replies = await prisma.ratingReply.findMany({
      where: { ratingId: { in: ratings.map((r) => r.id) } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, ratingId: true, content: true, isDeleted: true, user: { select: { name: true, username: true } } },
    })
    for (const r of replies) {
      const list = repliesBy.get(r.ratingId) ?? []
      list.push({ id: r.id, content: r.content, isDeleted: r.isDeleted, author: r.user.username ? `@${r.user.username}` : r.user.name ?? 'Member' })
      repliesBy.set(r.ratingId, list)
    }
  } catch {
    // no replies table yet
  }

  const rows: ReviewRow[] = ratings.map((r) => ({
    id: r.id,
    score: r.score,
    review: r.review,
    pros: r.pros,
    cons: r.cons,
    ownership: r.ownership,
    promisedPossession: month(r.promisedPossession),
    actualPossession: month(r.actualPossession),
    maintenancePerSqFt: r.maintenancePerSqFt === null ? null : Number(r.maintenancePerSqFt),
    createdAt: r.createdAt.toISOString(),
    author: r.user.username ? `@${r.user.username}` : r.user.name ?? 'Member',
    isSeeded: r.user.isSeeded,
    project: r.topic.propertyName,
    city: r.topic.city.name,
    url: `/${r.topic.city.slug}/${r.topic.slug}#review-${r.id}`,
    replies: repliesBy.get(r.id) ?? [],
  }))

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy-500">Reviews</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Star ratings and written reviews, newest first. You can fix the wording, pros and cons, possession dates and maintenance figure, or delete a review. The star scores stay the member&apos;s own.
          Reworded reviews and replies show &quot;Edited by a moderator&quot; on the site.
        </p>
      </div>
      <ReviewsTable initialRows={rows} initialEditId={edit} />
    </div>
  )
}
