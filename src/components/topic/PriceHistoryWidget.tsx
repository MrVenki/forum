'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { TrendingUp, Plus, X, Info } from 'lucide-react'
import { FlairBadge } from './FlairBadge'

interface PriceLogEntry {
  id: string
  pricePerSqFt: string
  configuration: string | null
  source: string | null
  loggedAt: string
  createdAt: string
  user: { id: string; name: string; flairTag: string | null }
}

interface Props {
  topicId: string
  priceMin?: number | null
  priceMax?: number | null
}

const CONFIGS = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+', 'Villa', 'Plot', 'Studio', 'Penthouse', 'Other']
const SOURCES = ['Builder website', 'Site visit', 'Broker quote', 'Newspaper ad', 'Online listing', 'Resale deal']

function formatINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function PriceHistoryWidget({ topicId, priceMin, priceMax }: Props) {
  const { data: session } = useSession()
  const [logs, setLogs] = useState<PriceLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // form state
  const [pricePerSqFt, setPricePerSqFt] = useState('')
  const [config, setConfig] = useState('')
  const [source, setSource] = useState('')
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetch_ = useCallback(async () => {
    const res = await fetch(`/api/topics/${topicId}/price-history`)
    if (res.ok) setLogs(await res.json())
    setLoading(false)
  }, [topicId])

  useEffect(() => { fetch_() }, [fetch_])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const price = Number(pricePerSqFt)
    if (!price || price < 100) { setError('Enter a valid price per sq ft'); return }
    setSubmitting(true); setError('')
    const res = await fetch(`/api/topics/${topicId}/price-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pricePerSqFt: price,
        configuration: config || null,
        source: source || null,
        loggedAt: new Date(loggedAt).toISOString(),
      }),
    })
    if (res.ok) {
      setPricePerSqFt(''); setConfig(''); setSource('')
      setLoggedAt(new Date().toISOString().split('T')[0])
      setShowForm(false)
      fetch_()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to save')
    }
    setSubmitting(false)
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  // Simple SVG sparkline
  const Sparkline = () => {
    if (logs.length < 2) return null
    const prices = logs.map(l => Number(l.pricePerSqFt))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min || 1
    const W = 280, H = 60, PAD = 4
    const pts = prices.map((p, i) => {
      const x = PAD + (i / (prices.length - 1)) * (W - PAD * 2)
      const y = H - PAD - ((p - min) / range) * (H - PAD * 2)
      return `${x},${y}`
    })
    const pct = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
    const isUp = pct >= 0

    return (
      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-neutral-600">Price Trend (₹/sq ft)</p>
          <span className={`text-xs font-bold ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}% since first entry
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? '#ef4444' : '#10b981'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={isUp ? '#ef4444' : '#10b981'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={isUp ? '#ef4444' : '#10b981'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Area fill */}
          <polygon
            points={`${pts[0].split(',')[0]},${H} ${pts.join(' ')} ${pts[pts.length - 1].split(',')[0]},${H}`}
            fill="url(#pg)"
          />
          {/* Data points */}
          {pts.map((pt, i) => {
            const [x, y] = pt.split(',')
            return <circle key={i} cx={x} cy={y} r="3" fill={isUp ? '#ef4444' : '#10b981'} />
          })}
        </svg>
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
          <span>{fmt(logs[0].loggedAt)}</span>
          <span>{fmt(logs[logs.length - 1].loggedAt)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-saffron-500" />
          <span className="font-semibold text-navy-500">
            Price History
            {logs.length > 0 && <span className="ml-1.5 text-sm font-normal text-neutral-400">({logs.length} entries)</span>}
          </span>
        </div>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Log Price
          </button>
        )}
      </div>

      {/* Current price context from topic */}
      {(priceMin || priceMax) && logs.length === 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Listed price: {priceMin ? formatINR(Number(priceMin)) : ''}
            {priceMin && priceMax ? ' – ' : ''}{priceMax ? formatINR(Number(priceMax)) : ''}.
            Help the community by logging the actual price per sq ft.
          </span>
        </div>
      )}

      {/* Log form */}
      {showForm && session && (
        <form onSubmit={handleSubmit} className="card-base p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-navy-500">Log a Price Entry</p>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Price per sq ft (₹) *</label>
              <input
                type="number" value={pricePerSqFt} onChange={e => setPricePerSqFt(e.target.value)}
                placeholder="e.g. 6500" min={100} max={1000000} required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Date *</label>
              <input
                type="date" value={loggedAt} onChange={e => setLoggedAt(e.target.value)}
                max={new Date().toISOString().split('T')[0]} required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Configuration</label>
              <select value={config} onChange={e => setConfig(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400">
                <option value="">Any</option>
                {CONFIGS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Source</label>
              <select value={source} onChange={e => setSource(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400">
                <option value="">Unknown</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={submitting}
              className="rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
              {submitting ? 'Saving…' : 'Save Entry'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sparkline chart */}
      {logs.length >= 2 && <Sparkline />}

      {/* Log table */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2].map(i => <div key={i} className="h-10 rounded-lg bg-neutral-100" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center">
          <TrendingUp className="h-7 w-7 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">No price entries yet.</p>
          {session ? (
            <p className="text-xs text-neutral-400 mt-1">Know the going rate? Log it to help future buyers.</p>
          ) : (
            <p className="text-xs text-neutral-400 mt-1"><a href="/login" className="underline hover:text-saffron-600">Sign in</a> to log a price entry.</p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500">Date</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-neutral-500">₹/sq ft</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500 hidden sm:table-cell">Config</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500 hidden sm:table-cell">Source</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-500 hidden md:table-cell">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[...logs].reverse().map((log, i) => {
                const price = Number(log.pricePerSqFt)
                const prev  = i < logs.length - 1 ? Number(logs[logs.length - 2 - i]?.pricePerSqFt) : null
                const delta = prev ? ((price - prev) / prev) * 100 : null
                return (
                  <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-2 text-xs text-neutral-500">{fmt(log.loggedAt)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-neutral-800">
                      ₹{price.toLocaleString('en-IN')}
                      {delta !== null && (
                        <span className={`ml-1.5 text-[10px] font-normal ${delta > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {delta > 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-500 hidden sm:table-cell">{log.configuration || '—'}</td>
                    <td className="px-3 py-2 text-xs text-neutral-500 hidden sm:table-cell">{log.source || '—'}</td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-neutral-500">{log.user.name}</span>
                        {log.user.flairTag && <FlairBadge flair={log.user.flairTag} />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
