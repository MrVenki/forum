import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-saffron-50 flex flex-col">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron-500">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-navy-500">
            India<span className="text-saffron-500">Property</span>Talk
          </span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </div>
  )
}
