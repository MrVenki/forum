'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-navy-500">Something went wrong</h1>
      <p className="mt-2 text-neutral-500 max-w-sm">An unexpected error occurred. Please try again.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </div>
  )
}
