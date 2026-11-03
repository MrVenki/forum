import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants/config'
import { formatINR } from '@/lib/utils/format'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getComparison, type CompareProject } from '@/lib/compare'
import { percentVs, typeLabel } from '@/lib/areaPrices'

export const revalidate = 3600

interface Props {
  params: { citySlug: string; pair: string }
}

const STATUS_LABEL: Record<string, string> = {
  ON_TRACK: 'On track',
  DELAYED: 'Delayed',
  STALLED: 'Stalled',
  POSSESSION_DONE: 'Possession given',
}

const shorten = (s: string, n: number) => {
  if (s.length <= n) return s
  const cut = s.slice(0, n)
  const space = cut.lastIndexOf(' ')
  return (space > 8 ? cut.slice(0, space) : cut).trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getComparison(params.citySlug, params.pair)
  if (!data) return {}
  const { city, a, b, canonical } = data
  const title = `${shorten(a.name, 20)} vs ${shorten(b.name, 20)} (${new Date().getFullYear()})`
  const bits = [a, b].map((p) => `${p.name}${p.ratingCount ? ` ${p.avgRating.toFixed(1)}/5` : ''}`)
  const description = `${bits[0]} vs ${bits[1]} in ${city.name}: price, ratings, buyer reviews, maintenance and possession compared side by side on IndiaPropertyTalk.`
  const url = `${SITE_CONFIG.url}/${city.slug}/compare/${canonical}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: 'article' } }
}

function priceText(p: CompareProject) {
  if (p.priceMin == null) return '–'
  return p.priceMax && p.priceMax !== p.priceMin ? `${formatINR(p.priceMin)} – ${formatINR(p.priceMax)}` : `from ${formatINR(p.priceMin)}`
}

export default async function ComparePage({ params }: Props) {
  const data = await getComparison(params.citySlug, params.pair)
  if (!data) notFound()
  const { city, a, b, canonical } = data
  if (canonical !== params.pair) permanentRedirect(`/${city.slug}/compare/${canonical}`)

  const num = (v: number | null, digits = 1) => (v == null ? '–' : v.toFixed(digits))
  const better = (x: number | null, y: number | null, mine: 'a' | 'b') =>
    x != null && y != null && x !== y && (mine === 'a' ? x > y : y > x)

  const rows: { label: string; cells: [string, string]; win?: 'a' | 'b' | null }[] = [
    { label: 'Price range', cells: [priceText(a), priceText(b)] },
    { label: 'Type', cells: [typeLabel(a.type), typeLabel(b.type)] },
    { label: 'Builder', cells: [a.developerName ?? '–', b.developerName ?? '–'] },
    { label: 'Location', cells: [a.address ?? '–', b.address ?? '–'] },
    { label: 'Construction status', cells: [a.status ? STATUS_LABEL[a.status] ?? a.status : '–', b.status ? STATUS_LABEL[b.status] ?? b.status : '–'] },
    {
      label: 'Overall rating',
      cells: [a.ratingCount ? `${num(a.avgRating)} (${a.ratingCount})` : '–', b.ratingCount ? `${num(b.avgRating)} (${b.ratingCount})` : '–'],
      win: better(a.ratingCount ? a.avgRating : null, b.ratingCount ? b.avgRating : null, 'a') ? 'a' : better(a.ratingCount ? a.avgRating : null, b.ratingCount ? b.avgRating : null, 'b') ? 'b' : null,
    },
    { label: 'Buyer comments', cells: [String(a.commentCount), String(b.commentCount)] },
    ...([
      ['Construction quality', 'constructionQuality'],
      ['Maintenance and upkeep', 'maintenanceScore'],
      ['Amenities', 'amenitiesScore'],
      ['Builder responsiveness', 'builderScore'],
    ] as const).map(([label, key]) => ({
      label,
      cells: [num(a.dims[key]), num(b.dims[key])] as [string, string],
      win: better(a.dims[key], b.dims[key], 'a') ? ('a' as const) : better(a.dims[key], b.dims[key], 'b') ? ('b' as const) : null,
    })),
    {
      label: 'Maintenance (₹ per sq ft / month)',
      cells: [a.maintenancePerSqFt ? num(a.maintenancePerSqFt) : '–', b.maintenancePerSqFt ? num(b.maintenancePerSqFt) : '–'],
    },
    ...(a.areaTypical && b.areaTypical
      ? [
          {
            label: 'Price vs typical for its area',
            cells: [a, b].map((p) => {
              const mid = p.priceMin == null ? null : p.priceMax ? (p.priceMin + p.priceMax) / 2 : p.priceMin
              const diff = mid && p.areaTypical ? percentVs(mid, p.areaTypical) : null
              return diff == null ? '–' : `${diff > 0 ? '+' : ''}${diff}% (${p.areaLabel})`
            }) as [string, string],
          },
        ]
      : []),
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
      { '@type': 'ListItem', position: 2, name: city.name, item: `${SITE_CONFIG.url}/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${a.name} vs ${b.name}`, item: `${SITE_CONFIG.url}/${city.slug}/compare/${canonical}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container-forum py-8">
        <Breadcrumbs items={[{ label: city.name, href: `/${city.slug}` }, { label: `${a.name} vs ${b.name}` }]} />

        <h1 className="mt-5 font-heading text-2xl sm:text-3xl font-bold text-navy-500">
          {a.name} vs {b.name}: reviews, price and ratings compared
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Side-by-side comparison of two projects in {city.name}, using prices listed and reviews posted by buyers on IndiaPropertyTalk.
        </p>

        <div className="card-base mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left">
                <th className="w-1/4 px-4 py-3" />
                {[a, b].map((p) => (
                  <th key={p.id} className="px-4 py-3">
                    <Link href={`/${city.slug}/${p.slug}`} className="font-heading text-base font-bold text-navy-500 hover:text-saffron-600">{p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{r.label}</td>
                  {r.cells.map((c, i) => (
                    <td key={i} className={`px-4 py-3 ${r.win === (i === 0 ? 'a' : 'b') ? 'font-semibold text-emerald-700' : 'text-neutral-800'}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {[a, b].some((p) => p.pros.length || p.cons.length) && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[a, b].map((p) => (
              <div key={p.id} className="card-base p-5">
                <h2 className="font-heading font-bold text-navy-500">What buyers say about {p.name}</h2>
                {p.pros.length === 0 && p.cons.length === 0 && <p className="mt-2 text-sm text-neutral-400">No pros and cons shared yet.</p>}
                <ul className="mt-3 space-y-1.5 text-sm">
                  {p.pros.map((t, i) => <li key={`p${i}`} className="text-neutral-700"><span className="font-semibold text-emerald-700">Pro:</span> {t}</li>)}
                  {p.cons.map((t, i) => <li key={`c${i}`} className="text-neutral-700"><span className="font-semibold text-red-700">Con:</span> {t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {[a, b].map((p) => (
            <Link key={p.id} href={`/${city.slug}/${p.slug}`} className="btn-primary text-sm">Read all reviews of {p.name}</Link>
          ))}
        </div>

        <p className="mt-8 rounded-xl bg-neutral-50 p-5 text-xs leading-relaxed text-neutral-500">
          Figures come from developer-listed prices and community ratings, so small numbers of reviews can swing the averages.
          Highlighted values show the higher score only, not a recommendation. Verify details with the builder and on your state RERA portal before you decide.
        </p>
      </div>
    </>
  )
}
