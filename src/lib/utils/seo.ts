import { SITE_CONFIG } from '@/lib/constants/config'
import type { Metadata } from 'next'

export function buildMetadata({
  title,
  description,
  path = '',
  ogImage,
  noindex = false,
  type = 'website',
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  noindex?: boolean
  type?: 'website' | 'article'
}): Metadata {
  const url = `${SITE_CONFIG.url}${path}`
  const image = ogImage || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`

  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: 'en_IN',
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: SITE_CONFIG.twitterHandle,
    },
  }
}
