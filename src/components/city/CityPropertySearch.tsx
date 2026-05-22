'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Search, X, Star, Home } from 'lucide-react'

interface TopicItem {
  slug: string
  propertyName: string
  propertyType: string
  avgRating: number
  ratingCount: number
}

interface Props {
  topics: TopicItem[]
  citySlug: string
  cityName: string
}

export function CityPropertySearch({ topics, citySlug, cityName }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return topics
      .filter((t) => t.propertyName.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, topics])

  const totalMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return 0
    return topics.filter((t) => t.propertyName.toLowerCase().includes(q)).length
  }, [query, topics])

  const showDropdown = open && query.trim().length > 0

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={`Search properties in ${cityName}…`}
          className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-10 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent shadow-sm transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div
          className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filtered.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3.5 text-sm text-neutral-400">
              <Search className="h-4 w-4 opacity-50 shrink-0" />
              No properties found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul role="listbox">
              {filtered.map((t) => (
                <li key={t.slug} role="option">
                  <Link
                    href={`/${citySlug}/${t.slug}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-saffron-50 transition-colors group border-b border-neutral-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Home className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
                      <span className="text-sm font-medium text-navy-500 group-hover:text-saffron-600 transition-colors truncate">
                        <HighlightText text={t.propertyName} query={query} />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs text-neutral-400 hidden sm:block capitalize">
                        {t.propertyType.charAt(0) + t.propertyType.slice(1).toLowerCase()}
                      </span>
                      {t.avgRating > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-semibold text-saffron-600">
                          <Star className="h-3 w-3 fill-saffron-400 text-saffron-400" />
                          {t.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
              {totalMatches > 8 && (
                <li className="px-4 py-2 text-xs text-neutral-400 bg-neutral-50 border-t border-neutral-100">
                  Showing 8 of {totalMatches} matches — keep typing to narrow down
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-saffron-100 text-saffron-800 rounded px-0.5 not-italic font-medium">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}
