import { prisma } from '@/lib/prisma'
import { getCityAreas } from '@/lib/areaPrices'

export interface CompareProject {
  id: string
  slug: string
  name: string
  type: string
  address: string | null
  developerName: string | null
  priceMin: number | null
  priceMax: number | null
  avgRating: number
  ratingCount: number
  commentCount: number
  status: string | null
  dims: { constructionQuality: number | null; maintenanceScore: number | null; amenitiesScore: number | null; builderScore: number | null }
  maintenancePerSqFt: number | null
  areaLabel: string | null
  areaTypical: number | null
  pros: string[]
  cons: string[]
}

export const PAIR_SEPARATOR = '-vs-'

export function pairSlug(a: string, b: string): string {
  const [x, y] = [a, b].sort()
  return `${x}${PAIR_SEPARATOR}${y}`
}

const mid = (min: number | null, max: number | null) => (min == null ? null : max ? (min + max) / 2 : min)

function avg(values: (number | null)[]): number | null {
  const v = values.filter((n): n is number => n != null)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

function median(values: number[]): number | null {
  if (values.length < 2) return null
  const v = [...values].sort((a, b) => a - b)
  const m = Math.floor(v.length / 2)
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2
}

/** Splits "a-vs-b" into candidate slug pairs (a project slug may itself contain "-vs-"). */
export function candidatePairs(pair: string): [string, string][] {
  const out: [string, string][] = []
  let idx = pair.indexOf(PAIR_SEPARATOR)
  while (idx !== -1) {
    out.push([pair.slice(0, idx), pair.slice(idx + PAIR_SEPARATOR.length)])
    idx = pair.indexOf(PAIR_SEPARATOR, idx + 1)
  }
  return out
}

export async function getComparison(citySlug: string, pair: string) {
  const city = await prisma.city.findUnique({ where: { slug: citySlug, isActive: true }, select: { id: true, name: true, slug: true } })
  if (!city) return null

  for (const [slugA, slugB] of candidatePairs(pair)) {
    if (slugA === slugB) continue
    const topics = await prisma.topic.findMany({
      where: { cityId: city.id, isPublished: true, slug: { in: [slugA, slugB] } },
      select: {
        id: true, slug: true, propertyName: true, propertyType: true, address: true, developerName: true,
        priceMin: true, priceMax: true, avgRating: true, ratingCount: true, commentCount: true, constructionStatus: true,
        ratings: {
          select: {
            constructionQuality: true, maintenanceScore: true, amenitiesScore: true, builderScore: true,
            maintenancePerSqFt: true, pros: true, cons: true,
          },
        },
      },
    })
    if (topics.length !== 2) continue

    const { areas } = (await getCityAreas(city.slug)) ?? { areas: [] }

    const build = (t: (typeof topics)[number]): CompareProject => {
      const priceMin = t.priceMin ? Number(t.priceMin) : null
      const priceMax = t.priceMax ? Number(t.priceMax) : null
      const area = areas.find((a) => a.topics.some((x) => x.id === t.id))
      const stat = area?.byType[t.propertyType]
      return {
        id: t.id,
        slug: t.slug,
        name: t.propertyName,
        type: t.propertyType,
        address: t.address,
        developerName: t.developerName,
        priceMin,
        priceMax,
        avgRating: Number(t.avgRating),
        ratingCount: t.ratingCount,
        commentCount: t.commentCount,
        status: t.constructionStatus,
        dims: {
          constructionQuality: avg(t.ratings.map((r) => r.constructionQuality)),
          maintenanceScore: avg(t.ratings.map((r) => r.maintenanceScore)),
          amenitiesScore: avg(t.ratings.map((r) => r.amenitiesScore)),
          builderScore: avg(t.ratings.map((r) => r.builderScore)),
        },
        maintenancePerSqFt: median(t.ratings.map((r) => (r.maintenancePerSqFt ? Number(r.maintenancePerSqFt) : null)).filter((n): n is number => n != null)),
        areaLabel: area && stat && stat.n >= 2 ? area.label : null,
        areaTypical: area && stat && stat.n >= 2 ? stat.median : null,
        pros: t.ratings.map((r) => r.pros).filter((x): x is string => !!x).slice(0, 3),
        cons: t.ratings.map((r) => r.cons).filter((x): x is string => !!x).slice(0, 3),
      }
    }

    const bySlug = new Map(topics.map((t) => [t.slug, build(t)]))
    const a = bySlug.get(slugA)!
    const b = bySlug.get(slugB)!
    // Canonical order is alphabetical by slug
    const [first, second] = a.slug < b.slug ? [a, b] : [b, a]
    return { city, a: first, b: second, canonical: pairSlug(a.slug, b.slug) }
  }
  return null
}

/** Same-city, same-type projects with the closest price, for "compare with" links. */
export async function getPeers(topic: { id: string; cityId: string; propertyType: string; priceMin: number | null; priceMax: number | null }, take = 3) {
  const target = mid(topic.priceMin, topic.priceMax)
  if (target == null) return []
  const rows = await prisma.topic.findMany({
    where: {
      cityId: topic.cityId, isPublished: true, propertyType: topic.propertyType as 'APARTMENT',
      priceMin: { not: null }, id: { not: topic.id },
    },
    select: { slug: true, propertyName: true, priceMin: true, priceMax: true, ratingCount: true, commentCount: true },
  })
  return rows
    .map((r) => ({
      slug: r.slug,
      name: r.propertyName,
      engagement: r.ratingCount + r.commentCount,
      distance: Math.abs((mid(Number(r.priceMin), r.priceMax ? Number(r.priceMax) : null) as number) - target),
    }))
    .filter((r) => r.engagement > 0)
    .sort((x, y) => x.distance - y.distance)
    .slice(0, take)
}

/** Sitemap pairs: each reviewed project with its 2 nearest-priced reviewed peers, capped. */
export async function getComparePairs(limit = 1500): Promise<{ city: string; pair: string }[]> {
  const rows = await prisma.topic.findMany({
    where: { isPublished: true, priceMin: { not: null }, ratingCount: { gt: 0 } },
    select: { slug: true, propertyType: true, priceMin: true, priceMax: true, city: { select: { slug: true } } },
  })

  const groups = new Map<string, typeof rows>()
  for (const r of rows) {
    const key = `${r.city.slug}|${r.propertyType}`
    groups.set(key, [...(groups.get(key) ?? []), r])
  }

  const seen = new Set<string>()
  const out: { city: string; pair: string }[] = []
  for (const [key, list] of Array.from(groups.entries())) {
    const city = key.split('|')[0]
    const midOf = (r: (typeof rows)[number]) => (r.priceMax ? (Number(r.priceMin) + Number(r.priceMax)) / 2 : Number(r.priceMin))
    for (const t of list) {
      const peers = list
        .filter((p) => p.slug !== t.slug)
        .sort((x, y) => Math.abs(midOf(x) - midOf(t)) - Math.abs(midOf(y) - midOf(t)))
        .slice(0, 2)
      for (const p of peers) {
        const pair = pairSlug(t.slug, p.slug)
        const id = `${city}/${pair}`
        if (seen.has(id)) continue
        seen.add(id)
        out.push({ city, pair })
        if (out.length >= limit) return out
      }
    }
  }
  return out
}
