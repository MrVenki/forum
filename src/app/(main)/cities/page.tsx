import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/constants/config'
import { METRO_CITIES, TIER1_CITIES } from '@/lib/constants/cities'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { MapPin, Building2, MessageSquare } from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Browse Indian Cities — Property Forum by Metro & Tier 1 Cities',
  description: 'Explore property discussions across 22 Indian cities. Find reviews, ratings, and real estate conversations in Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata and more.',
  alternates: { canonical: `${SITE_CONFIG.url}/cities` },
}

async function getCityCounts() {
  try {
    return await prisma.city.findMany({
      where: { isActive: true },
      include: { _count: { select: { topics: { where: { isPublished: true } } } } },
    })
  } catch { return [] }
}

export default async function CitiesPage() {
  const citiesData = await getCityCounts()
  const countMap = Object.fromEntries(citiesData.map((c) => [c.slug, c._count.topics]))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Indian Property Forum Cities',
    description: metadata.description,
    itemListElement: [...METRO_CITIES, ...TIER1_CITIES].map((city, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${city.name} Property Forum`,
      url: `${SITE_CONFIG.url}/${city.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gradient-to-br from-navy-500 to-navy-700 text-white">
        <div className="container-forum py-10">
          <Breadcrumbs items={[{ label: 'Cities' }]} />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-4">Browse by City</h1>
          <p className="mt-2 text-navy-200 max-w-lg">
            Explore property discussions in {METRO_CITIES.length + TIER1_CITIES.length} Indian cities — from metro hubs to emerging Tier 1 markets.
          </p>
        </div>
      </div>

      <div className="container-forum py-10 space-y-10">
        {/* Metro Cities */}
        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-saffron-500" />
            Metro Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {METRO_CITIES.map((city) => {
              const count = countMap[city.slug] || 0
              return (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-center hover:border-saffron-300 hover:shadow-lg transition-all"
                >
                  <div className="h-14 w-14 rounded-2xl bg-saffron-50 flex items-center justify-center group-hover:bg-saffron-500 transition-colors">
                    <Building2 className="h-7 w-7 text-saffron-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-navy-500">{city.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{city.state}</p>
                  </div>
                  <Badge variant="metro">Metro</Badge>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {count} discussion{count !== 1 ? 's' : ''}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Tier 1 Cities */}
        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal" />
            Tier 1 Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {TIER1_CITIES.map((city) => {
              const count = countMap[city.slug] || 0
              return (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-center hover:border-teal hover:shadow-md transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-teal-light flex items-center justify-center group-hover:bg-teal transition-colors">
                    <MapPin className="h-5 w-5 text-teal-dark group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-navy-500">{city.name}</p>
                    <p className="text-[10px] text-neutral-400">{city.state}</p>
                  </div>
                  <p className="text-[10px] text-neutral-400">{count} topics</p>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
