'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MailWarning, X } from 'lucide-react'
import { isEmailVerificationEnabled } from '@/lib/features'

export function VerificationBanner() {
  const { data: session, status } = useSession()
  const [dismissed, setDismissed] = useState(false)

  if (
    status !== 'authenticated' ||
    dismissed ||
    !isEmailVerificationEnabled() ||
    session.user.emailVerified
  ) {
    return null
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-sm text-amber-800">
          <MailWarning className="h-4 w-4 shrink-0 text-amber-500" />
          <span>
            Please verify your email to post topics, comments, or ratings.{' '}
            <Link
              href={`/verify-email?email=${encodeURIComponent(session.user.email)}`}
              className="font-semibold underline underline-offset-2 hover:text-amber-900"
            >
              Verify now
            </Link>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 text-amber-500 hover:bg-amber-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
