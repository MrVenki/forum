'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { toast } from '@/hooks/use-toast'
import type { CommentWithRelations } from '@/types'

type Step = 'compose' | 'email' | 'code'

interface Props {
  topicId: string
  placeholder: string
  onSuccess: (comment: CommentWithRelations) => void
}

const STARTERS = ['Price: ', 'Possession date: ', 'Location: ', 'Builder track record: ']

export function GuestCommentBox({ topicId, placeholder, onSuccess }: Props) {
  const draftKey = `ipt-draft-${topicId}`
  const [step, setStep] = useState<Step>('compose')
  const [draft, setDraft] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sendToken, setSendToken] = useState('')
  const [postToken, setPostToken] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) setDraft(saved)
    } catch {}
  }, [draftKey])

  function updateDraft(value: string) {
    setDraft(value)
    try {
      if (value) localStorage.setItem(draftKey, value)
      else localStorage.removeItem(draftKey)
    } catch {}
  }

  function addStarter(starter: string) {
    updateDraft(draft ? `${draft.replace(/\s+$/, '')}\n${starter}` : starter)
  }

  function continueToEmail() {
    if (draft.trim().length < 10) {
      setError('Write at least 10 characters first.')
      return
    }
    setError('')
    setStep('email')
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await fetch('/api/auth/quick-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, cfToken: sendToken }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) setStep('code')
    else setError(data.error || 'Could not send the code.')
  }

  async function verifyAndPost(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) {
      setError('Enter the 6-digit code.')
      return
    }
    setError('')
    setBusy(true)

    const signedIn = await signIn('email-otp', { email: email.trim().toLowerCase(), code, redirect: false })
    if (!signedIn || signedIn.error) {
      setBusy(false)
      setError(signedIn?.error && signedIn.error !== 'CredentialsSignin' ? signedIn.error : 'That code did not work. Request a new one.')
      return
    }

    const res = await fetch(`/api/topics/${topicId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft.trim(), cfToken: postToken }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)

    if (res.ok) {
      try {
        localStorage.removeItem(draftKey)
      } catch {}
      setDraft('')
      toast({ title: 'Comment posted', description: "You're now following this thread and will get an email when someone replies." })
      onSuccess(data)
    } else {
      setStep('compose')
      const message = data.error || 'You are signed in, but the comment could not be posted. Your draft is saved. Try again.'
      setError(message)
      toast({ title: 'Comment not posted', description: message, variant: 'destructive' })
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-4 space-y-3">
      {step === 'compose' && (
        <>
          <Textarea
            value={draft}
            onChange={(e) => updateDraft(e.target.value)}
            placeholder={placeholder}
            rows={3}
            maxLength={5000}
            className="min-h-[88px]"
          />
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addStarter(s)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-saffron-300"
              >
                {s.replace(': ', '')}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-400">Posts under your username. Your email stays private.</span>
            <Button type="button" size="sm" onClick={continueToEmail}>
              <Send className="h-3.5 w-3.5" /> Post comment
            </Button>
          </div>
        </>
      )}

      {step === 'email' && (
        <form onSubmit={sendCode} className="space-y-3">
          <TurnstileWidget onSuccess={setSendToken} onExpire={() => setSendToken('')} />
          <TurnstileWidget onSuccess={setPostToken} onExpire={() => setPostToken('')} />
          <p className="text-sm font-semibold text-navy-500">Almost done: verify your email to post</p>
          <p className="text-xs text-neutral-500">Your comment is saved. We will send a 6-digit code and create your account if you are new.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required minLength={2} maxLength={50} autoComplete="name" />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" required autoComplete="email" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={() => setStep('compose')} className="text-xs text-neutral-500 hover:underline">Back to comment</button>
            <Button type="submit" size="sm" disabled={busy}>{busy ? 'Sending…' : 'Send code'}</Button>
          </div>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verifyAndPost} className="space-y-3">
          <p className="text-sm font-semibold text-navy-500">Enter the code we sent to {email}</p>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit code"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="max-w-[180px] tracking-widest"
          />
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={() => { setCode(''); setStep('email') }} className="text-xs text-neutral-500 hover:underline">Use a different email or resend</button>
            <Button type="submit" size="sm" disabled={busy}>{busy ? 'Posting…' : 'Verify and post'}</Button>
          </div>
        </form>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
