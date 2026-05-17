'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTopicSchema, type CreateTopicInput } from '@/lib/validations/topic'
import { PROPERTY_TYPES } from '@/lib/constants/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/shared/ImageUploader'
import { DeveloperPicker, type DeveloperValue } from '@/components/shared/DeveloperPicker'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { TurnstileWidget } from '@/components/shared/TurnstileWidget'
import { toast } from '@/hooks/use-toast'
import { PlusCircle, AlertCircle, CheckCircle } from 'lucide-react'

interface City { id: string; name: string; slug: string; tier: string }
interface Developer { id: string; name: string; slug: string }
interface UploadedImage { url: string; publicId: string }

export default function NewTopicForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [cities, setCities] = useState<City[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [images, setImages] = useState<UploadedImage[]>([])
  const [developer, setDeveloper] = useState<DeveloperValue | null>(null)
  const [loading, setLoading] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState('')
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [cfToken, setCfToken] = useState('')

  useEffect(() => {
    fetch('/api/cities').then((r) => r.json()).then(setCities).catch(() => {})
    fetch('/api/developers').then((r) => r.json()).then(setDevelopers).catch(() => {})
  }, [])

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<CreateTopicInput>({
    resolver: zodResolver(createTopicSchema),
  })

  const [selectedCityId, propertyName] = watch(['cityId', 'propertyName'])

  // Duplicate check on blur
  const checkDuplicate = async () => {
    if (!selectedCityId || !propertyName || propertyName.length < 3) return
    setCheckingDuplicate(true)
    try {
      const city = cities.find((c) => c.id === selectedCityId)
      const res = await fetch(`/api/topics?city=${city?.slug}&check=true&name=${encodeURIComponent(propertyName)}`)
      const data = await res.json()
      if (data.topics?.length > 0) {
        const existing = data.topics[0]
        setDuplicateWarning(`A discussion for this property already exists in ${city?.name}.`)
      } else {
        setDuplicateWarning('')
      }
    } catch {}
    setCheckingDuplicate(false)
  }

  const onSubmit = async (data: CreateTopicInput) => {
    if (!session) { toast({ title: 'Please sign in first', variant: 'destructive' }); return }

    setLoading(true)
    const payload = {
      ...data,
      image1Url: images[0]?.url || null,
      image1PubId: images[0]?.publicId || null,
      image2Url: images[1]?.url || null,
      image2PubId: images[1]?.publicId || null,
      priceMin: data.priceMin ? Number(data.priceMin) : null,
      priceMax: data.priceMax ? Number(data.priceMax) : null,
      developerSlug: developer?.slug ?? null,
      developerName: developer?.name ?? null,
    }

    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, cfToken }),
    })
    const result = await res.json()
    setLoading(false)

    if (res.ok) {
      toast({ title: 'Discussion started!', description: 'Your topic has been published.' })
      router.push(result.slug)
    } else {
      toast({ title: result.error || 'Failed to create topic', variant: 'destructive' })
    }
  }

  if (status === 'loading') return null
  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <>
      <div className="bg-gradient-to-br from-navy-500 to-navy-700 text-white">
        <div className="container-forum py-8">
          <Breadcrumbs items={[{ label: 'New Topic' }]} />
          <h1 className="font-heading text-2xl sm:text-3xl font-bold mt-4">Start a Property Discussion</h1>
          <p className="mt-1 text-navy-200 text-sm">Share your experience to help thousands of Indian buyers make informed decisions.</p>
        </div>
      </div>

      <div className="container-forum py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* City */}
            <div className="card-base p-6 space-y-4">
              <h2 className="font-heading font-bold text-navy-500">Location & Property</h2>

              <div className="space-y-1.5">
                <Label htmlFor="cityId">City *</Label>
                <Controller
                  name="cityId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__metro" disabled>── Metro Cities ──</SelectItem>
                        {cities.filter((c) => c.tier === 'METRO').map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                        <SelectItem value="__tier1" disabled>── Tier 1 Cities ──</SelectItem>
                        {cities.filter((c) => c.tier === 'TIER1').map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.cityId && <p className="text-xs text-red-600">{errors.cityId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propertyName">Property / Project Name *</Label>
                <Input
                  id="propertyName"
                  placeholder="e.g. Lodha World Towers, Prestige Lakeside Habitat"
                  {...register('propertyName')}
                  onBlur={checkDuplicate}
                />
                {errors.propertyName && <p className="text-xs text-red-600">{errors.propertyName.message}</p>}
                {checkingDuplicate && <p className="text-xs text-neutral-400">Checking for duplicates…</p>}
                {duplicateWarning && (
                  <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {duplicateWarning} You can still post if this is a different discussion.
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Property Type *</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type…" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((pt) => (
                          <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyType && <p className="text-xs text-red-600">{errors.propertyType.message}</p>}
              </div>

              {/* Developer / Builder */}
              <div className="space-y-1.5">
                <Label>
                  Developer / Builder
                  <span className="ml-1.5 text-xs font-normal text-neutral-400">(optional)</span>
                </Label>
                <DeveloperPicker
                  developers={developers}
                  value={developer}
                  onChange={setDeveloper}
                />
                {developer && (
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    {developer.slug
                      ? `Linked to ${developer.name}'s profile page`
                      : `Custom builder "${developer.name}" will be saved`}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Address / Location (optional)</Label>
                <Input id="address" placeholder="e.g. Worli, Mumbai 400018" {...register('address')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="priceMin">Min Price (₹) (optional)</Label>
                  <Input id="priceMin" type="number" placeholder="e.g. 5000000" {...register('priceMin', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priceMax">Max Price (₹) (optional)</Label>
                  <Input id="priceMax" type="number" placeholder="e.g. 15000000" {...register('priceMax', { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="card-base p-6 space-y-4">
              <h2 className="font-heading font-bold text-navy-500">Discussion Details</h2>

              <div className="space-y-1.5">
                <Label htmlFor="title">Discussion Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Lodha World Towers — Is it worth the price?"
                  {...register('title')}
                />
                {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Your Experience / Review * (min 100 characters)</Label>
                <Textarea
                  id="description"
                  rows={8}
                  placeholder="Share everything you know: location advantages/disadvantages, construction quality, builder reputation, amenities, pricing fairness, possession timeline, water & electricity, neighbors, resale value…"
                  {...register('description')}
                />
                {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
              </div>
            </div>

            {/* Images */}
            <div className="card-base p-6 space-y-3">
              <h2 className="font-heading font-bold text-navy-500">Property Photos (optional)</h2>
              <p className="text-sm text-neutral-500">Upload up to 2 property photos — exterior, interior, or common areas.</p>
              <ImageUploader value={images} onChange={setImages} maxFiles={2} />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                Your post will be visible immediately after submission.
              </div>
              <div className="flex flex-col items-end gap-2">
                <TurnstileWidget onSuccess={setCfToken} onExpire={() => setCfToken('')} />
                  <Button type="submit" disabled={loading} size="lg">
                  <PlusCircle className="h-5 w-5" />
                  {loading ? 'Publishing…' : 'Publish Discussion'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
