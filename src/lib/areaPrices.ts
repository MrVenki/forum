import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'

export const MIN_PROJECTS_PER_AREA = 2

export interface AreaTopic {
  id: string
  slug: string
  propertyName: string
  propertyType: string
  address: string
  priceMin: number
  priceMax: number | null
  avgRating: number
  ratingCount: number
  outlier?: boolean
}

export interface TypeStat {
  type: string
  n: number
  median: number
  low: number
  high: number
}

export interface Area {
  slug: string
  label: string
  pincode: string | null
  includes: string[]
  count: number
  byType: Record<string, TypeStat>
  topics: AreaTopic[]
}

const PIN = /\b[1-9]\d{5}\b/
const STATES = new Set([
  'maharashtra', 'karnataka', 'telangana', 'tamil nadu', 'india', 'west bengal', 'delhi', 'gujarat',
  'rajasthan', 'uttar pradesh', 'madhya pradesh', 'andhra pradesh', 'bihar', 'punjab', 'haryana',
])
const SUBCITIES = ['Greater Noida', 'Noida', 'Gurugram', 'Gurgaon', 'Ghaziabad', 'Faridabad', 'Pimpri-Chinchwad']
const STREETY = /\b(road|rd|avenue|street|marg|lane|highway|nh|chowk|junction|gate|circle|bypass|crossing)\b/i
const JUNK_LABEL = /(floor|tower|block|wing|survey|s\.?\s?no|plot\s*no|gat\s*no|phase\s*\d*$)/i

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

function cleanLabel(raw: string): string | null {
  const s = raw
    .replace(/\(.*$/, '')
    .replace(/^(near|off|opp\.?|opposite|behind|next to|beside)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (s.length < 3 || /^\d/.test(s) || JUNK_LABEL.test(s)) return null
  return s
}

/** Pulls a pincode and the best locality name out of a free-text address. */
export function deriveArea(address: string, propertyName: string, cityName: string) {
  const pincode = address.match(PIN)?.[0] ?? null
  const segments = address
    .replace(new RegExp(PIN, 'g'), '')
    .split(/[,/–]/)
    .map((s) => s.trim())
    .filter(Boolean)

  const pn = norm(propertyName)
  const city = norm(cityName)
  const candidates: string[] = []
  for (const seg of segments) {
    const label = cleanLabel(seg)
    if (!label) continue
    const n = norm(label)
    if (STATES.has(n) || n === city) continue
    // Drop the project's own name, but keep a locality that merely appears inside it ("Mahindra Alcove Powai" -> Powai)
    if (pn && (n === pn || n.includes(pn) || (pn.includes(n) && n.split(' ').length >= 2 && n.length / pn.length >= 0.7))) continue
    candidates.push(label)
  }

  // Prefer area names over street names: "Central Avenue, Powai" is Powai
  candidates.sort((a, b) => Number(STREETY.test(a)) - Number(STREETY.test(b)))
  let label = candidates[0] ?? null
  if (label && /^sector\s+\d+/i.test(label)) {
    const sub = SUBCITIES.find((c) => new RegExp(`\\b${c}\\b`, 'i').test(address))
    if (sub) label = `${label}, ${sub}`
  }
  return { pincode, label }
}

function median(values: number[]): number {
  const v = [...values].sort((a, b) => a - b)
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

function statFor(type: string, topics: AreaTopic[]): TypeStat {
  const mids = topics.map((t) => (t.priceMax ? (t.priceMin + t.priceMax) / 2 : t.priceMin))
  return {
    type,
    n: topics.length,
    median: median(mids),
    low: Math.min(...topics.map((t) => t.priceMin)),
    high: Math.max(...topics.map((t) => t.priceMax ?? t.priceMin)),
  }
}

const OUTLIER_FACTOR = 6
const MIN_FOR_OUTLIERS = 8

const midOf = (t: AreaTopic) => (t.priceMax ? (t.priceMin + t.priceMax) / 2 : t.priceMin)

/** Flags prices far from the city's typical for that type (likely data-entry errors); they stay listed but skip the averages. */
function flagOutliers(topics: AreaTopic[]): AreaTopic[] {
  const byType = new Map<string, number[]>()
  for (const t of topics) byType.set(t.propertyType, [...(byType.get(t.propertyType) ?? []), midOf(t)])
  const typical = new Map<string, number>()
  byType.forEach((mids, type) => {
    if (mids.length >= MIN_FOR_OUTLIERS) typical.set(type, median(mids))
  })
  return topics.map((t) => {
    const base = typical.get(t.propertyType)
    const mid = midOf(t)
    return { ...t, outlier: !!base && (mid > base * OUTLIER_FACTOR || mid < base / OUTLIER_FACTOR) }
  })
}

export function buildAreas(rawTopics: AreaTopic[], cityName: string): Area[] {
  const topics = flagOutliers(rawTopics)
  const groups = new Map<string, { pincode: string | null; labels: Map<string, number>; topics: AreaTopic[] }>()

  for (const t of topics) {
    const { pincode, label } = deriveArea(t.address, t.propertyName, cityName)
    const key = pincode ?? (label ? `l:${norm(label)}` : null)
    if (!key) continue
    const g = groups.get(key) ?? { pincode, labels: new Map<string, number>(), topics: [] as AreaTopic[] }
    g.topics.push(t)
    if (label) g.labels.set(label, (g.labels.get(label) ?? 0) + 1)
    groups.set(key, g)
  }

  const areas: Area[] = []
  for (const g of Array.from(groups.values())) {
    const counted = g.topics.filter((t) => !t.outlier)
    if (counted.length < MIN_PROJECTS_PER_AREA) continue

    const ranked = Array.from(g.labels.entries()).sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
    const [topLabel, topCount] = ranked[0] ?? [null, 0]
    const dominant = topLabel && topCount >= Math.max(2, Math.ceil(counted.length * 0.4))

    let label: string
    if (dominant) label = topLabel
    else if (g.pincode) label = `Pincode ${g.pincode}`
    else label = topLabel ?? 'Area'

    const types = Array.from(new Set(counted.map((t) => t.propertyType)))
    const byType: Record<string, TypeStat> = {}
    for (const type of types) byType[type] = statFor(type, counted.filter((t) => t.propertyType === type))

    areas.push({
      slug: slugify(g.pincode && !label.startsWith('Pincode') ? `${label}-${g.pincode}` : label),
      label,
      pincode: g.pincode,
      includes: ranked.map(([l]) => l).filter((l) => l !== label).slice(0, 5),
      count: counted.length,
      byType,
      topics: g.topics.sort((a, b) => b.ratingCount - a.ratingCount),
    })
  }

  // Slug collisions (same label in two pincodes without pincode suffix) get a numeric suffix
  const seen = new Map<string, number>()
  for (const a of areas) {
    const n = seen.get(a.slug) ?? 0
    seen.set(a.slug, n + 1)
    if (n > 0) a.slug = `${a.slug}-${n + 1}`
  }

  return areas.sort((a, b) => b.count - a.count)
}

export function cityMedian(areas: Area[], type: string): number | null {
  const mids = areas.flatMap((a) => a.topics.filter((t) => t.propertyType === type && !t.outlier).map(midOf))
  return mids.length >= 3 ? median(mids) : null
}

export async function getCityAreas(citySlug: string) {
  const city = await prisma.city.findUnique({ where: { slug: citySlug, isActive: true }, select: { id: true, name: true, slug: true, state: true } })
  if (!city) return null

  const rows = await prisma.topic.findMany({
    where: { cityId: city.id, isPublished: true, priceMin: { not: null }, address: { not: null } },
    select: {
      id: true, slug: true, propertyName: true, propertyType: true, address: true,
      priceMin: true, priceMax: true, avgRating: true, ratingCount: true,
    },
  })

  const topics: AreaTopic[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    propertyName: r.propertyName,
    propertyType: r.propertyType,
    address: r.address as string,
    priceMin: Number(r.priceMin),
    priceMax: r.priceMax ? Number(r.priceMax) : null,
    avgRating: Number(r.avgRating),
    ratingCount: r.ratingCount,
  }))

  return { city, areas: buildAreas(topics, city.name) }
}

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    APARTMENT: 'Apartments',
    VILLA: 'Villas',
    PLOT: 'Plots',
    COMMERCIAL: 'Commercial',
    PENTHOUSE: 'Penthouses',
    INDEPENDENT_HOUSE: 'Independent houses',
    BUILDER_FLOOR: 'Builder floors',
  }
  return map[type] ?? type
}

export function percentVs(value: number, base: number | null): number | null {
  if (!base) return null
  return Math.round(((value - base) / base) * 100)
}
