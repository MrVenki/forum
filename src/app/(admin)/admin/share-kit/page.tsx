import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants/config'
import { INDIAN_CITIES } from '@/lib/constants/cities'
import { buildShareTexts, getShareSummaries } from '@/lib/shareKit'
import { ShareKitCard } from '@/components/admin/ShareKitCard'

export const revalidate = 0

export default async function ShareKitPage({ searchParams }: { searchParams: { city?: string } }) {
  const city = INDIAN_CITIES.find((c) => c.slug === searchParams.city)?.slug
  const summaries = await getShareSummaries({ citySlug: city, take: 30 })

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy-500">Sharing kit</h1>
      <p className="mt-1 max-w-3xl text-sm text-neutral-500">
        Ready-to-post text for WhatsApp groups, Reddit and Quora, most-reviewed projects first. Figures use only real
        members&apos; ratings and comments, never seeded demo content. Reddit and Quora versions include a disclosure that you run
        the site; keep it, since both communities remove undisclosed self-promotion. Links carry UTM tags so visits show up by
        channel in Google Analytics.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Link href="/admin/share-kit" className={`rounded-full border px-3 py-1 ${!city ? 'border-saffron-400 bg-saffron-50 text-saffron-700' : 'border-neutral-200 text-neutral-600'}`}>All cities</Link>
        {INDIAN_CITIES.map((c) => (
          <Link key={c.slug} href={`/admin/share-kit?city=${c.slug}`} className={`rounded-full border px-3 py-1 ${city === c.slug ? 'border-saffron-400 bg-saffron-50 text-saffron-700' : 'border-neutral-200 text-neutral-600'}`}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {summaries.length === 0 && <p className="text-sm text-neutral-500">No projects in this city yet.</p>}
        {summaries.map((s) => (
          <ShareKitCard
            key={s.topicId}
            name={s.name}
            city={s.city}
            path={s.path}
            reviewCount={s.ratingCount + s.commentCount}
            texts={buildShareTexts(s, SITE_CONFIG.url)}
          />
        ))}
      </div>
    </div>
  )
}
