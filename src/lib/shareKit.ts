import { prisma } from '@/lib/prisma'
import { formatINR } from '@/lib/utils/format'
import { getCityAreas, percentVs } from '@/lib/areaPrices'

export interface ShareSummary {
  topicId: string
  name: string
  city: string
  path: string
  priceMin: number | null
  priceMax: number | null
  ratingAvg: number | null
  ratingCount: number
  commentCount: number
  pro: string | null
  con: string | null
  maintenance: number | null
  possessionDelay: number | null
  areaLabel: string | null
  areaDiff: number | null
}

export type Channel = 'whatsapp' | 'reddit' | 'quora'

function median(values: number[]): number {
  const v = [...values].sort((a, b) => a - b)
  const m = Math.floor(v.length / 2)
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2
}

const monthsBetween = (a: Date, b: Date) => (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth())

/** Summaries built only from real members' ratings and comments; seeded demo content is never exported. */
export async function getShareSummaries(opts: { topicIds?: string[]; citySlug?: string; take?: number }): Promise<ShareSummary[]> {
  const topics = await prisma.topic.findMany({
    where: {
      isPublished: true,
      ...(opts.topicIds ? { id: { in: opts.topicIds } } : {}),
      ...(opts.citySlug ? { city: { slug: opts.citySlug } } : {}),
    },
    select: {
      id: true, slug: true, propertyName: true, propertyType: true, priceMin: true, priceMax: true,
      city: { select: { name: true, slug: true } },
      ratings: {
        where: { user: { isSeeded: false } },
        orderBy: { updatedAt: 'desc' },
        select: { score: true, pros: true, cons: true, maintenancePerSqFt: true, promisedPossession: true, actualPossession: true },
      },
      _count: { select: { comments: { where: { isDeleted: false, user: { isSeeded: false } } } } },
    },
  })

  const areasByCity = new Map<string, Awaited<ReturnType<typeof getCityAreas>>>()
  const out: ShareSummary[] = []
  for (const t of topics) {
    if (!areasByCity.has(t.city.slug)) areasByCity.set(t.city.slug, await getCityAreas(t.city.slug))
    const area = areasByCity.get(t.city.slug)?.areas.find((a) => a.topics.some((x) => x.id === t.id))
    const stat = area?.byType[t.propertyType]
    const priceMin = t.priceMin ? Number(t.priceMin) : null
    const priceMax = t.priceMax ? Number(t.priceMax) : null
    const mid = priceMin == null ? null : priceMax ? (priceMin + priceMax) / 2 : priceMin

    const maint = t.ratings.map((r) => (r.maintenancePerSqFt ? Number(r.maintenancePerSqFt) : null)).filter((n): n is number => n != null)
    const delays = t.ratings
      .filter((r) => r.promisedPossession && r.actualPossession)
      .map((r) => monthsBetween(r.promisedPossession as Date, r.actualPossession as Date))

    out.push({
      topicId: t.id,
      name: t.propertyName,
      city: t.city.name,
      path: `/${t.city.slug}/${t.slug}`,
      priceMin,
      priceMax,
      ratingAvg: t.ratings.length ? t.ratings.reduce((n, r) => n + r.score, 0) / t.ratings.length : null,
      ratingCount: t.ratings.length,
      commentCount: t._count.comments,
      pro: t.ratings.find((r) => r.pros)?.pros ?? null,
      con: t.ratings.find((r) => r.cons)?.cons ?? null,
      maintenance: maint.length >= 2 ? median(maint) : null,
      possessionDelay: delays.length >= 2 ? Math.round(median(delays)) : null,
      areaLabel: area && stat && stat.n >= 2 ? area.label : null,
      areaDiff: area && stat && stat.n >= 2 && mid ? percentVs(mid, stat.median) : null,
    })
  }

  out.sort((a, b) => b.ratingCount + b.commentCount - (a.ratingCount + a.commentCount))
  return opts.take ? out.slice(0, opts.take) : out
}

export function shareUrl(siteUrl: string, s: ShareSummary, channel: Channel): string {
  return `${siteUrl}${s.path}?utm_source=${channel}&utm_medium=share&utm_campaign=sharekit`
}

function facts(s: ShareSummary): string[] {
  const lines: string[] = []
  if (s.ratingAvg !== null) {
    lines.push(`Rated ${s.ratingAvg.toFixed(1)}/5 by ${s.ratingCount} member${s.ratingCount !== 1 ? 's' : ''}${s.commentCount ? `, ${s.commentCount} comment${s.commentCount !== 1 ? 's' : ''}` : ''}`)
  } else if (s.commentCount) {
    lines.push(`${s.commentCount} comment${s.commentCount !== 1 ? 's' : ''} from members, no ratings yet`)
  }
  if (s.priceMin) {
    const price = s.priceMax && s.priceMax !== s.priceMin ? `${formatINR(s.priceMin)} – ${formatINR(s.priceMax)}` : `from ${formatINR(s.priceMin)}`
    const vs = s.areaDiff !== null && s.areaLabel && Math.abs(s.areaDiff) >= 3
      ? ` (${Math.abs(s.areaDiff)}% ${s.areaDiff > 0 ? 'above' : 'below'} typical for ${s.areaLabel})`
      : ''
    lines.push(`Listed price: ${price}${vs}`)
  }
  if (s.possessionDelay !== null) {
    lines.push(s.possessionDelay <= 0 ? 'Owners report possession on or before the promised date' : `Owners report possession about ${s.possessionDelay} months after the promised date`)
  }
  if (s.maintenance !== null) lines.push(`Residents report maintenance of about ₹${s.maintenance.toFixed(1)} per sq ft per month`)
  if (s.pro) lines.push(`Liked: ${s.pro}`)
  if (s.con) lines.push(`Watch out for: ${s.con}`)
  return lines
}

export function buildShareTexts(s: ShareSummary, siteUrl: string) {
  const hasReviews = s.ratingCount + s.commentCount > 0
  const f = facts(s)

  const whatsapp = [
    `*${s.name}, ${s.city}*`,
    ...(hasReviews ? f : [...f, 'No member reviews yet.']),
    '',
    `${hasReviews ? 'Read the reviews' : 'Visited or booked here? Share your experience'}: ${shareUrl(siteUrl, s, 'whatsapp')}`,
  ].join('\n')

  const redditTitle = hasReviews
    ? `${s.name}, ${s.city}: what members have said so far`
    : `Has anyone visited or booked ${s.name} in ${s.city}? Looking for honest experiences`

  const reddit = [
    hasReviews
      ? `Pulling together what members have shared about ${s.name} (${s.city}) for anyone researching it:`
      : `Researching ${s.name} in ${s.city} and there's very little independent feedback around. Some basics:`,
    '',
    ...f.map((l) => `- ${l}`),
    '',
    hasReviews
      ? `Full thread with the individual reviews: ${shareUrl(siteUrl, s, 'reddit')}`
      : `If you've visited, booked or live there, I'd like to hear about construction quality, possession timelines and maintenance. Thread: ${shareUrl(siteUrl, s, 'reddit')}`,
    '',
    '*Disclosure: I run IndiaPropertyTalk, the forum linked above.*',
  ].join('\n')

  const quora = [
    hasReviews
      ? `Here is what members of IndiaPropertyTalk have reported about ${s.name}, ${s.city}.`
      : `There isn't much independent feedback on ${s.name}, ${s.city} yet. The basics:`,
    f.length ? f.join('. ') + '.' : '',
    `Before booking, also check the project and builder on your state RERA portal for registration, completion date and complaints.`,
    `Reviews and discussion: ${shareUrl(siteUrl, s, 'quora')} (I run IndiaPropertyTalk.)`,
  ]
    .filter(Boolean)
    .join('\n\n')

  return { whatsapp, redditTitle, reddit, quora }
}
