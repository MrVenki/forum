'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { CalendarCheck, CheckCircle2, Compass, HelpCircle, Home, MessageCircleMore, ShoppingCart, X, type LucideIcon } from 'lucide-react'

export type BuyIntent = 'YES' | 'MAYBE' | 'NO'
export type Audience = 'CONSIDERING' | 'BOOKED' | 'RESIDENT' | 'EXPLORING'

const AUDIENCES: { value: Audience; label: string; Icon: LucideIcon }[] = [
  { value: 'CONSIDERING', label: 'Considering buying', Icon: ShoppingCart },
  { value: 'BOOKED', label: 'Already booked', Icon: CalendarCheck },
  { value: 'RESIDENT', label: 'Resident', Icon: Home },
  { value: 'EXPLORING', label: 'Just exploring', Icon: Compass },
]

const INTENTS: { value: BuyIntent; label: string; bar: string; Icon: LucideIcon }[] = [
  { value: 'YES', label: 'Yes', bar: 'bg-emerald-500', Icon: CheckCircle2 },
  { value: 'MAYBE', label: 'Maybe', bar: 'bg-amber-400', Icon: HelpCircle },
  { value: 'NO', label: 'No', bar: 'bg-red-400', Icon: X },
]

const MIN_VOTES_FOR_PERCENT = 5
const AUDIENCE_KEY = 'ipt-audience'

interface Results {
  counts: Record<BuyIntent, number>
  total: number
}

interface Props {
  topicId: string
  propertyName: string
  onChange: (state: { intent: BuyIntent | null; audience: Audience | null }) => void
}

export function BuyIntentStrip({ topicId, propertyName, onChange }: Props) {
  const [audience, setAudience] = useState<Audience | null>(null)
  const [intent, setIntent] = useState<BuyIntent | null>(null)
  const [results, setResults] = useState<Results>({ counts: { YES: 0, MAYBE: 0, NO: 0 }, total: 0 })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let stored: Audience | null = null
    try {
      stored = (localStorage.getItem(AUDIENCE_KEY) as Audience | null) ?? null
    } catch {}
    if (stored && AUDIENCES.some((a) => a.value === stored)) setAudience(stored)

    fetch(`/api/topics/${topicId}/buy-intent`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        setResults({ counts: d.counts, total: d.total })
        if (d.mine) {
          setIntent(d.mine.intent)
          if (d.mine.audience) setAudience(d.mine.audience)
        }
      })
      .catch(() => {})
  }, [topicId])

  useEffect(() => {
    onChange({ intent, audience })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent, audience])

  function pickAudience(value: Audience) {
    const next = audience === value ? null : value
    setAudience(next)
    try {
      if (next) localStorage.setItem(AUDIENCE_KEY, next)
      else localStorage.removeItem(AUDIENCE_KEY)
    } catch {}
  }

  async function vote(value: BuyIntent) {
    if (busy) return
    setBusy(true)
    setError('')
    const res = await fetch(`/api/topics/${topicId}/buy-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent: value, audience }),
    })
    if (res.ok) {
      setIntent(value)
      const fresh = await fetch(`/api/topics/${topicId}/buy-intent`).then((r) => r.json()).catch(() => null)
      if (fresh) setResults({ counts: fresh.counts, total: fresh.total })
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'Could not record your vote. Try again.')
    }
    setBusy(false)
  }

  const showPercent = results.total >= MIN_VOTES_FOR_PERCENT
  const pct = (n: number) => (results.total ? Math.round((n / results.total) * 100) : 0)

  return (
    <div className="mb-5">
      <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4">
        <MessageCircleMore className="h-8 w-8 shrink-0 fill-navy-500 text-white" aria-hidden="true" />
        <div>
          <p className="font-heading text-base font-bold leading-snug text-navy-500">What do you think of {propertyName}?</p>
          <p className="mt-0.5 text-sm text-navy-400">Share your experience, opinion or ask a question</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-navy-500">I am a…</p>
      <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
        {AUDIENCES.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => pickAudience(value)}
            aria-pressed={audience === value}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium transition-colors sm:px-3.5 sm:text-sm',
              audience === value
                ? 'border-navy-500 bg-navy-500 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-navy-300'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-navy-500">Would you buy here?</p>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:flex">
        {INTENTS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            disabled={busy}
            onClick={() => vote(value)}
            aria-pressed={intent === value}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 sm:min-w-[96px]',
              intent === value
                ? 'border-navy-300 bg-navy-50 text-navy-600'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-navy-300'
            )}
          >
            <Icon
              className={cn('h-4 w-4', intent === value && value === 'YES' ? 'fill-navy-500 text-white' : '')}
              aria-hidden="true"
            />
            {label}
          </button>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {intent && (
        <div className="mt-3">
          {showPercent ? (
            <>
              <p className="text-xs text-neutral-600">
                {INTENTS.map((i) => `${pct(results.counts[i.value])}% ${i.label.toLowerCase()}`).join(' · ')} ({results.total} votes)
              </p>
              <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-neutral-200">
                {INTENTS.map((i) => (
                  <div key={i.value} className={i.bar} style={{ width: `${pct(results.counts[i.value])}%` }} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-neutral-500">Thanks. Results show once {MIN_VOTES_FOR_PERCENT} people have voted.</p>
          )}
        </div>
      )}
    </div>
  )
}
