'use client'

import { useState } from 'react'
import { Share2, Check, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ShareButtonProps {
  title: string
  text: string
  url: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  async function handleShare() {
    if (typeof navigator === 'undefined') return

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // user dismissed the share sheet — do nothing
      }
      return
    }

    // Desktop fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      // clipboard blocked — final fallback
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    }
  }

  return (
    <button
      onClick={handleShare}
      title="Share this property"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm focus:outline-none',
        state === 'copied'
          ? 'bg-emerald-500 text-white'
          : 'border border-neutral-200 bg-white text-neutral-600 hover:border-saffron-300 hover:text-saffron-700',
      )}
    >
      {state === 'copied' ? (
        <><Check className="h-3.5 w-3.5" /> Copied!</>
      ) : (
        <><Share2 className="h-3.5 w-3.5" /> Share</>
      )}
    </button>
  )
}
