'use client'

import type { ReactNode } from 'react'
import { Calendar, IndianRupee, MapPin, Pencil, Send, ShieldCheck, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const COMMENT_MAX_LENGTH = 5000

/** Bordered writing box with a pencil icon and a live character count. */
export function ComposerField({ length, children }: { length: number; children: ReactNode }) {
  return (
    <div className="relative rounded-xl border border-neutral-200 bg-white shadow-sm transition-colors focus-within:border-navy-300 focus-within:ring-2 focus-within:ring-navy-100">
      <Pencil className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-navy-500" aria-hidden="true" />
      {children}
      <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-neutral-400">
        {length}/{COMMENT_MAX_LENGTH}
      </span>
    </div>
  )
}

/** Classes for the textarea inside ComposerField. */
export const composerTextareaClass =
  'min-h-[112px] w-full resize-y rounded-xl border-0 bg-transparent pb-7 pl-12 pr-4 pt-3.5 text-[15px] leading-relaxed shadow-none placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'

const DETAILS: { label: string; starter: string; Icon: LucideIcon }[] = [
  { label: 'Price', starter: 'Price: ', Icon: IndianRupee },
  { label: 'Possession date', starter: 'Possession date: ', Icon: Calendar },
  { label: 'Location', starter: 'Location: ', Icon: MapPin },
  { label: 'Builder track record', starter: 'Builder track record: ', Icon: TrendingUp },
]

/** Appends a labelled line ("Price: ") to the draft so people know what to write about. */
export function addStarter(draft: string, starter: string): string {
  return draft ? `${draft.replace(/\s+$/, '')}\n${starter}` : starter
}

export function DetailStarters({ onAdd }: { onAdd: (starter: string) => void }) {
  return (
    <div>
      <p className="text-sm font-semibold text-navy-500">
        Add more details <span className="font-normal text-neutral-500">(optional)</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {DETAILS.map(({ label, starter, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onAdd(starter)}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
          >
            <Icon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Privacy note on the left, the orange Post button on the right. */
export function ComposerFooter({
  label = 'Post comment',
  busy = false,
  disabled = false,
  type = 'submit',
  onClick,
}: {
  label?: string
  busy?: boolean
  disabled?: boolean
  type?: 'submit' | 'button'
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-xs leading-snug text-neutral-500">
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
        <span>Posts under your username. Your email is never shown or shared with builders or agents.</span>
      </p>
      <button
        type={type}
        onClick={onClick}
        disabled={busy || disabled}
        className={cn(
          'inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-saffron-500 px-5 py-3 sm:w-auto text-sm font-bold text-white shadow-sm transition-colors hover:bg-saffron-600 disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {busy ? 'Posting…' : label}
      </button>
    </div>
  )
}
