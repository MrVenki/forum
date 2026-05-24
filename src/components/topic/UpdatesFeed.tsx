'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Camera, CalendarDays, Plus, X, Upload } from 'lucide-react'
import { FlairBadge } from './FlairBadge'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'

interface UpdateUser {
  id: string
  name: string
  username: string | null
  image: string | null
  flairTag: string | null
}

interface Update {
  id: string
  content: string
  imageUrl: string | null
  visitedAt: string
  createdAt: string
  user: UpdateUser
}

interface Props {
  topicId: string
}

export function UpdatesFeed({ topicId }: Props) {
  const { data: session } = useSession()
  const [updates, setUpdates] = useState<Update[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [content, setContent] = useState('')
  const [visitedAt, setVisitedAt] = useState(new Date().toISOString().split('T')[0])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePubId, setImagePubId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [cfToken, setCfToken] = useState('')

  const fetchUpdates = useCallback(async (p = 1) => {
    setLoading(true)
    const res = await fetch(`/api/topics/${topicId}/updates?page=${p}`)
    if (res.ok) {
      const data = await res.json()
      setUpdates(p === 1 ? data.updates : prev => [...prev, ...data.updates])
      setTotal(data.total)
      setPage(p)
    }
    setLoading(false)
  }, [topicId])

  useEffect(() => { fetchUpdates(1) }, [fetchUpdates])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }
    setUploading(true)
    setError('')
    try {
      // Get signed params
      const sigRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'property-forum/updates' }),
      })
      if (!sigRes.ok) throw new Error('Failed to get upload signature')
      const { signature, timestamp, cloudName, apiKey, folder, upload_preset } = await sigRes.json()

      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', timestamp)
      fd.append('api_key', apiKey)
      fd.append('folder', folder)
      if (upload_preset) fd.append('upload_preset', upload_preset)

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      if (!upRes.ok) throw new Error('Upload failed')
      const upData = await upRes.json()
      setImageUrl(upData.secure_url)
      setImagePubId(upData.public_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    const res = await fetch(`/api/topics/${topicId}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        visitedAt: new Date(visitedAt).toISOString(),
        imageUrl,
        imagePubId,
        cfToken,
      }),
    })
    if (res.ok) {
      setContent('')
      setImageUrl(null)
      setImagePubId(null)
      setVisitedAt(new Date().toISOString().split('T')[0])
      setShowForm(false)
      fetchUpdates(1)
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to post update')
    }
    setSubmitting(false)
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-saffron-500" />
          <span className="font-semibold text-navy-500">
            Construction Updates
            {total > 0 && <span className="ml-1.5 text-sm font-normal text-neutral-400">({total})</span>}
          </span>
        </div>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Post Update
          </button>
        )}
      </div>

      {/* Post form */}
      {showForm && session && (
        <form onSubmit={handleSubmit} className="card-base p-4 space-y-3">
          <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-navy-500">Share a Construction Update</p>
            <button type="button" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Visit Date *</label>
            <input
              type="date"
              value={visitedAt}
              onChange={e => setVisitedAt(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">What did you observe? *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="E.g. Slab work done on floors 1-5. Plastering started on ground floor. No workers visible on Tower B..."
              rows={3}
              required
              minLength={10}
              maxLength={2000}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-none"
            />
            <p className="text-xs text-neutral-400 text-right mt-0.5">{content.length}/2000</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Site Photo <span className="text-neutral-400">(optional)</span>
            </label>
            {imageUrl ? (
              <div className="relative inline-block">
                <Image src={imageUrl} alt="Site photo" width={200} height={120} className="rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageUrl(null); setImagePubId(null) }}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className={`flex items-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 px-4 py-3 cursor-pointer hover:border-saffron-300 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                <Upload className="h-4 w-4 text-neutral-400" />
                <span className="text-xs text-neutral-500">{uploading ? 'Uploading...' : 'Upload site photo (max 5MB)'}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting || uploading || content.length < 10}
              className="rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Update'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Updates list */}
      {loading && updates.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="card-base p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-neutral-200 rounded" />
                  <div className="h-3 w-full bg-neutral-200 rounded" />
                  <div className="h-3 w-3/4 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <div className="card-base p-8 text-center">
          <Camera className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">No construction updates yet.</p>
          {session && (
            <p className="text-xs text-neutral-400 mt-1">
              Visited the site recently? Be the first to share an update.
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-100" />
          <div className="space-y-4">
            {updates.map((upd) => (
              <div key={upd.id} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div className="shrink-0 h-8 w-8 rounded-full bg-saffron-50 border-2 border-saffron-200 flex items-center justify-center z-10">
                  <Camera className="h-3.5 w-3.5 text-saffron-500" />
                </div>
                <div className="flex-1 card-base p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-navy-500">
                        {upd.user.username ? `@${upd.user.username}` : upd.user.name}
                      </span>
                      {upd.user.flairTag && <FlairBadge flair={upd.user.flairTag} />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 shrink-0">
                      <CalendarDays className="h-3 w-3" />
                      Visited {fmt(upd.visitedAt)}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{upd.content}</p>
                  {upd.imageUrl && (
                    <div className="mt-3">
                      <Image
                        src={upd.imageUrl}
                        alt="Construction site photo"
                        width={400}
                        height={240}
                        className="rounded-lg object-cover w-full max-h-60"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Load more */}
      {updates.length < total && (
        <button
          onClick={() => fetchUpdates(page + 1)}
          disabled={loading}
          className="w-full rounded-lg border border-neutral-200 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : `Load more (${total - updates.length} remaining)`}
        </button>
      )}
    </div>
  )
}
