'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BookOpen, HelpCircle, Info } from 'lucide-react'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { SignInDialog } from '@/components/auth/SignInDialog'
import { COMMUNITY_CATEGORIES, type PostKind } from '@/lib/community'
import { cn } from '@/lib/utils/cn'
import { toast } from '@/hooks/use-toast'

interface Props {
  cities: { slug: string; name: string }[]
  initialCity?: string
  initialKind?: PostKind
}

interface Draft {
  kind: PostKind
  title: string
  body: string
  category: string
  citySlug: string
}

interface Similar {
  title: string
  slug: string
  kind: PostKind
  replyCount: number
}

const DRAFT_KEY = 'ipt_community_draft'

export function AskForm({ cities, initialCity = '', initialKind = 'QUESTION' }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [draft, setDraft] = useState<Draft>({ kind: initialKind, title: '', body: '', category: '', citySlug: initialCity })
  const [similar, setSimilar] = useState<Similar[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [cfToken, setCfToken] = useState('')
  const [signInOpen, setSignInOpen] = useState(false)
  const isExp = draft.kind === 'EXPERIENCE'

  // Restore a saved draft (for example after Google sign-in left the page)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) setDraft((d) => ({ ...d, ...(JSON.parse(saved) as Partial<Draft>) }))
    } catch {
      // storage blocked: start empty
    }
  }, [])

  useEffect(() => {
    try {
      if (draft.title || draft.body) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      // storage blocked: the draft just isn't kept
    }
  }, [draft])

  // Similar questions while typing a question title
  useEffect(() => {
    if (isExp || draft.title.trim().length < 12) {
      setSimilar([])
      return
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/community/posts?q=${encodeURIComponent(draft.title.trim())}`).catch(() => null)
      const data = res?.ok ? await res.json() : { posts: [] }
      setSimilar(data.posts ?? [])
    }, 400)
    return () => clearTimeout(t)
  }, [draft.title, isExp])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    setError('')
    if (draft.title.trim().length < 15) return setError('The title needs at least 15 characters.')
    if (!draft.category) return setError('Pick a topic.')
    if (isExp && draft.body.trim().length < 30) return setError('Tell members a little more about what happened (at least 30 characters).')
    if (!session) return setSignInOpen(true)

    setBusy(true)
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, citySlug: draft.citySlug || null, cfToken }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        // ignore
      }
      toast({ title: isExp ? 'Your experience is posted' : 'Your question is posted' })
      router.push(`/community/${data.slug}`)
      return
    }
    setBusy(false)
    setError(data.error || 'Could not post. Please try again.')
  }

  const typeCard = (kind: PostKind, Icon: typeof HelpCircle, title: string, sub: string) => {
    const on = draft.kind === kind
    return (
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={() => set('kind', kind)}
        className={cn(
          'flex-1 rounded-xl border p-3 text-left transition-colors',
          on ? 'border-saffron-500 bg-saffron-50 ring-2 ring-saffron-500/20' : 'border-neutral-300 bg-white hover:bg-neutral-50',
        )}
      >
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-saffron-600" />
          <span className={cn('h-4 w-4 rounded-full bg-white', on ? 'border-[5px] border-saffron-500' : 'border-2 border-neutral-300')} />
        </div>
        <p className="mt-2 text-sm font-bold text-navy-500">{title}</p>
        <p className="text-xs text-neutral-500">{sub}</p>
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="card-base mt-5 space-y-5 p-6" noValidate>
      <div>
        <p className="mb-1.5 block text-sm font-semibold text-neutral-800" id="kind-label">What are you posting?</p>
        <div className="flex gap-2" role="radiogroup" aria-labelledby="kind-label">
          {typeCard('QUESTION', HelpCircle, 'Question', 'Ask something')}
          {typeCard('EXPERIENCE', BookOpen, 'Experience', 'Share what happened to you')}
        </div>
      </div>

      <div>
        <label htmlFor="post-title" className="mb-1.5 block text-sm font-semibold text-neutral-800">{isExp ? 'Title' : 'Your question'}</label>
        <input
          id="post-title"
          className="input-field"
          value={draft.title}
          maxLength={150}
          onChange={(e) => set('title', e.target.value)}
          placeholder={isExp ? 'e.g. Our flat registration took 3 visits: what we learned' : 'e.g. Which builders in Hyderabad deliver on time?'}
        />
        <p className="mt-1 text-xs text-neutral-500">
          {isExp ? 'Sum up what happened in one line.' : 'Write it the way you would search for it.'} 15 to 150 characters.
        </p>
      </div>

      {!isExp && similar.length > 0 && (
        <div className="rounded-lg border border-teal/30 bg-teal-light/60 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-dark">Already asked? Similar questions</p>
          <ul className="space-y-2">
            {similar.map((s) => (
              <li key={s.slug}>
                <Link href={`/community/${s.slug}`} className="flex items-start gap-2 text-sm font-medium text-navy-500 hover:underline">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>
                    {s.title} <span className="font-normal text-neutral-400">· {s.replyCount} {s.replyCount === 1 ? 'reply' : 'replies'}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-1.5 block text-sm font-semibold text-neutral-800" id="topic-label">Topic</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="topic-label">
          {COMMUNITY_CATEGORIES.map((c) => {
            const on = draft.category === c.slug
            return (
              <button
                key={c.slug}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set('category', c.slug)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  on ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
                )}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label htmlFor="post-city" className="mb-1.5 block text-sm font-semibold text-neutral-800">
          City <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <select id="post-city" className="input-field" value={draft.citySlug} onChange={(e) => set('citySlug', e.target.value)}>
          <option value="">All India / not about one city</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="post-body" className="mb-1.5 block text-sm font-semibold text-neutral-800">
          {isExp ? 'Your experience' : <>More details <span className="font-normal text-neutral-400">(optional)</span></>}
        </label>
        <textarea
          id="post-body"
          className="input-field min-h-[130px]"
          value={draft.body}
          maxLength={5000}
          onChange={(e) => set('body', e.target.value)}
          placeholder={isExp ? 'What happened, and what would you tell someone in the same spot?' : 'Budget, area, what you have already checked…'}
        />
      </div>

      <div className="flex items-start gap-2 text-xs text-neutral-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>No phone numbers or agent links. Builders and agents must say so if they answer about their own projects.</span>
      </div>

      <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />

      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Link href="/community" className="btn-secondary">Cancel</Link>
        <button type="submit" className="btn-primary px-8" disabled={busy}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>

      <SignInDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={() => {
          setSignInOpen(false)
          toast({ title: 'Signed in. Press Post to publish.' })
        }}
        callbackUrl="/community/ask"
        title="Sign in to post"
        subtitle="Your post is saved. You will come straight back to it."
      />
    </form>
  )
}
