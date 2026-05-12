'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils/cn'

interface Props {
  initialName: string
}

export function EditNameForm({ initialName }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [draft, setDraft] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function startEdit() {
    setDraft(name)
    setEditing(true)
  }

  function cancel() {
    setEditing(false)
    setDraft(name)
  }

  async function save() {
    const trimmed = draft.trim()
    if (trimmed === name) { setEditing(false); return }
    if (trimmed.length < 2) {
      toast({ title: 'Name too short', description: 'Please enter at least 2 characters.', variant: 'destructive' })
      return
    }
    setLoading(true)
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setName(data.name)
      setEditing(false)
      toast({ title: 'Profile updated', description: 'Your name has been saved.' })
      router.refresh()
    } else {
      toast({ title: data.error || 'Failed to update', variant: 'destructive' })
    }
  }

  if (editing) {
    return (
      <div className="mt-3 flex flex-col items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
          maxLength={100}
          className="w-full rounded-lg border border-saffron-300 px-3 py-1.5 text-sm text-center font-semibold text-navy-500 focus:outline-none focus:ring-2 focus:ring-saffron-400"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={loading}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 transition-colors',
              loading && 'opacity-60 cursor-not-allowed',
            )}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Save
          </button>
          <button
            onClick={cancel}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 flex items-center justify-center gap-1.5 group">
      <h1 className="font-heading font-bold text-lg text-navy-500">{name}</h1>
      <button
        onClick={startEdit}
        title="Edit name"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-saffron-500"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
