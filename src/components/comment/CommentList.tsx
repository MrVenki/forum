'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare } from 'lucide-react'
import type { CommentWithRelations } from '@/types'

interface CommentListProps {
  topicId: string
  initialComments?: CommentWithRelations[]
}

export function CommentList({ topicId, initialComments }: CommentListProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<CommentWithRelations[]>(initialComments || [])
  const [loading, setLoading] = useState(!initialComments)

  useEffect(() => {
    if (!initialComments) {
      fetch(`/api/topics/${topicId}/comments`)
        .then((r) => r.json())
        .then((data) => { setComments(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [topicId, initialComments])

  const handleNewComment = (comment: CommentWithRelations) => {
    setComments((prev) => [...prev, comment])
  }

  const handleReply = (parentId: string, reply: CommentWithRelations) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-saffron-500" />
        <h2 className="font-heading font-bold text-lg text-navy-500">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {session ? (
        <CommentForm topicId={topicId} onSuccess={handleNewComment} />
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 p-5 text-center">
          <p className="text-sm text-neutral-500">
            <a href="/login" className="font-semibold text-saffron-500 hover:text-saffron-600">Sign in</a> to join the discussion
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="py-10 text-center text-neutral-400">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              topicId={topicId}
              onReply={(reply) => handleReply(comment.id, reply)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
