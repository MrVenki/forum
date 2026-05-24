'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { Home, Building2, PlusCircle, LogIn, LogOut, User, Menu, X, Search, ChevronDown, Shield, Bookmark, Calculator, IndianRupee, FileText, TrendingUp } from 'lucide-react'
import { METRO_CITIES, TIER1_CITIES } from '@/lib/constants/cities'
import { cn } from '@/lib/utils/cn'

export function Header({ newTopicEnabled = false }: { newTopicEnabled?: boolean }) {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="container-forum">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo-icon.svg" alt="IndiaPropertyTalk logo" width={36} height={36} priority />
            <span className="font-heading text-xl font-bold text-navy-500">
              India<span className="text-saffron-500">Property</span>Talk
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="primary" className="hidden md:flex items-center gap-1">
            <Link href="/" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
              <Home className="h-4 w-4" /> Home
            </Link>

            {/* Cities Dropdown */}
            <div className="relative" onMouseLeave={() => setCitiesOpen(false)}>
              <button
                onMouseEnter={() => setCitiesOpen(true)}
                onClick={() => setCitiesOpen(!citiesOpen)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <Building2 className="h-4 w-4" /> Cities <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {citiesOpen && (
                <div className="absolute left-0 top-full mt-1 w-[520px] rounded-xl border border-neutral-200 bg-white p-4 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-saffron-500">Metro Cities</p>
                      <ul className="space-y-0.5">
                        {METRO_CITIES.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/${c.slug}`} onClick={() => setCitiesOpen(false)} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-saffron-50 hover:text-saffron-700 transition-colors">
                              <span>{c.name}</span>
                              <span className="text-xs text-neutral-400">{c.state}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-teal">Tier 1 Cities</p>
                      <ul className="space-y-0.5 columns-2">
                        {TIER1_CITIES.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/${c.slug}`} onClick={() => setCitiesOpen(false)} className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-teal-light hover:text-teal-dark transition-colors">
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-neutral-100 pt-3">
                    <Link href="/cities" onClick={() => setCitiesOpen(false)} className="text-sm font-medium text-saffron-500 hover:text-saffron-600 transition-colors">
                      View all cities →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
              <button
                onMouseEnter={() => setToolsOpen(true)}
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <Calculator className="h-4 w-4" /> Tools <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {toolsOpen && (
                <div className="absolute left-0 top-full mt-1 w-80 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
                  <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-neutral-400">Calculators</p>
                  {[
                    { href: '/tools/emi-calculator', Icon: IndianRupee, label: 'EMI Calculator', desc: 'EMI, affordability & double-burden', bg: 'bg-saffron-100', color: 'text-saffron-600', hover: 'hover:bg-saffron-50' },
                    { href: '/tools/stamp-duty-calculator', Icon: FileText, label: 'Stamp Duty Calculator', desc: '13 states — incl. women concessions', bg: 'bg-teal-100', color: 'text-teal-600', hover: 'hover:bg-teal-50' },
                    { href: '/tools/home-loan-eligibility', Icon: TrendingUp, label: 'Loan Eligibility', desc: 'How much loan can you get?', bg: 'bg-emerald-100', color: 'text-emerald-600', hover: 'hover:bg-emerald-50' },
                    { href: '/tools/rent-vs-buy', Icon: Home, label: 'Rent vs Buy', desc: 'True long-term cost comparison', bg: 'bg-blue-100', color: 'text-blue-600', hover: 'hover:bg-blue-50' },
                  ].map(({ href, Icon, label, desc, bg, color, hover }) => (
                    <Link key={href} href={href} onClick={() => setToolsOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-2 py-2 ${hover} transition-colors group`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-500 group-hover:text-saffron-600 transition-colors">{label}</p>
                        <p className="text-xs text-neutral-400 leading-snug">{desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-neutral-100 pt-2">
                    <Link href="/tools" onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-saffron-500 hover:text-saffron-600 transition-colors">
                      View all tools →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/search" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
              <Search className="h-4 w-4" /> Search
            </Link>
            <Link href="/developers" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
              <Building2 className="h-4 w-4" /> Developers
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                {newTopicEnabled && (
                  <Link href="/new-topic" className="btn-primary text-sm">
                    <PlusCircle className="h-4 w-4" /> New Topic
                  </Link>
                )}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors ${userMenuOpen ? 'bg-neutral-100' : ''}`}
                  >
                    <div className="h-7 w-7 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 text-xs font-bold">
                      {(session.user.username ?? session.user.name)?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">
                      {session.user.username ? `@${session.user.username}` : session.user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg z-50">
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <Link href="/profile/watchlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <Bookmark className="h-4 w-4" /> Watchlist
                      </Link>
                      {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-saffron-600 hover:bg-saffron-50 transition-colors font-medium">
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="my-1 border-t border-neutral-100" />
                      <button onClick={() => signOut()} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="container-forum py-4 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link href="/cities" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
              <Building2 className="h-4 w-4" /> All Cities
            </Link>
            <Link href="/search" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
              <Search className="h-4 w-4" /> Search
            </Link>
            <Link href="/tools" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
              <Calculator className="h-4 w-4" /> Tools & Calculators
            </Link>
            <Link href="/tools/emi-calculator" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 pl-8">
              <IndianRupee className="h-4 w-4" /> EMI Calculator
            </Link>
            <Link href="/tools/stamp-duty-calculator" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 pl-8">
              <FileText className="h-4 w-4" /> Stamp Duty Calculator
            </Link>
            <Link href="/tools/home-loan-eligibility" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 pl-8">
              <TrendingUp className="h-4 w-4" /> Loan Eligibility
            </Link>
            <Link href="/tools/rent-vs-buy" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 pl-8">
              <Home className="h-4 w-4" /> Rent vs Buy
            </Link>
            <div className="pt-2 border-t border-neutral-100">
              {session ? (
                <>
                  {newTopicEnabled && (
                    <Link href="/new-topic" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-saffron-600 hover:bg-saffron-50">
                      <PlusCircle className="h-4 w-4" /> New Topic
                    </Link>
                  )}
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-saffron-600 hover:bg-saffron-50">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileOpen(false) }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">Sign In</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
