'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, ChevronDown, Building2, Plus } from 'lucide-react'

export type DeveloperValue = {
  slug: string | null   // null = custom / not in list
  name: string
}

type Developer = { id: string; name: string; slug: string }

interface DeveloperPickerProps {
  developers: Developer[]
  value: DeveloperValue | null
  onChange: (val: DeveloperValue | null) => void
  error?: string
}

// Rules for custom developer name
const CUSTOM_NAME_MIN = 2
const CUSTOM_NAME_MAX = 100
const CUSTOM_NAME_REGEX = /^[a-zA-Z0-9\s\-\.&()']+$/

function validateCustomName(raw: string): string {
  const v = raw.trim()
  if (v.length === 0) return ''
  if (v.length < CUSTOM_NAME_MIN) return `Minimum ${CUSTOM_NAME_MIN} characters required`
  if (v.length > CUSTOM_NAME_MAX) return `Maximum ${CUSTOM_NAME_MAX} characters allowed`
  if (!CUSTOM_NAME_REGEX.test(v)) return "Only letters, numbers, spaces, hyphens ( - ), dots ( . ), ampersands ( & ) and brackets allowed"
  return ''
}

export function DeveloperPicker({ developers, value, onChange, error }: DeveloperPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customError, setCustomError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const customInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // Focus custom input when it appears
  useEffect(() => {
    if (showCustom) customInputRef.current?.focus()
  }, [showCustom])

  const filtered = search.trim()
    ? developers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : developers

  function selectExisting(dev: Developer) {
    onChange({ slug: dev.slug, name: dev.name })
    setShowCustom(false)
    setCustomName('')
    setCustomError('')
    setSearch('')
    setOpen(false)
  }

  function selectOther() {
    setShowCustom(true)
    setSearch('')
    setOpen(false)
    onChange(null) // cleared until a valid custom name is typed
  }

  function clearAll() {
    onChange(null)
    setShowCustom(false)
    setCustomName('')
    setCustomError('')
    setSearch('')
  }

  const handleCustomChange = useCallback((raw: string) => {
    // Hard-stop at max length
    if (raw.length > CUSTOM_NAME_MAX) return
    setCustomName(raw)
    const err = validateCustomName(raw)
    setCustomError(err)
    if (!err && raw.trim().length >= CUSTOM_NAME_MIN) {
      onChange({ slug: null, name: raw.trim() })
    } else {
      onChange(null)
    }
  }, [onChange])

  // What to show in the trigger button
  const triggerLabel = showCustom
    ? 'Other / Not listed'
    : value
    ? value.name
    : 'Search or select a developer…'

  const hasSelection = !!(value || showCustom)

  return (
    <div className="space-y-2.5">
      <div ref={containerRef} className="relative">
        {/* ── Trigger ── */}
        <button
          type="button"
          onClick={() => { if (!showCustom) setOpen((o) => !o) }}
          className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors text-left ${
            open
              ? 'border-saffron-400 ring-2 ring-saffron-100'
              : error
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-neutral-300 hover:border-neutral-400'
          } ${showCustom ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Building2 className={`h-4 w-4 shrink-0 ${value ? 'text-saffron-500' : 'text-neutral-400'}`} />
            <span className={`truncate ${value || showCustom ? 'text-neutral-800 font-medium' : 'text-neutral-400'}`}>
              {triggerLabel}
            </span>
          </span>
          <span className="flex items-center gap-1 shrink-0 ml-2">
            {hasSelection && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); clearAll() }}
                onKeyDown={(e) => e.key === 'Enter' && clearAll()}
                className="p-0.5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                title="Clear developer"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            {!showCustom && (
              <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
            )}
          </span>
        </button>

        {/* ── Dropdown ── */}
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-2xl overflow-hidden">
            {/* Search bar */}
            <div className="p-2 border-b border-neutral-100">
              <label className="flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2">
                <Search className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type to search 46 developers…"
                  className="flex-1 bg-transparent text-sm outline-none text-neutral-800 placeholder:text-neutral-400"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </label>
            </div>

            {/* Developer list */}
            <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
              {filtered.length > 0 ? (
                filtered.map((dev) => (
                  <li key={dev.id} role="option">
                    <button
                      type="button"
                      onClick={() => selectExisting(dev)}
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-saffron-50 hover:text-saffron-700 transition-colors"
                    >
                      {dev.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-sm text-neutral-400 text-center">
                  No developer matches &ldquo;{search}&rdquo;
                </li>
              )}
            </ul>

            {/* Other option */}
            <div className="border-t border-neutral-100 p-1.5">
              <button
                type="button"
                onClick={selectOther}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-saffron-600 hover:bg-saffron-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Other / Not listed — enter manually
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Custom name input (shown when "Other" is chosen) ── */}
      {showCustom && (
        <div className="rounded-xl border border-saffron-200 bg-saffron-50/50 p-4 space-y-2">
          <p className="text-xs font-semibold text-saffron-700 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Enter developer / builder name
          </p>

          <div className="relative">
            <input
              ref={customInputRef}
              type="text"
              value={customName}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. Kumar Builders, Sharma Constructions…"
              maxLength={CUSTOM_NAME_MAX}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm pr-14 transition-colors focus:outline-none focus:ring-2 ${
                customError
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : customName.trim().length >= CUSTOM_NAME_MIN
                  ? 'border-green-400 focus:ring-green-100 focus:border-green-500'
                  : 'border-neutral-300 focus:ring-saffron-100 focus:border-saffron-400'
              }`}
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums ${
              customName.length >= CUSTOM_NAME_MAX - 10 ? 'text-red-500' : 'text-neutral-400'
            }`}>
              {customName.length}/{CUSTOM_NAME_MAX}
            </span>
          </div>

          {customError ? (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <X className="h-3 w-3 shrink-0" /> {customError}
            </p>
          ) : customName.trim().length >= CUSTOM_NAME_MIN ? (
            <p className="text-xs text-green-700 font-medium">
              ✓ &ldquo;{customName.trim()}&rdquo; will be saved with this post
            </p>
          ) : (
            <p className="text-xs text-neutral-500">
              {CUSTOM_NAME_MIN}–{CUSTOM_NAME_MAX} characters · letters, numbers, spaces, hyphens, dots &amp; brackets only
            </p>
          )}
        </div>
      )}

      {/* Field-level error from parent form */}
      {error && !showCustom && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
