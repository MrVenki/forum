'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Building2, Check, CornerDownRight, Flag, MessageSquare, Star, ThumbsUp } from 'lucide-react'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { SignInDialog } from '@/components/auth/SignInDialog'
import { ShareButton } from '@/components/topic/ShareButton'
import type { MentionedProject, PostKind } from '@/lib/community'
import { formatRelativeTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { toast } from '@/hooks/use-toast'

export interface ThreadReply {
  id: string
  parentId: string | null
  content: string
  helpfulCount: number
  createdAt: string
  user: { id: string; name: string | null; username: string | null }
  mentions: MentionedProject[]
  isMostHelpful: boolean
}

interface PostInfo {
  id: string
  kind: PostKind
  title: string
  url: string
  authorId: string
  helpfulCount: number
}

const handle = (u: ThreadReply['user']) => (u.username ? `@${u.username}` : u.name || 'Member')

/* ── Shared state: which items this member marked Helpful ─────────────────── */

function useVotes(postId: string) {
  const { status } = useSession()
  const [voted, setVoted] = useState<Set<string>>(new Set())
  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/community/vote?postId=${postId}`)
      .then((r) => (r.ok ? r.json() : { voted: [] }))
      .then((d) => setVoted(new Set(d.voted ?? [])))
      .catch(() => {})
  }, [status, postId])
  return [voted, setVoted] as const
}

function HelpfulButton({
  targetType,
  targetId,
  initialCount,
  voted,
  onVoted,
  onNeedSignIn,
  big = false,
}: {
  targetType: 'POST' | 'REPLY'
  targetId: string
  initialCount: number
  voted: boolean
  onVoted: (id: string, on: boolean) => void
  onNeedSignIn: () => void
  big?: boolean
}) {
  const { data: session } = useSession()
  const [count, setCount] = useState(initialCount)
  const [busy, setBusy] = useState(false)

  async function click() {
    if (!session) return onNeedSignIn()
    setBusy(true)
    const res = await fetch('/api/community/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType, targetId }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return toast({ title: data.error || 'Could not save your vote', variant: 'destructive' })
    setCount(data.helpfulCount)
    onVoted(targetId, data.voted)
  }

  if (big) {
    return (
      <button type="button" onClick={click} disabled={busy} aria-pressed={voted} className={cn('btn-secondary flex-1 sm:flex-none', voted && 'border-teal bg-teal-light text-teal-dark')}>
        <ThumbsUp className="h-4 w-4" /> Helpful · {count}
      </button>
    )
  }
  return (
    <button type="button" onClick={click} disabled={busy} aria-pressed={voted} className={cn('inline-flex items-center gap-1 hover:text-neutral-800', voted && 'font-semibold text-teal-dark')}>
      <ThumbsUp className="h-3.5 w-3.5" /> Helpful · {count}
    </button>
  )
}

const REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'promotion', label: 'Advertising or self-promotion' },
  { value: 'abusive', label: 'Abusive or personal attack' },
  { value: 'false', label: 'False or misleading' },
  { value: 'other', label: 'Something else' },
]

function ReportButton({ targetType, targetId, onNeedSignIn, label = 'Report' }: { targetType: 'POST' | 'REPLY'; targetId: string; onNeedSignIn: () => void; label?: string }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  async function report(reason: string) {
    setOpen(false)
    const res = await fetch('/api/community/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType, targetId, reason }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return toast({ title: data.error || 'Could not send the report', variant: 'destructive' })
    setDone(true)
    toast({ title: 'Thanks. A moderator will take a look.' })
  }

  if (done) return <span className="inline-flex items-center gap-1 text-neutral-400"><Flag className="h-3.5 w-3.5" /> Reported</span>
  return (
    <span className="relative">
      <button type="button" onClick={() => (session ? setOpen((v) => !v) : onNeedSignIn())} aria-expanded={open} className="inline-flex items-center gap-1 hover:text-neutral-800">
        <Flag className="h-3.5 w-3.5" /> {label}
      </button>
      {open && (
        <span className="absolute bottom-full right-0 z-20 mb-1 block w-56 rounded-lg border border-neutral-200 bg-white py-1 text-left shadow-lg">
          {REASONS.map((r) => (
            <button key={r.value} type="button" onClick={() => report(r.value)} className="block w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
              {r.label}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}

/* ── Composer ──────────────────────────────────────────────────────────────── */

function Composer({
  postId,
  parentId,
  label,
  placeholder,
  autoFocus,
  onPosted,
  onCancel,
  onNeedSignIn,
}: {
  postId: string
  parentId?: string
  label: string
  placeholder: string
  autoFocus?: boolean
  onPosted: (r: ThreadReply) => void
  onCancel?: () => void
  onNeedSignIn: () => void
}) {
  const { data: session } = useSession()
  const draftKey = `ipt_cdraft_${postId}_${parentId ?? 'top'}`
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [cfToken, setCfToken] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) setText(saved)
    } catch {
      // storage blocked
    }
    if (autoFocus) requestAnimationFrame(() => ref.current?.focus())
  }, [draftKey, autoFocus])

  function change(v: string) {
    setText(v)
    try {
      if (v) localStorage.setItem(draftKey, v)
      else localStorage.removeItem(draftKey)
    } catch {
      // storage blocked
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (text.trim().length < 10) return toast({ title: 'Write at least 10 characters', variant: 'destructive' })
    if (!session) return onNeedSignIn()
    setBusy(true)
    const res = await fetch(`/api/community/posts/${postId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text.trim(), parentId: parentId ?? null, cfToken }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return toast({ title: data.error || 'Could not post', variant: 'destructive' })
    change('')
    onPosted(data)
    toast({ title: 'Posted' })
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-800" htmlFor={`composer-${parentId ?? 'top'}`}>{label}</label>
      <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />
      <textarea
        id={`composer-${parentId ?? 'top'}`}
        ref={ref}
        value={text}
        onChange={(e) => change(e.target.value)}
        placeholder={placeholder}
        maxLength={5000}
        className="input-field min-h-[90px]"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary px-4 py-2">Cancel</button>
        )}
        <button type="submit" disabled={busy} className="btn-primary px-8">{busy ? 'Posting…' : 'Post'}</button>
      </div>
    </form>
  )
}

/* ── Post action bar (under the post) ─────────────────────────────────────── */

export function PostActions({ post }: { post: PostInfo }) {
  const [voted, setVoted] = useVotes(post.id)
  const [signInOpen, setSignInOpen] = useState(false)
  const isQ = post.kind === 'QUESTION'

  function goToComposer() {
    const el = document.getElementById('composer-top')
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    setTimeout(() => (el as HTMLTextAreaElement | null)?.focus(), 400)
  }

  return (
    <div className="mt-4 flex gap-2">
      {isQ ? (
        <button type="button" onClick={goToComposer} className="btn-primary flex-1 sm:flex-none">
          <MessageSquare className="h-4 w-4" /> Write an answer
        </button>
      ) : (
        <HelpfulButton
          big
          targetType="POST"
          targetId={post.id}
          initialCount={post.helpfulCount}
          voted={voted.has(post.id)}
          onVoted={(id, on) => setVoted((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n })}
          onNeedSignIn={() => setSignInOpen(true)}
        />
      )}
      {!isQ && (
        <button type="button" onClick={goToComposer} className="btn-primary flex-1 sm:flex-none">
          <MessageSquare className="h-4 w-4" /> Comment
        </button>
      )}
      <ShareButton title={post.title} text={post.title} url={post.url} className="btn-secondary px-3" />
      <SignInDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={() => setSignInOpen(false)}
        callbackUrl={typeof window === 'undefined' ? '/' : window.location.pathname}
        title="Sign in to continue"
        subtitle="It takes a few seconds. You will come straight back to this post."
      />
    </div>
  )
}

/* ── Replies ───────────────────────────────────────────────────────────────── */

function MentionChips({ mentions }: { mentions: MentionedProject[] }) {
  if (mentions.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {mentions.map((m) => (
        <Link key={m.href} href={m.href} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-semibold text-navy-500 hover:border-saffron-300">
          <Building2 className="h-3.5 w-3.5 text-saffron-500" />
          {m.name}
          {m.ratingCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-gold"><Star className="h-3 w-3 fill-gold" /> {m.avgRating.toFixed(1)}</span>
          )}
        </Link>
      ))}
    </div>
  )
}

export function CommunityReplies({ post, initialReplies }: { post: PostInfo; initialReplies: ThreadReply[] }) {
  const [replies, setReplies] = useState(initialReplies)
  const [voted, setVoted] = useVotes(post.id)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [signInOpen, setSignInOpen] = useState(false)
  const isQ = post.kind === 'QUESTION'
  const needSignIn = useCallback(() => setSignInOpen(true), [])
  const onVoted = useCallback(
    (id: string, on: boolean) => setVoted((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n }),
    [setVoted],
  )

  const top = replies.filter((r) => !r.parentId)
  const childrenOf = (id: string) => replies.filter((r) => r.parentId === id)
  const noun = isQ ? 'answer' : 'comment'

  function item(r: ThreadReply, nested: boolean) {
    return (
      <div key={r.id} id={`reply-${r.id}`} className={cn(nested ? 'mt-3 border-l-2 border-neutral-100 pl-4' : 'border-t border-neutral-100 py-4 first:border-t-0')}>
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex items-center justify-center rounded-full bg-saffron-100 font-bold text-saffron-700', nested ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs')}>
            {handle(r.user).replace('@', '').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-neutral-800">{handle(r.user)}</span>
          {r.user.id === post.authorId && <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-navy-500">Author</span>}
          <time className="text-xs text-neutral-400" dateTime={r.createdAt}>{formatRelativeTime(r.createdAt)}</time>
          {isQ && r.isMostHelpful && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-light px-2 py-0.5 text-xs font-semibold text-teal-dark">
              <Check className="h-3 w-3" /> Most helpful
            </span>
          )}
        </div>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">{r.content}</p>
        <MentionChips mentions={r.mentions} />
        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-neutral-500">
          <HelpfulButton targetType="REPLY" targetId={r.id} initialCount={r.helpfulCount} voted={voted.has(r.id)} onVoted={onVoted} onNeedSignIn={needSignIn} />
          <button type="button" onClick={() => setReplyingTo((v) => (v === r.id ? null : r.id))} className="inline-flex items-center gap-1 hover:text-neutral-800">
            <CornerDownRight className="h-3.5 w-3.5" /> Reply
          </button>
          <span className="ml-auto">
            <ReportButton targetType="REPLY" targetId={r.id} onNeedSignIn={needSignIn} />
          </span>
        </div>
        {!nested && childrenOf(r.id).map((c) => item(c, true))}
        {replyingTo === r.id && (
          <div className="mt-3 border-l-2 border-saffron-200 pl-4">
            <Composer
              postId={post.id}
              parentId={r.id}
              label={`Reply to ${handle(r.user)}`}
              placeholder="Write your reply…"
              autoFocus
              onPosted={(n) => { setReplies((list) => [...list, n]); setReplyingTo(null) }}
              onCancel={() => setReplyingTo(null)}
              onNeedSignIn={needSignIn}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card-base mt-4 p-6">
      <h2 className="font-heading text-lg font-bold text-navy-500">
        {replies.length === 0 ? (isQ ? 'No answers yet' : 'No comments yet') : `${replies.length} ${noun}${replies.length === 1 ? '' : 's'}`}
      </h2>
      {replies.length === 0 && (
        <p className="mt-1 text-sm text-neutral-500">{isQ ? 'Know the answer, or been through this? Help a fellow buyer.' : 'Had a similar experience, or a question for the poster?'}</p>
      )}
      <div className="mt-1">{top.map((r) => item(r, false))}</div>
      <div className="border-t border-neutral-100 pt-4">
        <Composer
          postId={post.id}
          label={isQ ? 'Your answer' : 'Your comment'}
          placeholder={isQ ? 'Share what you know or have seen. Mention a project by name to link it.' : 'Had a similar experience, or a question for the poster?'}
          onPosted={(n) => setReplies((list) => [...list, n])}
          onNeedSignIn={needSignIn}
        />
      </div>
      <div className="mt-4 flex justify-end text-xs text-neutral-500">
        <ReportButton targetType="POST" targetId={post.id} onNeedSignIn={needSignIn} label="Report this post" />
      </div>
      <SignInDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={() => setSignInOpen(false)}
        callbackUrl={typeof window === 'undefined' ? '/' : window.location.pathname}
        title="Sign in to continue"
        subtitle="It takes a few seconds. What you typed stays here."
      />
    </div>
  )
}
