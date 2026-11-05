import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { TopicCard } from '@/components/topic/TopicCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { formatAbsoluteDate } from '@/lib/utils/format'
import { User, MessageSquare, Star, Calendar, Bookmark, Share2 } from 'lucide-react'
import type { TopicWithRelations } from '@/types'
import { EditNameForm } from '@/components/profile/EditNameForm'
import { EditUsernameForm } from '@/components/profile/EditUsernameForm'
import { FlairPickerClient } from '@/components/profile/FlairPickerClient'
import { getReviewGaps } from '@/lib/reviewGaps'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [user, topics, commentCount, ratingCount, bookmarkCount, reviewGaps] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, username: true, email: true, createdAt: true, image: true, flairTag: true } }),
    prisma.topic.findMany({
      where: { userId: session.user.id, isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        city: { select: { id: true, name: true, slug: true, tier: true } },
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    }),
    prisma.comment.count({ where: { userId: session.user.id, isDeleted: false } }),
    prisma.rating.count({ where: { userId: session.user.id } }),
    prisma.bookmark.count({ where: { userId: session.user.id } }),
    getReviewGaps(session.user.id),
  ])

  if (!user) redirect('/login')

  return (
    <div className="container-forum py-8">
      <Breadcrumbs items={[{ label: 'My Profile' }]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <aside className="lg:col-span-1">
          <div className="card-base p-6 text-center">
            <div className="h-20 w-20 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 text-3xl font-bold mx-auto">
              {(user.username ?? user.name).charAt(0).toUpperCase()}
            </div>
            <EditNameForm initialName={user.name} />
            <EditUsernameForm initialUsername={user.username ?? ''} />
            <p className="text-sm text-neutral-500">{user.email}</p>
            <p className="text-xs text-neutral-400 mt-2 flex items-center justify-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Joined {formatAbsoluteDate(user.createdAt)}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-neutral-100 pt-4">
              {[
                { label: 'Posts', value: topics.length, icon: User },
                { label: 'Comments', value: commentCount, icon: MessageSquare },
                { label: 'Ratings', value: ratingCount, icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-bold text-lg text-saffron-500">{stat.value}</p>
                  <p className="text-xs text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/profile/watchlist" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-neutral-600 hover:text-saffron-600 transition-colors">
              <Bookmark className="h-4 w-4" /> Watchlist ({bookmarkCount})
            </Link>
            {topics.length > 0 && (
              <Link href="/profile/share" className="mt-2 flex items-center justify-center gap-1.5 text-sm text-neutral-600 hover:text-saffron-600 transition-colors">
                <Share2 className="h-4 w-4" /> Invite buyers to comment
              </Link>
            )}

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <FlairPickerClient initialFlair={user.flairTag} />
            </div>

            <Link href="/new-topic" className="btn-primary w-full mt-4 text-sm justify-center">
              Start New Discussion
            </Link>
          </div>
        </aside>

        {/* Topics */}
        <main className="lg:col-span-3">
          {reviewGaps.length > 0 && (
            <section id="improve-reviews" className="card-base mb-6 scroll-mt-24 p-5">
              <h2 className="font-heading font-bold text-lg text-navy-500">Reviews you can improve</h2>
              <p className="mt-1 text-sm text-neutral-500">
                These details power each builder&apos;s possession tracker and the maintenance figures buyers rely on.
              </p>
              <ul className="mt-3 divide-y divide-neutral-100">
                {reviewGaps.map((g) => (
                  <li key={g.topicId} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                    <span>
                      <span className="font-semibold text-neutral-800">{g.propertyName}</span>
                      <span className="text-neutral-500"> · missing {g.missing.join(', ')}</span>
                    </span>
                    <Link href={g.url} className="text-xs font-semibold text-saffron-600 hover:underline">Add details →</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <h2 className="font-heading font-bold text-lg text-navy-500 mb-4">My Discussions ({topics.length})</h2>
          {topics.length === 0 ? (
            <div className="card-base p-10 text-center text-neutral-400">
              <p className="text-sm">You haven&apos;t started any discussions yet.</p>
              <Link href="/new-topic" className="btn-primary mt-4 text-sm">Start your first discussion</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic as TopicWithRelations} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
