'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle2, Clock, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

type Status = 'ON_TRACK' | 'DELAYED' | 'STALLED' | 'POSSESSION_DONE'

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  ON_TRACK:        { label: 'On Track',        color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: CheckCircle2  },
  DELAYED:         { label: 'Delayed',          color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   icon: Clock         },
  STALLED:         { label: 'Stalled',          color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     icon: XCircle       },
  POSSESSION_DONE: { label: 'Possession Done',  color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    icon: CheckCircle2  },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Status[]

interface StatusData {
  constructionStatus: Status | null
  expectedPossession: string | null
  actualPossession: string | null
  tally: Partial<Record<Status, number>>
  total: number
}

interface Props {
  topicId: string
  initialStatus?: Status | null
  initialExpected?: string | null
  initialActual?: string | null
}

export function ConstructionStatus({ topicId, initialStatus, initialExpected, initialActual }: Props) {
  const { data: session } = useSession()
  const [data, setData] = useState<StatusData>({
    constructionStatus: initialStatus ?? null,
    expectedPossession: initialExpected ?? null,
    actualPossession: initialActual ?? null,
    tally: {},
    total: 0,
  })
  const [userVote, setUserVote] = useState<Status | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [voting, setVoting] = useState(false)

  const fetchStatus = useCallback(async () => {
    const res = await fetch(`/api/topics/${topicId}/status`)
    if (res.ok) setData(await res.json())
  }, [topicId])

  useEffect(() => { fetchStatus() }, [fetchStatus])

  async function vote(status: Status) {
    if (!session || voting) return
    setVoting(true)
    const prev = userVote
    setUserVote(userVote === status ? null : status)
    const res = await fetch(`/api/topics/${topicId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      await fetchStatus()
    } else {
      setUserVote(prev) // revert on error
    }
    setVoting(false)
  }

  const current = data.constructionStatus
  const cfg = current ? STATUS_CONFIG[current] : null
  const Icon = cfg?.icon

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      {/* Status header */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer ${cfg ? `${cfg.bg} ${cfg.border} border-b` : 'bg-neutral-50 border-b border-neutral-200'}`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`h-4 w-4 ${cfg?.color}`} />}
          <span className={`text-sm font-semibold ${cfg?.color ?? 'text-neutral-500'}`}>
            {current ? STATUS_CONFIG[current].label : 'Construction Status Unknown'}
          </span>
          {data.total > 0 && (
            <span className="text-xs text-neutral-400 ml-1">· {data.total} vote{data.total !== 1 ? 's' : ''}</span>
          )}
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
      </div>

      {/* Possession dates */}
      {(data.expectedPossession || data.actualPossession) && (
        <div className="px-4 py-2 bg-white border-b border-neutral-100 flex gap-6 text-xs text-neutral-600">
          {data.expectedPossession && (
            <span>Expected possession: <strong className="text-neutral-800">{fmt(data.expectedPossession)}</strong></span>
          )}
          {data.actualPossession && (
            <span>Actual possession: <strong className="text-neutral-800">{fmt(data.actualPossession)}</strong></span>
          )}
        </div>
      )}

      {/* Voting panel */}
      {expanded && (
        <div className="bg-white px-4 py-3 space-y-2">
          <p className="text-xs text-neutral-500 mb-2">
            {session ? 'What is the current construction status?' : 'Sign in to vote on construction status.'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_STATUSES.map((s) => {
              const c = STATUS_CONFIG[s]
              const count = data.tally[s] ?? 0
              const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0
              const mine = userVote === s
              return (
                <button
                  key={s}
                  disabled={!session || voting}
                  onClick={() => vote(s)}
                  className={`relative flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all overflow-hidden
                    ${mine ? `${c.bg} ${c.border} ${c.color}` : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {/* progress bar */}
                  {data.total > 0 && (
                    <div
                      className={`absolute inset-0 opacity-10 ${c.bg.replace('bg-', 'bg-')}`}
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <c.icon className={`h-3.5 w-3.5 shrink-0 relative z-10 ${mine ? c.color : 'text-neutral-400'}`} />
                  <span className="relative z-10 flex-1">{c.label}</span>
                  {count > 0 && (
                    <span className={`relative z-10 text-[10px] ${mine ? c.color : 'text-neutral-400'}`}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
          {!session && (
            <p className="text-xs text-neutral-400 pt-1">
              <a href="/login" className="underline hover:text-saffron-600">Sign in</a> to vote
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** Compact inline badge for use in TopicCards */
export function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}
