import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { AskForm } from '@/components/community/AskForm'

export const metadata: Metadata = {
  title: 'Ask the Community',
  description: 'Ask a property question or share an experience with Indian home buyers and residents.',
  robots: { index: false, follow: true },
}

interface Props {
  searchParams: Promise<{ city?: string; type?: string }>
}

export default async function AskPage({ searchParams }: Props) {
  const sp = await searchParams
  const cities = await prisma.city.findMany({ where: { isActive: true }, select: { slug: true, name: true }, orderBy: { name: 'asc' } })
  const initialCity = cities.some((c) => c.slug === sp.city) ? sp.city : ''

  return (
    <div className="container-forum py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs items={[{ label: 'Community', href: '/community' }, { label: 'Ask' }]} />
        <h1 className="mt-3 font-heading text-2xl font-bold text-navy-500 sm:text-3xl">Ask the community</h1>
        <p className="mt-1 text-neutral-600">Ask a question or share an experience that isn&apos;t about one project: builders, areas, loans, legal steps.</p>
        <AskForm cities={cities} initialCity={initialCity} initialKind={sp.type === 'experience' ? 'EXPERIENCE' : 'QUESTION'} />
      </div>
    </div>
  )
}
