'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

interface RatingFormProps {
  topicId: string
  existingScore?: number
  existingReview?: string
  onSuccess?: (avgRating: number, ratingCount: number) => void
}

export function RatingForm({ topicId, existingScore, existingReview, onSuccess }: RatingFormProps) {
  const { data: session } = useSession()
  const [score, setScore] = useState(existingScore || 0)
  const [review, setReview] = useState(existingReview || '')
  const [loading, setLoading] = useState(false)

  if (!session) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center">
        <p className="text-sm text-neutral-600">
          <a href="/login" className="font-semibold text-saffron-500 hover:text-saffron-600">Sign in</a> to rate this property
        </p>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (score === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' })
      return
    }
    setLoading(true)
    const res = await fetch(`/api/topics/${topicId}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, review: review || null }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      toast({ title: existingScore ? 'Rating updated!' : 'Rating submitted!', description: 'Thank you for your review.' })
      onSuccess?.(data.avgRating, data.ratingCount)
    } else {
      toast({ title: data.error || 'Failed to submit rating', variant: 'destructive' })
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
      <h3 className="font-heading font-bold text-navy-500">
        {existingScore ? 'Update Your Rating' : 'Rate This Property'}
      </h3>
      <div>
        <StarRating value={score} onChange={setScore} size="lg" showCount={false} />
        <p className="mt-1 text-xs text-neutral-500">
          {score === 0 ? 'Select a rating' : ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][score]}
        </p>
      </div>
      <Textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience (optional)..."
        rows={3}
        maxLength={2000}
      />
      <Button onClick={handleSubmit} disabled={loading || score === 0} className="w-full">
        {loading ? 'Submitting…' : existingScore ? 'Update Rating' : 'Submit Rating'}
      </Button>
    </div>
  )
}
