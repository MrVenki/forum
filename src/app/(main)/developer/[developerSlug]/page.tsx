import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/constants/config'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { StarRating } from '@/components/rating/StarRating'
import { TopicCard } from '@/components/topic/TopicCard'
import { Building2, MapPin, Calendar, Star, MessageSquare, Home } from 'lucide-react'
import type { TopicWithRelations } from '@/types'

export const revalidate = 3600

interface Props { params: { developerSlug: string } }

export async function generateStaticParams() {
  const developers = await prisma.developer.findMany({ select: { slug: true } })
  return developers.map((d) => ({ developerSlug: d.slug }))
}

const MIN_TOPICS_TO_INDEX = 3 // Noindex thin developer pages to preserve crawl budget

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const developer = await prisma.developer.findUnique({ where: { slug: params.developerSlug } })
  if (!developer) return {}

  const topicCount = await prisma.topic.count({
    where: { developerSlug: params.developerSlug, isPublished: true },
  })

  // Pages with fewer than 3 topics are thin content — noindex to protect crawl budget
  // while still keeping the page accessible to users who land via internal links.
  const shouldIndex = topicCount >= MIN_TOPICS_TO_INDEX

  return {
    title: `${developer.name} — Developer Reputation Score | IndiaPropertyTalk`,
    description: `Community ratings, reviews and property listings for ${developer.name}. See what buyers say about build quality, delivery, and value.`,
    alternates: shouldIndex ? { canonical: `${SITE_CONFIG.url}/developer/${developer.slug}` } : undefined,
    robots: shouldIndex ? undefined : { index: false, follow: true },
  }
}

export default async function DeveloperPage({ params }: Props) {
  const developer = await prisma.developer.findUnique({ where: { slug: params.developerSlug } })
  if (!developer) notFound()

  const [topics, allRatings] = await Promise.all([
    prisma.topic.findMany({
      where: { developerSlug: params.developerSlug, isPublished: true },
      orderBy: { avgRating: 'desc' },
      include: {
        city: { select: { id: true, name: true, slug: true, tier: true } },
        user: { select: { id: true, name: true, image: true } },
      },
    }) as Promise<TopicWithRelations[]>,
    prisma.rating.findMany({
      where: { topic: { developerSlug: params.developerSlug, isPublished: true } },
      select: { score: true },
    }),
  ])

  const totalRatings = allRatings.length
  const avgRating = totalRatings > 0
    ? allRatings.reduce((s, r) => s + r.score, 0) / totalRatings
    : 0

  const distribution = [5, 4, 3, 2, 1].map((score) => {
    const count = allRatings.filter((r) => r.score === score).length
    return { score, count, pct: totalRatings > 0 ? (count / totalRatings) * 100 : 0 }
  })

  const totalComments = topics.reduce((s, t) => s + t.commentCount, 0)

  // Reputation label
  const reputationLabel =
    avgRating >= 4.5 ? 'Excellent' :
    avgRating >= 4.0 ? 'Very Good' :
    avgRating >= 3.5 ? 'Good' :
    avgRating >= 3.0 ? 'Average' :
    avgRating > 0    ? 'Below Average' : 'No ratings yet'

  const reputationColor =
    avgRating >= 4.5 ? 'text-emerald-600' :
    avgRating >= 4.0 ? 'text-teal-600' :
    avgRating >= 3.5 ? 'text-saffron-600' :
    avgRating >= 3.0 ? 'text-orange-500' :
    avgRating > 0    ? 'text-red-500' : 'text-neutral-400'

  return (
    <div className="container-forum py-8">
      <Breadcrumbs items={[
        { label: 'Developer Reputation Scores', href: '/developers' },
        { label: developer.name },
      ]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* Reputation Score Card */}
          <div className="card-base p-6">
            <div className="flex items-start gap-5 flex-wrap">
              {/* Logo block */}
              <div className="h-16 w-16 rounded-2xl bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 font-heading font-bold text-3xl shrink-0">
                {developer.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="font-heading text-2xl font-bold text-navy-500">{developer.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500 flex-wrap">
                  {developer.hq && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {developer.hq}</span>}
                  {developer.foundedYear && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Est. {developer.foundedYear}</span>}
                  {developer.totalDelivered && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {developer.totalDelivered}</span>}
                </div>
              </div>
            </div>

            {/* Score row */}
            <div className="mt-6 flex items-center gap-6 flex-wrap">
              <div className="text-center">
                <p className="text-6xl font-bold text-navy-500 leading-none">
                  {avgRating > 0 ? avgRating.toFixed(1) : '–'}
                </p>
                <p className={`text-sm font-semibold mt-1 ${reputationColor}`}>{reputationLabel}</p>
              </div>
              <div className="space-y-1 flex-1 min-w-[180px]">
                <StarRating value={avgRating} readonly size="md" showCount={false} />
                <p className="text-sm text-neutral-500">Based on {totalRatings} ratings across {topics.length} project{topics.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3 pt-5 border-t border-neutral-100">
              {[
                { icon: Home, label: 'Projects Listed', value: topics.length },
                { icon: Star, label: 'Total Ratings', value: totalRatings },
                { icon: MessageSquare, label: 'Discussions', value: totalComments },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon className="h-4 w-4 text-saffron-400 mx-auto mb-1" />
                  <p className="font-bold text-xl text-navy-500">{value}</p>
                  <p className="text-xs text-neutral-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          {totalRatings > 0 && (
            <div className="card-base p-6">
              <h2 className="font-heading font-bold text-lg text-navy-500 mb-4">Rating Breakdown</h2>
              <div className="space-y-2.5">
                {distribution.map(({ score, count, pct }) => (
                  <div key={score} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-600 w-4">{score}</span>
                    <Star className="h-3.5 w-3.5 text-saffron-400 fill-saffron-400 shrink-0" />
                    <div className="flex-1 bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-saffron-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-500 w-8 text-right">{count}</span>
                    <span className="text-xs text-neutral-400 w-10 text-right">{pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {developer.description && (
            <div className="card-base p-6">
              <h2 className="font-heading font-bold text-lg text-navy-500 mb-3">About {developer.name}</h2>
              <p className="text-sm text-neutral-700 leading-relaxed">{developer.description}</p>
            </div>
          )}

          {/* Projects */}
          <div>
            <h2 className="font-heading font-bold text-lg text-navy-500 mb-4">
              Properties on IndiaPropertyTalk
              <span className="ml-2 text-sm font-normal text-neutral-400">({topics.length})</span>
            </h2>
            {topics.length === 0 ? (
              <div className="card-base p-10 text-center text-neutral-400 text-sm">
                No properties listed yet for this developer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Quick verdict */}
          <div className="card-base p-5">
            <h3 className="font-heading font-bold text-navy-500 mb-3">Community Verdict</h3>
            <div className={`text-4xl font-bold mb-1 ${reputationColor}`}>
              {reputationLabel}
            </div>
            <StarRating value={avgRating} readonly size="sm" showCount={false} />
            <p className="text-xs text-neutral-500 mt-2">
              {totalRatings} ratings · {topics.length} properties tracked
            </p>
            {avgRating >= 4.0 && (
              <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-700">
                ✅ Highly rated developer — buyers consistently report good build quality and delivery.
              </div>
            )}
            {avgRating >= 3.0 && avgRating < 4.0 && (
              <div className="mt-3 rounded-lg bg-saffron-50 border border-saffron-100 p-3 text-xs text-saffron-700">
                ⚠️ Mixed reviews — check individual project pages for specific concerns before deciding.
              </div>
            )}
            {avgRating > 0 && avgRating < 3.0 && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-700">
                ❌ Below average ratings — read community reviews carefully before investing.
              </div>
            )}
          </div>

          {/* Developer details */}
          <div className="card-base p-5">
            <h3 className="font-heading font-bold text-navy-500 mb-3">Developer Profile</h3>
            <dl className="space-y-2 text-sm">
              {developer.foundedYear && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Founded</dt>
                  <dd className="font-medium text-neutral-800">{developer.foundedYear}</dd>
                </div>
              )}
              {developer.hq && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Headquarters</dt>
                  <dd className="font-medium text-neutral-800">{developer.hq}</dd>
                </div>
              )}
              {developer.totalDelivered && (
                <div className="flex flex-col gap-0.5">
                  <dt className="text-neutral-500">Portfolio</dt>
                  <dd className="font-medium text-neutral-800 text-xs">{developer.totalDelivered}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-gradient-to-br from-navy-500 to-navy-600 p-5 text-white text-center">
            <h3 className="font-heading font-bold mb-1">Know a project by {developer.name.split(' ')[0]}?</h3>
            <p className="text-sm text-white/70 mb-3">Share your experience to help other buyers make better decisions.</p>
            <Link href="/developers" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-600 hover:bg-neutral-100 transition-colors">
              See All Developers
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
