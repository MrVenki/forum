'use client'

import { useState } from 'react'
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
}

/** Hide, restore or delete community posts and replies. */
export function CommunityModeration({ items: initial, emptyText }: { items: ModItem[]; emptyText: string }) {
  const [items, setItems] = useState(initial)

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
          <div className="mt-3 flex gap-2">
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
    </ul>
  )
}
