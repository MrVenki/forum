'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface User {
  username: string
  name: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  className?: string
  disabled?: boolean
}

export function MentionTextarea({ value, onChange, placeholder, rows = 3, maxLength, className, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const [suggestions, setSuggestions] = useState<User[]>([])
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionStart, setMentionStart] = useState<number>(-1)
  const [activeIdx, setActiveIdx] = useState(0)
  const [open, setOpen] = useState(false)

  /** Detect whether cursor is inside an @mention and return the query string */
  function detectMention(text: string, cursor: number): { query: string; start: number } | null {
    // Walk backwards from cursor to find the most recent '@'
    let i = cursor - 1
    while (i >= 0) {
      const ch = text[i]
      if (ch === '@') {
        const query = text.slice(i + 1, cursor)
        // Only trigger if the query is valid username chars (no spaces, no @)
        if (/^[a-z0-9]*$/i.test(query) && query.length <= 19) {
          return { query: query.toLowerCase(), start: i }
        }
        return null
      }
      // Stop if we hit whitespace — @mention must be uninterrupted
      if (/\s/.test(ch)) return null
      i--
    }
    return null
  }

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q) {
      // Show recent / popular users on bare '@' — just show empty or skip
      setSuggestions([])
      setOpen(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`)
        const data: User[] = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
        setActiveIdx(0)
      } catch {
        setSuggestions([])
        setOpen(false)
      }
    }, 200)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    onChange(text)

    const cursor = e.target.selectionStart ?? text.length
    const mention = detectMention(text, cursor)

    if (mention) {
      setMentionQuery(mention.query)
      setMentionStart(mention.start)
      fetchSuggestions(mention.query)
    } else {
      closeSuggestions()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (open && suggestions[activeIdx]) {
        e.preventDefault()
        insertMention(suggestions[activeIdx].username)
      }
    } else if (e.key === 'Escape') {
      closeSuggestions()
    }
  }

  function insertMention(username: string) {
    const ta = textareaRef.current
    if (!ta) return

    const cursor = ta.selectionStart ?? value.length
    const before = value.slice(0, mentionStart) // everything before the '@'
    const after = value.slice(cursor)           // everything after the current cursor

    const inserted = `@${username} `
    const newValue = before + inserted + after
    onChange(newValue)

    // Move cursor to end of inserted mention
    const newCursor = before.length + inserted.length
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(newCursor, newCursor)
    })

    closeSuggestions()
  }

  function closeSuggestions() {
    clearTimeout(debounceRef.current)
    setOpen(false)
    setSuggestions([])
    setMentionQuery(null)
    setMentionStart(-1)
  }

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (textareaRef.current && !textareaRef.current.closest('[data-mention-root]')?.contains(e.target as Node)) {
        closeSuggestions()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" data-mention-root>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Delay so click on suggestion registers first
          setTimeout(closeSuggestions, 150)
        }}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          className,
        )}
      />

      {/* Mention dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="px-3 py-1.5 border-b border-neutral-100 flex items-center gap-1">
            <span className="text-xs text-neutral-400 font-medium">
              Mention{mentionQuery ? ` matching "@${mentionQuery}"` : ''}
            </span>
          </div>
          <ul>
            {suggestions.map((user, idx) => (
              <li key={user.username}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); insertMention(user.username) }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    idx === activeIdx ? 'bg-saffron-50' : 'hover:bg-neutral-50',
                  )}
                >
                  <div className="h-7 w-7 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 font-bold text-xs shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-500">@{user.username}</p>
                    <p className="text-xs text-neutral-400 truncate">{user.name}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
