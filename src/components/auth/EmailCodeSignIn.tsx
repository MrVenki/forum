'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { Mail } from 'lucide-react'

export function EmailCodeSignIn({ callbackUrl = '/' }: { callbackUrl?: string }) {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [needsName, setNeedsName] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [cfToken, setCfToken] = useState('')
  // A Turnstile token works once; remounting the widget fetches a fresh one
  const [widgetKey, setWidgetKey] = useState(0)

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await fetch('/api/auth/quick-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: needsName ? name : undefined, cfToken }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) {
      setStep('code')
      return
    }
    if (data.needsName) setNeedsName(true)
    else {
      setCfToken('')
      setWidgetKey((k) => k + 1)
    }
    setError(data.error || 'Could not send the code.')
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Enter the 6-digit code.')
      return
    }
    setError('')
    setBusy(true)
    const res = await signIn('email-otp', { email: email.trim().toLowerCase(), code, redirect: false })
    setBusy(false)
    if (!res || res.error) {
      setError(res?.error && res.error !== 'CredentialsSignin' ? res.error : 'That code did not work. Request a new one.')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  if (step === 'code') {
    return (
      <form onSubmit={verify} className="space-y-4">
        <p className="text-sm text-neutral-600">Enter the 6-digit code we sent to <span className="font-semibold">{email}</span>.</p>
        <div className="space-y-1.5">
          <Label htmlFor="otp-code">Sign-in code</Label>
          <Input
            id="otp-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            className="tracking-widest"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
        <button
          type="button"
          onClick={() => { setStep('email'); setCode(''); setError(''); setCfToken(''); setWidgetKey((k) => k + 1) }}
          className="w-full text-center text-xs text-neutral-500 hover:underline"
        >
          Use a different email or resend the code
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={sendCode} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="otp-email">Email address</Label>
        <Input
          id="otp-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setNeedsName(false); setError('') }}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>
      {needsName && (
        <div className="space-y-1.5">
          <Label htmlFor="otp-name">Your name</Label>
          <Input id="otp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown on your comments" required minLength={2} maxLength={50} autoComplete="name" />
        </div>
      )}
      <TurnstileWidget key={widgetKey} onSuccess={setCfToken} onExpire={() => setCfToken('')} />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>
        <Mail className="h-4 w-4" />
        {busy ? 'Sending…' : needsName ? 'Create account and send code' : 'Email me a sign-in code'}
      </Button>
      <p className="text-center text-xs text-neutral-400">No password needed. Works for any account except staff accounts.</p>
    </form>
  )
}
