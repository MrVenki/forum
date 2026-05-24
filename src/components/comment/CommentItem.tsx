'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatRelativeTime, formatAbsoluteDate } from '@/lib/utils/format'
import { REACTION_TYPES } from '@/lib/constants/config'
import { CommentForm } from './CommentForm'
import { cn } from '@/lib/utils/cn'
import { CornerDownRight } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { CommentWithRelations, ReactionType } from '@/types'
import { FlairBadge } from '@/components/topic/FlairBadge'

interface CommentItemProps {
  comment: CommentWithRelations
  topicId: string
  onReply?: (reply: CommentWithRelations) => void
  isReply?: boolean
}

export function CommentItem({ comment, topicId, onReply, isReply = false }: CommentItemProps) {
  const { data: session } = useSession()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [reactions, setReactions] = useState(comment.reactions)
  const handle = comment.user.username ? `@${comment.user.username}` : comment.user.name
  const initials = (comment.user.username ?? comment.user.name).charAt(0).toUpperCase()

  const reactionCounts = REACTION_TYPES.reduce(
    (acc, r) => ({ ...acc, [r.value]: reactions.filter((rx) => rx.reactionType === r.value).length }),
    {} as Record<string, number>
  )
  const userReaction = session ? reactions.find((r) => r.userId === session.user.id)?.reactionType : null

  const handleReaction = async (type: ReactionType) => {
    if (!session) { toast({ title: 'Sign in to react', variant: 'destructive' }); return }

    const res = await fetch(`/api/topics/${topicId}/comments/${comment.id}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reactionType: type }),
    })
    const data = await res.json()

    if (data.action === 'removed') {
      setReactions((prev) => prev.filter((r) => r.userId !== session.user.id))
    } else if (data.action === 'added') {
      setReactions((prev) => [...prev, data.reaction])
    } else if (data.action === 'updated') {
      setReactions((prev) => prev.map((r) => r.userId === session.user.id ? data.reaction : r))
    }
  }

  const handleReplySuccess = (reply: CommentWithRelations) => {
    setShowReplyForm(false)
    onReply?.(reply)
  }

  return (
    <div className={cn('group', isReply && 'ml-10 pl-4 border-l-2 border-neutral-100')}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 font-bold text-sm shrink-0 mt-0.5">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-neutral-800">{handle}</span>
            {comment.user.flairTag && <FlairBadge flair={comment.user.flairTag} />}
            <time
              className="text-xs text-neutral-500"
              dateTime={comment.createdAt.toString()}
              title={formatAbsoluteDate(comment.createdAt)}
            >
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>

          {/* Content */}
          <p className="mt-1.5 text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
            {comment.isDeleted ? <em className="text-neutral-400">[Comment removed]</em> : comment.content}
          </p>

          {/* Reactions */}
          {!comment.isDeleted && (
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              {REACTION_TYPES.map((rt) => {
                const count = reactionCounts[rt.value] || 0
                const isActive = userReaction === rt.value
                return (
                  <button
                    key={rt.value}
                    onClick={() => handleReaction(rt.value as ReactionType)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                      isActive
                        ? 'bg-saffron-100 text-saffron-700 ring-1 ring-saffron-300'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    )}
                    title={rt.label}
                  >
                    <span>{rt.emoji}</span>
                    {count > 0 && <span>{count}</span>}
                  </button>
                )
              })}
              {!isReply && session && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-all"
                >
                  <CornerDownRight className="h-3 w-3" /> Reply
                </button>
              )}
            </div>
          )}

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                topicId={topicId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${handle}…`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} topicId={topicId} isReply />
          ))}
        </div>
      )}
    </div>
  )
}
