import { prisma } from '@/lib/prisma'
import { CommentsTable } from '@/components/admin/CommentsTable'

export const revalidate = 0

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
    select: {
      id: true,
      content: true,
      isDeleted: true,
      createdAt: true,
      parentId: true,
      user: { select: { name: true } },
      topic: {
        select: {
          propertyName: true,
          slug: true,
          city: { select: { slug: true, name: true } },
        },
      },
    },
  })

  // Serialize dates to strings for client component
  const serialized = comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Comments</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review user comments. Edit text inline or delete inappropriate content. Deleted comments can be restored.
          </p>
        </div>
        <span className="text-sm text-neutral-400">{comments.length} comments</span>
      </div>
      <CommentsTable initialComments={serialized} />
    </div>
  )
}
