import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How IndiaPropertyTalk collects, uses, and protects your personal information.',
  alternates: { canonical: `${SITE_CONFIG.url}/privacy-policy` },
}

const EFFECTIVE_DATE = 'May 12, 2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="container-forum py-10 max-w-4xl">
      <h1 className="font-heading text-3xl font-bold text-navy-500 mb-2">Privacy Policy</h1>
      <p className="text-sm text-neutral-400 mb-8">Effective date: {EFFECTIVE_DATE}</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">

        <section>
          <p>
            IndiaPropertyTalk (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website{' '}
            <strong>www.indiapropertytalk.com</strong>. This Privacy Policy explains what personal information
            we collect, how we use it, and your rights regarding that information. By using our platform,
            you agree to the practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">1. Information We Collect</h2>
          <h3 className="font-semibold text-neutral-800 mb-2">a) Information you provide directly</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li><strong>Account registration:</strong> name and email address when you register with email and password</li>
            <li><strong>Google Sign-In:</strong> name, email address, and profile picture from your Google account (if you choose to sign in with Google)</li>
            <li><strong>User-generated content:</strong> property reviews, discussion posts, comments, and ratings you submit</li>
            <li><strong>Profile updates:</strong> any changes you make to your display name</li>
          </ul>
          <h3 className="font-semibold text-neutral-800 mb-2">b) Information collected automatically</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Usage data:</strong> pages visited, time spent on pages, links clicked, and referring URLs</li>
            <li><strong>Device and browser data:</strong> browser type, operating system, screen resolution, and IP address</li>
            <li><strong>Analytics:</strong> we use Google Analytics 4 to collect anonymised usage statistics (see Section 4)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and manage your account</li>
            <li>To send email OTP codes to verify your email address</li>
            <li>To send notifications about activity on topics you follow (you can unsubscribe at any time)</li>
            <li>To display your name alongside content you post</li>
            <li>To improve site functionality, content quality, and user experience</li>
            <li>To detect and prevent spam, abuse, or fraudulent activity</li>
            <li>To comply with applicable Indian law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">3. Data Sharing</h2>
          <p className="mb-3">
            We do <strong>not</strong> sell, rent, or trade your personal information to third parties.
            We may share data only in the following limited circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Service providers:</strong> trusted processors such as Neon (database hosting), Vercel (web hosting), and Cloudinary (image storage) who process data on our behalf under data processing agreements</li>
            <li><strong>Legal compliance:</strong> if required by Indian law, court order, or government authority</li>
            <li><strong>Safety:</strong> to protect the rights, property, or safety of IndiaPropertyTalk, our users, or the public</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">4. Google Analytics</h2>
          <p>
            We use Google Analytics 4 to understand how visitors use our site. Google Analytics collects
            information such as how often you visit, which pages you view, and what other sites you visited
            before coming to IndiaPropertyTalk. We use this data only to improve our service. Google&rsquo;s
            use of this data is governed by Google&rsquo;s Privacy Policy. You can opt out by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-saffron-600 underline" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">5. Cookies</h2>
          <p>
            We use essential session cookies to keep you logged in. Google Analytics uses its own cookies
            to distinguish users and sessions. We do not use advertising or tracking cookies beyond what
            Google Analytics requires. You can control cookies through your browser settings, but disabling
            them may affect your ability to use certain features (such as staying logged in).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">6. Data Retention</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account data:</strong> retained as long as your account is active</li>
            <li><strong>Posts and comments:</strong> retained indefinitely as part of the forum record; deleted posts are marked as removed but metadata may be retained for moderation purposes</li>
            <li><strong>OTP codes:</strong> automatically expired and purged within 24 hours</li>
            <li><strong>Analytics data:</strong> retained per Google Analytics default retention settings (up to 14 months)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">7. Your Rights</h2>
          <p className="mb-3">
            Under the Digital Personal Data Protection Act, 2023 (DPDPA) and applicable Indian law, you have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your account and associated personal data</li>
            <li>Withdraw consent for processing (where consent is the legal basis)</li>
            <li>Nominate a person to exercise your rights on your behalf</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:notification@indiapropertytalk.com" className="text-saffron-600 underline">
              notification@indiapropertytalk.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">8. Children&rsquo;s Privacy</h2>
          <p>
            IndiaPropertyTalk is not directed at children under the age of 18. We do not knowingly collect
            personal information from minors. If you believe a minor has registered on our platform, please
            contact us and we will promptly delete the account.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">9. Security</h2>
          <p>
            We implement industry-standard security measures including bcrypt password hashing, HTTPS
            encryption in transit, and restricted database access. However, no method of transmission over
            the internet is 100% secure. We cannot guarantee absolute security, and we encourage you to
            use a strong, unique password for your account.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &ldquo;Effective date&rdquo; at the top of this page. Continued use of the platform after any
            change constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-navy-500 mb-3">11. Contact</h2>
          <p>
            For any privacy-related questions or requests, please write to us at{' '}
            <a href="mailto:notification@indiapropertytalk.com" className="text-saffron-600 underline">
              notification@indiapropertytalk.com
            </a>. We aim to respond within 7 business days.
          </p>
        </section>

      </div>
    </div>
  )
}
