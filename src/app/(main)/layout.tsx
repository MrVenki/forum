import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VerificationBanner } from '@/components/shared/VerificationBanner'
import { ReviewGapBanner } from '@/components/layout/ReviewGapBanner'
import { isNewTopicEnabled } from '@/lib/features'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header newTopicEnabled={isNewTopicEnabled()} />
      <VerificationBanner />
      <ReviewGapBanner />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  )
}
