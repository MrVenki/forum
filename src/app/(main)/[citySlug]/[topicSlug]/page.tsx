import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recordTopicView } from '@/lib/topicViews'
import { SITE_CONFIG, PROPERTY_TYPES } from '@/lib/constants/config'
import { getCityDefaultImage } from '@/lib/constants/cityImages'
import { getOgImageUrl } from '@/lib/cloudinary'
import { formatAbsoluteDate, formatINR, formatNumber } from '@/lib/utils/format'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { StarRating } from '@/components/rating/StarRating'
import { RatingForm } from '@/components/rating/RatingForm'
import { DiscussionSection } from '@/components/comment/DiscussionSection'
import { ReferralTracker } from '@/components/topic/ReferralTracker'
import { Badge } from '@/components/ui/badge'
import { MapPin, Eye, MessageSquare, User, Calendar, Home, PenLine, Star, ChevronRight, CheckCircle2, Clock, XCircle, HelpCircle, type LucideIcon } from 'lucide-react'
import type { ConstructionStatus as ConstructionStatusValue } from '@prisma/client'
import type { CommentWithRelations } from '@/types'
import { SubscribeButton, SubscriberCount } from '@/components/topic/SubscribeButton'
import { EditDescriptionForm } from '@/components/topic/EditDescriptionForm'
import { ConstructionStatus } from '@/components/topic/ConstructionStatus'
import { BookmarkButton } from '@/components/topic/BookmarkButton'
import { PollWidget } from '@/components/topic/PollWidget'
import { UpdatesFeed } from '@/components/topic/UpdatesFeed'
import { PriceHistoryWidget } from '@/components/topic/PriceHistoryWidget'
import { QASection } from '@/components/topic/QASection'
import { buildTopicSeo } from '@/lib/topicSeo'
import { ReviewInsights } from '@/components/rating/ReviewInsights'
import { CompareLinks } from '@/components/topic/CompareLinks'
import { WhatsAppSummaryButton } from '@/components/topic/WhatsAppSummaryButton'
import { AreaPriceContext } from '@/components/topic/AreaPriceContext'
import { EmiCalculator } from '@/components/tools/EmiCalculator'

/** Safely serialise JSON-LD — escapes </script> injection sequences */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
import { ShareButton } from '@/components/topic/ShareButton'
import { AdminEditLink } from '@/components/admin/AdminEditLink'
import { moderatorEditedIds } from '@/lib/adminEdit'

export const revalidate = 60

const STATUS_STRIP: Record<ConstructionStatusValue, { label: string; Icon: LucideIcon; box: string; icon: string; text: string }> = {
  ON_TRACK: { label: 'On Track', Icon: CheckCircle2, box: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70', icon: 'text-emerald-600', text: 'text-emerald-800' },
  DELAYED: { label: 'Delayed', Icon: Clock, box: 'border-amber-200 bg-amber-50 hover:bg-amber-100/70', icon: 'text-amber-600', text: 'text-amber-800' },
  STALLED: { label: 'Stalled', Icon: XCircle, box: 'border-red-200 bg-red-50 hover:bg-red-100/70', icon: 'text-red-600', text: 'text-red-800' },
  POSSESSION_DONE: { label: 'Possession Done', Icon: CheckCircle2, box: 'border-blue-200 bg-blue-50 hover:bg-blue-100/70', icon: 'text-blue-600', text: 'text-blue-800' },
}

function getStatusStrip(status: ConstructionStatusValue | null, votes: number) {
  const voteText = votes > 0 ? `Based on ${votes} community vote${votes !== 1 ? 's' : ''}` : 'No community votes yet'
  if (!status || !STATUS_STRIP[status]) {
    return {
      label: 'Project status: not reported yet',
      sub: 'Know how construction is going? Tell other buyers.',
      cta: 'Vote',
      Icon: HelpCircle,
      box: 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100',
      icon: 'text-neutral-400',
      text: 'text-neutral-700',
    }
  }
  const c = STATUS_STRIP[status]
  return { ...c, label: `Project Status: ${c.label}`, sub: voteText, cta: 'View details' }
}

interface Props {
  params: Promise<{ citySlug: string; topicSlug: string }>
}

// Shared by generateMetadata and the page so a request runs this lookup once.
const getTopic = cache((citySlug: string, topicSlug: string) =>
  prisma.topic.findFirst({
    where: { slug: topicSlug, isPublished: true, city: { slug: citySlug } },
    include: {
      city: true,
      user: { select: { id: true, name: true, username: true, image: true, createdAt: true } },
      _count: { select: { comments: true, ratings: true } },
    },
  })
)

/** Where a listing an admin moved to another city lives now, or null. */
async function movedTopicUrl(citySlug: string, topicSlug: string): Promise<string | null> {
  try {
    const city = await prisma.city.findUnique({ where: { slug: citySlug }, select: { id: true } })
    if (!city) return null
    const r = await prisma.topicRedirect.findUnique({ where: { cityId_slug: { cityId: city.id, slug: topicSlug } }, select: { topicId: true } })
    if (!r) return null
    const t = await prisma.topic.findUnique({ where: { id: r.topicId }, select: { slug: true, isPublished: true, city: { select: { slug: true } } } })
    if (!t || !t.isPublished || (t.city.slug === citySlug && t.slug === topicSlug)) return null
    return `/${t.city.slug}/${t.slug}`
  } catch {
    return null // redirect table not there yet
  }
}

/** The root layout's title template already appends the site name; drop a copy typed into metaTitle. */
function stripSiteName(title: string): string {
  const escaped = SITE_CONFIG.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return title.replace(new RegExp(`\\s*[|\\-–—]\\s*${escaped}\\s*$`, 'i'), '').trim() || title
}

function absoluteUrl(url: string): string {
  return url.startsWith('http') ? url : `${SITE_CONFIG.url}${url}`
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const topic = await getTopic(params.citySlug, params.topicSlug)
  if (!topic) return {}

  const seo = buildTopicSeo({
    propertyName: topic.propertyName,
    cityName: topic.city.name,
    avgRating: Number(topic.avgRating),
    ratingCount: topic.ratingCount,
    commentCount: topic.commentCount,
    priceMin: topic.priceMin ? Number(topic.priceMin) : null,
    priceMax: topic.priceMax ? Number(topic.priceMax) : null,
  })
  const title = topic.metaTitle ? stripSiteName(topic.metaTitle) : seo.title
  const description = topic.metaDesc || seo.description
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

export default async function TopicPage(props: Props) {
  const params = await props.params
  const session = await getServerSession(authOptions)

  const topic = await getTopic(params.citySlug, params.topicSlug)

  if (!topic) {
    const moved = await movedTopicUrl(params.citySlug, params.topicSlug)
    if (moved) permanentRedirect(moved)
    notFound()
  }

  const isOwner = session?.user.id === topic.user.id

  // Increment view count (fire and forget)
  recordTopicView(topic.id)

  const [comments, relatedTopics, subscriberCount, statusVoteCount] = await Promise.all([
    prisma.comment.findMany({
      where: { topicId: topic.id, parentId: null, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, username: true, image: true, flairTag: true } },
        reactions: true,
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, username: true, image: true, flairTag: true } },
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
    prisma.statusVote.count({ where: { topicId: topic.id } }),
  ])

  // Comments whose wording a moderator changed show a small note
  const allComments = comments.flatMap((c) => [c, ...(c.replies ?? [])])
  const editedComments = await moderatorEditedIds('COMMENT', allComments.map((c) => ({ id: c.id, values: { content: c.content } })))
  for (const c of allComments) if (editedComments.has(c.id)) c.moderatorEdited = true

  const avgRating = Number(topic.avgRating)
  // Star ratings plus top-level buyer comments, which the page also presents as reviews
  const reviewCount = topic.ratingCount + comments.length
  const propTypeLabel = PROPERTY_TYPES.find((p) => p.value === topic.propertyType)?.label || topic.propertyType
  const topicUrl = `${SITE_CONFIG.url}/${params.citySlug}/${params.topicSlug}`

  const heroImage = topic.image1Url
    ? { url: topic.image1Url, isDefault: false }
    : { url: getCityDefaultImage(topic.city.slug), isDefault: true }
  const statusStrip = getStatusStrip(topic.constructionStatus, statusVoteCount)

  // Always have an image (property photo or city default)
  const topicImage = topic.image1Url || getCityDefaultImage(topic.city.slug)

  // Schema 1 — DiscussionForumPosting
  // Fixes: missing required text field, missing comment array, missing author.url
  const discussionSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: `${topic.propertyName}, ${topic.city.name} — Reviews & Discussion`,
    text: topic.description,           // FIXED: text (or image/video) is required
    image: absoluteUrl(topicImage),    // always present; must be an absolute URL
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
    // Google's forum guidelines ask for the visible comments, with replies nested under their parent.
    ...(comments.length > 0 && {
      comment: comments.slice(0, 50).map((c) => ({
        '@type': 'Comment',
        text: c.content,
        datePublished: c.createdAt.toISOString(),
        author: { '@type': 'Person', name: c.user.name, url: SITE_CONFIG.url },
        ...(c.replies && c.replies.length > 0 && {
          comment: c.replies.slice(0, 20).map((r) => ({
            '@type': 'Comment',
            text: r.content,
            datePublished: r.createdAt.toISOString(),
            author: { '@type': 'Person', name: r.user.name, url: SITE_CONFIG.url },
          })),
        }),
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
        image: absoluteUrl(topicImage),
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


  const schemas = [
    discussionSchema,
    ...(ratingSchema ? [ratingSchema] : []),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schemas) }} />
      <ReferralTracker topicId={topic.id} />

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
            {/* Topic Header: photo banner, key facts, actions, then straight on to the reviews */}
            <div className="card-base overflow-hidden p-0">
              <figure className="relative aspect-[2/1] sm:aspect-[4/1] bg-neutral-100">
                <Image
                  src={heroImage.url}
                  alt={heroImage.isDefault ? `${topic.city.name} cityscape` : `${topic.propertyName} — property image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  unoptimized={heroImage.isDefault}
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                    <MapPin className="h-3.5 w-3.5" />{topic.city.name}
                  </span>
                  <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-sm">{propTypeLabel}</span>
                </div>
                <figcaption className="sr-only">
                  {heroImage.isDefault ? `${topic.city.name} city image` : `${topic.propertyName} property image`}
                </figcaption>
              </figure>

              <div className="p-5 sm:p-6">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-500 leading-snug">
                  {topic.propertyName}
                  <span className="block text-base sm:text-lg font-normal text-neutral-600 mt-1">
                    Reviews &amp; Ratings — {topic.city.name}, {topic.city.state}
                  </span>
                </h1>
                <AdminEditLink href={`/admin/posts?edit=${topic.id}`} label="Edit listing" className="mt-2" />
                {topic.address && (
                  <p className="mt-1.5 text-sm text-neutral-600 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-neutral-500" /> {topic.address}
                  </p>
                )}

                {/* Price | rating */}
                <div className="mt-4 grid grid-cols-[3fr_2fr] sm:grid-cols-2 divide-x divide-neutral-200">
                  <div className="pr-3">
                    {topic.priceMin ? (
                      <p className="font-heading text-base sm:text-xl font-bold tracking-tight text-navy-500">
                        {formatINR(Number(topic.priceMin))}
                        {topic.priceMax ? ` – ${formatINR(Number(topic.priceMax))}` : '+'}
                      </p>
                    ) : (
                      <p className="font-heading text-lg font-bold text-neutral-500">Price not listed</p>
                    )}
                    <p className="text-xs text-neutral-500">Indicative price range</p>
                  </div>
                  <a href={topic.ratingCount > 0 ? '#reviews' : '#rate'} className="pl-3 text-center group">
                    {avgRating > 0 ? (
                      <>
                        <p className="flex items-center justify-center gap-1.5 font-heading text-lg sm:text-xl font-bold text-navy-500">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                          {avgRating.toFixed(1)}
                          <span className="text-sm font-normal text-neutral-500">({topic.ratingCount})</span>
                        </p>
                        <p className="text-xs text-neutral-500 group-hover:text-saffron-600">
                          {topic.ratingCount} rating{topic.ratingCount !== 1 ? 's' : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-heading text-base font-bold text-neutral-500">No ratings yet</p>
                        <p className="text-xs text-saffron-600 group-hover:underline">Be the first to rate</p>
                      </>
                    )}
                  </a>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <BookmarkButton
                    topicId={topic.id}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 p-0"
                  />
                  <ShareButton
                    title={`${topic.propertyName}, ${topic.city.name} — Reviews & Discussion`}
                    text={topic.description.slice(0, 100).replace(/\n/g, ' ') + '…'}
                    url={topicUrl}
                    iconOnly
                    className="h-11 w-11 shrink-0 justify-center rounded-full p-0"
                  />
                  <WhatsAppSummaryButton topicId={topic.id} className="h-11 w-11 rounded-full" />
                  <SubscribeButton
                    topicId={topic.id}
                    initialCount={subscriberCount}
                    className="h-11 flex-1 justify-center rounded-full text-sm sm:max-w-[220px]"
                  />
                </div>

                {/* Construction status in one line; the voting panel sits further down */}
                <a
                  href="#construction"
                  className={`mt-4 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${statusStrip.box}`}
                >
                  <statusStrip.Icon className={`h-6 w-6 shrink-0 ${statusStrip.icon}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold ${statusStrip.text}`}>{statusStrip.label}</span>
                    <span className="block text-xs text-neutral-600">{statusStrip.sub}</span>
                  </span>
                  <span className={`flex shrink-0 items-center text-xs font-semibold ${statusStrip.text}`}>
                    <span className="hidden sm:inline">{statusStrip.cta}</span>
                    <span className="sr-only sm:hidden">{statusStrip.cta}</span>
                    <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
                  </span>
                </a>

                {/* Review calls to action: most visitors come to read or write a review */}
                <div className="mt-4 grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap">
                  <a
                    href="#rate"
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-saffron-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm sm:px-4 transition-colors hover:bg-saffron-600"
                  >
                    <PenLine className="h-4 w-4" /> Write a review
                  </a>
                  {reviewCount > 0 ? (
                    <a
                      href={topic.ratingCount > 0 ? '#reviews' : '#discussion'}
                      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-navy-500 sm:px-4 transition-colors hover:border-saffron-300 hover:text-saffron-600"
                    >
                      <MessageSquare className="h-4 w-4" /> Read {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-500">No reviews yet. Be the first to help other buyers.</span>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-4 flex items-center gap-x-4 gap-y-2 text-xs text-neutral-500 flex-wrap border-t border-neutral-100 pt-4">
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
                    <MessageSquare className="h-3.5 w-3.5" /> {topic._count.comments} comment{topic._count.comments !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* About: folded to keep the reviews close, but the full text is in the page HTML */}
              <details className="group border-t border-neutral-100 bg-neutral-50/70" open={isOwner}>
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <h2 className="font-heading font-bold text-lg text-navy-500">About {topic.propertyName}</h2>
                  <span className="flex items-center text-sm font-semibold text-blue-600">
                    <span className="group-open:hidden">Read more</span>
                    <span className="hidden group-open:inline">Show less</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </span>
                </summary>
                <div className="space-y-4 px-5 pb-5 sm:px-6">
                  {isOwner ? (
                    <EditDescriptionForm topicId={topic.id} initialDescription={topic.description} />
                  ) : (
                    <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
                      {topic.description}
                    </div>
                  )}
                  {topic.image2Url && (
                    <figure className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100">
                      <Image
                        src={topic.image2Url}
                        alt={`${topic.propertyName} — property image 2`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <figcaption className="sr-only">{topic.propertyName} property image 2</figcaption>
                    </figure>
                  )}
                </div>
              </details>
            </div>

            {/* Reviews first: ratings, the review form, then the discussion */}
            <section id="reviews" aria-label="Reviews" className="scroll-mt-24 space-y-6">
              <ReviewInsights topicId={topic.id} propertyName={topic.propertyName} />

              <div id="rate" className="scroll-mt-24">
                <RatingForm topicId={topic.id} />
              </div>
            </section>

            {/* Discussion & Comments */}
            <div id="discussion" className="card-base p-6 scroll-mt-24">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 className="font-heading font-bold text-xl leading-snug text-navy-500">
                  {topic.propertyName} — Buyer Reviews &amp; Discussion
                  {comments.length > 0 && <span className="ml-1">({comments.length})</span>}
                </h2>
                <SubscriberCount count={subscriberCount} />
              </div>
              <DiscussionSection
                topicId={topic.id}
                topicOwnerId={topic.user.id}
                propertyName={topic.propertyName}
                initialComments={comments}
              />
            </div>

            {/* Q&A Section */}
            <div className="card-base p-6">
              <QASection topicId={topic.id} />
            </div>

            {/* Construction status and builder updates */}
            <div id="construction" className="scroll-mt-24">
              <ConstructionStatus
                topicId={topic.id}
                initialStatus={topic.constructionStatus}
                initialExpected={topic.expectedPossession?.toISOString() ?? null}
                initialActual={topic.actualPossession?.toISOString() ?? null}
              />
            </div>

            <div className="card-base p-6">
              <UpdatesFeed topicId={topic.id} />
            </div>

            {/* Price history and area prices */}
            <div className="card-base p-6">
              <PriceHistoryWidget
                topicId={topic.id}
                priceMin={topic.priceMin ? Number(topic.priceMin) : null}
                priceMax={topic.priceMax ? Number(topic.priceMax) : null}
              />
            </div>

            <AreaPriceContext
              citySlug={topic.city.slug}
              cityName={topic.city.name}
              topicId={topic.id}
              propertyType={topic.propertyType}
              priceMin={topic.priceMin ? Number(topic.priceMin) : null}
              priceMax={topic.priceMax ? Number(topic.priceMax) : null}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Write-a-review prompt (the form itself sits under the reviews) */}
            <div className="rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 p-5 text-white text-center">
              <h3 className="font-heading font-bold mb-1">Know {topic.propertyName}?</h3>
              <p className="text-sm text-saffron-100 mb-3">Visited, booked or living here? Your review helps other buyers decide.</p>
              <a href="#rate" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-saffron-600 hover:bg-saffron-50 transition-colors">
                <PenLine className="h-4 w-4" /> Write a review
              </a>
            </div>

            <CompareLinks
              citySlug={topic.city.slug}
              topic={{
                id: topic.id,
                slug: topic.slug,
                cityId: topic.cityId,
                propertyType: topic.propertyType,
                propertyName: topic.propertyName,
                priceMin: topic.priceMin ? Number(topic.priceMin) : null,
                priceMax: topic.priceMax ? Number(topic.priceMax) : null,
              }}
            />

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

            {/* Community Poll */}
            <PollWidget topicId={topic.id} topicOwnerId={topic.user.id} />

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

            {/* Compact EMI Calculator */}
            {topic.priceMin && (
              <div className="card-base p-5">
                <h3 className="font-heading font-bold text-navy-500 mb-3 text-sm">EMI Calculator</h3>
                <EmiCalculator prefillPrice={Number(topic.priceMin)} compact />
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
