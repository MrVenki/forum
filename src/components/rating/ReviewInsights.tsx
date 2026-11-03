import { prisma } from '@/lib/prisma'
import { StarRating } from './StarRating'
import { formatRelativeTime } from '@/lib/utils/format'

const DIMENSIONS = [
  { key: 'constructionQuality', label: 'Construction quality' },
  { key: 'maintenanceScore', label: 'Maintenance and upkeep' },
  { key: 'amenitiesScore', label: 'Amenities' },
  { key: 'builderScore', label: 'Builder responsiveness' },
] as const

const OWNERSHIP_LABEL: Record<string, string> = {
  RESIDENT: 'Resident',
  BOOKED: 'Booked',
  EXPLORING: 'Visited site',
}

const monthsBetween = (from: Date, to: Date) =>
  (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth())

function median(values: number[]): number {
  const v = [...values].sort((a, b) => a - b)
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

export async function ReviewInsights({ topicId, propertyName }: { topicId: string; propertyName: string }) {
  const ratings = await prisma.rating.findMany({
    where: { topicId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, score: true, review: true, updatedAt: true, ownership: true,
      constructionQuality: true, maintenanceScore: true, amenitiesScore: true, builderScore: true,
      pros: true, cons: true, promisedPossession: true, actualPossession: true, maintenancePerSqFt: true,
      user: { select: { name: true, username: true } },
    },
  })
  if (ratings.length === 0) return null

  const dimStats = DIMENSIONS.map((d) => {
    const vals = ratings.map((r) => r[d.key]).filter((v): v is number => v != null)
    return { ...d, n: vals.length, avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0 }
  }).filter((d) => d.n > 0)

  const maintenance = ratings.map((r) => (r.maintenancePerSqFt ? Number(r.maintenancePerSqFt) : null)).filter((v): v is number => v != null)

  const possession = ratings
    .filter((r) => r.promisedPossession && r.actualPossession)
    .map((r) => monthsBetween(r.promisedPossession as Date, r.actualPossession as Date))

  const written = ratings.filter((r) => r.review || r.pros || r.cons).slice(0, 8)

  return (
    <div className="card-base p-6">
      <h2 className="font-heading font-bold text-lg text-navy-500">
        {propertyName} — Ratings &amp; Reviews
        <span className="ml-2 text-sm font-normal text-neutral-400">({ratings.length})</span>
      </h2>

      {(dimStats.length > 0 || maintenance.length >= 2 || possession.length >= 2) && (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {dimStats.length > 0 && (
            <div className="space-y-2">
              {dimStats.map((d) => (
                <div key={d.key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-neutral-600">{d.label}</span>
                  <span className="flex items-center gap-2">
                    <StarRating value={d.avg} readonly size="sm" showCount={false} />
                    <span className="w-14 text-right text-xs text-neutral-500">{d.avg.toFixed(1)} ({d.n})</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2 text-sm">
            {maintenance.length >= 2 && (
              <p className="text-neutral-700">
                <span className="font-semibold">Maintenance:</span> about ₹{median(maintenance).toFixed(1)} per sq ft per month
                <span className="text-xs text-neutral-500"> (reported by {maintenance.length} residents)</span>
              </p>
            )}
            {possession.length >= 2 && (
              <p className="text-neutral-700">
                <span className="font-semibold">Possession:</span>{' '}
                {(() => {
                  const m = Math.round(median(possession))
                  if (m <= 0) return 'reported on or before the promised month'
                  return `reported about ${m} month${m !== 1 ? 's' : ''} after the promised month`
                })()}
                <span className="text-xs text-neutral-500"> ({possession.length} reports)</span>
              </p>
            )}
          </div>
        </div>
      )}

      {written.length > 0 && (
        <ul className="mt-5 divide-y divide-neutral-100">
          {written.map((r) => (
            <li key={r.id} className="py-4 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-neutral-800">{r.user.username ? `@${r.user.username}` : r.user.name}</span>
                {r.ownership && OWNERSHIP_LABEL[r.ownership] && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {OWNERSHIP_LABEL[r.ownership]}
                  </span>
                )}
                <StarRating value={r.score} readonly size="sm" showCount={false} />
                <time className="text-xs text-neutral-400" dateTime={r.updatedAt.toISOString()}>{formatRelativeTime(r.updatedAt)}</time>
              </div>
              {r.review && <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{r.review}</p>}
              {(r.pros || r.cons) && (
                <div className="mt-2 space-y-1 text-sm">
                  {r.pros && <p className="text-emerald-700"><span className="font-semibold">Pro:</span> <span className="text-neutral-700">{r.pros}</span></p>}
                  {r.cons && <p className="text-red-700"><span className="font-semibold">Con:</span> <span className="text-neutral-700">{r.cons}</span></p>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
