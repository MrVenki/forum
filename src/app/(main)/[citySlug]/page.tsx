import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG, PROPERTY_TYPES, PAGINATION } from '@/lib/constants/config'
import { INDIAN_CITIES } from '@/lib/constants/cities'
import { TopicCard } from '@/components/topic/TopicCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Pagination } from '@/components/shared/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { CityPropertySearch } from '@/components/city/CityPropertySearch'
import { Badge } from '@/components/ui/badge'
import { MapPin, TrendingUp, MessageSquare, Clock, PlusCircle } from 'lucide-react'
import type { TopicWithRelations } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  return INDIAN_CITIES.map((city) => ({ citySlug: city.slug }))
}

interface Props {
  params: { citySlug: string }
  searchParams: { page?: string; sort?: string; type?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.citySlug, isActive: true } })
  if (!city) return {}

  const title = `${city.name} Property Forum — Apartments, Villas & Plots Discussion`
  const description = `Join ${city.name}'s property community. Read honest reviews, ratings, and discussions about real estate projects in ${city.name}, ${city.state}. Powered by real buyers and residents.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_CONFIG.url}/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/${city.slug}`,
      type: 'website',
    },
  }
}

export const dynamicParams = true

export default async function CityPage({ params, searchParams }: Props) {
  const city = await prisma.city.findUnique({
    where: { slug: params.citySlug, isActive: true },
    include: { _count: { select: { topics: { where: { isPublished: true } } } } },
  })
  if (!city) notFound()

  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const sort = searchParams.sort || 'latest'
  const type = searchParams.type || ''
  const limit = PAGINATION.TOPICS_PER_PAGE

  const where = {
    cityId: city.id,
    isPublished: true,
    ...(type ? { propertyType: type as 'APARTMENT' } : {}),
  }

  const orderBy =
    sort === 'top-rated' ? { avgRating: 'desc' as const }
    : sort === 'most-discussed' ? { commentCount: 'desc' as const }
    : { createdAt: 'desc' as const }

  const [topics, total, allTopicsForSearch] = await Promise.all([
    prisma.topic.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        city: { select: { id: true, name: true, slug: true, tier: true } },
        user: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.topic.count({ where }),
    prisma.topic.findMany({
      where: { cityId: city.id, isPublished: true },
      select: {
        slug: true,
        propertyName: true,
        propertyType: true,
        avgRating: true,
        ratingCount: true,
      },
      orderBy: { propertyName: 'asc' },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${city.name} Property Forum Topics`,
    url: `${SITE_CONFIG.url}/${city.slug}`,
    numberOfItems: total,
    itemListElement: topics.slice(0, 10).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_CONFIG.url}/${city.slug}/${t.slug}`,
      name: t.propertyName,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
      { '@type': 'ListItem', position: 2, name: city.name, item: `${SITE_CONFIG.url}/${city.slug}` },
    ],
  }

  const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest', icon: Clock },
    { value: 'top-rated', label: 'Top Rated', icon: TrendingUp },
    { value: 'most-discussed', label: 'Most Discussed', icon: MessageSquare },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListSchema, breadcrumbSchema]) }} />

      <div className="bg-gradient-to-br from-navy-500 to-navy-700 text-white">
        <div className="container-forum py-10">
          <Breadcrumbs items={[{ label: city.name }]} />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-saffron-400" />
                <Badge variant={city.tier === 'METRO' ? 'metro' : 'tier1'} className="text-xs">
                  {city.tier === 'METRO' ? 'Metro City' : 'Tier 1 City'}
                </Badge>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold">{city.name} Property Forum</h1>
              <p className="mt-1 text-navy-200 text-sm">{city.state} · {city._count.topics} discussions</p>
            </div>
            <Link href="/new-topic" className="btn-primary shrink-0">
              <PlusCircle className="h-4 w-4" />
              Start a Discussion
            </Link>
          </div>
        </div>
      </div>

      <div className="container-forum py-8">
        {/* Property search */}
        {allTopicsForSearch.length > 0 && (
          <CityPropertySearch
            topics={allTopicsForSearch.map((t) => ({
              slug: t.slug,
              propertyName: t.propertyName,
              propertyType: t.propertyType,
              avgRating: Number(t.avgRating),
              ratingCount: t.ratingCount,
            }))}
            citySlug={city.slug}
            cityName={city.name}
          />
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Sort */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = sort === opt.value
              return (
                <Link
                  key={opt.value}
                  href={`/${city.slug}?sort=${opt.value}${type ? `&type=${type}` : ''}`}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${active ? 'bg-white text-saffron-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  <Icon className="h-3.5 w-3.5" />{opt.label}
                </Link>
              )
            })}
          </div>

          {/* Property type filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={`/${city.slug}?sort=${sort}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!type ? 'bg-saffron-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              All Types
            </Link>
            {PROPERTY_TYPES.map((pt) => (
              <Link
                key={pt.value}
                href={`/${city.slug}?sort=${sort}&type=${pt.value}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${type === pt.value ? 'bg-saffron-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
              >
                {pt.label}
              </Link>
            ))}
          </div>
        </div>

        {topics.length === 0 ? (
          <EmptyState
            title={`No discussions in ${city.name} yet`}
            description="Be the first to start a property discussion. Share your experience and help other buyers."
            action={{ label: 'Start a Discussion', href: '/new-topic' }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
              {topics.map((topic, i) => (
                <TopicCard
                  key={topic.id}
                  topic={topic as TopicWithRelations}
                  priority={i < 4}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} basePath={`/${city.slug}`} preserveParams={{ sort, ...(type ? { type } : {}) }} />
          </>
        )}
      </div>
    </>
  )
}
