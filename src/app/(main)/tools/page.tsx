import type { Metadata } from 'next'
import Link from 'next/link'
import { IndianRupee, Calculator, TrendingUp, Home, FileText, BarChart3, ArrowRight, CheckCircle, Building } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Free Property & Home Loan Calculators India 2025 — IndiaPropertyTalk',
  description: 'Free calculators for Indian home buyers: EMI calculator, affordability checker, stamp duty estimator, rent vs buy analysis and more. Make smarter property decisions.',
  alternates: { canonical: 'https://www.indiapropertytalk.com/tools' },
  openGraph: {
    title: 'Free Property Calculators for Indian Home Buyers — IndiaPropertyTalk',
    description: 'EMI calculator, affordability checker, stamp duty estimator and more. Trusted by thousands of Indian property buyers.',
    url: 'https://www.indiapropertytalk.com/tools',
    type: 'website',
  },
}

const LIVE_TOOLS = [
  {
    href: '/tools/emi-calculator',
    icon: IndianRupee,
    color: 'text-saffron-500',
    bg: 'bg-saffron-50',
    border: 'border-saffron-200',
    title: 'Home Loan EMI Calculator',
    description: 'Calculate your monthly EMI instantly. Includes income multiple check, EMI-to-income ratio, and double-burden analysis for under-construction properties.',
    highlights: ['Income multiple vs RBI guideline', 'EMI-to-income ratio', 'Double burden (EMI + rent) mode', 'SBI / HDFC / ICICI rate ranges'],
    badge: 'Most Used',
  },
  {
    href: '/tools/stamp-duty-calculator',
    icon: FileText,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    title: 'Stamp Duty Calculator',
    description: 'Calculate stamp duty and registration charges for 13 states — Maharashtra, Karnataka, Delhi, UP, Telangana, Tamil Nadu and more. Includes women buyer concessions.',
    highlights: ['13 states covered', 'Women buyer concessions', 'Transfer duty included', 'True cost of purchase'],
    badge: null,
  },
  {
    href: '/tools/home-loan-eligibility',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title: 'Home Loan Eligibility Calculator',
    description: 'Find out how much home loan you qualify for based on your salary, existing EMIs, and FOIR norms. Compares SBI, HDFC, ICICI, Axis and 4 more banks.',
    highlights: ['8 bank comparison', 'FOIR utilisation meter', 'Existing EMI impact', 'Property budget estimate'],
    badge: null,
  },
  {
    href: '/tools/rent-vs-buy',
    icon: Home,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    title: 'Rent vs Buy Calculator',
    description: 'Compare the true long-term cost of renting versus buying — accounting for property appreciation, rent escalation, EMI burden, and opportunity cost of down payment.',
    highlights: ['Break-even year finder', 'Opportunity cost of down payment', 'Rent escalation modelling', '30-year horizon view'],
    badge: null,
  },
]

const COMING_SOON = [
  {
    icon: BarChart3,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Property ROI Calculator',
    description: 'Calculate annualised return on your property investment — rental yield, capital appreciation, and total ROI over any holding period.',
  },
  {
    icon: Building,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: 'GST on Property Calculator',
    description: 'Calculate GST payable on under-construction flats — different rates for affordable vs non-affordable housing, with and without ITC.',
  },
  {
    icon: Calculator,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Home Loan Tax Benefit Calculator',
    description: 'Calculate annual tax savings under Section 80C (principal) and Section 24(b) (interest) on your home loan — for both old and new tax regimes.',
  },
]

const FAQS = [
  {
    q: 'How is home loan EMI calculated in India?',
    a: 'EMI is calculated using the formula: EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the tenure in months. For example, a ₹50L loan at 9% for 20 years gives an EMI of approximately ₹44,986.',
  },
  {
    q: 'What is a good EMI-to-income ratio for a home loan in India?',
    a: 'RBI and most Indian banks recommend keeping your total EMI obligations below 40–50% of gross monthly income. For just the home loan EMI, financial planners suggest staying under 30% for comfortable repayment. Above 50% is considered high risk.',
  },
  {
    q: 'What is stamp duty on property in India?',
    a: 'Stamp duty varies by state: Maharashtra charges 5–6%, Karnataka 5%, Delhi 4–6%, Telangana 4–5%, and Tamil Nadu 7%. Registration charges are typically 1% extra. Women buyers get a 1–2% concession in many states.',
  },
  {
    q: 'What is the income multiple for buying a property in India?',
    a: 'The income multiple is the property price divided by your annual household income. RBI guidelines suggest 4–5×. Under 4× is comfortable, 4–6× is manageable, 6–9× is stretched, and above 9× is considered financially risky for most Indian families.',
  },
  {
    q: 'What is the double burden problem for under-construction properties?',
    a: 'When buying an under-construction flat, you pay EMI (or pre-EMI) to the bank while still paying rent for your current home. This double outgo — EMI + rent — can consume 60–70% of monthly income during the construction period, which typically lasts 2–4 years.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Property & Home Loan Calculators India',
  description: 'Free online calculators for Indian home buyers and property investors',
  url: 'https://www.indiapropertytalk.com/tools',
  numberOfItems: LIVE_TOOLS.length,
  itemListElement: [
    ...LIVE_TOOLS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      description: t.description,
      url: `https://www.indiapropertytalk.com${t.href}`,
    })),
    ...COMING_SOON.map((t, i) => ({
      '@type': 'ListItem',
      position: LIVE_TOOLS.length + i + 1,
      name: t.title,
      description: t.description,
    })),
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function ToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, faqJsonLd]) }} />

      <div className="container-forum py-8 max-w-5xl">
        <Breadcrumbs items={[{ label: 'Tools' }]} />

        {/* Hero */}
        <div className="mt-6 mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy-500 leading-tight">
            Free Property Calculators
            <span className="block text-saffron-500">for Indian Home Buyers</span>
          </h1>
          <p className="mt-3 text-lg text-neutral-600 max-w-2xl">
            Make smarter property decisions with our free calculators — built specifically for Indian market conditions, RBI guidelines, and Indian tax rules.
          </p>
        </div>

        {/* Live Tools */}
        <section aria-labelledby="live-tools-heading">
          <h2 id="live-tools-heading" className="font-heading text-xl font-bold text-navy-500 mb-4">
            Available Now
          </h2>
          <div className="grid sm:grid-cols-1 gap-5 mb-12">
            {LIVE_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative rounded-2xl border-2 ${tool.border} bg-white p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-saffron-500 text-white px-2.5 py-1 rounded-full">
                    {tool.badge}
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.bg}`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl font-bold text-navy-500 group-hover:text-saffron-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{tool.description}</p>
                    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                      {tool.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-600 group-hover:gap-2.5 transition-all">
                      Open Calculator <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <section aria-labelledby="coming-soon-heading">
          <h2 id="coming-soon-heading" className="font-heading text-xl font-bold text-navy-500 mb-1">
            Coming Soon
          </h2>
          <p className="text-sm text-neutral-500 mb-4">More tools being built — bookmark this page.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {COMING_SOON.map((tool) => (
              <div key={tool.title} className="rounded-xl border border-neutral-200 bg-white p-5 opacity-75">
                <div className="flex items-start gap-3">
                  <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tool.bg}`}>
                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-navy-500">{tool.title}</h3>
                      <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Soon</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — SEO goldmine for featured snippets */}
        <section aria-labelledby="faq-heading" className="mb-14">
          <h2 id="faq-heading" className="font-heading text-2xl font-bold text-navy-500 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                <h3 className="font-semibold text-navy-500 mb-2">{q}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal linking — drives users to property discussions */}
        <section className="rounded-2xl bg-gradient-to-br from-navy-500 to-navy-600 p-8 text-white text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Ready to research a property?</h2>
          <p className="text-navy-200 mb-6 max-w-lg mx-auto">
            Use our calculators alongside real buyer reviews. Browse thousands of property discussions from verified Indian home buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-saffron-500 px-6 py-3 text-sm font-semibold text-white hover:bg-saffron-600 transition-colors">
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
              Search by Developer or City
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
