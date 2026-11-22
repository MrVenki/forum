import Link from 'next/link'
import { BookOpen, HelpCircle, MapPin, MessageSquare } from 'lucide-react'
import { getCategory, type PostKind, type PostListItem } from '@/lib/community'
import { formatRelativeTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export function KindTag({ kind }: { kind: PostKind }) {
  return kind === 'EXPERIENCE' ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
      <BookOpen className="h-3 w-3" /> Experience
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs font-semibold text-neutral-600">
      <HelpCircle className="h-3 w-3" /> Question
    </span>
  )
}

export function CategoryChip({ slug }: { slug: string }) {
  const c = getCategory(slug)
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', c.chip)}>{c.label}</span>
}

/** "1 reply", "6 replies". */
export function replyLabel(n: number) {
  return `${n} ${n === 1 ? 'reply' : 'replies'}`
}

/** One row in a list of community posts. */
export function PostRow({ post, headingLevel = 'h3' }: { post: PostListItem; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <Link href={`/community/${post.slug}`} className="block px-4 py-4 transition-colors hover:bg-neutral-50 sm:px-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <KindTag kind={post.kind} />
        <CategoryChip slug={post.category} />
      </div>
      <Heading className="font-heading font-bold leading-snug text-navy-500">{post.title}</Heading>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
        {post.replyCount > 0 ? (
          <span className="inline-flex items-center gap-1 font-semibold text-teal-dark">
            <MessageSquare className="h-3.5 w-3.5" /> {replyLabel(post.replyCount)}
          </span>
        ) : (
          <span className="font-semibold text-saffron-600">Be the first to reply</span>
        )}
        {post.city ? (
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {post.city.name}</span>
        ) : (
          <span>All India</span>
        )}
        <time dateTime={post.createdAt}>{formatRelativeTime(post.createdAt)}</time>
      </div>
    </Link>
  )
}
