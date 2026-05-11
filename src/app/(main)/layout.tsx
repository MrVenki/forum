import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VerificationBanner } from '@/components/shared/VerificationBanner'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <VerificationBanner />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  )
}
