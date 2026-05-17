'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [cfToken, setCfToken] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, cfToken }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(json.error || 'Registration failed. Please try again.')
    } else if (json.requiresVerification) {
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } else {
      router.push('/login?registered=1')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-navy-500">Create your account</h1>
          <p className="mt-1 text-sm text-neutral-500">Join India&apos;s most trusted property forum</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-neutral-400">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" type="text" placeholder="Ravi Kumar" {...register('name')} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" {...register('password')} className="pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {/* Terms agreement */}
          <div className="flex items-start gap-3">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 accent-saffron-500 cursor-pointer"
            />
            <label htmlFor="agree" className="text-xs text-neutral-500 leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link href="/terms-of-use" target="_blank" className="font-semibold text-saffron-500 hover:text-saffron-600 underline underline-offset-2 transition-colors">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" target="_blank" className="font-semibold text-saffron-500 hover:text-saffron-600 underline underline-offset-2 transition-colors">
                Privacy Policy
              </Link>. Your information is never sold.
            </label>
          </div>

          <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />

          <Button type="submit" className="w-full" disabled={loading || !agreed}>
            <UserPlus className="h-4 w-4" />
            {loading ? 'Creating account…' : 'Create Free Account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-saffron-500 hover:text-saffron-600 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
