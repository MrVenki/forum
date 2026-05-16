'use client'

import { useState } from 'react'
import { FlairBadge, FlairPicker } from '@/components/topic/FlairBadge'

export function FlairPickerClient({ initialFlair }: { initialFlair: string | null | undefined }) {
  const [flair, setFlair] = useState<string | null>(initialFlair ?? null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleChange(newFlair: string | null) {
    setFlair(newFlair)
    setSaving(true)
    setSaved(false)
    await fetch('/api/user/flair', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flairTag: newFlair }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="text-left space-y-2">
      {flair && (
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          Your flair: <FlairBadge flair={flair} />
        </div>
      )}
      <FlairPicker value={flair} onChange={handleChange} saving={saving} />
      {saving && <p className="text-xs text-neutral-400">Saving…</p>}
      {saved && <p className="text-xs text-emerald-600">Saved!</p>}
    </div>
  )
}
