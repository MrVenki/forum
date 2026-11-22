'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export interface ModItem {
  targetType: 'POST' | 'REPLY'
  id: string
  postSlug: string
  title: string
  text: string
  author: string
  createdAt: string
  isHidden: boolean
  reports: { reason: string; count: number }[]
  /** Posts only: for the edit form */
  category?: string
  cityId?: string | null
}

export interface CityChoice { id: string; name: string }
export interface CategoryChoice { slug: string; label: string }

const input = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-saffron-400'

/** Edit, hide, restore or delete community posts and replies. */
export function CommunityModeration({
  items: initial, emptyText, cities = [], categories = [], autoEditId,
}: { items: ModItem[]; emptyText: string; cities?: CityChoice[]; categories?: CategoryChoice[]; autoEditId?: string }) {
  const [items, setItems] = useState(initial)
  const [editing, setEditing] = useState<ModItem | null>(null)
  // Open the form from an Edit link only after hydration, so nothing typed early is lost
  useEffect(() => {
    const item = initial.find((i) => i.id === autoEditId)
    if (item) setEditing(item)
  }, [initial, autoEditId])

  async function act(item: ModItem, action: 'hide' | 'restore' | 'delete') {
    if (action === 'delete' && !window.confirm('Delete this for good? It disappears from the site.')) return
    const res = await fetch('/api/admin/community', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType: item.targetType, id: item.id, action }),
    })
    if (!res.ok) return toast({ title: 'Could not update', variant: 'destructive' })
    toast({ title: action === 'delete' ? 'Deleted' : action === 'hide' ? 'Hidden' : 'Restored' })
    setItems((list) =>
      action === 'delete' || action === 'restore'
        ? list.filter((x) => !(x.id === item.id && x.targetType === item.targetType))
        : list.map((x) => (x.id === item.id ? { ...x, isHidden: true } : x)),
    )
  }

  if (items.length === 0) return <p className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">{emptyText}</p>

  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={`${it.targetType}-${it.id}`} className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-semibold uppercase">{it.targetType === 'POST' ? 'Post' : 'Reply'}</span>
            {it.isHidden && <span className="rounded bg-red-50 px-1.5 py-0.5 font-semibold text-red-700">Hidden</span>}
            {it.reports.map((r) => (
              <span key={r.reason} className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-800">{r.reason} × {r.count}</span>
            ))}
            <span>{it.author}</span>
            <span>{new Date(it.createdAt).toLocaleString('en-IN')}</span>
          </div>
          <Link href={`/community/${it.postSlug}`} target="_blank" className="mt-1 block font-semibold text-navy-500 hover:underline">{it.title}</Link>
          {it.text && <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm text-neutral-700">{it.text}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setEditing(it)} className="btn-secondary px-3 py-1.5 text-xs">Edit</button>
            {it.isHidden ? (
              <button type="button" onClick={() => act(it, 'restore')} className="btn-secondary px-3 py-1.5 text-xs">Restore</button>
            ) : (
              <button type="button" onClick={() => act(it, 'hide')} className="btn-secondary px-3 py-1.5 text-xs">Hide</button>
            )}
            {it.reports.length > 0 && !it.isHidden && (
              <button type="button" onClick={() => act(it, 'restore')} className="btn-secondary px-3 py-1.5 text-xs">Dismiss reports</button>
            )}
            <button type="button" onClick={() => act(it, 'delete')} className="btn-secondary px-3 py-1.5 text-xs text-red-600">Delete</button>
          </div>
        </li>
      ))}
      {editing && (
        <CommunityEditModal
          item={editing}
          cities={cities}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={(next) => {
            setItems((list) => list.map((x) => (x.id === next.id && x.targetType === next.targetType ? next : x)))
            setEditing(null)
          }}
        />
      )}
    </ul>
  )
}

function CommunityEditModal({ item, cities, categories, onClose, onSaved }: { item: ModItem; cities: CityChoice[]; categories: CategoryChoice[]; onClose: () => void; onSaved: (i: ModItem) => void }) {
  const isPost = item.targetType === 'POST'
  const [title, setTitle] = useState(item.title)
  const [text, setText] = useState(item.text)
  const [category, setCategory] = useState(item.category ?? categories[0]?.slug ?? '')
  const [cityId, setCityId] = useState(item.cityId ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    const body: Record<string, unknown> = { targetType: item.targetType, id: item.id, action: 'edit' }
    if (isPost) {
      if (title.trim() !== item.title) body.title = title
      if (text.trim() !== item.text) body.body = text
      if (category !== item.category) body.category = category
      if (cityId !== (item.cityId ?? '')) body.cityId = cityId || null
    } else if (text.trim() !== item.text) body.content = text
    if (Object.keys(body).length === 3) return onClose()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/community', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return setError(data.error || 'Could not save')
      toast({ title: 'Saved' })
      onSaved({ ...item, title: isPost ? title.trim() : item.title, text: text.trim(), category, cityId: cityId || null })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 sm:items-center sm:p-4">
      <div className="flex max-h-full w-full max-w-2xl flex-col bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-neutral-200 p-4 sm:p-6">
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-navy-500">{isPost ? 'Edit post' : 'Edit reply'}</h2>
            <p className="mt-0.5 text-xs text-neutral-500">{item.author} · {isPost ? 'the post address stays the same' : item.title}</p>
          </div>
          <button type="button" onClick={onClose} className="ml-4 shrink-0 rounded-lg p-2 hover:bg-neutral-100" aria-label="Close">✕</button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {isPost && (
            <>
              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">Title</label>
                <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">Topic</label>
                  <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">City</label>
                  <select className={input} value={cityId} onChange={(e) => setCityId(e.target.value)}>
                    <option value="">No city (all India)</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-sm font-semibold text-neutral-700">{isPost ? 'Details' : 'Reply'}</label>
            <textarea rows={8} className={`${input} resize-y`} value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <p className="text-xs text-neutral-400">If you change the wording, the site shows &quot;Edited by a moderator&quot; under it. Topic and city changes stay silent.</p>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-neutral-200 bg-neutral-50 p-4 sm:rounded-b-2xl sm:p-6">
          <button type="button" onClick={onClose} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Cancel</button>
          <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-saffron-500 px-5 py-2 text-sm font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
