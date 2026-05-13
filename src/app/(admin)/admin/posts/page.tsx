import { prisma } from '@/lib/prisma'
import { PostsTable } from '@/components/admin/PostsTable'

export const revalidate = 0

export default async function AdminPostsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
    select: {
      id: true,
      propertyName: true,
      slug: true,
      description: true,
      isPublished: true,
      image1Url: true,
      image1PubId: true,
      image2Url: true,
      image2PubId: true,
      viewCount: true,
      createdAt: true,
      city: { select: { name: true, slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true, ratings: true } },
    },
  })

  // Serialize dates to strings for client component
  const serialized = topics.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Posts</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review and moderate property discussions. Click the status badge to toggle visibility instantly. Click the pencil icon to edit content or remove images.
          </p>
        </div>
        <span className="text-sm text-neutral-400">{topics.length} posts</span>
      </div>
      <PostsTable initialTopics={serialized} />
    </div>
  )
}
