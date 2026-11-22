import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'

/** Community posts: questions and experiences that are not about one project. */

export const POST_KINDS = ['QUESTION', 'EXPERIENCE'] as const
export type PostKind = (typeof POST_KINDS)[number]

export const COMMUNITY_CATEGORIES = [
  { slug: 'builders', label: 'Builders', chip: 'bg-navy-50 text-navy-500' },
  { slug: 'areas', label: 'Areas & localities', chip: 'bg-teal-light text-teal-dark' },
  { slug: 'home-loans', label: 'Home loans', chip: 'bg-saffron-50 text-saffron-700' },
  { slug: 'legal', label: 'Legal & documents', chip: 'bg-purple-50 text-purple-700' },
  { slug: 'buying-process', label: 'Buying process', chip: 'bg-sky-50 text-sky-700' },
  { slug: 'nri', label: 'NRI', chip: 'bg-rose-50 text-rose-700' },
  { slug: 'renting', label: 'Renting', chip: 'bg-lime-50 text-lime-700' },
] as const

export type CategorySlug = (typeof COMMUNITY_CATEGORIES)[number]['slug']
const CATEGORY_SLUGS = COMMUNITY_CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]]

export function getCategory(slug: string) {
  return COMMUNITY_CATEGORIES.find((c) => c.slug === slug) ?? COMMUNITY_CATEGORIES[0]
}

/** A post leaves noindex once it has this many replies from members other than its author. */
export const INDEX_MIN_REPLIES = 2
/** A "Most helpful" tag needs at least this many Helpful votes. */
export const MOST_HELPFUL_MIN_VOTES = 2
/** Open reports from different members that hide an item until an admin looks at it. */
export const REPORTS_TO_HIDE = 3

export const createPostSchema = z.object({
  kind: z.enum(POST_KINDS),
  title: z.string().trim().min(15, 'The title needs at least 15 characters').max(150, 'Keep the title under 150 characters'),
  body: z.string().trim().max(5000, 'Keep it under 5000 characters').default(''),
  category: z.enum(CATEGORY_SLUGS, { message: 'Pick a topic' }),
  citySlug: z.string().trim().max(60).optional().nullable(),
})

export const createReplySchema = z.object({
  content: z.string().trim().min(10, 'Write at least 10 characters').max(5000, 'Keep it under 5000 characters'),
  parentId: z.string().max(40).optional().nullable(),
})

export const targetSchema = z.object({
  targetType: z.enum(['POST', 'REPLY']),
  targetId: z.string().min(1).max(40),
})

/** An Indian mobile number, written with or without +91, spaces or dashes. */
const PHONE_RE = /(?:\+?91[\s-]?)?(?<!\d)[6-9]\d{4}[\s-]?\d{5}(?!\d)/
const LINK_RE = /(https?:\/\/|www\.)\S+/i
const NEW_ACCOUNT_MS = 7 * 24 * 60 * 60 * 1000

/** Returns an error message when text breaks the posting rules, or null when it is fine. */
export function checkContentRules(text: string, accountCreatedAt: Date): string | null {
  if (PHONE_RE.test(text)) return 'Please remove the phone number. Members talk here, not over calls.'
  if (LINK_RE.test(text) && Date.now() - accountCreatedAt.getTime() < NEW_ACCOUNT_MS) {
    return 'New accounts can post links after 7 days. Please remove the link.'
  }
  return null
}

/** A unique URL slug from the title, with -2, -3 … when the title was used before. */
export async function uniquePostSlug(title: string): Promise<string> {
  const base = slugify(title).slice(0, 80).replace(/-+$/g, '') || 'post'
  for (let i = 1; i <= 20; i++) {
    const slug = i === 1 ? base : `${base}-${i}`
    const taken = await prisma.communityPost.findUnique({ where: { slug }, select: { id: true } })
    if (!taken) return slug
  }
  return `${base}-${Date.now().toString(36)}`
}

export interface MentionedProject {
  name: string
  href: string
  avgRating: number
  ratingCount: number
  city: string
}

type ProjectRow = { propertyName: string; slug: string; avgRating: unknown; ratingCount: number; city: { slug: string; name: string } }

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Loads project names once per render so many texts can be matched against them. */
export async function loadProjectNames(): Promise<ProjectRow[]> {
  return prisma.topic.findMany({
    where: { isPublished: true },
    select: { propertyName: true, slug: true, avgRating: true, ratingCount: true, city: { select: { slug: true, name: true } } },
    take: 5000,
  })
}

/**
 * Projects named in a piece of text (whole words, case-insensitive).
 * Short names (under 6 letters) are skipped because they match ordinary words too often.
 * When two projects share a name, the one in the post's city wins.
 */
export function findMentionedProjects(text: string, projects: ProjectRow[], citySlug?: string | null, max = 5): MentionedProject[] {
  const found = new Map<string, ProjectRow>()
  for (const p of projects) {
    const name = p.propertyName.trim()
    if (name.length < 6) continue
    const key = name.toLowerCase()
    const existing = found.get(key)
    if (existing && (existing.city.slug === citySlug || p.city.slug !== citySlug)) continue
    if (new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(name)}($|[^\\p{L}\\p{N}])`, 'iu').test(text)) found.set(key, p)
  }
  return [...found.values()].slice(0, max).map((p) => ({
    name: p.propertyName,
    href: `/${p.city.slug}/${p.slug}`,
    avgRating: Number(p.avgRating),
    ratingCount: p.ratingCount,
    city: p.city.name,
  }))
}

export interface PostListItem {
  id: string
  kind: PostKind
  title: string
  slug: string
  category: string
  replyCount: number
  createdAt: string
  city: { name: string; slug: string } | null
}

/** Latest visible posts for lists. Returns [] when the tables are not there yet. */
export async function getLatestPosts(opts: { take?: number; cityId?: string; skip?: number; kind?: PostKind; category?: string } = {}): Promise<PostListItem[]> {
  try {
    const rows = await prisma.communityPost.findMany({
      where: {
        isHidden: false,
        isDeleted: false,
        ...(opts.cityId ? { cityId: opts.cityId } : {}),
        ...(opts.kind ? { kind: opts.kind } : {}),
        ...(opts.category ? { category: opts.category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: opts.take ?? 5,
      skip: opts.skip ?? 0,
      select: { id: true, kind: true, title: true, slug: true, category: true, replyCount: true, createdAt: true, city: { select: { name: true, slug: true } } },
    })
    return rows.map((r) => ({ ...r, kind: r.kind as PostKind, createdAt: r.createdAt.toISOString() }))
  } catch (err) {
    console.error('[community] could not load posts:', err)
    return []
  }
}
