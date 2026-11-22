import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { ConstructionStatus, PropertyType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { cleanText, getAdmin, logEdits } from '@/lib/adminEdit'

const PROPERTY_TYPES = Object.values(PropertyType) as string[]
const STATUSES = Object.values(ConstructionStatus) as string[]

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

/** "2027-06" or "2027-06-30" → first of that month (UTC). */
function monthDate(v: unknown): Date | null | undefined {
  if (v === undefined) return undefined
  if (v === null || v === '') return null
  if (typeof v !== 'string' || !/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return undefined
  const [y, m] = v.split('-').map(Number)
  if (y < 1990 || y > 2050 || m < 1 || m > 12) return undefined
  return new Date(Date.UTC(y, m - 1, 1))
}

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ topicId: string }> }
) {
  const params = await paramsPromise
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: { city: { select: { id: true, slug: true, name: true } } },
  })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return bad('Invalid request')
  const data: Record<string, unknown> = {}

  // Wording
  if ('description' in body) {
    const d = cleanText(body.description)
    if (!d || d.length < 20) return bad('Description must be at least 20 characters.')
    data.description = d
  }
  if ('title' in body) {
    const t = cleanText(body.title, 200)
    if (!t || t.length < 5) return bad('Title must be at least 5 characters.')
    data.title = t
  }
  if ('propertyName' in body) {
    const n = cleanText(body.propertyName, 150)
    if (!n || n.length < 2) return bad('Project name is required.')
    data.propertyName = n
  }
  if ('address' in body) {
    const a = cleanText(body.address, 300)
    if (a === undefined) return bad('Invalid address')
    data.address = a
  }

  // Property type and status
  if ('propertyType' in body) {
    if (!PROPERTY_TYPES.includes(body.propertyType)) return bad('Unknown property type')
    data.propertyType = body.propertyType
  }
  if ('constructionStatus' in body) {
    if (body.constructionStatus !== null && !STATUSES.includes(body.constructionStatus)) return bad('Unknown construction status')
    data.constructionStatus = body.constructionStatus
  }
  if ('expectedPossession' in body) {
    const d = monthDate(body.expectedPossession)
    if (d === undefined) return bad('Expected possession must be a month like 2027-06.')
    data.expectedPossession = d
  }

  // Builder: either a builder from the developers list, or a plain name with no builder page
  if ('developerSlug' in body || 'developerName' in body) {
    if (body.developerSlug) {
      const dev = await prisma.developer.findUnique({ where: { slug: String(body.developerSlug) }, select: { slug: true, name: true } })
      if (!dev) return bad('Builder not found in the developers list.')
      data.developerSlug = dev.slug
      data.developerName = dev.name
    } else {
      const n = cleanText(body.developerName, 150)
      if (n === undefined) return bad('Invalid builder name')
      data.developerSlug = null
      data.developerName = n
    }
  }

  // Toggle publish
  if (typeof body.isPublished === 'boolean') {
    data.isPublished = body.isPublished
  }

  // Remove images
  if (body.removeImage1 === true && topic.image1PubId) {
    await cloudinary.uploader.destroy(topic.image1PubId).catch(() => {})
    data.image1Url = null
    data.image1PubId = null
  }
  if (body.removeImage2 === true && topic.image2PubId) {
    await cloudinary.uploader.destroy(topic.image2PubId).catch(() => {})
    data.image2Url = null
    data.image2PubId = null
  }

  // Correct listed prices (rupees). priceMax may be null for "from" prices.
  if ('priceMin' in body || 'priceMax' in body) {
    const MIN = 100_000 // ₹1 lakh
    const MAX = 10_000_000_000 // ₹1,000 crore
    const min = body.priceMin === null || body.priceMin === '' ? null : Number(body.priceMin)
    const max = body.priceMax === null || body.priceMax === undefined || body.priceMax === '' ? null : Number(body.priceMax)
    if (min === null && max === null && body.allowNoPrice === true) {
      data.priceMin = null
      data.priceMax = null
    } else {
      if (min === null || !Number.isFinite(min) || min < MIN || min > MAX) {
        return bad('Minimum price must be between ₹1 lakh and ₹1,000 crore.')
      }
      if (max !== null && (!Number.isFinite(max) || max < min || max > MAX)) {
        return bad('Maximum price must be at least the minimum price.')
      }
      data.priceMin = Math.round(min)
      data.priceMax = max === null ? null : Math.round(max)
    }
  }

  // Move to another city. The page address changes, so the old one redirects.
  let newCity: { id: string; slug: string; name: string } | null = null
  if (typeof body.cityId === 'string' && body.cityId !== topic.cityId) {
    newCity = await prisma.city.findUnique({ where: { id: body.cityId }, select: { id: true, slug: true, name: true } })
    if (!newCity) return bad('City not found')
    const clash = await prisma.topic.findFirst({ where: { cityId: newCity.id, slug: topic.slug }, select: { id: true } })
    if (clash) return bad(`${newCity.name} already has a listing at /${newCity.slug}/${topic.slug}. Rename or merge that one first.`)
    data.cityId = newCity.id
  }

  if (Object.keys(data).length === 0) return bad('Nothing to update')

  await prisma.topic.update({ where: { id: params.topicId }, data })

  if (newCity) {
    try {
      // Old address → this listing. If it is moving back to a city it was in before, drop that redirect.
      await prisma.topicRedirect.deleteMany({ where: { cityId: newCity.id, slug: topic.slug } })
      await prisma.topicRedirect.upsert({
        where: { cityId_slug: { cityId: topic.cityId, slug: topic.slug } },
        create: { cityId: topic.cityId, slug: topic.slug, topicId: topic.id },
        update: { topicId: topic.id },
      })
    } catch (err) {
      console.error('[admin] could not save the old-address redirect:', err)
    }
  }

  const citySlug = newCity?.slug ?? topic.city.slug
  const before: Record<string, unknown> = { ...topic, cityId: topic.city.name }
  const after: Record<string, unknown> = { ...data }
  if (newCity) after.cityId = newCity.name
  // Image ids are noise in the log; record the removal once
  delete after.image1PubId
  delete after.image2PubId
  await logEdits(
    admin,
    { type: 'TOPIC', id: topic.id, label: (data.propertyName as string) ?? topic.propertyName, url: `/${citySlug}/${topic.slug}` },
    before,
    after,
  )

  // Revalidate affected pages
  revalidatePath(`/${topic.city.slug}/${topic.slug}`)
  revalidatePath(`/${topic.city.slug}`)
  if (newCity) {
    revalidatePath(`/${newCity.slug}/${topic.slug}`)
    revalidatePath(`/${newCity.slug}`)
    revalidatePath(`/${newCity.slug}/prices`, 'layout')
    revalidatePath(`/${topic.city.slug}/prices`, 'layout')
  }
  revalidatePath('/')
  if ('priceMin' in data) revalidatePath(`/${citySlug}/prices`, 'layout')

  return NextResponse.json({ success: true, url: `/${citySlug}/${topic.slug}` })
}
