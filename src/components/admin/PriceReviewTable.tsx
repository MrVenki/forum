'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatINR } from '@/lib/utils/format'

export interface PriceIssueRow {
  id: string
  name: string
  city: string
  url: string
  type: string
  priceMin: number
  priceMax: number | null
  typical: number | null
  reasons: string[]
  severity: number
}

const LAKH = 100_000
const toLakh = (rupees: number | null) => (rupees == null ? '' : String(Math.round((rupees / LAKH) * 100) / 100))

export function PriceReviewTable({ rows }: { rows: PriceIssueRow[] }) {
  if (rows.length === 0) {
    return <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">No unusual prices right now.</p>
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-500">
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Why flagged</th>
            <th className="px-4 py-3">Current</th>
            <th className="px-4 py-3">City typical</th>
            <th className="px-4 py-3">Fix (lakh)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => <Row key={r.id} row={r} />)}
        </tbody>
      </table>
    </div>
  )
}

function Row({ row }: { row: PriceIssueRow }) {
  const [min, setMin] = useState(toLakh(row.priceMin))
  const [max, setMax] = useState(toLakh(row.priceMax))
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const [current, setCurrent] = useState({ min: row.priceMin, max: row.priceMax })

  async function save() {
    const minRs = Number(min) * LAKH
    const maxRs = max.trim() === '' ? null : Number(max) * LAKH
    if (!Number.isFinite(minRs) || minRs <= 0 || (maxRs !== null && !Number.isFinite(maxRs))) {
      setState('error')
      setError('Enter numbers in lakhs')
      return
    }
    setState('saving')
    setError('')
    const res = await fetch(`/api/admin/topics/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceMin: minRs, priceMax: maxRs }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setCurrent({ min: Math.round(minRs), max: maxRs === null ? null : Math.round(maxRs) })
      setState('saved')
    } else {
      setState('error')
      setError(data.error || 'Save failed')
    }
  }

  return (
    <tr className="border-b border-neutral-50 align-top last:border-0">
      <td className="px-4 py-3">
        <Link href={row.url} target="_blank" className="font-semibold text-navy-500 hover:text-saffron-600">{row.name}</Link>
        <div className="text-xs text-neutral-500">{row.city} · {row.type.toLowerCase().replace('_', ' ')}</div>
      </td>
      <td className="px-4 py-3 text-xs text-amber-700">
        {row.reasons.map((reason) => <div key={reason}>{reason}</div>)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-neutral-800">
        {formatINR(current.min)}{current.max ? ` – ${formatINR(current.max)}` : '+'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-neutral-500">{row.typical ? formatINR(row.typical) : '–'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input aria-label="Minimum price in lakh" value={min} onChange={(e) => { setMin(e.target.value); setState('idle') }} inputMode="decimal" className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm" />
          <span className="text-neutral-400">–</span>
          <input aria-label="Maximum price in lakh" value={max} onChange={(e) => { setMax(e.target.value); setState('idle') }} inputMode="decimal" placeholder="none" className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm" />
          <button type="button" onClick={save} disabled={state === 'saving'} className="rounded-md bg-saffron-500 px-3 py-1 text-xs font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
            {state === 'saving' ? 'Saving…' : 'Save'}
          </button>
        </div>
        {state === 'saved' && <p className="mt-1 text-xs text-emerald-600">Saved</p>}
        {state === 'error' && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  )
}
