import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TopicCard } from '@/components/topic/TopicCard'
import { Pagination } from '@/components/shared/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { Search } from 'lucide-react'
import type { TopicWithRelations } from '@/types'

export const metadata: Metadata = {
  title: 'Search Properties',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: { q?: string; page?: string; city?: string }
}

async function searchTopics(q: string, page: number, citySlug?: string) {
  const limit = 15
  const where: Record<string, unknown> = {
    isPublished: true,
    OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { propertyName: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ],
  }
  if (citySlug) {
    const city = await prisma.city.findUnique({ where: { slug: citySlug }, select: { id: true } })
    if (city) where.cityId = city.id
  }
  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        city: { select: { id: true, name: true, slug: true, tier: true } },
        user: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.topic.count({ where }),
  ])
  return { topics, total, totalPages: Math.ceil(total / limit) }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() || ''
  const page = Math.max(1, parseInt(searchParams.page || '1'))

  const { topics, total, totalPages } = q.length >= 2
    ? await searchTopics(q, page, searchParams.city)
    : { topics: [], total: 0, totalPages: 0 }

  return (
    <div className="container-forum py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy-500">
          {q ? `Search results for "${q}"` : 'Search Properties'}
        </h1>
        {q && <p className="text-sm text-neutral-500 mt-1">{total} result{total !== 1 ? 's' : ''} found</p>}
      </div>

      {/* Search Form */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search properties, cities, projects…"
              className="input-field pl-10"
              autoFocus={!q}
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </div>
      </form>

      {q.length < 2 && q.length > 0 ? (
        <p className="text-sm text-neutral-500">Please enter at least 2 characters.</p>
      ) : topics.length === 0 && q ? (
        <EmptyState
          title="No results found"
          description={`We couldn't find any properties matching "${q}". Try different keywords or browse by city.`}
          action={{ label: 'Browse All Cities', href: '/cities' }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic as TopicWithRelations} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} basePath="/search" />
          )}
        </>
      )}
    </div>
  )
}
