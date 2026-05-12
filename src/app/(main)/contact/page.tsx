import type { Metadata } from 'next'
import { Mail, Clock, Shield, AlertTriangle, MessageSquare } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the IndiaPropertyTalk team for support, feedback, or content removal requests.',
  alternates: { canonical: `${SITE_CONFIG.url}/contact` },
}

const CONTACT_EMAIL = 'hello@indiapropertytalk.com'

const topics = [
  {
    icon: MessageSquare,
    title: 'General Enquiries',
    description: 'Questions about the platform, how things work, or feedback on your experience.',
    color: 'text-saffron-500',
    bg: 'bg-saffron-50',
  },
  {
    icon: AlertTriangle,
    title: 'Content Removal',
    description: 'Report inaccurate, defamatory, or rights-infringing content. Include the page URL and reason.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Privacy Requests',
    description: 'Requests to access, correct, or delete your personal data under the DPDPA 2023.',
    color: 'text-teal-DEFAULT',
    bg: 'bg-teal-50',
  },
  {
    icon: Mail,
    title: 'Business & Partnerships',
    description: 'Developer partnerships, collaboration proposals, or media enquiries.',
    color: 'text-navy-400',
    bg: 'bg-navy-50',
  },
]

export default function ContactPage() {
  return (
    <div className="container-forum py-10 max-w-4xl">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-navy-500 mb-2">Contact Us</h1>
        <p className="text-neutral-500 max-w-xl">
          Have a question, found an issue, or want to get in touch? We&rsquo;d love to hear from you.
          Send us an email and we&rsquo;ll respond as quickly as we can.
        </p>
      </div>

      {/* Email CTA */}
      <div className="card-base p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="h-14 w-14 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center shrink-0">
          <Mail className="h-7 w-7 text-saffron-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-500 mb-1">Reach us at</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-heading text-xl font-bold text-saffron-600 hover:text-saffron-700 transition-colors break-all"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="text-sm text-neutral-400 mt-1 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> We aim to respond within 2–3 business days
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="btn-primary shrink-0"
        >
          Send Email
        </a>
      </div>

      {/* Topic cards */}
      <h2 className="font-heading text-lg font-bold text-navy-500 mb-4">What can we help you with?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {topics.map((t) => (
          <div key={t.title} className="card-base p-5 flex gap-4">
            <div className={`h-10 w-10 rounded-lg ${t.bg} flex items-center justify-center shrink-0`}>
              <t.icon className={`h-5 w-5 ${t.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-1">{t.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-6">
        <h2 className="font-heading font-bold text-navy-500 mb-3">Tips for faster responses</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex items-start gap-2">
            <span className="text-saffron-500 font-bold mt-0.5">•</span>
            Include the full URL of the page you&rsquo;re writing about
          </li>
          <li className="flex items-start gap-2">
            <span className="text-saffron-500 font-bold mt-0.5">•</span>
            For content removal, describe why the content is inaccurate or harmful and attach supporting evidence
          </li>
          <li className="flex items-start gap-2">
            <span className="text-saffron-500 font-bold mt-0.5">•</span>
            For account issues, include the email address registered on your account
          </li>
          <li className="flex items-start gap-2">
            <span className="text-saffron-500 font-bold mt-0.5">•</span>
            We do not accept requests sent via social media — email only
          </li>
        </ul>
      </div>
    </div>
  )
}
