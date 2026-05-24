import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Eye, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/rating/StarRating'
import { formatRelativeTime, formatINR } from '@/lib/utils/format'
import { PROPERTY_TYPES } from '@/lib/constants/config'
import { getCityDefaultImage } from '@/lib/constants/cityImages'
import type { TopicWithRelations } from '@/types'

interface TopicCardProps {
  topic: TopicWithRelations
  priority?: boolean
  headingLevel?: 'h2' | 'h3'
}

export function TopicCard({ topic, priority = false, headingLevel: Tag = 'h3' }: TopicCardProps) {
  const href = `/${topic.city.slug}/${topic.slug}`
  const propTypeLabel = PROPERTY_TYPES.find((p) => p.value === topic.propertyType)?.label || topic.propertyType
  const avgRating = Number(topic.avgRating)

  return (
    <article className="card-base group overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={href} className="relative block h-44 overflow-hidden bg-neutral-100 shrink-0">
        <Image
          src={topic.image1Url || getCityDefaultImage(topic.city.slug)}
          alt={topic.image1Url ? `${topic.propertyName} in ${topic.city.name}` : `${topic.city.name} cityscape`}
          fill
          className="object-cover transition-transform group-hover:scale-105 duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          unoptimized={!topic.image1Url}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={topic.city.tier as 'metro' | 'tier1'}>
            <MapPin className="h-3 w-3 mr-1" />
            {topic.city.name}
          </Badge>
          <Badge variant="outline">{propTypeLabel}</Badge>
        </div>

        {/* Title */}
        <Tag className="font-heading font-bold text-navy-500 leading-snug group-hover:text-saffron-600 transition-colors">
          <Link href={href}>{topic.propertyName}</Link>
        </Tag>

        {/* Description excerpt */}
        <p className="text-sm text-neutral-500 line-clamp-2 flex-1">{topic.description}</p>

        {/* Price range */}
        {topic.priceMin && (
          <p className="text-sm font-semibold text-teal">
            {formatINR(Number(topic.priceMin))}
            {topic.priceMax && ` – ${formatINR(Number(topic.priceMax))}`}
          </p>
        )}

        {/* Rating + Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <StarRating value={avgRating} readonly size="sm" count={topic.ratingCount} />
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {topic.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {topic.viewCount}
            </span>
          </div>
        </div>

        {/* Developer + Author */}
        <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="h-5 w-5 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 font-bold text-[10px] shrink-0"
              title={topic.user.username ? `@${topic.user.username}` : topic.user.name}
            >
              {(topic.user.username ?? topic.user.name).charAt(0).toUpperCase()}
            </div>
            <time dateTime={topic.createdAt.toString()} className="truncate">{formatRelativeTime(topic.createdAt)}</time>
          </div>
          {topic.developerSlug && (
            <Link
              href={`/developer/${topic.developerSlug}`}
              className="shrink-0 text-[10px] font-medium text-saffron-600 hover:text-saffron-700 bg-saffron-50 border border-saffron-100 rounded px-1.5 py-0.5 transition-colors"
            >
              {topic.developerName ?? topic.developerSlug}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
