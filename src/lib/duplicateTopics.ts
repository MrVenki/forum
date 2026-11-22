import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

/**
 * The same project is sometimes listed more than once in a city ("nivaan-meadows" and "nivaan-meadows-1").
 * Google flags the copies as duplicates and is less keen to index the city's listings at all, so every copy
 * names one main page as its canonical, and the copies stay out of the sitemap.
 */

// Short names people add to a project name, e.g. "Aparna HillPark Vizag".
const CITY_ALIASES: Record<string, string[]> = {
  bengaluru: ['bangalore', 'blr'],
  visakhapatnam: ['vizag', 'vsp'],
  hyderabad: ['hyd'],
  mumbai: ['bombay'],
  chennai: ['madras'],
  ghaziabad: ['ghz'],
  rajahmundry: ['rajamahendravaram'],
}

/** Name used to tell whether two listings in one city are the same project. */
export function projectKey(propertyName: string, cityName: string, citySlug: string): string {
  let key = propertyName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const tails = [cityName.toLowerCase(), citySlug, ...(CITY_ALIASES[citySlug] ?? [])]
  let changed = true
  while (changed) {
    changed = false
    for (const tail of tails) {
      if (key.endsWith(` ${tail}`)) {
        key = key.slice(0, -(tail.length + 1)).trim()
        changed = true
      }
    }
  }
  return key
}

/**
 * Listings count as the same project only when city, name and property type all match, and the name is not just
 * a developer's name ("Godrej Properties" in Kharadi and in Koregaon Park are different projects).
 */
export function sameProjectKey(propertyName: string, propertyType: string, city: { slug: string; name: string }, developerNames: Set<string>): string | null {
  const key = projectKey(propertyName, city.name, city.slug)
  if (!key || developerNames.has(key)) return null
  return `${city.slug}|${propertyType}|${key}`
}

/** Developer names in the same normalised form as projectKey, for sameProjectKey. */
export async function developerNameKeys(): Promise<Set<string>> {
  const devs = await prisma.developer.findMany({ select: { name: true } })
  return new Set(devs.map((d) => d.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()))
}

export interface ListingRow {
  slug: string
  propertyName: string
  propertyType: string
  ratingCount: number
  commentCount: number
  createdAt: Date
  city: { slug: string; name: string }
}

/**
 * Maps the path of every duplicate copy ("/pune/nivaan-meadows-1") to the path of its main page.
 * The main page is the copy with the most reviews and comments; on a tie, the oldest.
 */
export function duplicateMap(rows: ListingRow[], developerNames: Set<string>): Record<string, string> {
  const groups = new Map<string, ListingRow[]>()
  for (const r of rows) {
    const id = sameProjectKey(r.propertyName, r.propertyType, r.city, developerNames)
    if (!id) continue
    groups.set(id, [...(groups.get(id) ?? []), r])
  }
  const out: Record<string, string> = {}
  for (const list of Array.from(groups.values())) {
    if (list.length < 2) continue
    const [main, ...copies] = [...list].sort(
      (a, b) =>
        b.ratingCount + b.commentCount - (a.ratingCount + a.commentCount) ||
        a.createdAt.getTime() - b.createdAt.getTime() ||
        a.slug.localeCompare(b.slug)
    )
    for (const c of copies) out[`/${c.city.slug}/${c.slug}`] = `/${main.city.slug}/${main.slug}`
  }
  return out
}

/** Duplicate copy path → main page path, for every published listing. Refreshed hourly. */
export const getDuplicateMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const rows = await prisma.topic.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        propertyName: true,
        propertyType: true,
        ratingCount: true,
        commentCount: true,
        createdAt: true,
        city: { select: { slug: true, name: true } },
      },
    })
    return duplicateMap(rows, await developerNameKeys())
  },
  ['duplicate-topics-v2'],
  { revalidate: 3600 }
)

/** The main page for a listing path, or null when the listing is not a duplicate copy (or the lookup fails). */
export async function mainListingFor(path: string): Promise<string | null> {
  try {
    return (await getDuplicateMap())[path] ?? null
  } catch {
    return null
  }
}
