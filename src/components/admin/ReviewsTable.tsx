'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Pencil, Search, Star, Trash2, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export interface ReviewRow {
  id: string
  score: number
  review: string | null
  pros: string | null
  cons: string | null
  ownership: string | null
  promisedPossession: string | null
  actualPossession: string | null
  maintenancePerSqFt: number | null
  createdAt: string
  author: string
  isSeeded: boolean
  project: string
  city: string
  url: string
  replies: { id: string; content: string; isDeleted: boolean; author: string }[]
}

const OWNERSHIP = [
  { value: '', label: 'Not given' },
  { value: 'RESIDENT', label: 'Resident' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'EXPLORING', label: 'Visited site' },
  { value: 'CONSIDERING', label: 'Considering' },
]

const input = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-saffron-400'
const labelCls = 'block text-sm font-semibold text-neutral-700 mb-1'

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-label={`${n} stars`}>
      {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < n ? 'fill-gold' : 'text-neutral-300'}`} />)}
    </span>
  )
}

export function ReviewsTable({ initialRows, initialEditId }: { initialRows: ReviewRow[]; initialEditId?: string }) {
  const [rows, setRows] = useState(initialRows)
  const [editing, setEditing] = useState<ReviewRow | null>(null)
  // Open the form from an Edit link only after hydration, so nothing typed early is lost
  useEffect(() => {
    const row = initialRows.find((r) => r.id === initialEditId)
    if (row) setEditing(row)
  }, [initialRows, initialEditId])
  const [query, setQuery] = useState('')
  const [realOnly, setRealOnly] = useState(false)

  const q = query.trim().toLowerCase()
  const shown = rows.filter((r) =>
    (!realOnly || !r.isSeeded) &&
    (!q || [r.project, r.city, r.author, r.review ?? '', r.pros ?? '', r.cons ?? ''].some((s) => s.toLowerCase().includes(q))),
  )

  async function remove(r: ReviewRow) {
    if (!window.confirm(`Delete ${r.author}'s ${r.score}-star review of ${r.project}? This cannot be undone. The text is kept in the Edit log.`)) return
    const res = await fetch(`/api/admin/ratings/${r.id}`, { method: 'DELETE' })
    if (!res.ok) return toast({ title: 'Could not delete', variant: 'destructive' })
    toast({ title: 'Review deleted' })
    setRows((list) => list.filter((x) => x.id !== r.id))
    setEditing(null)
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project, member or words" className={`${input} pl-8`} />
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" className="h-4 w-4 accent-saffron-500" checked={realOnly} onChange={(e) => setRealOnly(e.target.checked)} />
          Real members only (hide demo accounts)
        </label>
        <span className="ml-auto text-sm text-neutral-400">{shown.length} shown</span>
      </div>

      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">{r.project}</span>
              <span>{r.city}</span>
              <Stars n={r.score} />
              <span>{r.author}</span>
              {r.isSeeded && <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-semibold uppercase">Demo</span>}
              <span>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
              {r.replies.length > 0 && <span>{r.replies.length} repl{r.replies.length === 1 ? 'y' : 'ies'}</span>}
              <span className="ml-auto flex items-center gap-1">
                <Link href={r.url} target="_blank" className="rounded-lg p-1.5 text-neutral-400 hover:bg-saffron-50 hover:text-saffron-500" title="View on site"><ExternalLink className="h-4 w-4" /></Link>
                <button onClick={() => setEditing(r)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-navy-50 hover:text-navy-500" title="Edit review"><Pencil className="h-4 w-4" /></button>
              </span>
            </div>
            {r.review ? <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-sm text-neutral-700">{r.review}</p> : <p className="mt-1.5 text-sm italic text-neutral-400">Stars only, no written review</p>}
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-400">No reviews found</p>}

      {editing && (
        <ReviewEditModal
          row={editing}
          onClose={() => setEditing(null)}
          onDelete={() => remove(editing)}
          onSaved={(r) => {
            setRows((list) => list.map((x) => (x.id === r.id ? r : x)))
            setEditing(null)
          }}
        />
      )}
    </>
  )
}

function ReviewEditModal({ row, onClose, onSaved, onDelete }: { row: ReviewRow; onClose: () => void; onSaved: (r: ReviewRow) => void; onDelete: () => void }) {
  const [f, setF] = useState({
    review: row.review ?? '',
    pros: row.pros ?? '',
    cons: row.cons ?? '',
    ownership: row.ownership ?? '',
    promisedPossession: row.promisedPossession ?? '',
    actualPossession: row.actualPossession ?? '',
    maintenancePerSqFt: row.maintenancePerSqFt === null ? '' : String(row.maintenancePerSqFt),
  })
  const [replies, setReplies] = useState(row.replies)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = <K extends keyof typeof f>(k: K, v: string) => setF((p) => ({ ...p, [k]: v }))

  async function save() {
    const body: Record<string, unknown> = {}
    if (f.review.trim() !== (row.review ?? '')) body.review = f.review
    if (f.pros.trim() !== (row.pros ?? '')) body.pros = f.pros
    if (f.cons.trim() !== (row.cons ?? '')) body.cons = f.cons
    if (f.ownership !== (row.ownership ?? '')) body.ownership = f.ownership || null
    if (f.promisedPossession !== (row.promisedPossession ?? '')) body.promisedPossession = f.promisedPossession || null
    if (f.actualPossession !== (row.actualPossession ?? '')) body.actualPossession = f.actualPossession || null
    if (f.maintenancePerSqFt !== (row.maintenancePerSqFt === null ? '' : String(row.maintenancePerSqFt))) body.maintenancePerSqFt = f.maintenancePerSqFt || null

    const replyChanges = replies.filter((r) => {
      const orig = row.replies.find((o) => o.id === r.id)
      return orig && (orig.content !== r.content.trim() || orig.isDeleted !== r.isDeleted)
    })
    if (Object.keys(body).length === 0 && replyChanges.length === 0) return onClose()

    setSaving(true)
    setError('')
    try {
      if (Object.keys(body).length > 0) {
        const res = await fetch(`/api/admin/ratings/${row.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return setError(data.error || 'Could not save the review')
      }
      for (const r of replyChanges) {
        const orig = row.replies.find((o) => o.id === r.id)!
        const payload: Record<string, unknown> = {}
        if (orig.content !== r.content.trim()) payload.content = r.content
        if (orig.isDeleted !== r.isDeleted) payload.isDeleted = r.isDeleted
        const res = await fetch(`/api/admin/rating-replies/${r.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return setError(data.error || 'Could not save a reply')
      }
      toast({ title: 'Saved' })
      onSaved({
        ...row,
        review: f.review.trim() || null,
        pros: f.pros.trim() || null,
        cons: f.cons.trim() || null,
        ownership: f.ownership || null,
        promisedPossession: f.promisedPossession || null,
        actualPossession: f.actualPossession || null,
        maintenancePerSqFt: f.maintenancePerSqFt ? Number(f.maintenancePerSqFt) : null,
        replies: replies.map((r) => ({ ...r, content: r.content.trim() })),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 sm:items-center sm:p-4">
      <div className="flex max-h-full w-full max-w-2xl flex-col bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-neutral-200 p-4 sm:p-6">
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-navy-500">Edit review</h2>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              {row.author} on {row.project}, {row.city} <Stars n={row.score} />
            </p>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-lg p-2 hover:bg-neutral-100" aria-label="Close"><X className="h-5 w-5 text-neutral-500" /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">The {row.score}-star score is the member&apos;s opinion and can&apos;t be changed here. If you reword the review, the site shows &quot;Edited by a moderator&quot; under it.</p>
          <div>
            <label className={labelCls}>Review</label>
            <textarea rows={6} className={`${input} resize-y`} value={f.review} onChange={(e) => set('review', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Pros</label>
              <textarea rows={2} className={`${input} resize-y`} value={f.pros} onChange={(e) => set('pros', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Cons</label>
              <textarea rows={2} className={`${input} resize-y`} value={f.cons} onChange={(e) => set('cons', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Reviewer is</label>
              <select className={input} value={f.ownership} onChange={(e) => set('ownership', e.target.value)}>
                {OWNERSHIP.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Maintenance (₹ per sq ft / month)</label>
              <input className={input} inputMode="decimal" value={f.maintenancePerSqFt} onChange={(e) => set('maintenancePerSqFt', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Promised possession</label>
              <input type="month" className={input} value={f.promisedPossession} onChange={(e) => set('promisedPossession', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Actual possession</label>
              <input type="month" className={input} value={f.actualPossession} onChange={(e) => set('actualPossession', e.target.value)} />
            </div>
          </div>

          {replies.length > 0 && (
            <div>
              <p className={labelCls}>Replies to this review</p>
              <ul className="space-y-3">
                {replies.map((r, i) => (
                  <li key={r.id} className={`rounded-lg border p-3 ${r.isDeleted ? 'border-red-200 bg-red-50/40' : 'border-neutral-200'}`}>
                    <div className="mb-1 flex items-center justify-between text-xs text-neutral-500">
                      <span>{r.author}{r.isDeleted && ' · removed'}</span>
                      <button
                        type="button"
                        onClick={() => setReplies((list) => list.map((x, j) => (j === i ? { ...x, isDeleted: !x.isDeleted } : x)))}
                        className={r.isDeleted ? 'font-semibold text-navy-500' : 'font-semibold text-red-600'}
                      >
                        {r.isDeleted ? 'Restore' : 'Remove'}
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      className={`${input} resize-y`}
                      value={r.content}
                      disabled={r.isDeleted}
                      onChange={(e) => setReplies((list) => list.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)))}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 p-4 sm:rounded-b-2xl sm:p-6">
          <button onClick={onDelete} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" /> Delete review
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Cancel</button>
            <button onClick={save} disabled={saving} className="rounded-lg bg-saffron-500 px-5 py-2 text-sm font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
