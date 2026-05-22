import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { DeveloperSearch } from '@/components/developer/DeveloperSearch'
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

      <DeveloperSearch rows={rows} />
    </div>
  )
}
