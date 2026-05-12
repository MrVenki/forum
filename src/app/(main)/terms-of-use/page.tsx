import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using IndiaPropertyTalk — India\'s trusted property discussion forum.',
  alternates: { canonical: `${SITE_CONFIG.url}/terms-of-use` },
}

const EFFECTIVE_DATE = 'May 12, 2026'

export default function TermsOfUsePage() {
  return (
    <div className="container-forum py-10 max-w-4xl">
      <h1 className="font-heading text-3xl font-bold text-navy-500 mb-2">Terms of Use</h1>
      <p className="text-sm text-neutral-400 mb-8">Effective date: {EFFECTIVE_DATE}</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">

        <section>
          <p>
            Welcome to IndiaPropertyTalk. By accessing or using{' '}
            <strong>www.indiapropertytalk.com</strong> (the &ldquo;Platform&rdquo;), you agree to be
            bound by these Terms of Use. Please read them carefully. If you do not agree, please do
            not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">1. About the Platform</h2>
          <p>
            IndiaPropertyTalk is a community-driven discussion forum where registered users can share
            opinions, reviews, ratings, and experiences about residential and commercial properties
            across India. All content on the Platform is user-generated and represents the personal
            views of individual contributors.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">2. Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be at least 18 years of age to create an account or post content</li>
            <li>You must provide accurate and truthful information during registration</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>One person may not maintain more than one active account</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">3. User Conduct</h2>
          <p className="mb-3">By posting on IndiaPropertyTalk, you agree <strong>not</strong> to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post false, misleading, defamatory, or fraudulent content about any property, developer, or person</li>
            <li>Impersonate any individual, company, developer, or government body</li>
            <li>Post spam, promotional content, or unsolicited advertising</li>
            <li>Share another person&rsquo;s personal information without their consent</li>
            <li>Post content that is hateful, obscene, threatening, or violates any applicable Indian law</li>
            <li>Attempt to manipulate ratings or reviews through fake accounts or coordinated inauthentic behavior</li>
            <li>Use automated bots, scrapers, or similar tools to access the Platform without written permission</li>
            <li>Interfere with the security or integrity of the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">4. User-Generated Content</h2>
          <p className="mb-3">
            You retain ownership of the content you post. By submitting content to IndiaPropertyTalk,
            you grant us a non-exclusive, royalty-free, worldwide licence to display, reproduce, and
            distribute that content on the Platform and in promotional materials.
          </p>
          <p>
            You represent that your content does not infringe the intellectual property rights,
            privacy rights, or any other rights of any third party, and that you have all necessary
            permissions to post it.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">5. No Professional Advice</h2>
          <p>
            Content on IndiaPropertyTalk is for informational and discussion purposes only. Nothing on
            this Platform constitutes legal advice, financial advice, investment advice, or a
            professional property valuation. You should always consult qualified professionals — such
            as registered real estate agents, lawyers, and financial advisors — before making any
            property-related decisions. We are not liable for any decisions made based on content
            posted on this Platform.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">6. Moderation and Removal</h2>
          <p>
            We reserve the right, at our sole discretion, to remove, edit, or restrict any content
            or account that violates these Terms or that we deem harmful to the community — without
            prior notice and without liability. Repeated violations may result in permanent account
            suspension.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">7. Intellectual Property</h2>
          <p>
            The IndiaPropertyTalk name, logo, design, and all Platform-owned content (excluding
            user-generated content) are the intellectual property of IndiaPropertyTalk. You may not
            reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">8. Third-Party Links</h2>
          <p>
            The Platform may contain links to third-party websites or developer microsites. We do not
            endorse and are not responsible for the content, accuracy, or practices of any third-party
            site. Accessing third-party links is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable Indian law, IndiaPropertyTalk shall not be
            liable for any direct, indirect, incidental, consequential, or punitive damages arising
            from your use of or inability to use the Platform, reliance on user-generated content,
            or any errors or omissions in the content. Our total aggregate liability shall not exceed
            ₹1,000 (Indian Rupees One Thousand).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">10. Governing Law and Jurisdiction</h2>
          <p>
            These Terms are governed by the laws of India, including the Information Technology Act,
            2000, the Consumer Protection Act, 2019, and the Digital Personal Data Protection Act,
            2023. Any disputes shall be subject to the exclusive jurisdiction of the courts in
            Chennai, Tamil Nadu, India.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">11. Changes to Terms</h2>
          <p>
            We may modify these Terms from time to time. We will update the &ldquo;Effective date&rdquo;
            at the top of this page. Continued use of the Platform after changes are posted constitutes
            your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">12. Contact</h2>
          <p>
            Questions about these Terms? Write to us at{' '}
            <a href="mailto:notification@indiapropertytalk.com" className="text-saffron-600 underline">
              notification@indiapropertytalk.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  )
}
