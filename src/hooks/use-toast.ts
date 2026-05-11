'use client'

import { useState, useCallback } from 'react'

type ToastVariant = 'default' | 'destructive'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

let toastState: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

function notify() {
  listeners.forEach((l) => l([...toastState]))
}

export function toast({ title, description, variant = 'default' }: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2)
  toastState = [...toastState, { id, title, description, variant }]
  notify()
  setTimeout(() => {
    toastState = toastState.filter((t) => t.id !== id)
    notify()
  }, 4000)
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastState)

  const subscribe = useCallback((listener: (t: Toast[]) => void) => {
    listeners.push(listener)
    return () => { listeners = listeners.filter((l) => l !== listener) }
  }, [])

  useState(() => {
    const unsub = subscribe(setToasts)
    return unsub
  })

  const dismiss = useCallback((id: string) => {
    toastState = toastState.filter((t) => t.id !== id)
    notify()
  }, [])

  return { toasts, dismiss, toast }
}
