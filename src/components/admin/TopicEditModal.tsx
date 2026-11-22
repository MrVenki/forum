'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, X, Trash2, Check } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/constants/config'

export interface EditableTopic {
  id: string
  title: string
  propertyName: string
  slug: string
  description: string
  address: string | null
  propertyType: string
  priceMin: number | null
  priceMax: number | null
  developerSlug: string | null
  developerName: string | null
  constructionStatus: string | null
  expectedPossession: string | null // YYYY-MM
  isPublished: boolean
  image1Url: string | null
  image2Url: string | null
  city: { id: string; name: string; slug: string }
  user: { name: string }
}

export interface CityOption { id: string; name: string; slug: string }
export interface DeveloperOption { slug: string; name: string }

const LAKH = 100_000
const toLakh = (rupees: number | null) => (rupees == null ? '' : String(Math.round((rupees / LAKH) * 100) / 100))
const STATUSES = [
  { value: '', label: 'Not set' },
  { value: 'ON_TRACK', label: 'On track' },
  { value: 'DELAYED', label: 'Delayed' },
  { value: 'STALLED', label: 'Stalled' },
  { value: 'POSSESSION_DONE', label: 'Possession done' },
]

const input = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-saffron-400'
const labelCls = 'block text-sm font-semibold text-neutral-700 mb-1'

/** Full edit form for a listing. Sends only the fields that changed. */
export function TopicEditModal({
  topic, cities, developers, onClose, onSaved,
}: {
  topic: EditableTopic
  cities: CityOption[]
  developers: DeveloperOption[]
  onClose: () => void
  onSaved: (t: EditableTopic) => void
}) {
  const [f, setF] = useState({
    title: topic.title,
    propertyName: topic.propertyName,
    description: topic.description,
    address: topic.address ?? '',
    propertyType: topic.propertyType,
    cityId: topic.city.id,
    priceMin: toLakh(topic.priceMin),
    priceMax: toLakh(topic.priceMax),
    developerSlug: topic.developerSlug ?? '',
    developerName: topic.developerName ?? '',
    constructionStatus: topic.constructionStatus ?? '',
    expectedPossession: topic.expectedPossession ?? '',
    isPublished: topic.isPublished,
  })
  const [removeImg1, setRemoveImg1] = useState(false)
  const [removeImg2, setRemoveImg2] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }))

  const newCity = cities.find((c) => c.id === f.cityId)
  const cityChanged = f.cityId !== topic.city.id

  function changes(): Record<string, unknown> | string {
    const body: Record<string, unknown> = {}
    if (f.title.trim() !== topic.title) body.title = f.title
    if (f.propertyName.trim() !== topic.propertyName) body.propertyName = f.propertyName
    if (f.description.trim() !== topic.description) body.description = f.description
    if (f.address.trim() !== (topic.address ?? '')) body.address = f.address
    if (f.propertyType !== topic.propertyType) body.propertyType = f.propertyType
    if (cityChanged) body.cityId = f.cityId
    if (f.priceMin !== toLakh(topic.priceMin) || f.priceMax !== toLakh(topic.priceMax)) {
      const min = f.priceMin.trim() === '' ? null : Number(f.priceMin) * LAKH
      const max = f.priceMax.trim() === '' ? null : Number(f.priceMax) * LAKH
      if ((min !== null && !Number.isFinite(min)) || (max !== null && !Number.isFinite(max))) return 'Enter prices as numbers in lakhs (1 crore = 100 lakh).'
      body.priceMin = min
      body.priceMax = max
      if (min === null && max === null) body.allowNoPrice = true
    }
    if (f.developerSlug !== (topic.developerSlug ?? '') || (!f.developerSlug && f.developerName.trim() !== (topic.developerName ?? ''))) {
      body.developerSlug = f.developerSlug || null
      body.developerName = f.developerSlug ? undefined : f.developerName
    }
    if (f.constructionStatus !== (topic.constructionStatus ?? '')) body.constructionStatus = f.constructionStatus || null
    if (f.expectedPossession !== (topic.expectedPossession ?? '')) body.expectedPossession = f.expectedPossession || null
    if (f.isPublished !== topic.isPublished) body.isPublished = f.isPublished
    if (removeImg1) body.removeImage1 = true
    if (removeImg2) body.removeImage2 = true
    return body
  }

  async function save() {
    const body = changes()
    if (typeof body === 'string') return setError(body)
    if (Object.keys(body).length === 0) return onClose()
    if (cityChanged && !window.confirm(`Move this listing to ${newCity?.name}? Its address changes to /${newCity?.slug}/${topic.slug}. The old address will redirect there.`)) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/topics/${topic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return setError(data.error || 'Could not save')
      const dev = developers.find((d) => d.slug === f.developerSlug)
      onSaved({
        ...topic,
        title: f.title.trim(),
        propertyName: f.propertyName.trim(),
        description: f.description.trim(),
        address: f.address.trim() || null,
        propertyType: f.propertyType,
        city: newCity ?? topic.city,
        priceMin: f.priceMin.trim() === '' ? null : Math.round(Number(f.priceMin) * LAKH),
        priceMax: f.priceMax.trim() === '' ? null : Math.round(Number(f.priceMax) * LAKH),
        developerSlug: f.developerSlug || null,
        developerName: dev ? dev.name : f.developerName.trim() || null,
        constructionStatus: f.constructionStatus || null,
        expectedPossession: f.expectedPossession || null,
        isPublished: f.isPublished,
        image1Url: removeImg1 ? null : topic.image1Url,
        image2Url: removeImg2 ? null : topic.image2Url,
      })
    } finally {
      setSaving(false)
    }
  }

  const images = [
    { url: topic.image1Url, removing: removeImg1, toggle: () => setRemoveImg1(!removeImg1), label: 'Photo 1' },
    { url: topic.image2Url, removing: removeImg2, toggle: () => setRemoveImg2(!removeImg2), label: 'Photo 2' },
  ].filter((i) => i.url)

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 sm:items-center sm:p-4">
      <div className="flex max-h-full w-full max-w-2xl flex-col bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-neutral-200 p-4 sm:p-6">
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold leading-snug text-navy-500">Edit listing</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {topic.propertyName} · {topic.city.name} · posted by {topic.user.name}
            </p>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-lg p-2 hover:bg-neutral-100" aria-label="Close">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Project name</label>
              <input className={input} value={f.propertyName} onChange={(e) => set('propertyName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Property type</label>
              <select className={input} value={f.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                {PROPERTY_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Title</label>
            <input className={input} value={f.title} onChange={(e) => set('title', e.target.value)} />
            <p className="mt-1 text-xs text-neutral-400">The page address stays /{topic.city.slug}/{topic.slug} even if you change the name or title.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>City</label>
              <select className={input} value={f.cityId} onChange={(e) => set('cityId', e.target.value)}>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Address / locality</label>
              <input className={input} value={f.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. Kondapur, Hyderabad" />
            </div>
          </div>
          {cityChanged && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Moving to {newCity?.name}: the page moves to <b>/{newCity?.slug}/{topic.slug}</b>. Visitors and Google following the old link are sent there automatically.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Price from (lakh)</label>
              <input className={input} inputMode="decimal" value={f.priceMin} onChange={(e) => set('priceMin', e.target.value)} placeholder="e.g. 85" />
            </div>
            <div>
              <label className={labelCls}>Price up to (lakh)</label>
              <input className={input} inputMode="decimal" value={f.priceMax} onChange={(e) => set('priceMax', e.target.value)} placeholder="blank = 'from' price" />
            </div>
          </div>
          <p className="-mt-2 text-xs text-neutral-400">1 crore = 100 lakh. Leave both blank for &quot;Price not listed&quot;.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Builder</label>
              <select className={input} value={f.developerSlug} onChange={(e) => set('developerSlug', e.target.value)}>
                <option value="">Not in the builders list</option>
                {developers.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
            {!f.developerSlug && (
              <div>
                <label className={labelCls}>Builder name</label>
                <input className={input} value={f.developerName} onChange={(e) => set('developerName', e.target.value)} placeholder="Optional" />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Construction status</label>
              <select className={input} value={f.constructionStatus} onChange={(e) => set('constructionStatus', e.target.value)}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <p className="mt-1 text-xs text-neutral-400">Members&apos; status votes can change this again.</p>
            </div>
            <div>
              <label className={labelCls}>Expected possession</label>
              <input type="month" className={input} value={f.expectedPossession} onChange={(e) => set('expectedPossession', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${input} resize-y`} rows={7} value={f.description} onChange={(e) => set('description', e.target.value)} />
            <p className="mt-1 text-xs text-neutral-400">{f.description.length} characters (at least 20)</p>
          </div>

          {images.length > 0 && (
            <div>
              <label className={labelCls}>Photos</label>
              <div className="flex flex-wrap gap-3">
                {images.map((img) => (
                  <div key={img.label} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url!} alt={img.label} className={`h-24 w-36 rounded-xl border-2 object-cover ${img.removing ? 'border-red-400 opacity-25' : 'border-neutral-200'}`} />
                    <button
                      type="button"
                      onClick={img.toggle}
                      className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold shadow-md ${img.removing ? 'bg-red-500 text-white' : 'border border-red-200 bg-white text-red-500'}`}
                    >
                      {img.removing ? <><Check className="h-3 w-3" /> Removing</> : <><Trash2 className="h-3 w-3" /> Remove</>}
                    </button>
                  </div>
                ))}
              </div>
              {(removeImg1 || removeImg2) && <p className="mt-2 text-xs text-red-500">Removing a photo deletes it from Cloudinary for good.</p>}
            </div>
          )}

          <label className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <span>
              <span className="block text-sm font-semibold text-neutral-700">Visible on the site</span>
              <span className="mt-0.5 block text-xs text-neutral-400">{f.isPublished ? 'Everyone can see this listing' : 'Hidden: only admins can see it'}</span>
            </span>
            <input type="checkbox" className="h-5 w-5 accent-saffron-500" checked={f.isPublished} onChange={(e) => set('isPublished', e.target.checked)} />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 p-4 sm:rounded-b-2xl sm:p-6">
          <Link href={`/${topic.city.slug}/${topic.slug}`} target="_blank" className="flex items-center gap-1.5 text-sm font-medium text-saffron-500 hover:text-saffron-600">
            <ExternalLink className="h-4 w-4" /> View live
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Cancel</button>
            <button
              onClick={save}
              disabled={saving || f.description.trim().length < 20}
              className="rounded-lg bg-saffron-500 px-5 py-2 text-sm font-semibold text-white hover:bg-saffron-600 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
