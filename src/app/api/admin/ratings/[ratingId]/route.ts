import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { AudienceType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { cleanText, getAdmin, logEdits } from '@/lib/adminEdit'

const OWNERSHIP = Object.values(AudienceType) as string[]

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

function monthDate(v: unknown): Date | null | undefined {
  if (v === null || v === '') return null
  if (typeof v !== 'string' || !/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return undefined
  const [y, m] = v.split('-').map(Number)
  if (y < 1990 || y > 2050 || m < 1 || m > 12) return undefined
  return new Date(Date.UTC(y, m - 1, 1))
}

async function loadRating(id: string) {
  return prisma.rating.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, username: true } },
      topic: { select: { id: true, slug: true, propertyName: true, city: { select: { slug: true } } } },
    },
  })
}

async function recalcTopic(topicId: string) {
  const agg = await prisma.rating.aggregate({ where: { topicId }, _avg: { score: true }, _count: { score: true } })
  await prisma.topic.update({ where: { id: topicId }, data: { avgRating: agg._avg.score ?? 0, ratingCount: agg._count.score } })
}

/** Fix the wording or facts of a review. The star scores are the member's opinion and stay as they are. */
export async function PATCH(req: NextRequest, { params: paramsPromise }: { params: Promise<{ ratingId: string }> }) {
  const params = await paramsPromise
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const rating = await loadRating(params.ratingId)
  if (!rating) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return bad('Invalid request')
  const data: Record<string, unknown> = {}

  // Same limits as the member's own review form
  for (const [field, max] of [['review', 2000], ['pros', 300], ['cons', 300]] as const) {
    if (field in body) {
      const v = cleanText(body[field], max + 1)
      if (v === undefined) return bad(`Invalid ${field}`)
      if (v && v.length > max) return bad(`Keep the ${field === 'review' ? 'review' : field} under ${max} characters.`)
      data[field] = v
    }
  }
  if ('ownership' in body) {
    if (body.ownership !== null && !OWNERSHIP.includes(body.ownership)) return bad('Unknown ownership')
    data.ownership = body.ownership
  }
  for (const field of ['promisedPossession', 'actualPossession'] as const) {
    if (field in body) {
      const d = monthDate(body[field])
      if (d === undefined) return bad('Possession dates must be a month like 2027-06.')
      data[field] = d
    }
  }
  if ('maintenancePerSqFt' in body) {
    const v = body.maintenancePerSqFt
    if (v === null || v === '') data.maintenancePerSqFt = null
    else {
      const n = Number(v)
      if (!Number.isFinite(n) || n < 0.5 || n > 50) return bad('Maintenance must be between ₹0.5 and ₹50 per sq ft.')
      data.maintenancePerSqFt = Math.round(n * 100) / 100
    }
  }
  if (Object.keys(data).length === 0) return bad('Nothing to update')

  // Keep the review's date and place in the list: an admin fix is not a new review
  await prisma.rating.update({ where: { id: rating.id }, data: { ...data, updatedAt: rating.updatedAt } })

  const who = rating.user.username ? `@${rating.user.username}` : rating.user.name
  const url = `/${rating.topic.city.slug}/${rating.topic.slug}#review-${rating.id}`
  await logEdits(admin, { type: 'RATING', id: rating.id, label: `${who}'s review of ${rating.topic.propertyName}`, url }, rating, data)

  revalidatePath(`/${rating.topic.city.slug}/${rating.topic.slug}`)
  return NextResponse.json({ success: true })
}

/** Remove a review for good (spam, abuse, or a duplicate). The project's average is recalculated. */
export async function DELETE(_req: NextRequest, { params: paramsPromise }: { params: Promise<{ ratingId: string }> }) {
  const params = await paramsPromise
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const rating = await loadRating(params.ratingId)
  if (!rating) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.rating.delete({ where: { id: rating.id } })
  await recalcTopic(rating.topic.id)

  const who = rating.user.username ? `@${rating.user.username}` : rating.user.name
  // The deleted text stays in the edit log so it can be read back later
  await logEdits(
    admin,
    { type: 'RATING', id: rating.id, label: `${who}'s review of ${rating.topic.propertyName} (deleted)`, url: `/${rating.topic.city.slug}/${rating.topic.slug}` },
    { deleted: `${rating.score}★ ${rating.review ?? ''}`.trim() },
    { deleted: null },
  )

  revalidatePath(`/${rating.topic.city.slug}/${rating.topic.slug}`)
  revalidatePath(`/${rating.topic.city.slug}`)
  return NextResponse.json({ success: true })
}
