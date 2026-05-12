'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils/cn'

interface Props {
  topicId: string
  initialDescription: string
}

export function EditDescriptionForm({ topicId, initialDescription }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [draft, setDraft] = useState(initialDescription)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(draft.length, draft.length)
    }
  }, [editing])

  function startEdit() {
    setDraft(description)
    setEditing(true)
  }

  function cancel() {
    setEditing(false)
    setDraft(description)
  }

  async function save() {
    const trimmed = draft.trim()
    if (trimmed === description) { setEditing(false); return }
    if (trimmed.length < 20) {
      toast({ title: 'Too short', description: 'Description must be at least 20 characters.', variant: 'destructive' })
      return
    }
    setLoading(true)
    const res = await fetch(`/api/topics/${topicId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: trimmed }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setDescription(data.description)
      setEditing(false)
      toast({ title: 'Description updated' })
      router.refresh()
    } else {
      toast({ title: data.error || 'Failed to save', variant: 'destructive' })
    }
  }

  if (editing) {
    return (
      <div className="space-y-3">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={Math.max(6, draft.split('\n').length + 2)}
          maxLength={10000}
          className="w-full rounded-lg border border-saffron-300 px-3 py-2.5 text-sm text-neutral-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-y"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">{draft.length} / 10,000</span>
          <div className="flex gap-2">
            <button
              onClick={cancel}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button
              onClick={save}
              disabled={loading || draft.trim().length < 20}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 transition-colors',
                (loading || draft.trim().length < 20) && 'opacity-60 cursor-not-allowed',
              )}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
        {description}
      </div>
      <button
        onClick={startEdit}
        title="Edit description"
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:border-saffron-300 hover:text-saffron-600 transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" /> Edit description
      </button>
    </div>
  )
}
