import type { Metadata } from 'next'
import { StampDutyCalculator } from '@/components/tools/StampDutyCalculator'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Stamp Duty Calculator India 2025 — All States — IndiaPropertyTalk',
  description: 'Calculate stamp duty and registration charges for Maharashtra, Karnataka, Delhi, UP, Telangana, Tamil Nadu and 9 more states. Includes women buyer concessions and transfer duty.',
  alternates: { canonical: 'https://www.indiapropertytalk.com/tools/stamp-duty-calculator' },
  openGraph: {
    title: 'Stamp Duty Calculator India 2025 — All States',
    description: 'Instant stamp duty & registration charge estimates for 13 Indian states. Know the true cost before you register.',
    url: 'https://www.indiapropertytalk.com/tools/stamp-duty-calculator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is stamp duty on property in Maharashtra in 2025?',
      acceptedAnswer: { '@type': 'Answer', text: 'In Maharashtra, stamp duty is 6% for male buyers and 5% for female buyers. In Mumbai, an additional 1% metro cess applies in BMC limits. Registration charges are 1% of the property value, capped at ₹3 lakh for properties above ₹30L.' },
    },
    {
      '@type': 'Question',
      name: 'Do women get a concession on stamp duty in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Most Indian states offer a 1–2% concession on stamp duty for women buyers. Delhi offers 2% (6% vs 4%), Maharashtra offers 1% (6% vs 5%), Haryana offers 2% (7% vs 5%), and UP offers 1% (7% vs 6%). This concession applies when a woman is the sole or primary buyer.' },
    },
    {
      '@type': 'Question',
      name: 'Which state has the highest stamp duty in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Tamil Nadu has one of the highest effective rates — 7% stamp duty plus 4% registration equals 11% total. Madhya Pradesh is also high at 7.5% stamp duty plus 3% registration for male buyers (10.5% total). West Bengal in Kolkata can reach ~9% including transfer duty.' },
    },
    {
      '@type': 'Question',
      name: 'What is stamp duty in Karnataka for a flat above ₹45 lakh?',
      acceptedAnswer: { '@type': 'Answer', text: 'In Karnataka, properties above ₹45 lakh attract 5% stamp duty plus 1% registration charges, totalling 6% of the property value. For properties between ₹20L and ₹45L the rate is 3%, and below ₹20L it is 2%.' },
    },
    {
      '@type': 'Question',
      name: 'Is stamp duty included in home loan?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Banks do not finance stamp duty and registration charges as part of the home loan. These must be paid from your own funds at the time of registration. This is a significant additional cost — budget 4–11% of the property value depending on your state, on top of your down payment.' },
    },
  ],
}

export default function StampDutyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-forum py-8 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Stamp Duty Calculator' }]} />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6 text-saffron-500" />
            <h1 className="font-heading text-3xl font-bold text-navy-500">Stamp Duty Calculator India</h1>
          </div>
          <p className="text-neutral-600">
            Instantly calculate stamp duty and registration charges for 13 states — including women buyer concessions, transfer duty, and total cost of purchase.
          </p>
        </div>

        <StampDutyCalculator />

        <div className="mt-10 space-y-6 prose prose-sm max-w-none text-neutral-700">
          <h2 className="font-heading font-bold text-xl text-navy-500">What is stamp duty on property?</h2>
          <p>
            Stamp duty is a state government tax levied when a property changes ownership. It must be paid before or at the time of registration at the sub-registrar&apos;s office. Failure to pay stamp duty makes the sale deed legally invalid and unenforceable.
          </p>

          <h2 className="font-heading font-bold text-xl text-navy-500">Stamp duty rates across major Indian states (2025)</h2>
          <p>
            Rates vary significantly: Tamil Nadu charges 11% total (7% stamp duty + 4% registration), making it one of the most expensive states for property registration. Maharashtra and Karnataka charge 5–6% total, while Telangana&apos;s effective rate is 6% (4% stamp + 1.5% transfer + 0.5% registration).
          </p>

          <h2 className="font-heading font-bold text-xl text-navy-500">Can stamp duty be paid online?</h2>
          <p>
            Yes. Most states now allow online stamp duty payment through their official portals — Maharashtra&apos;s GRAS, Karnataka&apos;s KAVERI, Delhi&apos;s DORIS, and Telangana&apos;s IGRS. Payment generates a receipt used at the sub-registrar&apos;s office.
          </p>

          <h2 className="font-heading font-bold text-xl text-navy-500">Is stamp duty tax-deductible?</h2>
          <p>
            Yes — stamp duty and registration charges paid for a residential property can be claimed as a deduction under Section 80C of the Income Tax Act, up to the overall limit of ₹1.5 lakh per financial year. This benefit is available only in the year of payment.
          </p>

          <h2 className="font-heading font-bold text-xl text-navy-500">Frequently Asked Questions</h2>
          {[
            { q: 'What is stamp duty on property in Maharashtra in 2025?', a: 'In Maharashtra, stamp duty is 6% for male buyers and 5% for female buyers. In Mumbai, an additional 1% metro cess applies. Registration is 1% (capped at ₹3L).' },
            { q: 'Do women get a concession on stamp duty?', a: 'Yes — most states give women 1–2% off stamp duty. Delhi: 4% vs 6% for men. Maharashtra: 5% vs 6%. Haryana: 5% vs 7%. UP: 6% vs 7%.' },
            { q: 'Is stamp duty included in home loan?', a: 'No. Banks do not fund stamp duty. You must pay it from savings, on top of your down payment. Budget 5–11% extra depending on your state.' },
            { q: 'Which state has the lowest stamp duty?', a: 'Gujarat (4.9% total), Delhi for women (5%), and Karnataka for affordable housing (below ₹20L, just 3%) have some of the lowest rates.' },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
              <h3 className="font-semibold text-navy-500 mb-2">{q}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
