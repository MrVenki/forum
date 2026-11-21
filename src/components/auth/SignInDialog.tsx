'use client'

import { useEffect, useRef, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { X } from 'lucide-react'
import { EmailCodeSignIn } from './EmailCodeSignIn'

interface Props {
  open: boolean
  onClose: () => void
  /** Runs once the session is live, so the caller can open and focus the reply box. */
  onSignedIn: () => void
  /** Where Google sends the person back to (Google sign-in leaves the page). */
  callbackUrl: string
  title?: string
  subtitle?: string
}

/** Sign-in popup used where an action needs an account, such as replying. */
export function SignInDialog({ open, onClose, onSignedIn, callbackUrl, title = 'Sign in to reply', subtitle }: Props) {
  const { update } = useSession()
  const [hasGoogle, setHasGoogle] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    fetch('/api/auth/providers')
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => setHasGoogle(!!p?.google))
      .catch(() => {})
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="signin-dialog-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div ref={panelRef} className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
          <X className="h-5 w-5" />
        </button>
        <h2 id="signin-dialog-title" className="font-heading text-lg font-bold text-navy-500">{title}</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {subtitle ?? 'It takes a few seconds. You will come straight back to your reply.'}
        </p>

        {hasGoogle && (
          <>
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
              </svg>
              Continue with Google
            </button>
            <div className="my-4 flex items-center gap-3 text-xs text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" /> or <span className="h-px flex-1 bg-neutral-200" />
            </div>
          </>
        )}

        <div className={hasGoogle ? '' : 'mt-5'}>
          <EmailCodeSignIn
            callbackUrl={callbackUrl}
            onSignedIn={async () => {
              await update()
              onSignedIn()
            }}
          />
        </div>
      </div>
    </div>
  )
}

/** The `?reply=` marker Google sign-in returns with, so the right reply box reopens. */
export function replyCallbackUrl(key: string, anchor: string): string {
  if (typeof window === 'undefined') return '/'
  const url = new URL(window.location.href)
  url.searchParams.set('reply', key)
  url.hash = anchor
  return url.pathname + url.search + url.hash
}

/** True once if the page was opened with `?reply=<key>`; clears the marker from the address bar. */
export function consumeReplyMarker(key: string): boolean {
  if (typeof window === 'undefined') return false
  const url = new URL(window.location.href)
  if (url.searchParams.get('reply') !== key) return false
  url.searchParams.delete('reply')
  window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  return true
}
