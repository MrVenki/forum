import type { Metadata } from 'next'
import { Shield } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { LoanAgainstFdCalculator } from '@/components/tools/LoanAgainstFdCalculator'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Loan Against FD Calculator India 2025 — IndiaPropertyTalk',
  description: 'Calculate EMI and true cost of a loan against your Fixed Deposit. Compare loan-against-FD vs breaking FD. Shows net borrowing cost, FD earnings, and year-by-year breakdown.',
  alternates: { canonical: `${SITE_CONFIG.url}/tools/loan-against-fd` },
  openGraph: {
    title: 'Loan Against FD Calculator India 2025',
    description: 'Calculate monthly EMI, total interest paid, and net cost of borrowing against your Fixed Deposit. Compares loan against FD vs premature FD withdrawal.',
    url: `${SITE_CONFIG.url}/tools/loan-against-fd`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a loan against FD in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A loan against Fixed Deposit (FD) is a secured loan where your FD is used as collateral. The bank lends 70–90% of your FD value at an interest rate that is typically FD rate + 1–2%. Your FD continues to earn interest during the loan period. It is ideal for short-term liquidity needs without breaking the FD.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the interest rate on loan against FD in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Indian banks typically charge FD interest rate + 1–2% for loans against FD. SBI charges exactly FD rate + 1%. So if your FD earns 7%, you pay 8% on the loan. This makes it much cheaper than personal loans (12–18%) or credit cards (36–42%).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it better to break FD or take loan against FD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taking a loan against FD is usually better than breaking it if: (1) your FD has significant time left to maturity, (2) you need funds for a short term, and (3) the loan amount is smaller than the FD. Breaking an FD attracts a 0.5–1% penalty on the interest rate, and you lose future compounding. The net cost of a loan against FD is just 1–2% per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum loan I can get against my FD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most Indian banks offer 70–90% of the FD amount as a loan. SBI offers up to 90%, HDFC Bank up to 90%, ICICI Bank up to 90%, and smaller cooperative banks may cap at 70–75%. The loan tenure cannot exceed the FD maturity date.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does my CIBIL score matter for loan against FD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Since the FD acts as collateral, banks do not check your CIBIL credit score. This makes loan against FD ideal for people with low or no credit history. Processing is fast — usually within 24 hours — as it is a fully secured loan with minimal documentation.',
      },
    },
  ],
}

export default function LoanAgainstFdPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-forum py-8 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Loan Against FD Calculator' }]} />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h1 className="font-heading text-3xl font-bold text-navy-500">Loan Against FD Calculator</h1>
          </div>
          <p className="text-neutral-600 max-w-2xl">
            Calculate your monthly EMI and true net cost of borrowing against your Fixed Deposit — including
            how much interest your FD keeps earning. Compare against breaking the FD prematurely.
          </p>
        </div>

        <LoanAgainstFdCalculator />

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-navy-500 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {jsonLd.mainEntity.map((item) => (
              <div key={item.name} className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                <h3 className="font-semibold text-navy-500 mb-2">{item.name}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
