'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function SearchForm({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = (new FormData(e.currentTarget).get('q') as string).trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            name="q"
            defaultValue={defaultValue}
            placeholder="Search properties, cities, projects…"
            className="input-field pl-10"
            autoFocus={!defaultValue}
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </div>
    </form>
  )
}
