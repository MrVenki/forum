'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Eye, EyeOff, Pencil, ExternalLink, X, Trash2, Check, ImageOff,
} from 'lucide-react'

type TopicRow = {
  id: string
  propertyName: string
  slug: string
  description: string
  isPublished: boolean
  image1Url: string | null
  image1PubId: string | null
  image2Url: string | null
  image2PubId: string | null
  viewCount: number
  createdAt: string
  city: { name: string; slug: string }
  user: { name: string }
  _count: { comments: number; ratings: number }
}

type FilterType = 'all' | 'published' | 'hidden'

export function PostsTable({ initialTopics }: { initialTopics: TopicRow[] }) {
  const [topics, setTopics] = useState(initialTopics)
  const [editing, setEditing] = useState<TopicRow | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [removeImg1, setRemoveImg1] = useState(false)
  const [removeImg2, setRemoveImg2] = useState(false)
  const [editPublished, setEditPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [savingToggle, setSavingToggle] = useState<string | null>(null)

  function openEdit(t: TopicRow) {
    setEditing(t)
    setEditDesc(t.description)
    setRemoveImg1(false)
    setRemoveImg2(false)
    setEditPublished(t.isPublished)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/topics/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editDesc,
          isPublished: editPublished,
          removeImage1: removeImg1,
          removeImage2: removeImg2,
        }),
      })
      if (res.ok) {
        setTopics((prev) =>
          prev.map((t) =>
            t.id === editing.id
              ? {
                  ...t,
                  description: editDesc,
                  isPublished: editPublished,
                  image1Url: removeImg1 ? null : t.image1Url,
                  image1PubId: removeImg1 ? null : t.image1PubId,
                  image2Url: removeImg2 ? null : t.image2Url,
                  image2PubId: removeImg2 ? null : t.image2PubId,
                }
              : t
          )
        )
        setEditing(null)
      }
    } finally {
      setSaving(false)
    }
  }

  async function quickTogglePublish(t: TopicRow) {
    setSavingToggle(t.id)
    try {
      const res = await fetch(`/api/admin/topics/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !t.isPublished }),
      })
      if (res.ok) {
        setTopics((prev) =>
          prev.map((x) => (x.id === t.id ? { ...x, isPublished: !t.isPublished } : x))
        )
      }
    } finally {
      setSavingToggle(null)
    }
  }

  const counts = {
    all: topics.length,
    published: topics.filter((t) => t.isPublished).length,
    hidden: topics.filter((t) => !t.isPublished).length,
  }

  const filtered = topics.filter((t) =>
    filter === 'all' ? true : filter === 'published' ? t.isPublished : !t.isPublished
  )

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'published', 'hidden'] as FilterType[]).map((f) => (
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

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Property
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">
                  City
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">
                  Posted by
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">
                  Views
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hidden md:table-cell">
                  Comments
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-neutral-50 transition-colors ${!t.isPublished ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {t.image1Url ? (
                        <img
                          src={t.image1Url}
                          alt=""
                          className="h-10 w-14 rounded object-cover shrink-0 border border-neutral-200"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded bg-neutral-100 flex items-center justify-center shrink-0">
                          <ImageOff className="h-4 w-4 text-neutral-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-800 line-clamp-1">{t.propertyName}</p>
                        <p className="text-xs text-neutral-400 md:hidden">{t.city.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 hidden md:table-cell">{t.city.name}</td>
                  <td className="px-4 py-3 text-neutral-500 hidden lg:table-cell">{t.user.name}</td>
                  <td className="px-4 py-3 text-center text-neutral-500 hidden md:table-cell">
                    {t.viewCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center text-neutral-500 hidden md:table-cell">
                    {t._count.comments}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => quickTogglePublish(t)}
                      disabled={savingToggle === t.id}
                      title={t.isPublished ? 'Click to hide post' : 'Click to make live'}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                        t.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                          : 'bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700'
                      }`}
                    >
                      {t.isPublished ? (
                        <>
                          <Eye className="h-3 w-3" /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/${t.city.slug}/${t.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-saffron-500 hover:bg-saffron-50 transition-colors"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-navy-500 hover:bg-navy-50 transition-colors"
                        title="Edit post"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-neutral-400">No posts found</div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-neutral-200 shrink-0">
              <div>
                <h2 className="font-heading font-bold text-navy-500 text-lg leading-snug">
                  {editing.propertyName}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {editing.city.name} · Posted by {editing.user.name}
                </p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors shrink-0 ml-4"
              >
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-y"
                />
                <p className="text-xs text-neutral-400 mt-1">{editDesc.length} characters</p>
              </div>

              {/* Images */}
              {(editing.image1Url || editing.image2Url) && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Property Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {editing.image1Url && (
                      <div className="relative">
                        <img
                          src={editing.image1Url}
                          alt="Photo 1"
                          className={`h-32 w-48 object-cover rounded-xl border-2 transition-all ${
                            removeImg1 ? 'opacity-25 border-red-400' : 'border-neutral-200'
                          }`}
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                          Photo 1
                        </span>
                        <button
                          onClick={() => setRemoveImg1(!removeImg1)}
                          className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-md transition-colors ${
                            removeImg1
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-red-500 hover:bg-red-50 border border-red-200'
                          }`}
                        >
                          {removeImg1 ? (
                            <>
                              <Check className="h-3 w-3" /> Removing
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3" /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {editing.image2Url && (
                      <div className="relative">
                        <img
                          src={editing.image2Url}
                          alt="Photo 2"
                          className={`h-32 w-48 object-cover rounded-xl border-2 transition-all ${
                            removeImg2 ? 'opacity-25 border-red-400' : 'border-neutral-200'
                          }`}
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                          Photo 2
                        </span>
                        <button
                          onClick={() => setRemoveImg2(!removeImg2)}
                          className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-md transition-colors ${
                            removeImg2
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-red-500 hover:bg-red-50 border border-red-200'
                          }`}
                        >
                          {removeImg2 ? (
                            <>
                              <Check className="h-3 w-3" /> Removing
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3" /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  {(removeImg1 || removeImg2) && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      ⚠ Image deletion is permanent and removes from Cloudinary.
                    </p>
                  )}
                </div>
              )}

              {/* Visibility toggle */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-700">Post Visibility</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {editPublished ? 'Visible to all users on the site' : 'Hidden from public — only admins can see it'}
                  </p>
                </div>
                <button
                  onClick={() => setEditPublished(!editPublished)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    editPublished ? 'bg-saffron-500' : 'bg-neutral-300'
                  }`}
                  role="switch"
                  aria-checked={editPublished}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                      editPublished ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl shrink-0">
              <Link
                href={`/${editing.city.slug}/${editing.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-sm text-saffron-500 hover:text-saffron-600 font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> View live post
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || editDesc.trim().length < 20}
                  className="px-6 py-2 rounded-lg bg-saffron-500 hover:bg-saffron-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
