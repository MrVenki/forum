import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'About Us — IndiaPropertyTalk',
  description: 'IndiaPropertyTalk was built by Venkatesh, a Chennai-based professional who struggled to find genuine, unbiased property reviews. Our mission is to give every Indian buyer an honest forum to research, discuss and decide.',
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
}

export default function AboutPage() {
  return (
    <div className="container-forum py-12 max-w-3xl">

      {/* Founder note */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron-500 mb-3">Our Story</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy-500 leading-tight mb-6">
          Built because genuine property reviews were impossible to find
        </h1>

        <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-5">
          <p>
            My name is <strong>Venkatesh</strong>. I&rsquo;m from Chennai. In 2025, when I started looking seriously at buying a property, I quickly realised there was no honest place to get real answers.
          </p>
          <p>
            Builder websites showed only the best renders. Real estate portals were full of sponsored listings. YouTube reviews were paid promotions dressed as opinions. When I asked friends and colleagues, everyone had a different experience — mostly shared quietly, in WhatsApp groups or over coffee — never in a public space where it could help the next buyer.
          </p>
          <p>
            I wanted to know: <em>Has the builder delayed before? Is the construction quality actually good? What are residents saying after two years of living there? Is the price justified for this location?</em>
          </p>
          <p>
            No single platform in India answered these questions honestly. So I built one.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100 my-10" />

      {/* Mission */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron-500 mb-3">What We&rsquo;re Building</p>
        <h2 className="font-heading text-2xl font-bold text-navy-500 mb-5">A public forum. No ads. No sponsored listings. No builder influence.</h2>

        <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-5">
          <p>
            IndiaPropertyTalk is a community discussion platform where real buyers, residents, and investors share their unfiltered experiences about properties across India. Every review, rating, and comment is from a registered user — a real person with a stake in the information they share.
          </p>
          <p>
            We cover properties in Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata and 15 more cities. We track developer reputation through community ratings — not paid scores. We don&rsquo;t accept money from builders, brokers, or anyone with a financial interest in the properties discussed here.
          </p>
          <p>
            The goal is simple: every Indian property buyer deserves the same quality of information that someone with 10 well-connected friends in the industry gets. IndiaPropertyTalk is that friend — for everyone.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100 my-10" />

      {/* Values */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron-500 mb-3">What We Stand For</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
          {[
            {
              title: 'Honest Reviews',
              body: 'No review is removed because a builder complained. The community speaks — we protect that right.',
            },
            {
              title: 'Real People',
              body: 'Every account is verified. No fake profiles, no builder-planted reviews, no anonymous spam.',
            },
            {
              title: 'No Paid Influence',
              body: 'We do not accept sponsored content, paid listings, or builder partnerships that compromise editorial independence.',
            },
          ].map((v) => (
            <div key={v.title} className="rounded-xl bg-saffron-50 border border-saffron-100 p-5">
              <h3 className="font-heading font-bold text-navy-500 mb-2">{v.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100 my-10" />

      {/* Stats */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron-500 mb-5">Where We Are Today</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '21', label: 'Cities covered' },
            { value: '250+', label: 'Properties listed' },
            { value: '700+', label: 'Community ratings' },
            { value: '46', label: 'Developer profiles' },
          ].map((s) => (
            <div key={s.label} className="card-base p-4 text-center">
              <p className="font-heading text-2xl font-bold text-saffron-500">{s.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-3">
          Launched 2025. Growing every day as more buyers join the community.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100 my-10" />

      {/* CTA */}
      <div className="rounded-xl bg-navy-500 p-8 text-white text-center">
        <h2 className="font-heading text-xl font-bold mb-2">Have experience with a property?</h2>
        <p className="text-navy-200 text-sm mb-5">
          Your review could save someone from a bad decision — or confirm a good one. Both matter.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn-primary">
            Join the Community
          </Link>
          <Link href="/cities" className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy-400 px-4 py-2 text-sm font-semibold text-navy-100 hover:bg-navy-400 transition-colors">
            Browse Properties
          </Link>
        </div>
      </div>

      {/* Contact */}
      <p className="text-center text-sm text-neutral-400 mt-8">
        Questions or feedback?{' '}
        <Link href="/contact" className="text-saffron-500 hover:text-saffron-600 transition-colors font-medium">
          Get in touch
        </Link>{' '}
        — we read every message.
      </p>

    </div>
  )
}
