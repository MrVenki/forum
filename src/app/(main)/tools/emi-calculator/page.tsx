import type { Metadata } from 'next'
import { EmiCalculator } from '@/components/tools/EmiCalculator'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { IndianRupee } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants/config'

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator India 2025 — IndiaPropertyTalk',
  description: 'Calculate your home loan EMI instantly. Includes affordability check, income multiple, double-burden analysis for under-construction properties, and EMI-to-income ratio.',
  alternates: { canonical: `${SITE_CONFIG.url}/tools/emi-calculator` },
  openGraph: {
    title: 'Home Loan EMI Calculator India 2025',
    description: 'Calculate your monthly EMI with affordability check, income multiple, and double-burden analysis for under-construction properties.',
    url: `${SITE_CONFIG.url}/tools/emi-calculator`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate my home loan EMI in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter the property price, down payment percentage, home loan interest rate, and loan tenure. The EMI formula is: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate, and n is the number of months. Most banks in India offer home loans at 8.4–9.5% interest for tenures of 10–30 years.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the income multiple in home loan affordability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The income multiple is the ratio of property price to your annual household income. RBI and financial planners recommend keeping this below 4–5×. A property priced at more than 9× your annual income is considered financially stretched. For example, a ₹1 Cr property on a ₹15L annual income gives an income multiple of 6.7×, which is borderline high.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the double burden problem for under-construction properties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When buying an under-construction property, you pay full EMI (or pre-EMI) to the bank while also paying rent for your current home. This double burden — EMI + rent — can consume 60–70% of monthly income for middle-class families. For a ₹80L loan at 8.75% (EMI ≈ ₹71,000) plus ₹20,000 rent, that is ₹91,000/month until possession, which is unaffordable for most households earning under ₹2L/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are current home loan interest rates in India in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In 2025, most public sector banks (SBI, PNB, Bank of Baroda) offer home loans in the 8.4–9.0% range for salaried employees with good CIBIL scores. Private banks (HDFC, ICICI, Axis) typically range from 8.75–9.5%. The actual rate depends on your CIBIL score (750+ gets the best rates), loan amount, and income profile. Women borrowers often get 0.05–0.1% concession.',
      },
    },
    {
      '@type': 'Question',
      name: 'What percentage of salary should EMI be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Indian banks use FOIR (Fixed Obligation to Income Ratio) — most banks cap total EMIs (including home loan) at 40–50% of gross monthly income. Financial planners recommend keeping your home loan EMI alone below 30–35% of take-home (net) salary to maintain a comfortable lifestyle and emergency fund. Going above 40% of net income on EMI creates significant financial stress.',
      },
    },
  ],
}

export default function EmiCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="container-forum py-8 max-w-4xl">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'EMI Calculator' }]} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <IndianRupee className="h-6 w-6 text-saffron-500" />
          <h1 className="font-heading text-3xl font-bold text-navy-500">Home Loan EMI Calculator</h1>
        </div>
        <p className="text-neutral-600">
          Calculate your monthly EMI and check if the property is truly affordable — including the
          double-burden during under-construction periods when you pay both EMI and rent.
        </p>
      </div>

      <EmiCalculator />

      {/* Educational content for SEO */}
      <div className="mt-10 space-y-6 prose prose-sm max-w-none text-neutral-700">
        <h2 className="font-heading font-bold text-xl text-navy-500">How to use this calculator</h2>
        <p>
          Enter the property price, your preferred down payment percentage, the expected home loan
          interest rate, and your loan tenure. The calculator instantly shows your monthly EMI along
          with two key affordability indicators used by Indian banks and RBI guidelines.
        </p>

        <h2 className="font-heading font-bold text-xl text-navy-500">What is the income multiple?</h2>
        <p>
          The income multiple tells you how many years of your annual household income the property
          costs. RBI and most financial planners recommend keeping this under 4–5×. Properties priced
          at more than 9× your annual income are considered financially stretched for most families.
        </p>

        <h2 className="font-heading font-bold text-xl text-navy-500">The double burden problem</h2>
        <p>
          When buying an under-construction property, you often pay pre-EMI or full EMI to the bank
          while continuing to pay rent for your current home. This double burden — EMI + rent — can
          eat up 60–70% of monthly income for many Indian middle-class families. Use the double burden
          toggle to see the real monthly outgo during the construction period.
        </p>

        <h2 className="font-heading font-bold text-xl text-navy-500">Current home loan interest rates (2025)</h2>
        <p>
          Most public sector banks (SBI, PNB, Bank of Baroda) offer home loans in the 8.4–9.0% range
          for salaried employees with good credit scores. Private banks (HDFC, ICICI, Axis) typically
          range from 8.75–9.5%. The actual rate depends on your CIBIL score, income, and loan amount.
        </p>
      </div>
    </div>
    </>
  )
}
