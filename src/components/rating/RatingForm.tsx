'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils/cn'
import { dateToMonth } from '@/lib/validations/rating'

interface RatingFormProps {
  topicId: string
  existingScore?: number
  existingReview?: string
  onSuccess?: (avgRating: number, ratingCount: number) => void
}

type Ownership = 'BOOKED' | 'RESIDENT' | 'EXPLORING'

const OWNERSHIP: { value: Ownership; label: string }[] = [
  { value: 'RESIDENT', label: 'I live here' },
  { value: 'BOOKED', label: 'I have booked' },
  { value: 'EXPLORING', label: 'I visited the site' },
]

const DIMENSIONS = [
  { key: 'constructionQuality', label: 'Construction quality' },
  { key: 'maintenanceScore', label: 'Maintenance and upkeep' },
  { key: 'amenitiesScore', label: 'Amenities' },
  { key: 'builderScore', label: 'Builder responsiveness' },
] as const

type DimKey = (typeof DIMENSIONS)[number]['key']

export function RatingForm({ topicId, existingScore, existingReview, onSuccess }: RatingFormProps) {
  const { data: session } = useSession()
  const [score, setScore] = useState(existingScore || 0)
  const [review, setReview] = useState(existingReview || '')
  const [loading, setLoading] = useState(false)
  const [hadRating, setHadRating] = useState(!!existingScore)
  const [showDetails, setShowDetails] = useState(false)
  const [ownership, setOwnership] = useState<Ownership | null>(null)
  const [dims, setDims] = useState<Record<DimKey, number>>({ constructionQuality: 0, maintenanceScore: 0, amenitiesScore: 0, builderScore: 0 })
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [promised, setPromised] = useState('')
  const [actual, setActual] = useState('')
  const [maintenance, setMaintenance] = useState('')

  useEffect(() => {
    if (!session) return
    fetch(`/api/topics/${topicId}/ratings`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const r = d?.userRating
        if (!r) return
        setHadRating(true)
        setScore(r.score)
        setReview(r.review ?? '')
        setOwnership(r.ownership ?? null)
        setDims({
          constructionQuality: r.constructionQuality ?? 0,
          maintenanceScore: r.maintenanceScore ?? 0,
          amenitiesScore: r.amenitiesScore ?? 0,
          builderScore: r.builderScore ?? 0,
        })
        setPros(r.pros ?? '')
        setCons(r.cons ?? '')
        setPromised(dateToMonth(r.promisedPossession))
        setActual(dateToMonth(r.actualPossession))
        setMaintenance(r.maintenancePerSqFt ? String(Number(r.maintenancePerSqFt)) : '')
        if (r.ownership || r.pros || r.cons || r.constructionQuality) setShowDetails(true)
      })
      .catch(() => {})
  }, [session, topicId])

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
      body: JSON.stringify({
        score,
        review: review || null,
        ownership,
        constructionQuality: dims.constructionQuality || null,
        maintenanceScore: dims.maintenanceScore || null,
        amenitiesScore: dims.amenitiesScore || null,
        builderScore: dims.builderScore || null,
        pros: pros.trim() || null,
        cons: cons.trim() || null,
        promisedPossession: promised || null,
        actualPossession: actual || null,
        maintenancePerSqFt: maintenance ? Number(maintenance) : null,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setHadRating(true)
      toast({ title: hadRating ? 'Rating updated!' : 'Rating submitted!', description: 'Thank you for your review.' })
      onSuccess?.(data.avgRating, data.ratingCount)
    } else {
      toast({ title: data.error || 'Failed to submit rating', variant: 'destructive' })
    }
  }

  const livesOrBooked = ownership === 'RESIDENT' || ownership === 'BOOKED'

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
      <h3 className="font-heading font-bold text-navy-500">
        {hadRating ? 'Update Your Rating' : 'Rate This Property'}
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

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-semibold text-saffron-600 hover:underline"
        aria-expanded={showDetails}
      >
        {showDetails ? 'Hide details' : 'Add details that help other buyers (optional)'}
      </button>

      {showDetails && (
        <div className="space-y-4 border-t border-neutral-100 pt-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-neutral-600">Your connection to this project</p>
            <div className="flex flex-wrap gap-2">
              {OWNERSHIP.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={ownership === o.value}
                  onClick={() => setOwnership(ownership === o.value ? null : o.value)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    ownership === o.value ? 'border-saffron-400 bg-saffron-50 text-saffron-700' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {DIMENSIONS.map((dim) => (
              <div key={dim.key} className="flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-600">{dim.label}</span>
                <StarRating value={dims[dim.key]} onChange={(n) => setDims((d) => ({ ...d, [dim.key]: n }))} size="sm" showCount={false} />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Input value={pros} onChange={(e) => setPros(e.target.value)} placeholder="Best thing about it" maxLength={300} />
            <Input value={cons} onChange={(e) => setCons(e.target.value)} placeholder="Biggest drawback" maxLength={300} />
          </div>

          {livesOrBooked && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-neutral-600">
                  Possession promised
                  <Input type="month" value={promised} onChange={(e) => setPromised(e.target.value)} className="mt-1" />
                </label>
                <label className="text-xs text-neutral-600">
                  Possession received
                  <Input type="month" value={actual} onChange={(e) => setActual(e.target.value)} className="mt-1" />
                </label>
              </div>
              {ownership === 'RESIDENT' && (
                <label className="block text-xs text-neutral-600">
                  Monthly maintenance (₹ per sq ft)
                  <Input type="number" min="0.5" max="50" step="0.5" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} placeholder="e.g. 4" className="mt-1" />
                </label>
              )}
              <p className="text-[11px] text-neutral-400">Dates and maintenance help other buyers see how reliable this builder is. They are shown without your name.</p>
            </div>
          )}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={loading || score === 0} className="w-full">
        {loading ? 'Submitting…' : hadRating ? 'Update Rating' : 'Submit Rating'}
      </Button>
    </div>
  )
}
