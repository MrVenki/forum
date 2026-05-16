import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/cities', '/*'],
        disallow: ['/api/', '/admin/', '/new-topic', '/search', '/login', '/register', '/profile/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  }
}
