'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  name: string
  city: string
  path: string
  reviewCount: number
  texts: { whatsapp: string; redditTitle: string; reddit: string; quora: string }
}

const BLOCKS: { key: 'whatsapp' | 'reddit' | 'quora'; label: string }[] = [
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'reddit', label: 'Reddit' },
  { key: 'quora', label: 'Quora answer' },
]

export function ShareKitCard({ name, city, path, reviewCount, texts }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    } catch {}
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Link href={path} target="_blank" className="font-heading font-bold text-navy-500 hover:text-saffron-600">{name}</Link>
        <span className="text-xs text-neutral-500">{city} · {reviewCount ? `${reviewCount} member ratings and comments` : 'no member reviews yet'}</span>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {BLOCKS.map((b) => {
          const value = b.key === 'reddit' ? `${texts.redditTitle}\n\n${texts.reddit}` : texts[b.key]
          return (
            <div key={b.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{b.label}</span>
                <button type="button" onClick={() => copy(b.key, value)} className="text-xs font-semibold text-saffron-600 hover:underline">
                  {copied === b.key ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea readOnly value={value} rows={9} className="w-full resize-y rounded-lg border border-neutral-200 bg-neutral-50 p-2 font-mono text-[11px] leading-relaxed text-neutral-700" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
