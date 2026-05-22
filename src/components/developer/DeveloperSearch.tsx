'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Search, X, MapPin, Calendar, Home, Star, Building2 } from 'lucide-react'
import { StarRating } from '@/components/rating/StarRating'

interface DeveloperRow {
  developer: {
    slug: string
    name: string
    hq: string | null
    foundedYear: number | null
    totalDelivered: string | null
  }
  avg: number
  projects: number
  ratings: number
}

interface Props {
  rows: DeveloperRow[]
}

export function DeveloperSearch({ rows }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      ({ developer }) =>
        developer.name.toLowerCase().includes(q) ||
        developer.hq?.toLowerCase().includes(q)
    )
  }, [query, rows])

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search developers by name or city…"
          className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-10 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent shadow-sm transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Result count when filtering */}
      {query && (
        <p className="text-sm text-neutral-500 mb-4">
          {filtered.length === 0
            ? `No developers found for "${query}"`
            : `${filtered.length} developer${filtered.length !== 1 ? 's' : ''} matching "${query}"`}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No developers found</p>
          <p className="text-sm mt-1">Try a different name or city</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(({ developer, avg, projects, ratings }) => (
            <Link
              key={developer.slug}
              href={`/developer/${developer.slug}`}
              className="card-base p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 font-heading font-bold text-xl shrink-0">
                  {developer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading font-bold text-navy-500 group-hover:text-saffron-600 transition-colors leading-tight">
                    {/* Highlight matching text */}
                    <HighlightText text={developer.name} query={query} />
                  </h2>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-neutral-400 flex-wrap">
                    {developer.hq && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <HighlightText text={developer.hq} query={query} />
                      </span>
                    )}
                    {developer.foundedYear && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Est. {developer.foundedYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-navy-500">{avg > 0 ? avg.toFixed(1) : '–'}</span>
                <div>
                  <StarRating value={avg} readonly size="sm" showCount={false} />
                  <p className="text-xs text-neutral-400 mt-0.5">{ratings} rating{ratings !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 text-center">
                <div>
                  <p className="font-bold text-lg text-saffron-500">{projects}</p>
                  <p className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                    <Home className="h-3 w-3" /> Project{projects !== 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-lg text-saffron-500">{ratings}</p>
                  <p className="text-xs text-neutral-400 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3" /> Ratings
                  </p>
                </div>
              </div>

              {developer.totalDelivered && (
                <p className="text-xs text-neutral-500 border-t border-neutral-100 pt-3 line-clamp-1">
                  <Building2 className="h-3 w-3 inline mr-1 text-neutral-400" />
                  {developer.totalDelivered}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/** Highlights the matching substring in text */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.trim().toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-saffron-100 text-saffron-800 rounded px-0.5 not-italic">
        {text.slice(idx, idx + query.trim().length)}
      </mark>
      {text.slice(idx + query.trim().length)}
    </>
  )
}
