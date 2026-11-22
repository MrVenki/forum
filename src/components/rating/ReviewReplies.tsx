'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CornerDownRight, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { SignInDialog, consumeReplyMarker, replyCallbackUrl } from '@/components/auth/SignInDialog'
import { formatRelativeTime } from '@/lib/utils/format'
import { toast } from '@/hooks/use-toast'
import { AdminEditLink, ModeratorEditedNote } from '@/components/admin/AdminEditLink'

export interface ReviewReply {
  id: string
  content: string
  createdAt: string
  user: { name: string | null; username: string | null }
  moderatorEdited?: boolean
}

interface Props {
  topicId: string
  ratingId: string
  reviewerHandle: string
  initialReplies: ReviewReply[]
}

const MAX = 2000

/** Replies under one star-rating review, with a Reply button for everyone. */
export function ReviewReplies({ topicId, ratingId, reviewerHandle, initialReplies }: Props) {
  const { data: session, status } = useSession()
  const [replies, setReplies] = useState(initialReplies)
  const [open, setOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [cfToken, setCfToken] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const replyKey = `r_${ratingId}`
  const anchorId = `review-${ratingId}`

  useEffect(() => {
    if (status !== 'authenticated') return
    if (consumeReplyMarker(replyKey)) {
      setOpen(true)
      document.getElementById(anchorId)?.scrollIntoView({ block: 'center' })
    }
  }, [status, replyKey, anchorId])

  useEffect(() => {
    if (open) requestAnimationFrame(() => textareaRef.current?.focus())
  }, [open])

  function onReplyClick() {
    if (session) setOpen((v) => !v)
    else setSignInOpen(true)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (text.trim().length < 2) return
    setBusy(true)
    const res = await fetch(`/api/topics/${topicId}/ratings/${ratingId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text.trim(), cfToken }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) {
      setReplies((r) => [...r, data])
      setText('')
      setOpen(false)
      toast({ title: 'Reply posted' })
    } else {
      toast({ title: data.error || 'Could not post your reply', variant: 'destructive' })
    }
  }

  return (
    <div className="mt-2">
      {replies.length > 0 && (
        <ul className="mb-2 ml-4 space-y-2 border-l-2 border-neutral-100 pl-4">
          {replies.map((r) => (
            <li key={r.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-neutral-800">{r.user.username ? `@${r.user.username}` : r.user.name}</span>
                <time className="text-xs text-neutral-400" dateTime={new Date(r.createdAt).toISOString()}>
                  {formatRelativeTime(new Date(r.createdAt))}
                </time>
                <AdminEditLink href={`/admin/reviews?edit=${ratingId}`} className="ml-auto" />
              </div>
              <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{r.content}</p>
              {r.moderatorEdited && <ModeratorEditedNote className="mt-0.5" />}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onReplyClick}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 transition-all hover:bg-neutral-200"
      >
        <CornerDownRight className="h-3 w-3" /> Reply
      </button>

      {open && (
        <form onSubmit={submit} className="mt-2 space-y-2">
          <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Reply to ${reviewerHandle}…`}
            rows={3}
            maxLength={MAX}
            aria-label={`Reply to ${reviewerHandle}`}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">{text.length}/{MAX}</span>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={busy || text.trim().length < 2}>
                <Send className="h-3.5 w-3.5" />
                {busy ? 'Posting…' : 'Post reply'}
              </Button>
            </div>
          </div>
        </form>
      )}

      <SignInDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={() => {
          setSignInOpen(false)
          setOpen(true)
        }}
        callbackUrl={signInOpen ? replyCallbackUrl(replyKey, anchorId) : '/'}
        subtitle={`Sign in to reply to ${reviewerHandle}. You will come straight back to your reply.`}
      />
    </div>
  )
}
