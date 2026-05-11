import Link from 'next/link'
import { Building2, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-100 mb-6">
        <Building2 className="h-8 w-8 text-saffron-500" />
      </div>
      <h1 className="font-heading text-5xl font-bold text-navy-500">404</h1>
      <h2 className="font-heading text-xl font-bold text-navy-400 mt-2">Page Not Found</h2>
      <p className="mt-3 text-neutral-500 max-w-sm">
        The property discussion or page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <Link href="/cities" className="btn-secondary">
          Browse Cities
        </Link>
      </div>
    </div>
  )
}
