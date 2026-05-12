import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
  preserveParams?: Record<string, string>
}

export function Pagination({ page, totalPages, basePath, preserveParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const makeHref = (p: number) => {
    const entries = Object.entries({ ...preserveParams, page: String(p) }).filter(([, v]) => v !== '')
    const qs = new URLSearchParams(entries).toString()
    return `${basePath}?${qs}`
  }

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {page > 1 && (
        <Link href={makeHref(page - 1)} rel="prev" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-saffron-50 hover:text-saffron-500 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-neutral-400">…</span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              p === page
                ? 'bg-saffron-500 text-white shadow-sm pointer-events-none'
                : 'border border-neutral-200 text-neutral-600 hover:bg-saffron-50 hover:text-saffron-500'
            )}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages && (
        <Link href={makeHref(page + 1)} rel="next" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-saffron-50 hover:text-saffron-500 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  )
}
