import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/constants/config'
import { INDIAN_CITIES } from '@/lib/constants/cities'
import { getCityAreas } from '@/lib/areaPrices'
import { getComparePairs } from '@/lib/compare'
import { INDEX_MIN_REPLIES } from '@/lib/community'
import { getDuplicateMap } from '@/lib/duplicateTopics'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/cities`, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/developers`, changeFrequency: 'weekly',  priority: 0.8 },
    // Tools hub + individual calculators — high-value SEO pages
    { url: `${baseUrl}/tools`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/emi-calculator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/stamp-duty-calculator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/home-loan-eligibility`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/rent-vs-buy`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/loan-against-fd`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-use`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // lastModified is only sent when it is real: Google ignores lastmod on sites where it is always "now".
  const cityPages: MetadataRoute.Sitemap = INDIAN_CITIES.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  let topicPages: MetadataRoute.Sitemap = []
  let pricePages: MetadataRoute.Sitemap = []
  let comparePages: MetadataRoute.Sitemap = []
  let developerPages: MetadataRoute.Sitemap = []
  try {
    const topics = await prisma.topic.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, city: { select: { slug: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    })
    // Second listings of the same project name the main one as canonical, so only the main one is listed here
    const duplicates = await getDuplicateMap().catch(() => ({} as Record<string, string>))
    topicPages = topics.filter((t) => !duplicates[`/${t.city.slug}/${t.slug}`]).map((t) => ({
      url: `${baseUrl}/${t.city.slug}/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    // A city page changes when one of its topics does; the home page when any topic does.
    const latestByCity = new Map<string, Date>()
    for (const t of topics) {
      const prev = latestByCity.get(t.city.slug)
      if (!prev || t.updatedAt > prev) latestByCity.set(t.city.slug, t.updatedAt)
    }
    for (const page of cityPages) {
      const slug = page.url.slice(baseUrl.length + 1)
      const latest = latestByCity.get(slug)
      if (latest) page.lastModified = latest
    }
    if (topics[0]) staticPages[0].lastModified = topics[0].updatedAt

    // Only include developer pages with ≥3 published topics.
    // Thin developer pages (0-2 topics) waste crawl budget and dilute quality signals —
    // they're noindexed at the page level too, so excluding from sitemap is consistent.
    const developerTopicCounts = await prisma.topic.groupBy({
      by: ['developerSlug'],
      where: { isPublished: true, developerSlug: { not: null } },
      _count: { _all: true },
      having: { developerSlug: { _count: { gte: 3 } } },
    })
    const qualifiedSlugs = new Set(developerTopicCounts.map((d) => d.developerSlug!))
    const developers = await prisma.developer.findMany({
      where: { slug: { in: [...qualifiedSlugs] } },
      select: { slug: true, createdAt: true },
    })
    developerPages = developers.map((d) => ({
      url: `${baseUrl}/developer/${d.slug}`,
      lastModified: d.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    for (const c of INDIAN_CITIES) {
      const data = await getCityAreas(c.slug)
      if (!data || data.areas.length < 2) continue
      pricePages.push({ url: `${baseUrl}/${c.slug}/prices`, changeFrequency: 'weekly' as const, priority: 0.7 })
      for (const a of data.areas) {
        pricePages.push({ url: `${baseUrl}/${c.slug}/prices/${a.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })
      }
    }

    comparePages = (await getComparePairs()).map((c) => ({
      url: `${baseUrl}/${c.city}/compare/${c.pair}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch {
    // DB not connected during build — skip dynamic pages
  }

  // Community posts: only the ones that have left noindex (replies from members other than the author)
  let communityPages: MetadataRoute.Sitemap = []
  try {
    const rows = await prisma.$queryRaw<{ slug: string; updatedAt: Date }[]>`
      SELECT p."slug", p."updatedAt" FROM "public"."community_posts" p
      WHERE p."isHidden" = false AND p."isDeleted" = false
        AND (SELECT count(*) FROM "public"."community_replies" r
             WHERE r."postId" = p."id" AND r."isDeleted" = false AND r."isHidden" = false AND r."userId" <> p."userId") >= ${INDEX_MIN_REPLIES}
      ORDER BY p."updatedAt" DESC LIMIT 5000`
    communityPages = rows.map((r) => ({ url: `${baseUrl}/community/${r.slug}`, lastModified: r.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 }))
    const visible = await prisma.communityPost.count({ where: { isHidden: false, isDeleted: false } })
    if (visible >= 3) communityPages.unshift({ url: `${baseUrl}/community`, changeFrequency: 'daily' as const, priority: 0.7 })
  } catch {
    // Community tables not created yet — skip
  }

  return [...staticPages, ...cityPages, ...pricePages, ...comparePages, ...developerPages, ...topicPages, ...communityPages]
}
