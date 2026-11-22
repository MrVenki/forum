'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Building2, PlusCircle, Search, Star } from 'lucide-react'

interface Result {
  id: string
  slug: string
  propertyName: string
  address: string | null
  avgRating: string | number
  ratingCount: number
  city: { name: string; slug: string }
}

/** Find a project to review. Each result opens the project's review form. */
export function ReviewProjectSearch({ canAddProject }: { canAddProject: boolean }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        const data = res.ok ? await res.json() : { topics: [] }
        const lower = term.toLowerCase()
        // Projects whose name matches come before ones that only mention the words
        const sorted = [...(data.topics as Result[])].sort(
          (a, b) => Number(b.propertyName.toLowerCase().includes(lower)) - Number(a.propertyName.toLowerCase().includes(lower)),
        )
        setResults(sorted.slice(0, 8))
        setSearched(true)
      } catch {
        // aborted or offline: keep the previous results
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q])

  return (
    <div className="card-base mt-5 p-6">
      <label htmlFor="project-search" className="sr-only">Project name</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input
          id="project-search"
          ref={inputRef}
          type="search"
          className="input-field pl-10"
          placeholder="Project name, builder or area"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-3 overflow-hidden rounded-lg border border-neutral-200">
          {results.map((r, i) => {
            const rating = Number(r.avgRating)
            return (
              <li key={r.id} className={i ? 'border-t border-neutral-100' : ''}>
                <Link href={`/${r.city.slug}/${r.slug}#rate`} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-100"><Building2 className="h-5 w-5 text-navy-500" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-navy-500">{r.propertyName}</span>
                    <span className="flex flex-wrap items-center gap-x-1 text-xs text-neutral-500">
                      <span className="truncate">{r.address ? `${r.address.split(',')[0]}, ` : ''}{r.city.name}</span>
                      {r.ratingCount > 0 && (
                        <span className="inline-flex items-center gap-0.5">· <Star className="h-3 w-3 fill-gold text-gold" /> {rating.toFixed(1)} · {r.ratingCount} review{r.ratingCount === 1 ? '' : 's'}</span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-saffron-600">Review →</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="mt-3 text-sm text-neutral-500">No project matches “{q.trim()}”. Check the spelling, or add it below.</p>
      )}
      {!searched && <p className="mt-2 text-xs text-neutral-500">Type at least 2 letters.</p>}

      {canAddProject && (
        <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-neutral-800">Not listed yet?</p>
            <p className="text-xs text-neutral-500">Add the project and be its first reviewer.</p>
          </div>
          <Link href="/new-topic" className="btn-secondary"><PlusCircle className="h-4 w-4" /> Add a new project</Link>
        </div>
      )}
    </div>
  )
}
