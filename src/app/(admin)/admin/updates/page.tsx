import { prisma } from '@/lib/prisma'
import { UpdatesTable } from '@/components/admin/UpdatesTable'

export const revalidate = 0

export default async function AdminUpdatesPage() {
  const updates = await prisma.topicUpdate.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
    include: {
      user: { select: { name: true } },
      topic: {
        select: {
          propertyName: true,
          slug: true,
          city: { select: { name: true, slug: true } },
        },
      },
    },
  })

  const serialized = updates.map(u => ({
    ...u,
    visitedAt: u.visitedAt.toISOString(),
    createdAt: u.createdAt.toISOString(),
  }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Construction Updates</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review site visit updates posted by users. Edit the description or delete entries that violate guidelines.
            Photos are shown as thumbnails for quick review.
          </p>
        </div>
        <span className="text-sm text-neutral-400">{updates.length} updates</span>
      </div>
      <UpdatesTable initialUpdates={serialized} />
    </div>
  )
}
