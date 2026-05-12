import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimer about the user-generated content and information on IndiaPropertyTalk.',
  alternates: { canonical: `${SITE_CONFIG.url}/disclaimer` },
}

const EFFECTIVE_DATE = 'May 12, 2026'

export default function DisclaimerPage() {
  return (
    <div className="container-forum py-10 max-w-4xl">
      <h1 className="font-heading text-3xl font-bold text-navy-500 mb-2">Disclaimer</h1>
      <p className="text-sm text-neutral-400 mb-8">Effective date: {EFFECTIVE_DATE}</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">

        <section>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 text-sm leading-relaxed">
            <strong>Important:</strong> IndiaPropertyTalk is a community discussion forum. All property
            reviews, ratings, comments, and discussions are submitted by individual users and represent
            their personal opinions only. This platform does not provide professional real estate,
            legal, or financial advice.
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">1. User-Generated Content</h2>
          <p>
            All content published on IndiaPropertyTalk — including property reviews, ratings,
            discussions, and comments — is submitted by registered users of the Platform. We do not
            independently verify, endorse, or guarantee the accuracy, completeness, or reliability
            of any user-generated content. The views expressed are solely those of the individual
            contributors and do not represent the views of IndiaPropertyTalk.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">2. Not Professional Advice</h2>
          <p className="mb-3">Nothing on this Platform should be construed as:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Legal advice</strong> — consult a registered lawyer or advocate for legal matters related to property purchase, title, or disputes</li>
            <li><strong>Financial or investment advice</strong> — consult a SEBI-registered investment advisor or AMFI-registered mutual fund distributor for investment decisions</li>
            <li><strong>Valuation or appraisal</strong> — property prices discussed on this forum are anecdotal and may not reflect current market values; consult a registered valuer under the Wealth Tax Act or a certified property appraiser</li>
            <li><strong>RERA compliance guidance</strong> — verify project registrations directly on the relevant state RERA portal</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">3. Verify Independently</h2>
          <p>
            Before making any property purchase, investment, or financial decision based on information
            found on this Platform, you are strongly advised to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-3">
            <li>Visit the property in person and conduct your own due diligence</li>
            <li>Verify the developer&rsquo;s RERA registration on your state&rsquo;s RERA portal</li>
            <li>Engage a qualified advocate to review all sale agreements, title deeds, and encumbrance certificates</li>
            <li>Consult a certified financial planner before taking on a home loan or making a large investment</li>
            <li>Cross-check price information with multiple registered brokers and recent market data</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">4. Developer and Project Information</h2>
          <p>
            Developer reputation scores, ratings, and project details on this Platform are derived
            entirely from community reviews and are not official assessments. Past performance of a
            developer does not guarantee future delivery timelines, construction quality, or project
            completion. Always conduct fresh due diligence for each project.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">5. Price Information</h2>
          <p>
            Property prices, price ranges, and cost estimates mentioned on this Platform are user-reported
            figures based on individual experiences and may be outdated, incomplete, or inaccurate. Real
            estate prices are subject to market fluctuations, negotiation, and additional charges (stamp
            duty, registration fees, GST, maintenance deposits, etc.) that may not be reflected in the
            figures discussed. IndiaPropertyTalk makes no representation as to the accuracy of any
            price information on this Platform.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">6. No Liability</h2>
          <p>
            IndiaPropertyTalk, its owners, employees, and contributors shall not be held liable for
            any loss, damage, or harm — financial or otherwise — arising from reliance on any content
            published on this Platform. This includes but is not limited to losses arising from
            property purchases, investment decisions, or legal actions taken based on forum discussions.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">7. External Links</h2>
          <p>
            This Platform may reference or link to external websites including developer sites, RERA
            portals, and news articles. We do not control, endorse, or take responsibility for the
            content of any external website. Links are provided for convenience only.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">8. Content Removal</h2>
          <p>
            If you believe any content on this Platform is factually incorrect, defamatory, or
            violates your rights, please contact us at{' '}
            <a href="mailto:notification@indiapropertytalk.com" className="text-saffron-600 underline">
              notification@indiapropertytalk.com
            </a>{' '}
            with details and supporting evidence. We will review and take appropriate action in
            accordance with our content moderation policy.
          </p>
        </section>

      </div>
    </div>
  )
}
