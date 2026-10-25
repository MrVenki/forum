import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/constants/config'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ShareCard } from '@/components/profile/ShareCard'

export const dynamic = 'force-dynamic'

export default async function ShareListingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const topics = await prisma.topic.findMany({
    where: { userId: session.user.id, isPublished: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      propertyName: true,
      commentCount: true,
      city: { select: { slug: true, name: true } },
    },
  })
  const ids = topics.map((t) => t.id)

  const [visits, referredComments, yesVotes] = ids.length
    ? await Promise.all([
        prisma.referralVisit.groupBy({ by: ['topicId'], where: { topicId: { in: ids } }, _count: { _all: true } }),
        prisma.comment.groupBy({
          by: ['topicId'],
          where: { topicId: { in: ids }, viaReferral: true, isDeleted: false },
          _count: { _all: true },
        }),
        prisma.buyIntentVote.groupBy({
          by: ['topicId'],
          where: { topicId: { in: ids }, intent: 'YES' },
          _count: { _all: true },
        }),
      ])
    : [[], [], []]

  const countOf = (rows: { topicId: string; _count: { _all: number } }[], id: string) =>
    rows.find((r) => r.topicId === id)?._count._all ?? 0

  return (
    <div className="container-forum py-8">
      <Breadcrumbs items={[{ label: 'My Profile', href: '/profile' }, { label: 'Invite buyers' }]} />

      <div className="mt-6 max-w-3xl space-y-5">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Get honest feedback from your customers</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Share your project page with people who visited or bought. Their comments appear on the page for everyone to read.
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="card-base p-8 text-center text-sm text-neutral-500">
            You have not posted a project yet.{' '}
            <Link href="/new-topic" className="font-semibold text-saffron-600 hover:underline">Post one</Link>
          </div>
        ) : (
          topics.map((t) => (
            <ShareCard
              key={t.id}
              propertyName={t.propertyName}
              cityName={t.city.name}
              url={`${SITE_CONFIG.url}/${t.city.slug}/${t.slug}?ref=owner`}
              visitors={countOf(visits, t.id)}
              comments={countOf(referredComments, t.id)}
              wouldBuy={countOf(yesVotes, t.id)}
              totalComments={t.commentCount}
            />
          ))
        )}
      </div>
    </div>
  )
}
