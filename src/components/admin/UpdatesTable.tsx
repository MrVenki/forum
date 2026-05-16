'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Check, X, Camera, Construction } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/format'

interface Update {
  id: string
  content: string
  imageUrl: string | null
  visitedAt: string
  createdAt: string
  user: { name: string }
  topic: {
    propertyName: string
    slug: string
    city: { name: string; slug: string }
  }
}

interface Props {
  initialUpdates: Update[]
}

function UpdateRow({ update, onDelete }: { update: Update; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(update.content)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (content.trim().length < 10) { setError('Min 10 characters'); return }
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/updates/${update.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    })
    if (res.ok) { setEditing(false) } else { setError('Failed to save') }
    setSaving(false)
  }

  async function del() {
    if (!confirm('Delete this construction update?')) return
    const res = await fetch(`/api/admin/updates/${update.id}`, { method: 'DELETE' })
    if (res.ok) onDelete(update.id)
  }

  const topicHref = `/${update.topic.city.slug}/${update.topic.slug}`
  const visitDate = new Date(update.visitedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex gap-4">
        {/* Image thumbnail */}
        {update.imageUrl && (
          <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
            <Image src={update.imageUrl} alt="Update photo" fill className="object-cover" unoptimized />
            <div className="absolute top-1 right-1 bg-black/60 rounded p-0.5">
              <Camera className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Construction className="h-3.5 w-3.5 text-saffron-500 shrink-0" />
            <Link href={topicHref} target="_blank"
              className="text-xs font-semibold text-saffron-600 hover:underline truncate max-w-[200px]">
              {update.topic.propertyName}
            </Link>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500">{update.topic.city.name}</span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs font-medium text-neutral-600">{update.user.name}</span>
            <span className="text-xs text-neutral-400 ml-auto">{formatRelativeTime(new Date(update.createdAt))}</span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-1.5">Site visited: {visitDate}</p>

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-none"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
                  <Check className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setContent(update.content); setError('') }}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">{content}</p>
          )}
        </div>

        {/* Actions */}
        {!editing && (
          <div className="flex flex-col gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 rounded hover:bg-neutral-100" title="Edit">
              <Pencil className="h-4 w-4 text-neutral-500" />
            </button>
            <button onClick={del} className="p-1.5 rounded hover:bg-red-100" title="Delete">
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function UpdatesTable({ initialUpdates }: Props) {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates)
  const [search, setSearch] = useState('')
  const [filterPhoto, setFilterPhoto] = useState(false)

  function deleteUpdate(id: string) {
    setUpdates(prev => prev.filter(u => u.id !== id))
  }

  const filtered = updates
    .filter(u => !filterPhoto || u.imageUrl)
    .filter(u =>
      !search ||
      u.content.toLowerCase().includes(search.toLowerCase()) ||
      u.user.name.toLowerCase().includes(search.toLowerCase()) ||
      u.topic.propertyName.toLowerCase().includes(search.toLowerCase())
    )

  const withPhoto = updates.filter(u => u.imageUrl).length

  return (
    <div>
      {/* Summary chips */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold px-3 py-1">
          {updates.length} updates
        </span>
        <span className="rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1">
          {withPhoto} with photos
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="search"
          placeholder="Search by content, user, or property…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
        />
        <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 cursor-pointer">
          <input type="checkbox" checked={filterPhoto} onChange={e => setFilterPhoto(e.target.checked)}
            className="accent-saffron-500" />
          Photos only
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400">
          {search || filterPhoto ? 'No updates match your filters.' : 'No updates yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <UpdateRow key={u.id} update={u} onDelete={deleteUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
