import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Bookmark } from 'lucide-react'
import { TopicCard } from '@/components/topic/TopicCard'
import type { TopicWithRelations } from '@/types'

export const metadata = { title: 'My Watchlist — IndiaPropertyTalk' }

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      topic: {
        include: {
          city: { select: { id: true, name: true, slug: true, tier: true } },
          user: { select: { id: true, name: true, username: true, image: true } },
        },
      },
    },
  })

  const topics = bookmarks.map(b => b.topic) as TopicWithRelations[]

  return (
    <div className="container-forum py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="h-5 w-5 text-saffron-500 fill-saffron-500" />
        <h1 className="font-heading text-2xl font-bold text-navy-500">My Watchlist</h1>
        {topics.length > 0 && (
          <span className="text-sm text-neutral-400">({topics.length} {topics.length === 1 ? 'property' : 'properties'})</span>
        )}
      </div>

      {topics.length === 0 ? (
        <div className="card-base p-12 text-center">
          <Bookmark className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
          <p className="font-semibold text-neutral-400">Your watchlist is empty</p>
          <p className="text-sm text-neutral-400 mt-1">
            Bookmark properties you&apos;re researching to track them here.
          </p>
          <a
            href="/"
            className="mt-4 inline-flex items-center rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-600 transition-colors"
          >
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}
