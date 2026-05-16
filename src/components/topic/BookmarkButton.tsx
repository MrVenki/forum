'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  topicId: string
  size?: 'sm' | 'md'
}

export function BookmarkButton({ topicId, size = 'md' }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch(`/api/topics/${topicId}/bookmark`)
      .then(r => r.json())
      .then(d => setBookmarked(d.bookmarked))
  }, [topicId, session])

  async function toggle() {
    if (!session) { router.push('/login'); return }
    setLoading(true)
    const prev = bookmarked
    setBookmarked(!bookmarked)
    const res = await fetch(`/api/topics/${topicId}/bookmark`, { method: 'POST' })
    if (res.ok) {
      const d = await res.json()
      setBookmarked(d.bookmarked)
    } else {
      setBookmarked(prev)
    }
    setLoading(false)
  }

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const btnSize  = size === 'sm' ? 'p-1.5'      : 'p-2'

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? 'Remove from watchlist' : 'Save to watchlist'}
      className={`${btnSize} rounded-lg transition-all ${
        bookmarked
          ? 'bg-saffron-50 text-saffron-600 hover:bg-saffron-100'
          : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600'
      } disabled:opacity-50`}
    >
      <Bookmark className={`${iconSize} ${bookmarked ? 'fill-saffron-500' : ''}`} />
    </button>
  )
}
