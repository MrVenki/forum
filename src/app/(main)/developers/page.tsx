import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { StarRating } from '@/components/rating/StarRating'
import { Building2, MapPin, Calendar, Home, Star } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Developer Reputation Scores — IndiaPropertyTalk',
  description: 'Compare Indian real estate developers by community ratings, review counts, and project quality scores based on verified buyer experiences.',
  alternates: { canonical: `${SITE_CONFIG.url}/developers` },
}

export const revalidate = 3600

export default async function DevelopersPage() {
  const [developers, topics] = await Promise.all([
    prisma.developer.findMany({ orderBy: { name: 'asc' } }),
    prisma.topic.findMany({
      where: { isPublished: true, developerSlug: { not: null } },
      select: { developerSlug: true, avgRating: true, ratingCount: true, commentCount: true },
    }),
  ])

  // Aggregate stats per developer from topics
  const statsMap: Record<string, { projectCount: number; totalRatings: number; totalComments: number; ratingSum: number }> = {}
  for (const t of topics) {
    const slug = t.developerSlug!
    if (!statsMap[slug]) statsMap[slug] = { projectCount: 0, totalRatings: 0, totalComments: 0, ratingSum: 0 }
    statsMap[slug].projectCount++
    statsMap[slug].totalRatings += t.ratingCount
    statsMap[slug].totalComments += t.commentCount
    statsMap[slug].ratingSum += Number(t.avgRating) * t.ratingCount
  }

  const rows = developers
    .filter((d) => statsMap[d.slug])
    .map((d) => {
      const s = statsMap[d.slug]
      const avg = s.totalRatings > 0 ? s.ratingSum / s.totalRatings : 0
      return { developer: d, avg, projects: s.projectCount, ratings: s.totalRatings }
    })
    .sort((a, b) => b.projects - a.projects)

  const totalProjects = rows.reduce((s, r) => s + r.projects, 0)

  return (
    <div className="container-forum py-8">
      <Breadcrumbs items={[{ label: 'Developer Reputation Scores' }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy-500">Developer Reputation Scores</h1>
        <p className="mt-2 text-neutral-500 max-w-2xl">
          Community-driven ratings based on verified buyer experiences across {rows.length} developers and {totalProjects} properties. Higher scores reflect consistent build quality, delivery track record, and buyer satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map(({ developer, avg, projects, ratings }) => (
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
                <p className="text-xs text-neutral-400 mt-0.5">{ratings} rating{ratings !== 1 ? 's' : ''}</p>
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
                <p className="font-bold text-lg text-saffron-500">{ratings}</p>
                <p className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                  <Star className="h-3 w-3" /> Ratings
                </p>
              </div>
            </div>

            {developer.totalDelivered && (
              <p className="text-xs text-neutral-500 border-t border-neutral-100 pt-3 line-clamp-1">
                <Building2 className="h-3 w-3 inline mr-1 text-neutral-400" />
                {developer.totalDelivered}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
