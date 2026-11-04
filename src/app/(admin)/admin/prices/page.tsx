import { prisma } from '@/lib/prisma'
import { PriceReviewTable, type PriceIssueRow } from '@/components/admin/PriceReviewTable'

export const revalidate = 0

const MIN_GROUP = 5 // need a few projects before "typical" means anything
const FAR = 4 // flag for review; the public price pages exclude at 6x
const EXCLUDED = 6
const WIDE = 8

function median(values: number[]): number {
  const v = [...values].sort((a, b) => a - b)
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

export default async function AdminPricesPage() {
  const topics = await prisma.topic.findMany({
    where: { isPublished: true, priceMin: { not: null } },
    select: {
      id: true, slug: true, propertyName: true, propertyType: true, priceMin: true, priceMax: true,
      city: { select: { name: true, slug: true } },
    },
  })

  const rows = topics.map((t) => {
    const min = Number(t.priceMin)
    const max = t.priceMax ? Number(t.priceMax) : null
    return { t, min, max, mid: max ? (min + max) / 2 : min, key: `${t.city.slug}|${t.propertyType}` }
  })

  const typical = new Map<string, number>()
  const groups = new Map<string, number[]>()
  for (const r of rows) groups.set(r.key, [...(groups.get(r.key) ?? []), r.mid])
  groups.forEach((mids, key) => {
    if (mids.length >= MIN_GROUP) typical.set(key, median(mids))
  })

  const issues: PriceIssueRow[] = []
  for (const r of rows) {
    const reasons: string[] = []
    let severity = 0
    const base = typical.get(r.key)
    if (base) {
      const ratio = r.mid / base
      if (ratio >= FAR || ratio <= 1 / FAR) {
        const x = ratio >= 1 ? ratio : 1 / ratio
        reasons.push(`${x.toFixed(1)}× ${ratio >= 1 ? 'above' : 'below'} typical for ${r.t.city.name}${x >= EXCLUDED ? ' (left out of area averages)' : ''}`)
        severity = Math.max(severity, x)
      }
    }
    if (r.max !== null && r.max < r.min) {
      reasons.push('Maximum is below minimum')
      severity = Math.max(severity, 10)
    }
    if (r.max !== null && r.max / r.min >= WIDE) {
      reasons.push(`Very wide range (${(r.max / r.min).toFixed(0)}×)`)
      severity = Math.max(severity, r.max / r.min / 2)
    }
    if (reasons.length) {
      issues.push({
        id: r.t.id,
        name: r.t.propertyName,
        city: r.t.city.name,
        url: `/${r.t.city.slug}/${r.t.slug}`,
        type: r.t.propertyType,
        priceMin: r.min,
        priceMax: r.max,
        typical: base ?? null,
        reasons,
        severity,
      })
    }
  }
  issues.sort((a, b) => b.severity - a.severity)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy-500">Price review</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {issues.length} of {topics.length} priced projects look unusual. These skew the public area price pages, so fix the
        ones that are typos. Prices are entered in lakhs (100 lakh = ₹1 crore).
      </p>
      <div className="mt-6">
        <PriceReviewTable rows={issues} />
      </div>
    </div>
  )
}
