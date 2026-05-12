'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bell, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Props {
  topicId: string
  initialSubscribed?: boolean
  initialCount?: number
}

export function SubscribeButton({ topicId, initialSubscribed = false, initialCount = 0 }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [subscribed, setSubscribed] = useState(initialSubscribed)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  // Fetch live state once mounted (covers SSR mismatch for logged-in users)
  useEffect(() => {
    if (!session) return
    fetch(`/api/topics/${topicId}/subscribe`)
      .then((r) => r.json())
      .then((d) => { setSubscribed(d.subscribed); setCount(d.count) })
      .catch(() => {})
  }, [topicId, session])

  async function toggle() {
    if (!session) { router.push('/login'); return }
    setLoading(true)
    try {
      const method = subscribed ? 'DELETE' : 'POST'
      const res = await fetch(`/api/topics/${topicId}/subscribe`, { method })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubscribed(data.subscribed)
      setCount(data.count)
    } catch {
      // silent — state reverts
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={subscribed ? 'Unfollow this thread' : 'Follow this thread for updates'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all focus:outline-none shadow-sm',
        subscribed
          ? 'border border-saffron-300 bg-saffron-50 text-saffron-700 hover:bg-saffron-100'
          : 'bg-saffron-500 text-white hover:bg-saffron-600 active:bg-saffron-700',
        loading && 'opacity-60 cursor-not-allowed',
      )}
    >
      {subscribed
        ? <Bell className="h-3.5 w-3.5 fill-saffron-500 text-saffron-500" />
        : <Bell className="h-3.5 w-3.5" />}
      {subscribed ? 'Following' : 'Follow'}
    </button>
  )
}

export function SubscriberCount({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
      <Bell className="h-3 w-3" />
      {count} {count === 1 ? 'person' : 'people'} following
    </span>
  )
}
