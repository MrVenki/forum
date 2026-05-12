import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/constants/config'
import { INDIAN_CITIES } from '@/lib/constants/cities'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/cities`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/developers`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/search`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/about`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-use`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const cityPages: MetadataRoute.Sitemap = INDIAN_CITIES.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  let topicPages: MetadataRoute.Sitemap = []
  let developerPages: MetadataRoute.Sitemap = []
  try {
    const [topics, developers] = await Promise.all([
      prisma.topic.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true, city: { select: { slug: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 5000,
      }),
      prisma.developer.findMany({
        select: { slug: true, createdAt: true },
      }),
    ])
    topicPages = topics.map((t) => ({
      url: `${baseUrl}/${t.city.slug}/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
    developerPages = developers.map((d) => ({
      url: `${baseUrl}/developer/${d.slug}`,
      lastModified: d.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // DB not connected during build — skip dynamic pages
  }

  return [...staticPages, ...cityPages, ...developerPages, ...topicPages]
}
