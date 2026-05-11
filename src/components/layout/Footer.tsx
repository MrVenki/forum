import Link from 'next/link'
import { Building2, MapPin, Mail } from 'lucide-react'
import { METRO_CITIES, TIER1_CITIES } from '@/lib/constants/cities'
import { SITE_CONFIG } from '@/lib/constants/config'

export function Footer() {
  return (
    <footer className="bg-navy-500 text-white">
      <div className="container-forum py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron-500">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">
                India<span className="text-saffron-400">Property</span>Talk
              </span>
            </Link>
            <p className="mt-3 text-sm text-navy-200 leading-relaxed">
              India&apos;s most trusted property discussion forum. Honest reviews and real conversations about real estate.
            </p>
          </div>

          {/* Metro Cities */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-saffron-400">Metro Cities</h3>
            <ul className="space-y-1.5">
              {METRO_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="flex items-center gap-1.5 text-sm text-navy-200 hover:text-white transition-colors"
                  >
                    <MapPin className="h-3 w-3 shrink-0" />
                    {city.name} Property Forum
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tier 1 Cities */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-teal-400">Tier 1 Cities</h3>
            <ul className="grid grid-cols-2 gap-1.5">
              {TIER1_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-navy-200 hover:text-white transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-300">Quick Links</h3>
            <ul className="space-y-1.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/cities', label: 'Browse All Cities' },
                { href: '/new-topic', label: 'Start a Discussion' },
                { href: '/search', label: 'Search Properties' },
                { href: '/register', label: 'Create Account' },
                { href: '/login', label: 'Sign In' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-400 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-300">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved. Made with ❤️ for India.
          </p>
          <p className="text-xs text-navy-400">
            Property information is user-generated. Always verify independently.
          </p>
        </div>
      </div>
    </footer>
  )
}
