export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'IndiaPropertyTalk',
  tagline: 'Honest Property Discussions by Real Indians',
  description:
    'Join India\'s most trusted property forum. Discuss real estate in Mumbai, Delhi, Bengaluru, Hyderabad and 18 more cities. Read honest reviews, ratings, and Q&A from real buyers and residents.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-default.jpg',
  twitterHandle: '@IndiaPropertyTalk',
  keywords: [
    'India property forum',
    'real estate discussion India',
    'Mumbai property reviews',
    'Delhi apartments forum',
    'Bengaluru real estate',
    'property ratings India',
    'housing discussion',
  ],
}

export const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment / Flat' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'PLOT', label: 'Plot / Land' },
  { value: 'COMMERCIAL', label: 'Commercial Property' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'INDEPENDENT_HOUSE', label: 'Independent House' },
  { value: 'BUILDER_FLOOR', label: 'Builder Floor' },
] as const

export const REACTION_TYPES = [
  { value: 'LIKE', label: '👍 Like', emoji: '👍' },
  { value: 'HELPFUL', label: '🙏 Helpful', emoji: '🙏' },
  { value: 'INFORMATIVE', label: '💡 Informative', emoji: '💡' },
  { value: 'DISLIKE', label: '👎 Dislike', emoji: '👎' },
] as const

export const PAGINATION = {
  TOPICS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 30,
  SEARCH_PER_PAGE: 15,
}

export const UPLOAD = {
  MAX_FILES: 2,
  MAX_SIZE_MB: 5,
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  FOLDER: 'property-forum/topics',
}
