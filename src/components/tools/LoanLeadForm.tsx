'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'

interface Props {
  source: string
  loanAmount?: number
  monthlyIncome?: number
}

export function LoanLeadForm({ source, loanAmount, monthlyIncome }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setState('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, city: city || undefined, source, consent,
          loanAmount: loanAmount ? Math.round(loanAmount) : undefined,
          monthlyIncome: monthlyIncome ? Math.round(monthlyIncome) : undefined,
          turnstileToken: token, website: honeypot,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex gap-2 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        Thanks! A loan partner will contact you shortly on the number you shared.
      </div>
    )
  }

  const input = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm'
  return (
    <form onSubmit={submit} className="rounded-xl border border-saffron-200 bg-saffron-50/50 p-4 space-y-3">
      <div>
        <p className="font-semibold text-sm text-navy-500">Get the best home loan offers</p>
        <p className="text-xs text-neutral-500">Compare rates from partner banks. Free, no obligation.</p>
      </div>
      <input className={input} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required minLength={2} />
      <input className={input} placeholder="Mobile number" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
      <input className={input} placeholder="City (optional)" value={city} onChange={e => setCity(e.target.value)} />
      <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden value={honeypot} onChange={e => setHoneypot(e.target.value)} name="website" />
      <label className="flex items-start gap-2 text-[11px] text-neutral-600">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-saffron-500" required />
        <span>
          I agree to be contacted by IndiaPropertyTalk&apos;s loan partners by call/WhatsApp about home loan offers, and to the{' '}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        </span>
      </label>
      <TurnstileWidget onSuccess={setToken} onExpire={() => setToken(null)} />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit" disabled={state === 'sending' || !consent}
        className="w-full rounded-lg bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2"
      >
        {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        Check offers
      </button>
    </form>
  )
}
