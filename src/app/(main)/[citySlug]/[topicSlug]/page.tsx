import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG, PROPERTY_TYPES } from '@/lib/constants/config'
import { getCityDefaultImage } from '@/lib/constants/cityImages'
import { getOgImageUrl } from '@/lib/cloudinary'
import { formatAbsoluteDate, formatINR, formatNumber } from '@/lib/utils/format'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { StarRating } from '@/components/rating/StarRating'
import { RatingForm } from '@/components/rating/RatingForm'
import { CommentList } from '@/components/comment/CommentList'
import { Badge } from '@/components/ui/badge'
import { MapPin, Eye, MessageSquare, User, Calendar, Home, IndianRupee } from 'lucide-react'
import type { CommentWithRelations } from '@/types'
import { SubscribeButton, SubscriberCount } from '@/components/topic/SubscribeButton'
import { EditDescriptionForm } from '@/components/topic/EditDescriptionForm'

/** Safely serialise JSON-LD — escapes </script> injection sequences */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
import { ShareButton } from '@/components/topic/ShareButton'

export const revalidate = 60

interface Props {
  params: { citySlug: string; topicSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = await prisma.topic.findFirst({
    where: {
      slug: params.topicSlug,
      isPublished: true,
      city: { slug: params.citySlug },
    },
    include: { city: true },
  })
  if (!topic) return {}

  const title = topic.metaTitle || `${topic.propertyName}, ${topic.city.name} — Reviews & Discussion`
  const description =
    topic.metaDesc || topic.description.slice(0, 155).replace(/\n/g, ' ')
  const url = `${SITE_CONFIG.url}/${params.citySlug}/${params.topicSlug}`
  const ogImage = topic.image1PubId
    ? getOgImageUrl(topic.image1PubId)
    : `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: SITE_CONFIG.name,
      publishedTime: topic.createdAt.toISOString(),
      modifiedTime: topic.updatedAt.toISOString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: topic.propertyName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: SITE_CONFIG.twitterHandle,
    },
  }
}

export default async function TopicPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  const topic = await prisma.topic.findFirst({
    where: {
      slug: params.topicSlug,
      isPublished: true,
      city: { slug: params.citySlug },
    },
    include: {
      city: true,
      user: { select: { id: true, name: true, image: true, createdAt: true } },
      _count: { select: { comments: true, ratings: true } },
    },
  })

  if (!topic) notFound()

  const isOwner = session?.user.id === topic.user.id

  // Increment view count (fire and forget)
  prisma.topic.update({ where: { id: topic.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  const [comments, relatedTopics, subscriberCount] = await Promise.all([
    prisma.comment.findMany({
      where: { topicId: topic.id, parentId: null, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
        reactions: true,
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, image: true } },
            reactions: true,
          },
        },
      },
    }) as Promise<CommentWithRelations[]>,
    prisma.topic.findMany({
      where: { cityId: topic.cityId, isPublished: true, id: { not: topic.id } },
      orderBy: { avgRating: 'desc' },
      take: 4,
      select: { id: true, propertyName: true, slug: true, avgRating: true, ratingCount: true },
    }),
    prisma.topicSubscription.count({ where: { topicId: topic.id } }),
  ])

  const avgRating = Number(topic.avgRating)
  const propTypeLabel = PROPERTY_TYPES.find((p) => p.value === topic.propertyType)?.label || topic.propertyType
  const topicUrl = `${SITE_CONFIG.url}/${params.citySlug}/${params.topicSlug}`

  // Always have an image (property photo or city default)
  const topicImage = topic.image1Url || getCityDefaultImage(topic.city.slug)

  // Schema 1 — DiscussionForumPosting
  // Fixes: missing required text field, missing comment array, missing author.url
  const discussionSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: `${topic.propertyName}, ${topic.city.name} — Reviews & Discussion`,
    text: topic.description,           // FIXED: text (or image/video) is required
    image: topicImage,                 // FIXED: always present
    url: topicUrl,
    datePublished: topic.createdAt.toISOString(),
    dateModified: topic.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: topic.user.name,
      url: SITE_CONFIG.url,            // FIXED: author.url is required
    },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CommentAction',
      userInteractionCount: topic._count.comments,
    },
    // FIXED: include top comments so Google sees discussion content
    ...(comments.length > 0 && {
      comment: comments.slice(0, 5).map((c) => ({
        '@type': 'Comment',
        text: c.content,
        dateCreated: c.createdAt.toISOString(),
        author: {
          '@type': 'Person',
          name: c.user.name,
          url: SITE_CONFIG.url,
        },
      })),
    }),
  }

  // Schema 2 — Product with AggregateRating (separate from DiscussionForumPosting)
  // FIXED: Google only renders Review Snippets for supported types (Product, LocalBusiness, etc.)
  // DiscussionForumPosting is NOT a valid parent for aggregateRating in Google's rich results.
  const ratingSchema = avgRating > 0 && topic.ratingCount > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${topic.propertyName}, ${topic.city.name}`,
        description: topic.description.slice(0, 300).replace(/\n/g, ' '),
        url: topicUrl,
        image: topicImage,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating.toFixed(1),
          bestRating: '5',
          worstRating: '1',
          ratingCount: topic.ratingCount,
          reviewCount: topic.ratingCount,
        },
      }
    : null

  const jsonLd = ratingSchema ? [discussionSchema, ratingSchema] : discussionSchema

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="container-forum py-6">
        <Breadcrumbs
          items={[
            { label: topic.city.name, href: `/${topic.city.slug}` },
            { label: topic.propertyName },
          ]}
        />
      </div>

      <div className="container-forum pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Header */}
            <div className="card-base p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={topic.city.tier === 'METRO' ? 'metro' : 'tier1'}>
                    <MapPin className="h-3 w-3 mr-1" />{topic.city.name}
                  </Badge>
                  <Badge variant="outline">{propTypeLabel}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton
                    title={`${topic.propertyName}, ${topic.city.name} — Reviews & Discussion`}
                    text={topic.description.slice(0, 100).replace(/\n/g, ' ') + '…'}
                    url={topicUrl}
                  />
                  <SubscribeButton topicId={topic.id} initialCount={subscriberCount} />
                </div>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-500 leading-snug">
                {topic.propertyName}
                <span className="block text-base sm:text-lg font-normal text-neutral-500 mt-1">
                  Reviews &amp; Ratings — {topic.city.name}, {topic.city.state}
                </span>
              </h1>
              {topic.address && (
                <p className="mt-1.5 text-sm text-neutral-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {topic.address}
                </p>
              )}

              {/* Rating Summary */}
              {avgRating > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <StarRating value={avgRating} readonly size="md" count={topic.ratingCount} />
                  <span className="text-xs text-neutral-500">based on {topic.ratingCount} rating{topic.ratingCount !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Price */}
              {topic.priceMin && (
                <div className="mt-3 flex items-center gap-1.5 text-teal-DEFAULT font-semibold">
                  <IndianRupee className="h-4 w-4" />
                  <span>
                    {formatINR(Number(topic.priceMin))}
                    {topic.priceMax ? ` – ${formatINR(Number(topic.priceMax))}` : '+'}
                  </span>
                </div>
              )}

              {/* Meta */}
              <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500 flex-wrap border-t border-neutral-100 pt-4">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {topic.user.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={topic.createdAt.toISOString()}>{formatAbsoluteDate(topic.createdAt)}</time>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {formatNumber(topic.viewCount)} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> {topic._count.comments} comments
                </span>
              </div>
            </div>

            {/* Images */}
            {(() => {
              const propertyImages = [topic.image1Url, topic.image2Url].filter(Boolean) as string[]
              const images = propertyImages.length > 0
                ? propertyImages.map((url) => ({ url, isDefault: false }))
                : [{ url: getCityDefaultImage(topic.city.slug), isDefault: true }]
              return (
                <div className={`grid gap-3 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {images.map(({ url, isDefault }, i) => (
                    <figure key={i} className="relative rounded-xl overflow-hidden aspect-video bg-neutral-100">
                      <Image
                        src={url}
                        alt={isDefault ? `${topic.city.name} cityscape` : `${topic.propertyName} — property image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={i === 0}
                        unoptimized={isDefault}
                      />
                      {isDefault && (
                        <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                          {topic.city.name}
                        </div>
                      )}
                      <figcaption className="sr-only">
                        {isDefault ? `${topic.city.name} city image` : `${topic.propertyName} property image ${i + 1}`}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )
            })()}

            {/* Description */}
            <div className="card-base p-6">
              <h2 className="font-heading font-bold text-lg text-navy-500 mb-3">About {topic.propertyName}</h2>
              {isOwner ? (
                <EditDescriptionForm topicId={topic.id} initialDescription={topic.description} />
              ) : (
                <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
                  {topic.description}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg text-navy-500">
                  {topic.propertyName} — Buyer Reviews &amp; Discussion
                  {comments.length > 0 && <span className="ml-2 text-sm font-normal text-neutral-400">({comments.length})</span>}
                </h2>
                <SubscriberCount count={subscriberCount} />
              </div>
              <CommentList topicId={topic.id} initialComments={comments} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Rating Form */}
            <RatingForm topicId={topic.id} />

            {/* Property Info */}
            <div className="card-base p-5">
              <h3 className="font-heading font-bold text-navy-500 mb-3">Property Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">City</dt>
                  <dd className="font-medium text-neutral-800">
                    <Link href={`/${topic.city.slug}`} className="hover:text-saffron-500 transition-colors">
                      {topic.city.name}
                    </Link>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">State</dt>
                  <dd className="font-medium text-neutral-800">{topic.city.state}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Type</dt>
                  <dd className="font-medium text-neutral-800">{propTypeLabel}</dd>
                </div>
                {topic.developerSlug && (
                  <div className="flex justify-between items-center">
                    <dt className="text-neutral-500">Developer</dt>
                    <dd className="font-medium">
                      <Link href={`/developer/${topic.developerSlug}`} className="text-saffron-600 hover:text-saffron-700 transition-colors">
                        {topic.developerName ?? topic.developerSlug}
                      </Link>
                    </dd>
                  </div>
                )}
                {avgRating > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Rating</dt>
                    <dd className="font-medium text-neutral-800">{avgRating.toFixed(1)}/5 ({topic.ratingCount})</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Related Topics */}
            {relatedTopics.length > 0 && (
              <div className="card-base p-5">
                <h3 className="font-heading font-bold text-navy-500 mb-3">
                  More in {topic.city.name}
                </h3>
                <ul className="space-y-2.5">
                  {relatedTopics.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/${topic.city.slug}/${t.slug}`}
                        className="flex items-start gap-2 group"
                      >
                        <Home className="h-4 w-4 text-saffron-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-neutral-700 group-hover:text-saffron-500 transition-colors line-clamp-2">
                            {t.propertyName}
                          </p>
                          {Number(t.avgRating) > 0 && (
                            <StarRating value={Number(t.avgRating)} readonly size="sm" showCount={false} />
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 p-5 text-white text-center">
              <h3 className="font-heading font-bold mb-1">Know this property?</h3>
              <p className="text-sm text-saffron-100 mb-3">Share your experience to help other buyers.</p>
              <Link href={`/${topic.city.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-saffron-600 hover:bg-saffron-50 transition-colors">
                Browse {topic.city.name} Properties
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
