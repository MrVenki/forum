import { prisma } from '@/lib/prisma'
import { PostsTable } from '@/components/admin/PostsTable'

export const revalidate = 0

const select = {
  id: true,
  title: true,
  propertyName: true,
  slug: true,
  description: true,
  address: true,
  propertyType: true,
  priceMin: true,
  priceMax: true,
  developerSlug: true,
  developerName: true,
  constructionStatus: true,
  expectedPossession: true,
  isPublished: true,
  image1Url: true,
  image2Url: true,
  viewCount: true,
  createdAt: true,
  city: { select: { id: true, name: true, slug: true } },
  user: { select: { name: true } },
  _count: { select: { comments: true, ratings: true } },
} as const

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  const [topics, cities, developers] = await Promise.all([
    prisma.topic.findMany({ orderBy: { createdAt: 'desc' }, take: 300, select }),
    prisma.city.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, slug: true } }),
    prisma.developer.findMany({ orderBy: { name: 'asc' }, select: { slug: true, name: true } }),
  ])
  // An "Edit listing" link from the site can point at an older listing outside the latest 300
  if (edit && !topics.some((t) => t.id === edit)) {
    const extra = await prisma.topic.findUnique({ where: { id: edit }, select })
    if (extra) topics.unshift(extra)
  }

  // Serialize dates and decimals for the client component
  const serialized = topics.map((t) => ({
    ...t,
    user: { name: t.user.name ?? 'Member' },
    priceMin: t.priceMin === null ? null : Number(t.priceMin),
    priceMax: t.priceMax === null ? null : Number(t.priceMax),
    expectedPossession: t.expectedPossession ? t.expectedPossession.toISOString().slice(0, 7) : null,
    createdAt: t.createdAt.toISOString(),
  }))

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Posts</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Property listings. Click the status badge to hide or show a listing. Click the pencil to edit its name, price, city, builder, wording or photos. Every change is saved in the Edit log.
          </p>
        </div>
        <span className="text-sm text-neutral-400 shrink-0 ml-4">{topics.length} posts</span>
      </div>
      <PostsTable initialTopics={serialized} cities={cities} developers={developers} initialEditId={edit} />
    </div>
  )
}
