import type { Metadata } from 'next'
import { EligibilityCalculator } from '@/components/tools/EligibilityCalculator'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { TrendingUp } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Home Loan Eligibility Calculator India 2025 — IndiaPropertyTalk',
  description: 'Find out how much home loan you qualify for based on your salary and existing EMIs. Compares SBI, HDFC, ICICI, Axis and 4 more banks using FOIR norms.',
  alternates: { canonical: `${SITE_CONFIG.url}/tools/home-loan-eligibility` },
  openGraph: {
    title: 'Home Loan Eligibility Calculator — How Much Loan Can I Get?',
    description: 'Instant eligibility estimate for SBI, HDFC, ICICI, Axis Bank and more. Based on FOIR norms and your salary.',
    url: `${SITE_CONFIG.url}/tools/home-loan-eligibility`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much home loan can I get on a ₹1 lakh salary?',
      acceptedAnswer: { '@type': 'Answer', text: 'On a ₹1 lakh (₹100,000) gross monthly salary with no existing EMIs, you can typically get a home loan of ₹55–65 lakh at 8.75% interest for 20 years, depending on the bank. SBI and HDFC allow up to 50% FOIR (Fixed Obligation to Income Ratio), meaning your max EMI is ₹50,000/month. At current rates, that translates to approximately ₹58–62 lakh in loan eligibility.' },
    },
    {
      '@type': 'Question',
      name: 'What is FOIR in home loan eligibility?',
      acceptedAnswer: { '@type': 'Answer', text: 'FOIR stands for Fixed Obligation to Income Ratio. It is the percentage of your gross monthly income that can go towards all EMI payments combined (existing EMIs + new home loan EMI). Most Indian banks allow a maximum FOIR of 40–50%. If your income is ₹80,000 and existing EMIs are ₹15,000, your available FOIR for a home loan is ₹25,000–₹25,000/month (at 50% FOIR).' },
    },
    {
      '@type': 'Question',
      name: 'Which bank gives the highest home loan in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'SBI, HDFC Bank, and Kotak Mahindra Bank typically offer the highest loan amounts due to their 50% FOIR policy. LIC Housing Finance is more conservative at 45% FOIR. The actual loan amount also depends on your CIBIL score — a score above 750 typically gets better rates and higher eligibility.' },
    },
    {
      '@type': 'Question',
      name: 'Does existing car loan or personal loan affect home loan eligibility?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, significantly. Any existing EMI (car loan, personal loan, credit card EMI) reduces your available FOIR and therefore your home loan eligibility. If you have a ₹20,000 car loan EMI and your income is ₹80,000, your maximum home loan EMI is reduced to ₹20,000 (at 50% FOIR), cutting your eligible loan amount by nearly half. Closing existing loans before applying for a home loan substantially increases eligibility.' },
    },
    {
      '@type': 'Question',
      name: 'What CIBIL score is required for a home loan in India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most banks require a minimum CIBIL score of 650–700 to approve a home loan. However, the best interest rates (lowest) are offered to borrowers with scores of 750 and above. A score below 650 typically leads to rejection or very high interest rates. Check your CIBIL score before applying.' },
    },
  ],
}

export default function EligibilityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-forum py-8 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Home Loan Eligibility' }]} />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-saffron-500" />
            <h1 className="font-heading text-3xl font-bold text-navy-500">Home Loan Eligibility Calculator</h1>
          </div>
          <p className="text-neutral-600">
            Find out how much home loan you qualify for — based on your salary, existing EMIs, and bank-specific FOIR norms. Compare SBI, HDFC, ICICI, Axis and more.
          </p>
        </div>

        <EligibilityCalculator />

        <div className="mt-10 space-y-6 prose prose-sm max-w-none text-neutral-700">
          <h2 className="font-heading font-bold text-xl text-navy-500">How is home loan eligibility calculated?</h2>
          <p>
            Indian banks use a metric called FOIR (Fixed Obligation to Income Ratio) to determine how much of your monthly income can go toward EMIs. Most banks cap this at 40–50% of gross monthly income across all obligations. The formula is:
          </p>
          <p className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 font-mono text-sm">
            Max Home Loan EMI = (Gross Income × FOIR%) − Existing EMIs
          </p>
          <p>
            The eligible loan amount is then calculated from this maximum allowable EMI using the standard EMI formula for your chosen tenure and interest rate.
          </p>

          <h2 className="font-heading font-bold text-xl text-navy-500">How to increase your home loan eligibility</h2>
          <ul className="space-y-2">
            <li><strong>Close existing loans:</strong> Paying off a car loan or personal loan before applying frees up FOIR capacity significantly.</li>
            <li><strong>Add a co-applicant:</strong> A working spouse or parent as co-applicant combines income, boosting eligibility by 30–100%.</li>
            <li><strong>Improve your CIBIL score:</strong> A score above 750 gets you better rates and sometimes higher eligibility. Pay all EMIs on time for 6+ months.</li>
            <li><strong>Choose a longer tenure:</strong> A 30-year loan has a lower EMI than a 20-year loan for the same amount, allowing a higher loan at the same FOIR.</li>
            <li><strong>Show all income sources:</strong> Rental income, freelance income, and interest income count toward gross income at many banks.</li>
          </ul>

          <h2 className="font-heading font-bold text-xl text-navy-500">Frequently Asked Questions</h2>
          {[
            { q: 'How much home loan can I get on a ₹1 lakh salary?', a: 'With ₹1L monthly income, no existing EMIs, and at 8.75% for 20 years: approximately ₹58–62 lakh, depending on the bank\'s FOIR policy (40–50%).' },
            { q: 'What is FOIR and how does it affect eligibility?', a: 'FOIR (Fixed Obligation to Income Ratio) is the max % of income banks allow for all EMIs combined. Most banks cap this at 50%. If you already spend 20% on a car loan, only 30% remains for your home loan EMI.' },
            { q: 'Does existing car loan affect home loan eligibility?', a: 'Yes — significantly. A ₹20K car EMI on ₹80K income reduces your home loan eligibility by roughly ₹18–22 lakh. Consider closing it before applying.' },
            { q: 'What CIBIL score do I need for a home loan?', a: 'Minimum 700 for approval at most banks. 750+ gets the best rates (0.25–0.5% lower). Check your score at CIBIL.com or Experian before applying.' },
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
