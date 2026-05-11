import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/constants/config'
import { INDIAN_CITIES } from '@/lib/constants/cities'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const cityPages: MetadataRoute.Sitemap = INDIAN_CITIES.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  let topicPages: MetadataRoute.Sitemap = []
  try {
    const topics = await prisma.topic.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, city: { select: { slug: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    })
    topicPages = topics.map((t) => ({
      url: `${baseUrl}/${t.city.slug}/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not connected during build — skip topic pages
  }

  return [...staticPages, ...cityPages, ...topicPages]
}
