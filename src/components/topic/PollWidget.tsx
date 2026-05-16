'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { BarChart2, Plus, X, Check } from 'lucide-react'

interface PollData {
  id: string
  question: string
  options: string[]
  counts: number[]
  total: number
  userVote: number | null
  createdBy: { id: string; name: string }
  createdAt: string
}

interface Props {
  topicId: string
  topicOwnerId: string
}

export function PollWidget({ topicId, topicOwnerId }: Props) {
  const { data: session } = useSession()
  const [poll, setPoll] = useState<PollData | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  // Create form state
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const isOwnerOrAdmin = session &&
    (session.user.id === topicOwnerId || session.user.role === 'ADMIN' || session.user.role === 'MODERATOR')

  const fetchPoll = useCallback(async () => {
    const res = await fetch(`/api/topics/${topicId}/poll`)
    if (res.ok) {
      const d = await res.json()
      setPoll(d.poll)
    }
    setLoading(false)
  }, [topicId])

  useEffect(() => { fetchPoll() }, [fetchPoll])

  async function castVote(optionIndex: number) {
    if (!session || voting) return
    setVoting(true)
    const res = await fetch(`/api/topics/${topicId}/poll`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIndex }),
    })
    if (res.ok) await fetchPoll()
    setVoting(false)
  }

  async function createPoll(e: React.FormEvent) {
    e.preventDefault()
    const filled = options.filter(o => o.trim())
    if (filled.length < 2) { setCreateError('Add at least 2 options'); return }
    setCreating(true)
    setCreateError('')
    const res = await fetch(`/api/topics/${topicId}/poll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options: filled }),
    })
    if (res.ok) {
      setShowCreate(false)
      setQuestion('')
      setOptions(['', ''])
      fetchPoll()
    } else {
      const d = await res.json()
      setCreateError(d.error || 'Failed to create poll')
    }
    setCreating(false)
  }

  if (loading) return null

  // Create poll UI (for topic owner/admin when no poll exists)
  if (!poll) {
    if (!isOwnerOrAdmin) return null
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 p-4">
        {showCreate ? (
          <form onSubmit={createPoll} className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-navy-500 flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-saffron-500" /> Create a Poll
              </p>
              <button type="button" onClick={() => setShowCreate(false)}>
                <X className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Poll question…"
              required
              minLength={5}
              maxLength={300}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
            />
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={opt}
                    onChange={e => {
                      const next = [...options]
                      next[i] = e.target.value
                      setOptions(next)
                    }}
                    placeholder={`Option ${i + 1}`}
                    maxLength={100}
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
                  />
                  {options.length > 2 && (
                    <button type="button" onClick={() => setOptions(options.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={() => setOptions([...options, ''])}
                  className="text-xs text-saffron-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add option
                </button>
              )}
            </div>
            {createError && <p className="text-xs text-red-600">{createError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-saffron-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-saffron-600 disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create Poll'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-saffron-600 transition-colors"
          >
            <BarChart2 className="h-4 w-4" /> Add a community poll
          </button>
        )}
      </div>
    )
  }

  // Poll display + voting
  const hasVoted = poll.userVote !== null
  const showResults = hasVoted || !session

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
        <BarChart2 className="h-4 w-4 text-saffron-500" />
        <span className="text-sm font-semibold text-navy-500">Community Poll</span>
        <span className="ml-auto text-xs text-neutral-400">{poll.total} vote{poll.total !== 1 ? 's' : ''}</span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm font-medium text-neutral-800">{poll.question}</p>
        <div className="space-y-2">
          {poll.options.map((opt, i) => {
            const count = poll.counts[i] ?? 0
            const pct = poll.total > 0 ? Math.round((count / poll.total) * 100) : 0
            const isChosen = poll.userVote === i

            return (
              <button
                key={i}
                onClick={() => !showResults && castVote(i)}
                disabled={voting || showResults}
                className={`w-full relative rounded-lg border text-left overflow-hidden transition-all
                  ${isChosen ? 'border-saffron-400 bg-saffron-50' : showResults ? 'border-neutral-200 bg-white' : 'border-neutral-200 bg-white hover:border-saffron-300 hover:bg-saffron-50/50'}
                  disabled:cursor-default`}
              >
                {/* Results bar */}
                {showResults && (
                  <div
                    className="absolute inset-y-0 left-0 bg-saffron-100 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between px-3 py-2">
                  <span className={`text-sm ${isChosen ? 'font-semibold text-saffron-700' : 'text-neutral-700'}`}>
                    {isChosen && <Check className="inline h-3 w-3 mr-1" />}
                    {opt}
                  </span>
                  {showResults && (
                    <span className={`text-xs font-medium ${isChosen ? 'text-saffron-600' : 'text-neutral-500'}`}>
                      {pct}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        {!session && (
          <p className="text-xs text-neutral-400">
            <a href="/login" className="underline hover:text-saffron-600">Sign in</a> to vote
          </p>
        )}
        {hasVoted && (
          <p className="text-xs text-neutral-400">You voted · {poll.total} total vote{poll.total !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  )
}
