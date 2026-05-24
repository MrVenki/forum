'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Send } from 'lucide-react'
import type { CommentWithRelations } from '@/types'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { MentionTextarea } from './MentionTextarea'

interface CommentFormProps {
  topicId: string
  parentId?: string
  onSuccess: (comment: CommentWithRelations) => void
  onCancel?: () => void
  placeholder?: string
}

export function CommentForm({ topicId, parentId, onSuccess, onCancel, placeholder }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [cfToken, setCfToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim().length < 10) {
      toast({ title: 'Comment too short', description: 'Please write at least 10 characters.', variant: 'destructive' })
      return
    }
    setLoading(true)
    const res = await fetch(`/api/topics/${topicId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim(), parentId, cfToken }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setContent('')
      onSuccess(data)
      toast({
        title: '✅ Comment posted',
        description: data.autoSubscribed && !parentId
          ? "🔔 You're now following this thread and will be notified of new replies."
          : undefined,
      })
    } else {
      toast({ title: data.error || 'Failed to post comment', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />
      <MentionTextarea
        value={content}
        onChange={setContent}
        placeholder={placeholder || 'Share your thoughts… type @ to mention someone'}
        rows={3}
        maxLength={5000}
        disabled={loading}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">{content.length}/5000</span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          )}
          <Button type="submit" size="sm" disabled={loading || content.trim().length < 10}>
            <Send className="h-3.5 w-3.5" />
            {loading ? 'Posting…' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </form>
  )
}
