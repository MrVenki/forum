'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Pencil, Check, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils/cn'

interface Props {
  initialUsername: string
}

export function EditUsernameForm({ initialUsername }: Props) {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(initialUsername)
  const [draft, setDraft] = useState(initialUsername)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [formatError, setFormatError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const checkAvailability = useCallback(async (value: string) => {
    if (!value || value === username) { setAvailable(null); return }
    setChecking(true)
    try {
      const res = await fetch(`/api/auth/check-username?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setAvailable(data.available)
    } finally {
      setChecking(false)
    }
  }, [username])

  function handleDraftChange(value: string) {
    const lower = value.toLowerCase()
    setDraft(lower)
    setAvailable(null)

    // Format validation
    if (lower.length > 0 && !/^[a-z0-9]+$/.test(lower)) {
      setFormatError('Only lowercase letters and numbers')
      return
    }
    if (lower.length > 19) {
      setFormatError('Max 19 characters')
      return
    }
    if (lower.length > 0 && lower.length < 3) {
      setFormatError('At least 3 characters')
      clearTimeout(debounceRef.current)
      return
    }
    setFormatError('')

    // Debounced availability check
    clearTimeout(debounceRef.current)
    if (lower.length >= 3 && lower !== username) {
      debounceRef.current = setTimeout(() => checkAvailability(lower), 400)
    }
  }

  function startEdit() {
    setDraft(username)
    setAvailable(null)
    setFormatError('')
    setEditing(true)
  }

  function cancel() {
    clearTimeout(debounceRef.current)
    setEditing(false)
    setDraft(username)
    setAvailable(null)
    setFormatError('')
  }

  async function save() {
    const trimmed = draft.trim()
    if (trimmed === username) { setEditing(false); return }
    if (formatError || trimmed.length < 3) return
    if (available === false) {
      toast({ title: 'Username taken', description: 'Please choose a different username.', variant: 'destructive' })
      return
    }
    setLoading(true)
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: trimmed }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setUsername(data.username)
      setEditing(false)
      toast({ title: 'Username updated', description: `You're now @${data.username}` })
      await updateSession()
      router.refresh()
    } else {
      toast({ title: data.error || 'Failed to update username', variant: 'destructive' })
    }
  }

  const statusIcon = () => {
    if (draft === username || draft.length < 3) return null
    if (formatError) return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
    if (checking) return <Loader2 className="h-4 w-4 text-neutral-400 animate-spin shrink-0" />
    if (available === true) return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
    if (available === false) return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
    return null
  }

  if (editing) {
    return (
      <div className="mt-1 flex flex-col items-center gap-2 w-full">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-medium select-none">@</span>
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
            maxLength={19}
            placeholder="yourhandle"
            className={cn(
              'w-full rounded-lg border pl-7 pr-8 py-1.5 text-sm text-center font-mono text-navy-500 focus:outline-none focus:ring-2 transition-colors',
              formatError || available === false
                ? 'border-red-300 focus:ring-red-300'
                : available === true
                ? 'border-emerald-300 focus:ring-emerald-300'
                : 'border-saffron-300 focus:ring-saffron-400',
            )}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">{statusIcon()}</div>
        </div>
        {formatError && <p className="text-xs text-red-500 -mt-1">{formatError}</p>}
        {!formatError && available === false && <p className="text-xs text-red-500 -mt-1">Username already taken</p>}
        {!formatError && available === true && <p className="text-xs text-emerald-600 -mt-1">Available!</p>}
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={loading || !!formatError || available === false || draft.length < 3}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 transition-colors',
              (loading || !!formatError || available === false || draft.length < 3) && 'opacity-50 cursor-not-allowed',
            )}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Save
          </button>
          <button onClick={cancel} disabled={loading} className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-0.5 flex items-center justify-center gap-1.5 group">
      <p className="text-sm font-mono text-neutral-500">
        {username ? `@${username}` : <span className="italic text-neutral-400">no username set</span>}
      </p>
      <button
        onClick={startEdit}
        title="Edit username"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-saffron-500"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  )
}
