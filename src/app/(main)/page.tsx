import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TopicCard } from '@/components/topic/TopicCard'
import { SITE_CONFIG } from '@/lib/constants/config'
import { METRO_CITIES, TIER1_CITIES } from '@/lib/constants/cities'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp, Star, MapPin, ArrowRight, PlusCircle } from 'lucide-react'
import { isNewTopicEnabled } from '@/lib/features'
import type { Metadata } from 'next'
import type { TopicWithRelations } from '@/types'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'India Property Forum — Honest Reviews & Ratings',
  description: 'India\'s most trusted property forum. Honest reviews and ratings from real buyers across Mumbai, Delhi, Bengaluru, Hyderabad and 18 more cities.',
  alternates: { canonical: SITE_CONFIG.url },
}

async function getHomeData() {
  try {
    const [latestTopics, topRatedTopics, cityCounts] = await Promise.all([
      prisma.topic.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          city: { select: { id: true, name: true, slug: true, tier: true } },
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.topic.findMany({
        where: { isPublished: true, ratingCount: { gte: 1 } },
        orderBy: { avgRating: 'desc' },
        take: 4,
        include: {
          city: { select: { id: true, name: true, slug: true, tier: true } },
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.city.findMany({
        where: { isActive: true },
        include: { _count: { select: { topics: { where: { isPublished: true } } } } },
        orderBy: { name: 'asc' },
      }),
    ])
    return { latestTopics, topRatedTopics, cityCounts }
  } catch {
    return { latestTopics: [], topRatedTopics: [], cityCounts: [] }
  }
}

export default async function HomePage() {
  const { latestTopics, topRatedTopics, cityCounts } = await getHomeData()
  const newTopicEnabled = isNewTopicEnabled()

  const cityCountMap = Object.fromEntries(cityCounts.map((c) => [c.slug, c._count.topics]))

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-500 text-white">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="container-forum relative py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
              India&apos;s Most Trusted
              <span className="block text-gradient-saffron mt-1">Property Forum</span>
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed max-w-xl">
              Real discussions, honest reviews and authentic ratings from actual buyers and residents across {cityCounts.length} Indian cities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cities" className="btn-primary text-base px-6 py-3">
                <Building2 className="h-5 w-5" /> Browse Cities
              </Link>
              {newTopicEnabled && (
                <Link href="/new-topic" className="btn-secondary text-base px-6 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <PlusCircle className="h-5 w-5" /> Start a Discussion
                </Link>
              )}
            </div>
          </div>

          {/* City Quick Links */}
          <div className="mt-10 flex flex-wrap gap-2">
            {METRO_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                <MapPin className="h-3.5 w-3.5" /> {city.name}
                {cityCountMap[city.slug] > 0 && (
                  <span className="text-xs bg-saffron-500 text-white rounded-full px-1.5 py-0.5 ml-0.5">
                    {cityCountMap[city.slug]}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="container-forum py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Cities Covered', value: cityCounts.length },
              { label: 'Property Discussions', value: latestTopics.length > 0 ? '100+' : '0' },
              { label: 'Community Members', value: '1000+' },
              { label: 'Honest Reviews', value: '500+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl font-bold text-saffron-500">{stat.value}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      {topRatedTopics.length > 0 && (
        <section className="container-forum py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold fill-gold" />
              <h2 className="font-heading text-2xl font-bold text-navy-500">Top Rated Properties in India</h2>
            </div>
            <Link href="/cities" className="text-sm font-medium text-saffron-500 hover:text-saffron-600 flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topRatedTopics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic as TopicWithRelations} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Discussions */}
      {latestTopics.length > 0 && (
        <section className="bg-neutral-50 border-y border-neutral-200">
          <div className="container-forum py-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-saffron-500" />
                <h2 className="font-heading text-2xl font-bold text-navy-500">Latest Property Reviews &amp; Discussions</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {latestTopics.map((topic, i) => (
                <TopicCard key={topic.id} topic={topic as TopicWithRelations} priority={i < 4} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City Directory */}
      <section className="container-forum py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-navy-500">Browse by City</h2>
          <Link href="/cities" className="text-sm font-medium text-saffron-500 hover:text-saffron-600 flex items-center gap-1">
            All cities <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-saffron-500 mb-3">Metro Cities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {METRO_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-center hover:border-saffron-300 hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 rounded-full bg-saffron-100 flex items-center justify-center group-hover:bg-saffron-500 transition-colors">
                  <MapPin className="h-5 w-5 text-saffron-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-navy-500">{city.name}</p>
                  <p className="text-xs text-neutral-400">{cityCountMap[city.slug] || 0} topics</p>
                </div>
                <Badge variant="metro" className="text-[10px] px-1.5 py-0">Metro</Badge>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal mb-3">Tier 1 Cities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {TIER1_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-3 text-center hover:border-teal hover:shadow-md transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-teal-light flex items-center justify-center group-hover:bg-teal transition-colors">
                  <MapPin className="h-4 w-4 text-teal-dark group-hover:text-white transition-colors" />
                </div>
                <p className="font-heading font-bold text-xs text-navy-500">{city.name}</p>
                <p className="text-[10px] text-neutral-400">{cityCountMap[city.slug] || 0} topics</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {latestTopics.length === 0 && (
        <section className="container-forum py-16 text-center">
          <div className="max-w-lg mx-auto">
            <Building2 className="h-16 w-16 mx-auto text-saffron-300 mb-4" />
            <h2 className="font-heading text-2xl font-bold text-navy-500">Be the First to Discuss</h2>
            <p className="mt-2 text-neutral-500">Start a property discussion and help thousands of Indian buyers make informed decisions.</p>
            <Link href="/register" className="btn-primary mt-6 text-base px-8 py-3 inline-flex">
              Join the Community
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
