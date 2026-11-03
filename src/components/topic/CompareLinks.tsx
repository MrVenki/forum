import Link from 'next/link'
import { getPeers, pairSlug } from '@/lib/compare'

interface Props {
  topic: { id: string; slug: string; cityId: string; propertyType: string; propertyName: string; priceMin: number | null; priceMax: number | null }
  citySlug: string
}

export async function CompareLinks({ topic, citySlug }: Props) {
  const peers = await getPeers(topic)
  if (peers.length === 0) return null

  return (
    <div className="card-base p-5">
      <h3 className="font-heading font-bold text-navy-500 mb-3">Compare with similar projects</h3>
      <ul className="space-y-2 text-sm">
        {peers.map((p) => (
          <li key={p.slug}>
            <Link href={`/${citySlug}/compare/${pairSlug(topic.slug, p.slug)}`} className="text-neutral-700 hover:text-saffron-600">
              {topic.propertyName} vs <span className="font-semibold">{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
