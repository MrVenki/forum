'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Check, X, ExternalLink, RotateCcw, MessageSquare } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/format'

type CommentRow = {
  id: string
  content: string
  isDeleted: boolean
  createdAt: string
  parentId: string | null
  user: { name: string }
  topic: {
    propertyName: string
    slug: string
    city: { slug: string; name: string }
  }
}

type FilterType = 'active' | 'deleted' | 'all'

export function CommentsTable({ initialComments }: { initialComments: CommentRow[] }) {
  const [comments, setComments] = useState(initialComments)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<FilterType>('active')

  function startEdit(c: CommentRow) {
    setEditingId(c.id)
    setEditContent(c.content)
  }

  async function saveEdit(id: string) {
    if (!editContent.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      })
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, content: editContent.trim() } : c))
        )
        setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteComment(id: string) {
    const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, isDeleted: true } : c)))
    }
  }

  async function restoreComment(id: string) {
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted: false }),
    })
    if (res.ok) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, isDeleted: false } : c)))
    }
  }

  const counts = {
    active: comments.filter((c) => !c.isDeleted).length,
    deleted: comments.filter((c) => c.isDeleted).length,
    all: comments.length,
  }

  const filtered = comments.filter((c) =>
    filter === 'all' ? true : filter === 'active' ? !c.isDeleted : c.isDeleted
  )

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['active', 'deleted', 'all'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-navy-500 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Comment cards */}
      <div className="space-y-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`rounded-xl border bg-white p-4 transition-all ${
              c.isDeleted ? 'border-red-200 bg-red-50/30' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                {/* Meta row */}
                <div className="flex items-center flex-wrap gap-1.5 mb-2">
                  <span className="text-xs font-semibold text-neutral-800">{c.user.name}</span>
                  {c.parentId && (
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      reply
                    </span>
                  )}
                  <MessageSquare className="h-3 w-3 text-neutral-400" />
                  <Link
                    href={`/${c.topic.city.slug}/${c.topic.slug}`}
                    target="_blank"
                    className="text-xs text-saffron-600 hover:underline font-medium max-w-[200px] truncate"
                  >
                    {c.topic.propertyName}
                  </Link>
                  <span className="text-neutral-300">·</span>
                  <span className="text-xs text-neutral-400">{c.topic.city.name}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-xs text-neutral-400">{formatRelativeTime(c.createdAt)}</span>
                  {c.isDeleted && (
                    <span className="text-[10px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide ml-1">
                      deleted
                    </span>
                  )}
                </div>

                {/* Content / Edit area */}
                {editingId === c.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-y"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(c.id)}
                        disabled={saving || !editContent.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-500 text-white text-xs font-semibold hover:bg-saffron-600 disabled:opacity-50 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 text-xs font-medium hover:bg-neutral-50 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className={`text-sm whitespace-pre-line leading-relaxed ${
                      c.isDeleted ? 'text-neutral-400 line-through' : 'text-neutral-700'
                    }`}
                  >
                    {c.content}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              {editingId !== c.id && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Link
                    href={`/${c.topic.city.slug}/${c.topic.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-saffron-500 hover:bg-saffron-50 transition-colors"
                    title="View post"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {!c.isDeleted && (
                    <button
                      onClick={() => startEdit(c)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-navy-500 hover:bg-navy-50 transition-colors"
                      title="Edit comment"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {c.isDeleted ? (
                    <button
                      onClick={() => restoreComment(c.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="Restore comment"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-neutral-400 rounded-xl border border-neutral-200 bg-white">
            No comments found
          </div>
        )}
      </div>
    </>
  )
}
