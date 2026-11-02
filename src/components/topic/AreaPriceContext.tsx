import Link from 'next/link'
import { formatINR } from '@/lib/utils/format'
import { getCityAreas, percentVs, typeLabel } from '@/lib/areaPrices'

interface Props {
  citySlug: string
  cityName: string
  topicId: string
  propertyType: string
  priceMin: number | null
  priceMax: number | null
}

export async function AreaPriceContext({ citySlug, cityName, topicId, propertyType, priceMin, priceMax }: Props) {
  if (!priceMin) return null
  const data = await getCityAreas(citySlug)
  const area = data?.areas.find((a) => a.topics.some((t) => t.id === topicId))
  const stat = area?.byType[propertyType]
  if (!area || !stat || stat.n < 2) return null

  const mine = priceMax ? (priceMin + priceMax) / 2 : priceMin
  const diff = percentVs(mine, stat.median)

  return (
    <div className="card-base p-6">
      <h2 className="font-heading font-bold text-lg text-navy-500">Price vs {area.label}</h2>
      <p className="mt-2 text-sm text-neutral-700">
        The typical {typeLabel(propertyType).toLowerCase()} price in {area.label}, {cityName} is{' '}
        <span className="font-semibold">{formatINR(stat.median)}</span> across {stat.n} projects
        ({formatINR(stat.low)} – {formatINR(stat.high)}).
        {diff !== null && Math.abs(diff) >= 3 && (
          <>
            {' '}This project sits{' '}
            <span className={`font-semibold ${diff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {Math.abs(diff)}% {diff > 0 ? 'above' : 'below'}
            </span>{' '}
            that typical price.
          </>
        )}
        {diff !== null && Math.abs(diff) < 3 && ' This project is in line with that typical price.'}
      </p>
      <Link href={`/${citySlug}/prices/${area.slug}`} className="mt-3 inline-block text-sm font-semibold text-saffron-600 hover:underline">
        See all prices in {area.label} →
      </Link>
      <p className="mt-2 text-[11px] text-neutral-400">Based on developer-listed price ranges on IndiaPropertyTalk, not a valuation.</p>
    </div>
  )
}
