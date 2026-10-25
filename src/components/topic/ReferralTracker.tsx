'use client'

import { useEffect } from 'react'

/** Counts a visit when someone arrives through the poster's share link (?ref=owner). */
export function ReferralTracker({ topicId }: { topicId: string }) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('ref') !== 'owner') return
    const key = `ipt-ref-${topicId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {}
    fetch(`/api/topics/${topicId}/referral`, { method: 'POST' }).catch(() => {})
  }, [topicId])

  return null
}
