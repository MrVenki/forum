import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { StarRating } from '@/components/rating/StarRating'
import { Building2, MapPin, Calendar, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Developer Reputation Scores — IndiaPropertyTalk',
  description: 'Compare Indian real estate developers by community ratings, review counts, and project quality scores based on verified buyer experiences.',
}

export const revalidate = 3600

export default async function DevelopersPage() {
  // Get all developers that have at least one published topic
  const stats = await prisma.topic.groupBy({
    by: ['developerSlug'],
    where: { isPublished: true, developerSlug: { not: null } },
    _avg: { avgRating: true },
    _count: { id: true },
    _sum: { ratingCount: true, commentCount: true },
    orderBy: { _count: { id: 'desc' } },
  })

  const slugs = stats.map((s) => s.developerSlug as string)
  const developers = await prisma.developer.findMany({
    where: { slug: { in: slugs } },
  })

  const devMap = Object.fromEntries(developers.map((d) => [d.slug, d]))

  const rows = stats
    .map((s) => ({
      ...s,
      developer: devMap[s.developerSlug as string],
    }))
    .filter((r) => r.developer)
    .sort((a, b) => (b._count.id) - (a._count.id))

  return (
    <div className="container-forum py-8">
      <Breadcrumbs items={[{ label: 'Developer Reputation Scores' }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy-500">Developer Reputation Scores</h1>
        <p className="mt-2 text-neutral-500 max-w-2xl">
          Community-driven ratings based on verified buyer experiences across {rows.length} developers and {stats.reduce((s, r) => s + r._count.id, 0)} properties. Higher scores reflect consistent build quality, delivery track record, and buyer satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map(({ developer, _avg, _count, _sum }) => {
          const avg = Number(_avg.avgRating ?? 0)
          const projects = _count.id
          const reviews = _sum.ratingCount ?? 0
          return (
            <Link
              key={developer.slug}
              href={`/developer/${developer.slug}`}
              className="card-base p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 font-heading font-bold text-xl shrink-0">
                  {developer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading font-bold text-navy-500 group-hover:text-saffron-600 transition-colors leading-tight">
                    {developer.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-400 flex-wrap">
                    {developer.hq && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {developer.hq}
                      </span>
                    )}
                    {developer.foundedYear && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Est. {developer.foundedYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-navy-500">{avg > 0 ? avg.toFixed(1) : '–'}</span>
                <div>
                  <StarRating value={avg} readonly size="sm" showCount={false} />
                  <p className="text-xs text-neutral-400 mt-0.5">{reviews} rating{reviews !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 text-center">
                <div>
                  <p className="font-bold text-lg text-saffron-500">{projects}</p>
                  <p className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                    <Home className="h-3 w-3" /> Project{projects !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-lg text-saffron-500">{reviews}</p>
                  <p className="text-xs text-neutral-400">Community Ratings</p>
                </div>
              </div>

              {developer.totalDelivered && (
                <p className="text-xs text-neutral-500 border-t border-neutral-100 pt-3 line-clamp-1">
                  <Building2 className="h-3 w-3 inline mr-1 text-neutral-400" />
                  {developer.totalDelivered}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
