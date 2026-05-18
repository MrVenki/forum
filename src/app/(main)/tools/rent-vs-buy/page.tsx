import type { Metadata } from 'next'
import { RentVsBuyCalculator } from '@/components/tools/RentVsBuyCalculator'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Home } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator India 2025 — Is Buying Worth It? — IndiaPropertyTalk',
  description: 'Should you rent or buy a home in India? Compare true long-term costs accounting for EMI, rent increases, property appreciation, and opportunity cost of down payment.',
  alternates: { canonical: `${SITE_CONFIG.url}/tools/rent-vs-buy` },
  openGraph: {
    title: 'Rent vs Buy Calculator India — Which Is Smarter?',
    description: 'The only rent vs buy calculator that accounts for Indian market conditions — property appreciation, rent escalation, and investment opportunity cost.',
    url: `${SITE_CONFIG.url}/tools/rent-vs-buy`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it better to rent or buy a home in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'It depends on your city, holding period, and financial situation. In cities like Mumbai and Bangalore where rental yields are 2–3% but property appreciates at 6–8%, buying typically becomes financially better after 8–12 years. In cities with high rental yields (4%+) or stagnant appreciation, renting and investing the down payment can be superior. Use our calculator to find your personal break-even point.' },
    },
    {
      '@type': 'Question',
      name: 'What is the price-to-rent ratio in Indian cities?',
      acceptedAnswer: { '@type': 'Answer', text: 'The price-to-rent ratio (property price ÷ annual rent) varies by city. Mumbai: 40–60x (very expensive to buy relative to rent). Bangalore: 25–35x. Hyderabad: 20–30x. Pune: 20–28x. Chennai: 18–25x. Delhi NCR: 20–35x. A ratio above 20 generally favours renting in the short term.' },
    },
    {
      '@type': 'Question',
      name: 'What is the opportunity cost of down payment when buying a home?',
      acceptedAnswer: { '@type': 'Answer', text: 'The down payment (typically 20% of property value) is money that could otherwise be invested. If you invest ₹20L in equity mutual funds at 12% return instead of using it as down payment, it grows to ₹1.93 Cr in 20 years. This opportunity cost must be weighed against property appreciation when deciding to buy.' },
    },
    {
      '@type': 'Question',
      name: 'At what stage of life should you buy a home in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Financial planners generally recommend buying when: (1) You plan to stay in the same city for 7+ years, (2) Your EMI will be under 40% of monthly income, (3) You have at least 6 months of emergency fund beyond the down payment, and (4) You have no high-interest debt. Buying in your 30s with a 20-year tenure allows you to be loan-free before retirement.' },
    },
    {
      '@type': 'Question',
      name: 'Does renting make more financial sense in Mumbai?',
      acceptedAnswer: { '@type': 'Answer', text: 'In Mumbai, where price-to-rent ratios are 40–60x, renting is often cheaper on a monthly basis and the high property cost means large down payments. However, Mumbai has seen strong long-term appreciation (6–9% p.a. historically). The rent vs buy decision in Mumbai depends heavily on your expected holding period — generally 12+ years of ownership is needed for buying to beat renting financially.' },
    },
  ],
}

export default function RentVsBuyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-forum py-8 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Rent vs Buy' }]} />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-6 w-6 text-saffron-500" />
            <h1 className="font-heading text-3xl font-bold text-navy-500">Rent vs Buy Calculator India</h1>
          </div>
          <p className="text-neutral-600">
            Compare the true long-term cost of renting versus buying — accounting for property appreciation, rent escalation, EMI burden, and the opportunity cost of your down payment.
          </p>
        </div>

        <RentVsBuyCalculator />

        <div className="mt-10 space-y-6 prose prose-sm max-w-none text-neutral-700">
          <h2 className="font-heading font-bold text-xl text-navy-500">How this calculator works</h2>
          <p>
            Most rent vs buy calculators compare only monthly EMI against monthly rent — that&apos;s misleading. Our calculator models the true financial picture:
          </p>
          <ul className="space-y-1">
            <li><strong>Buying path:</strong> Cumulative EMI + maintenance costs, minus property appreciation over time</li>
            <li><strong>Renting path:</strong> Cumulative rent (with annual escalation), minus what your down payment would have grown to if invested</li>
            <li><strong>Break-even year:</strong> The year when buying becomes financially superior to renting given your inputs</li>
          </ul>

          <h2 className="font-heading font-bold text-xl text-navy-500">What the numbers say about Indian cities (2025)</h2>
          <p>
            In most Indian metro cities, renting is cheaper on a monthly basis — the EMI on a ₹1 Cr property at 8.75% is roughly ₹88,000/month while the same property may rent for ₹30,000–45,000/month (a 2–3% rental yield). However, owning that property that grows at 7% annually means it becomes worth ₹3.87 Cr in 20 years, generating ₹2.87 Cr in wealth. The rent vs buy decision is ultimately about your holding period and risk tolerance.
          </p>

          <h2 className="font-heading font-bold text-xl text-navy-500">When renting clearly makes sense</h2>
          <ul className="space-y-1">
            <li>You plan to move cities within 3–5 years</li>
            <li>The EMI would be more than 50% of your household income</li>
            <li>You are in your 20s with career uncertainty or high job mobility</li>
            <li>You can invest the down payment at returns exceeding property appreciation</li>
          </ul>

          <h2 className="font-heading font-bold text-xl text-navy-500">When buying clearly makes sense</h2>
          <ul className="space-y-1">
            <li>You plan to stay in the same city for 10+ years</li>
            <li>EMI is comfortably under 40% of household income</li>
            <li>You want a forced savings vehicle and wealth building mechanism</li>
            <li>You value the intangible benefits of ownership — renovation freedom, stability, no landlord dependence</li>
          </ul>

          <h2 className="font-heading font-bold text-xl text-navy-500">Frequently Asked Questions</h2>
          {[
            { q: 'Is it better to rent or buy a home in India?', a: 'It depends on your holding period. In most metros, buying beats renting financially after 8–12 years of ownership, assuming 6–7% annual property appreciation.' },
            { q: 'What is the price-to-rent ratio in Indian cities?', a: 'Mumbai: 40–60x (strongly favours renting short-term). Bangalore: 25–35x. Hyderabad: 20–28x. Pune: 20–28x. Chennai: 18–25x. Below 20x generally favours buying.' },
            { q: 'What is opportunity cost of a down payment?', a: '₹20L invested at 12% (equity funds) grows to ₹1.93 Cr in 20 years. This is the hidden cost of buying that most people ignore. Our calculator factors this in.' },
            { q: 'Does renting make sense in Mumbai?', a: 'Monthly renting is much cheaper in Mumbai (2–3% yield vs 8.75% EMI rate). But if you hold for 12+ years and the property appreciates 7%+ p.a., buying still wins long-term.' },
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
