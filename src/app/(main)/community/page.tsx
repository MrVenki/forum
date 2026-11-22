import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, HelpCircle, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PostRow } from '@/components/community/PostBits'
import { COMMUNITY_CATEGORIES, getLatestPosts, type PostKind } from '@/lib/community'
import { SITE_CONFIG } from '@/lib/constants/config'
import { cn } from '@/lib/utils/cn'

export const revalidate = 300

const PAGE_SIZE = 20

interface Props {
  searchParams: Promise<{ type?: string; topic?: string; page?: string }>
}

function parse(sp: Awaited<Props['searchParams']>) {
  const kind: PostKind | undefined = sp.type === 'questions' ? 'QUESTION' : sp.type === 'experiences' ? 'EXPERIENCE' : undefined
  const category = COMMUNITY_CATEGORIES.find((c) => c.slug === sp.topic)?.slug
  const page = Math.max(1, Math.min(100, parseInt(sp.page || '1', 10) || 1))
  return { kind, category, page }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { kind, category, page } = parse(await searchParams)
  const filtered = Boolean(kind || category || page > 1)
  let visible = 0
  try {
    visible = await prisma.communityPost.count({ where: { isHidden: false, isDeleted: false } })
  } catch {
    visible = 0
  }
  return {
    title: 'Property Questions & Buyer Experiences',
    description: 'Ask Indian home buyers and residents about builders, areas, home loans and legal steps, or share what happened when you bought or rented.',
    alternates: { canonical: `${SITE_CONFIG.url}/community` },
    // Filtered views and a near-empty hub stay out of search results
    robots: filtered || visible < 3 ? { index: false, follow: true } : undefined,
  }
}

export default async function CommunityPage({ searchParams }: Props) {
  const sp = await searchParams
  const { kind, category, page } = parse(sp)
  const posts = await getLatestPosts({ take: PAGE_SIZE + 1, skip: (page - 1) * PAGE_SIZE, kind, category })
  const hasMore = posts.length > PAGE_SIZE
  const shown = posts.slice(0, PAGE_SIZE)

  const href = (next: { type?: string; topic?: string; page?: number }) => {
    const q = new URLSearchParams()
    const type = 'type' in next ? next.type : sp.type
    const topic = 'topic' in next ? next.topic : category
    if (type) q.set('type', type)
    if (topic) q.set('topic', topic)
    if (next.page && next.page > 1) q.set('page', String(next.page))
    const s = q.toString()
    return s ? `/community?${s}` : '/community'
  }
  const pill = (on: boolean) =>
    cn('shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors', on ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50')

  return (
    <div className="container-forum py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Community' }]} />
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500 sm:text-3xl">From the community</h1>
          <p className="mt-1 max-w-2xl text-neutral-600">Questions and experiences that are not about one project: builders, areas, loans, legal steps.</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex">
          <Link href="/community/ask" className="btn-primary"><HelpCircle className="h-4 w-4" /> Ask the community</Link>
          <Link href="/review" className="btn-secondary"><Star className="h-4 w-4" /> Review a project</Link>
        </div>
      </div>

      <div className="mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={href({ type: undefined })} className={pill(!kind)}>All</Link>
        <Link href={href({ type: 'questions' })} className={pill(kind === 'QUESTION')}><HelpCircle className="mr-1 inline h-3.5 w-3.5" />Questions</Link>
        <Link href={href({ type: 'experiences' })} className={pill(kind === 'EXPERIENCE')}><BookOpen className="mr-1 inline h-3.5 w-3.5" />Experiences</Link>
        <span className="mx-1 hidden w-px shrink-0 bg-neutral-200 sm:block" />
        {COMMUNITY_CATEGORIES.map((c) => (
          <Link key={c.slug} href={href({ topic: category === c.slug ? undefined : c.slug })} className={pill(category === c.slug)}>{c.label}</Link>
        ))}
      </div>

      <div className="card-base mt-4 overflow-hidden">
        {shown.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {shown.map((p) => <PostRow key={p.id} post={p} headingLevel="h2" />)}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="font-heading text-lg font-bold text-navy-500">Nothing here yet</p>
            <p className="mt-1 text-sm text-neutral-500">Be the first: ask a question or share what happened to you.</p>
            <Link href="/community/ask" className="btn-primary mt-4">Ask the community</Link>
          </div>
        )}
      </div>

      {(page > 1 || hasMore) && (
        <div className="mt-4 flex justify-between">
          {page > 1 ? <Link href={href({ page: page - 1 })} className="btn-secondary">← Newer</Link> : <span />}
          {hasMore && <Link href={href({ page: page + 1 })} className="btn-secondary">Older →</Link>}
        </div>
      )}
    </div>
  )
}
