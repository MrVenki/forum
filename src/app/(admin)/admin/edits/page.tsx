import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatINR } from '@/lib/utils/format'

export const revalidate = 0

const TYPE_LABEL: Record<string, string> = {
  TOPIC: 'Listing',
  RATING: 'Review',
  RATING_REPLY: 'Review reply',
  COMMENT: 'Comment',
  COMMUNITY_POST: 'Community post',
  COMMUNITY_REPLY: 'Community reply',
  QUESTION: 'Q&A question',
  ANSWER: 'Q&A answer',
  SITE_UPDATE: 'Site update',
}

const FIELD_LABEL: Record<string, string> = {
  propertyName: 'Project name', propertyType: 'Property type', cityId: 'City', priceMin: 'Price from', priceMax: 'Price up to',
  developerName: 'Builder', developerSlug: 'Builder page', constructionStatus: 'Construction status', expectedPossession: 'Expected possession',
  isPublished: 'Visible', image1Url: 'Photo 1', image2Url: 'Photo 2', promisedPossession: 'Promised possession', actualPossession: 'Actual possession',
  maintenancePerSqFt: 'Maintenance ₹/sq ft', isDeleted: 'Removed', body: 'Text', content: 'Text', review: 'Review', deleted: 'Deleted review',
}

const label = (f: string) => FIELD_LABEL[f] ?? f.charAt(0).toUpperCase() + f.slice(1)
const MONEY = new Set(['priceMin', 'priceMax'])
const shown = (field: string, v: string | null) => (v !== null && MONEY.has(field) && Number.isFinite(Number(v)) ? formatINR(Number(v)) : short(v))
const short = (v: string | null) => (v === null || v === '' ? '(empty)' : v.length > 400 ? `${v.slice(0, 400)}…` : v)

export default async function AdminEditsPage() {
  let rows: Awaited<ReturnType<typeof prisma.adminEditLog.findMany>> = []
  let error = ''
  try {
    rows = await prisma.adminEditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 300 })
  } catch {
    error = 'The edit log table is not there yet. It is created when the site restarts.'
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy-500">Edit log</h1>
        <p className="mt-1 text-sm text-neutral-500">Every change an admin or moderator made to members&apos; content, newest first, with the old and new value.</p>
        {error && <p className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
      {rows.length === 0 && !error && <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-400">No edits yet.</p>}
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-semibold uppercase">{TYPE_LABEL[r.targetType] ?? r.targetType}</span>
              {r.targetUrl ? (
                <Link href={r.targetUrl} target="_blank" className="font-semibold text-navy-500 hover:underline">{r.targetLabel}</Link>
              ) : (
                <span className="font-semibold text-neutral-800">{r.targetLabel}</span>
              )}
              <span className="ml-auto">{r.adminName} · {r.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-neutral-700">{label(r.field)}</p>
            <div className="mt-1 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-red-50/60 px-3 py-2">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-red-700">Before</span>
                <span className="whitespace-pre-line break-words text-neutral-700">{shown(r.field, r.oldValue)}</span>
              </div>
              <div className="rounded-lg bg-emerald-50/60 px-3 py-2">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-emerald-700">After</span>
                <span className="whitespace-pre-line break-words text-neutral-700">{shown(r.field, r.newValue)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
