import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ReviewProjectSearch } from '@/components/community/ReviewProjectSearch'
import { isNewTopicEnabled } from '@/lib/features'

export const metadata: Metadata = {
  title: 'Review a Project',
  description: 'Find the housing project you own, rent or visited and rate it for other Indian home buyers.',
  robots: { index: false, follow: true },
}

export default function ReviewAProjectPage() {
  return (
    <div className="container-forum py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs items={[{ label: 'Review a project' }]} />
        <h1 className="mt-3 font-heading text-2xl font-bold text-navy-500 sm:text-3xl">Review a project</h1>
        <p className="mt-1 text-neutral-600">Find the project you own, rent or visited. Your review goes straight to its page.</p>
        <ReviewProjectSearch canAddProject={isNewTopicEnabled()} />
      </div>
    </div>
  )
}
