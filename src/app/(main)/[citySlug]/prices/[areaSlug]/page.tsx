import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants/config'
import { formatINR } from '@/lib/utils/format'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { cityMedian, getCityAreas, percentVs, typeLabel } from '@/lib/areaPrices'

export const revalidate = 3600

interface Props {
  params: { citySlug: string; areaSlug: string }
}

async function load(params: Props['params']) {
  const data = await getCityAreas(params.citySlug)
  if (!data) return null
  const area = data.areas.find((a) => a.slug === params.areaSlug)
  return area ? { ...data, area } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params)
  if (!data) return {}
  const { city, area } = data
  const title = `Property Prices in ${area.label}, ${city.name} — Project Price Ranges`
  const description = `Typical property prices in ${area.label}, ${city.name}: price ranges for ${area.count} projects with buyer reviews and discussion on IndiaPropertyTalk.`
  const url = `${SITE_CONFIG.url}/${city.slug}/prices/${area.slug}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: 'website' } }
}

export default async function AreaPricesPage({ params }: Props) {
  const data = await load(params)
  if (!data) notFound()
  const { city, areas, area } = data

  const stats = Object.values(area.byType).sort((a, b) => b.n - a.n)
  const others = areas.filter((a) => a.slug !== area.slug).slice(0, 6)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
      { '@type': 'ListItem', position: 2, name: city.name, item: `${SITE_CONFIG.url}/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: 'Property prices by area', item: `${SITE_CONFIG.url}/${city.slug}/prices` },
      { '@type': 'ListItem', position: 4, name: area.label, item: `${SITE_CONFIG.url}/${city.slug}/prices/${area.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container-forum py-8">
        <Breadcrumbs
          items={[
            { label: city.name, href: `/${city.slug}` },
            { label: 'Property prices by area', href: `/${city.slug}/prices` },
            { label: area.label },
          ]}
        />

        <h1 className="mt-5 font-heading text-3xl font-bold text-navy-500">Property prices in {area.label}, {city.name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Price ranges for {area.topics.length} projects here
          {area.pincode && area.label !== `Pincode ${area.pincode}` ? ` (pincode ${area.pincode})` : ''}.
          {area.includes.length > 0 && ` This area also covers ${area.includes.join(', ')}.`}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => {
            const diff = percentVs(s.median, cityMedian(areas, s.type))
            return (
              <div key={s.type} className="card-base p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{typeLabel(s.type)}</p>
                <p className="mt-1 text-2xl font-bold text-navy-500">{formatINR(s.median)}</p>
                <p className="text-xs text-neutral-500">typical price · {s.n} project{s.n !== 1 ? 's' : ''}</p>
                <p className="mt-2 text-sm text-neutral-700">{formatINR(s.low)} – {formatINR(s.high)}</p>
                {diff !== null && (
                  <p className={`mt-1 text-xs font-medium ${diff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {diff > 0 ? '+' : ''}{diff}% vs {city.name} typical
                  </p>
                )}
                {s.n < 3 && <p className="mt-2 text-[11px] text-amber-700">Limited data: based on {s.n} projects.</p>}
              </div>
            )
          })}
        </div>

        <h2 className="mt-10 font-heading text-xl font-bold text-navy-500">Projects in {area.label}</h2>
        <div className="card-base mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price range</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {area.topics.map((t) => (
                <tr key={t.id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/${city.slug}/${t.slug}`} className="font-semibold text-navy-500 hover:text-saffron-600">{t.propertyName}</Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{typeLabel(t.propertyType)}</td>
                  <td className="px-4 py-3 text-neutral-800">
                    {formatINR(t.priceMin)}{t.priceMax ? ` – ${formatINR(t.priceMax)}` : '+'}
                    {t.outlier && <span className="ml-1.5 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500">not in average</span>}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {t.ratingCount > 0 ? `${t.avgRating.toFixed(1)} (${t.ratingCount})` : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {others.length > 0 && (
          <>
            <h2 className="mt-10 font-heading text-xl font-bold text-navy-500">Other areas in {city.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {others.map((a) => (
                <Link key={a.slug} href={`/${city.slug}/prices/${a.slug}`} className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-saffron-300">
                  {a.label}
                </Link>
              ))}
              <Link href={`/${city.slug}/prices`} className="rounded-full px-3 py-1.5 text-xs font-semibold text-saffron-600 hover:underline">
                All areas →
              </Link>
            </div>
          </>
        )}

        <div className="mt-10 rounded-xl bg-neutral-50 p-5 text-xs leading-relaxed text-neutral-500">
          Prices are developer-listed ranges for projects discussed on IndiaPropertyTalk, not market valuations or price per sq ft.
          They update automatically as projects are added. Verify current prices with the builder before you decide.
        </div>
      </div>
    </>
  )
}
