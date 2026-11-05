'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { X } from 'lucide-react'

interface Gap {
  propertyName: string
  url: string
}

const DISMISS_KEY = 'ipt-review-gap-dismissed'
const DISMISS_DAYS = 7

export function ReviewGapBanner() {
  const { status } = useSession()
  const [gaps, setGaps] = useState<Gap[]>([])

  useEffect(() => {
    if (status !== 'authenticated') return
    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) || 0)
      if (until > Date.now()) return
    } catch {}
    fetch('/api/user/review-gaps')
      .then((r) => (r.ok ? r.json() : { gaps: [] }))
      .then((d) => setGaps(d.gaps ?? []))
      .catch(() => {})
  }, [status])

  if (gaps.length === 0) return null

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000))
    } catch {}
    setGaps([])
  }

  const first = gaps[0]
  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="container-forum flex items-center gap-3 py-2 text-sm text-amber-900">
        <p className="flex-1">
          Help other buyers: add possession and maintenance details to your review of{' '}
          <Link href={first.url} className="font-semibold underline">{first.propertyName}</Link>
          {gaps.length > 1 && (
            <>
              {' '}and <Link href="/profile#improve-reviews" className="font-semibold underline">{gaps.length - 1} more</Link>
            </>
          )}
          .
        </p>
        <button type="button" onClick={dismiss} aria-label="Dismiss for a week" className="rounded p-1 hover:bg-amber-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
