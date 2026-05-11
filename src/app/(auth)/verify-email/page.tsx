'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MailCheck, RefreshCw } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!email) router.replace('/register')
  }, [email, router])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function startCooldown(seconds: number) {
    setResendCooldown(seconds)
    intervalRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(json.error || 'Verification failed.')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login?verified=1'), 1500)
    }
  }

  async function handleResend() {
    setResending(true)
    setError('')
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await res.json()
    setResending(false)
    if (!res.ok) {
      setError(json.error || 'Failed to resend code.')
    } else {
      startCooldown(60)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-50">
            <MailCheck className="h-7 w-7 text-saffron-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Check your email</h1>
          <p className="mt-2 text-sm text-neutral-500">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-neutral-700">{email}</span>
          </p>
        </div>

        {success ? (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-center text-sm text-green-700">
            Email verified! Redirecting to sign in…
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
                {loading ? 'Verifying…' : 'Verify Email'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-500">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="inline-flex items-center gap-1 font-semibold text-saffron-500 hover:text-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resending ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : null}
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-neutral-400">
              Code expires in 10 minutes
            </p>
          </>
        )}
      </div>
    </div>
  )
}
