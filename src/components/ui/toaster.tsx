'use client'

import * as React from 'react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'relative flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all animate-slide-up',
            toast.variant === 'destructive'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-neutral-200 bg-white text-neutral-900'
          )}
        >
          <div className="flex-1">
            {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
            {toast.description && <p className="text-sm text-neutral-600 mt-0.5">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 rounded-md p-0.5 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
