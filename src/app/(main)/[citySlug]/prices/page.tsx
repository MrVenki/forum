import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants/config'
import { formatINR } from '@/lib/utils/format'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { cityMedian, getCityAreas, percentVs, typeLabel } from '@/lib/areaPrices'

export const revalidate = 3600

interface Props {
  params: { citySlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCityAreas(params.citySlug)
  if (!data) return {}
  const { city, areas } = data
  const title = `Property Prices by Area in ${city.name} — Project Price Ranges`
  const description = `Compare property prices across ${areas.length} areas of ${city.name}. Typical price and price range for apartments, villas and plots, built from projects discussed on IndiaPropertyTalk.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_CONFIG.url}/${city.slug}/prices` },
    robots: areas.length < 2 ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: `${SITE_CONFIG.url}/${city.slug}/prices`, type: 'website' },
  }
}

export default async function CityPricesPage({ params }: Props) {
  const data = await getCityAreas(params.citySlug)
  if (!data) notFound()
  const { city, areas } = data

  const types = Array.from(new Set(areas.flatMap((a) => Object.keys(a.byType))))
  const sections = types
    .map((type) => ({
      type,
      median: cityMedian(areas, type),
      rows: areas
        .filter((a) => a.byType[type] && a.byType[type].n >= 2)
        .map((a) => ({ area: a, stat: a.byType[type] }))
        .sort((x, y) => Number(y.stat.n >= 3) - Number(x.stat.n >= 3) || y.stat.median - x.stat.median),
    }))
    .filter((s) => s.rows.length >= 2)
    .sort((a, b) => b.rows.length - a.rows.length)

  const projectCount = areas.reduce((n, a) => n + a.count, 0)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
      { '@type': 'ListItem', position: 2, name: city.name, item: `${SITE_CONFIG.url}/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: 'Property prices by area', item: `${SITE_CONFIG.url}/${city.slug}/prices` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container-forum py-8">
        <Breadcrumbs items={[{ label: city.name, href: `/${city.slug}` }, { label: 'Property prices by area' }]} />

        <h1 className="mt-5 font-heading text-3xl font-bold text-navy-500">Property prices by area in {city.name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Typical project prices across {areas.length} areas of {city.name}, based on {projectCount} projects discussed on
          IndiaPropertyTalk. These are listed price ranges for projects, not market valuations or price per sq ft.
        </p>

        {sections.length === 0 ? (
          <div className="card-base mt-8 p-8 text-center text-sm text-neutral-500">
            We do not have enough projects with prices in {city.name} to compare areas yet.{' '}
            <Link href="/new-topic" className="font-semibold text-saffron-600 hover:underline">Add a project</Link>
          </div>
        ) : (
          sections.map(({ type, median, rows }) => (
            <section key={type} className="mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-heading text-xl font-bold text-navy-500">{typeLabel(type)}: price by area</h2>
                {median && (
                  <p className="text-sm text-neutral-500">
                    {city.name} typical: <span className="font-semibold text-neutral-800">{formatINR(median)}</span>
                  </p>
                )}
              </div>
              <div className="card-base mt-3 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-500">
                      <th className="px-4 py-3 font-semibold">Area</th>
                      <th className="px-4 py-3 font-semibold">Projects</th>
                      <th className="px-4 py-3 font-semibold">Typical price</th>
                      <th className="px-4 py-3 font-semibold">Price range</th>
                      <th className="px-4 py-3 font-semibold">vs city</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ area, stat }) => {
                      const diff = percentVs(stat.median, median)
                      return (
                        <tr key={area.slug} className="border-b border-neutral-50 last:border-0">
                          <td className="px-4 py-3">
                            <Link href={`/${city.slug}/prices/${area.slug}`} className="font-semibold text-navy-500 hover:text-saffron-600">
                              {area.label}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-neutral-600">
                            {stat.n}
                            {stat.n < 3 && <span className="ml-1.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">limited data</span>}
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-800">{formatINR(stat.median)}</td>
                          <td className="px-4 py-3 text-neutral-600">{formatINR(stat.low)} – {formatINR(stat.high)}</td>
                          <td className={`px-4 py-3 font-medium ${diff === null ? 'text-neutral-400' : diff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {diff === null ? '–' : `${diff > 0 ? '+' : ''}${diff}%`}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}

        <div className="mt-10 rounded-xl bg-neutral-50 p-5 text-xs leading-relaxed text-neutral-500">
          <p className="font-semibold text-neutral-700">How these numbers are built</p>
          <p className="mt-1">
            An area is a pincode (or locality name where a pincode is missing). Typical price is the median of each project&apos;s
            midpoint price. Areas need at least 2 projects of the same type to appear; areas with only 2 are marked limited data.
            Figures update automatically as projects are added. They reflect developer-listed price ranges and community
            discussion, so verify current prices with the builder before you decide.
          </p>
        </div>
      </div>
    </>
  )
}
