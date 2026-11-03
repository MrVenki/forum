import { prisma } from '@/lib/prisma'

const MIN_REPORTS = 3

const monthsBetween = (from: Date, to: Date) =>
  (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth())

function median(values: number[]): number {
  const v = [...values].sort((a, b) => a - b)
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

/** Promised vs actual possession, built from buyer-reported dates. Hidden until there are enough reports. */
export async function PossessionTracker({ developerSlug, developerName }: { developerSlug: string; developerName: string }) {
  const rows = await prisma.rating.findMany({
    where: {
      topic: { developerSlug, isPublished: true },
      promisedPossession: { not: null },
      actualPossession: { not: null },
    },
    select: { topicId: true, promisedPossession: true, actualPossession: true },
  })
  if (rows.length < MIN_REPORTS) return null

  const delays = rows.map((r) => monthsBetween(r.promisedPossession as Date, r.actualPossession as Date))
  const medianDelay = Math.round(median(delays))
  const onTime = Math.round((delays.filter((d) => d <= 3).length / delays.length) * 100)
  const projects = new Set(rows.map((r) => r.topicId)).size

  return (
    <div className="card-base p-6">
      <h2 className="font-heading font-bold text-lg text-navy-500">Possession: promised vs received</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-neutral-50 p-4">
          <div className="text-2xl font-semibold text-navy-500">{medianDelay <= 0 ? 'On time' : `${medianDelay} mo`}</div>
          <div className="text-xs text-neutral-500">{medianDelay <= 0 ? 'typical possession vs promise' : 'typical delay after promised month'}</div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-4">
          <div className="text-2xl font-semibold text-navy-500">{onTime}%</div>
          <div className="text-xs text-neutral-500">received within 3 months of promise</div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-4">
          <div className="text-2xl font-semibold text-navy-500">{rows.length}</div>
          <div className="text-xs text-neutral-500">buyer reports across {projects} project{projects !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
        Based on dates reported by {developerName} buyers on IndiaPropertyTalk, shown without names. Also check this builder&apos;s
        registered projects and complaints on your state RERA portal before you pay.
      </p>
    </div>
  )
}
