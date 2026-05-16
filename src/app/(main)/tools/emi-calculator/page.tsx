import type { Metadata } from 'next'
import { EmiCalculator } from '@/components/tools/EmiCalculator'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { IndianRupee } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator India 2025 — IndiaPropertyTalk',
  description: 'Calculate your home loan EMI instantly. Includes affordability check, income multiple, double-burden analysis for under-construction properties, and EMI-to-income ratio.',
  alternates: { canonical: 'https://www.indiapropertytalk.com/tools/emi-calculator' },
}

export default function EmiCalculatorPage() {
  return (
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
  )
}
