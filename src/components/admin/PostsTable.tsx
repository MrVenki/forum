'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Pencil, ExternalLink, ImageOff, Search } from 'lucide-react'
import { TopicEditModal, type CityOption, type DeveloperOption, type EditableTopic } from './TopicEditModal'

type TopicRow = EditableTopic & {
  viewCount: number
  createdAt: string
  _count: { comments: number; ratings: number }
}

type FilterType = 'all' | 'published' | 'hidden'

export function PostsTable({
  initialTopics, cities, developers, initialEditId,
}: {
  initialTopics: TopicRow[]
  cities: CityOption[]
  developers: DeveloperOption[]
  initialEditId?: string
}) {
  const [topics, setTopics] = useState(initialTopics)
  const [editing, setEditing] = useState<TopicRow | null>(null)
  // Open the form from an Edit link only after hydration, so nothing typed early is lost
  useEffect(() => {
    const row = initialTopics.find((t) => t.id === initialEditId)
    if (row) setEditing(row)
  }, [initialTopics, initialEditId])
  const [filter, setFilter] = useState<FilterType>('all')
  const [query, setQuery] = useState('')
  const [savingToggle, setSavingToggle] = useState<string | null>(null)

  function openEdit(t: TopicRow) {
    setEditing(t)
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

  const q = query.trim().toLowerCase()
  const filtered = topics.filter((t) =>
    (filter === 'all' ? true : filter === 'published' ? t.isPublished : !t.isPublished) &&
    (!q || t.propertyName.toLowerCase().includes(q) || t.city.name.toLowerCase().includes(q) || (t.developerName ?? '').toLowerCase().includes(q))
  )

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
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
        <label className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project, city or builder"
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
          />
        </label>
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

      {editing && (
        <TopicEditModal
          topic={editing}
          cities={cities}
          developers={developers}
          onClose={() => setEditing(null)}
          onSaved={(t) => {
            setTopics((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...t } : x)))
            setEditing(null)
          }}
        />
      )}
    </>
  )
}
