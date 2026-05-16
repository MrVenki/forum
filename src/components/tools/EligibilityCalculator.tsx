'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Info, CheckCircle, AlertCircle } from 'lucide-react'

function formatINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

/** Max loan given max allowed EMI */
function loanFromEmi(emi: number, annualRate: number, tenureMonths: number): number {
  if (emi <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0
  const r = annualRate / 12 / 100
  return emi * (Math.pow(1 + r, tenureMonths) - 1) / (r * Math.pow(1 + r, tenureMonths))
}

const BANKS = [
  { name: 'SBI', foir: 50, rate: 8.5 },
  { name: 'HDFC Bank', foir: 50, rate: 8.75 },
  { name: 'ICICI Bank', foir: 48, rate: 8.75 },
  { name: 'Axis Bank', foir: 48, rate: 8.75 },
  { name: 'Kotak Mahindra', foir: 50, rate: 8.7 },
  { name: 'LIC HFL', foir: 45, rate: 8.5 },
  { name: 'PNB Housing', foir: 50, rate: 8.6 },
  { name: 'Bank of Baroda', foir: 50, rate: 8.4 },
]

interface Props {
  compact?: boolean
}

export function EligibilityCalculator({ compact = false }: Props) {
  const [monthlyIncome, setMonthlyIncome] = useState(100000)
  const [existingEmis, setExistingEmis] = useState(0)
  const [interestRate, setInterestRate] = useState(8.75)
  const [tenureYears, setTenureYears] = useState(20)
  const [downPaymentPct, setDownPaymentPct] = useState(20)

  const results = useMemo(() => {
    // Standard FOIR: 50% of gross income allowed for all obligations
    const foir = 0.50
    const maxTotalEmi = monthlyIncome * foir
    const maxHomeLoanEmi = Math.max(0, maxTotalEmi - existingEmis)
    const maxLoan = loanFromEmi(maxHomeLoanEmi, interestRate, tenureYears * 12)
    const maxProperty = maxLoan / (1 - downPaymentPct / 100)
    const downPayment = maxProperty - maxLoan
    const usedFoir = existingEmis > 0 ? (existingEmis / monthlyIncome) * 100 : 0
    const remainingFoir = foir * 100 - usedFoir

    // Per-bank estimates
    const bankEstimates = BANKS.map(b => {
      const bMaxEmi = Math.max(0, monthlyIncome * (b.foir / 100) - existingEmis)
      const bLoan = loanFromEmi(bMaxEmi, b.rate, tenureYears * 12)
      return { ...b, maxLoan: bLoan, maxEmi: bMaxEmi }
    })

    return {
      maxHomeLoanEmi, maxLoan, maxProperty, downPayment,
      usedFoir, remainingFoir, bankEstimates,
    }
  }, [monthlyIncome, existingEmis, interestRate, tenureYears, downPaymentPct])

  const SliderField = ({
    label, value, min, max, step, onChange, display, hint,
  }: {
    label: string; value: number; min: number; max: number; step: number
    onChange: (v: number) => void; display: string; hint?: string
  }) => (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-xs font-medium text-neutral-600">{label}</label>
        <span className="text-sm font-bold text-navy-500">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-saffron-500" />
      {hint && <p className="text-[10px] text-neutral-400 mt-0.5">{hint}</p>}
    </div>
  )

  const foirStatus =
    results.remainingFoir >= 40 ? { color: 'text-emerald-600', label: 'Excellent eligibility' } :
    results.remainingFoir >= 25 ? { color: 'text-amber-600', label: 'Good eligibility' } :
    results.remainingFoir >= 10 ? { color: 'text-orange-600', label: 'Limited eligibility' } :
    { color: 'text-red-600', label: 'Low eligibility — reduce existing EMIs' }

  return (
    <div className={compact ? '' : 'card-base p-6'}>
      {!compact && (
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-saffron-500" />
          <h2 className="font-heading font-bold text-xl text-navy-500">Home Loan Eligibility Calculator</h2>
        </div>
      )}

      <div className={`grid gap-8 ${compact ? '' : 'lg:grid-cols-2'}`}>
        {/* Inputs */}
        <div className="space-y-5">
          <SliderField
            label="Gross Monthly Income"
            value={monthlyIncome} min={25000} max={1000000} step={5000}
            onChange={setMonthlyIncome}
            display={formatINR(monthlyIncome)}
            hint="Include salary, rental income, business income before deductions"
          />
          <SliderField
            label="Existing Monthly EMIs"
            value={existingEmis} min={0} max={100000} step={1000}
            onChange={setExistingEmis}
            display={existingEmis === 0 ? 'None' : formatINR(existingEmis)}
            hint="Car loan, personal loan, credit card EMIs etc."
          />
          <SliderField
            label="Interest Rate (p.a.)"
            value={interestRate} min={7} max={14} step={0.05}
            onChange={setInterestRate}
            display={`${interestRate.toFixed(2)}%`}
          />
          <SliderField
            label="Loan Tenure"
            value={tenureYears} min={5} max={30} step={1}
            onChange={setTenureYears}
            display={`${tenureYears} years`}
          />
          <SliderField
            label="Down Payment"
            value={downPaymentPct} min={10} max={50} step={5}
            onChange={setDownPaymentPct}
            display={`${downPaymentPct}%`}
            hint="Banks require min 10–20%. Higher down payment = larger property budget."
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Hero */}
          <div className="rounded-xl bg-navy-500 p-5 text-white text-center">
            <p className="text-sm text-white/70 mb-1">Maximum Home Loan Eligible</p>
            <p className="text-4xl font-bold">{formatINR(results.maxLoan)}</p>
            <p className="text-xs text-white/60 mt-1">
              Max EMI: {formatINR(results.maxHomeLoanEmi)}/mo · {interestRate}% · {tenureYears}yr
            </p>
          </div>

          {/* Property budget */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500">Property Budget</p>
              <p className="font-bold text-navy-500 mt-0.5">{formatINR(results.maxProperty)}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">with {downPaymentPct}% down</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500">Down Payment Needed</p>
              <p className="font-bold text-navy-500 mt-0.5">{formatINR(results.downPayment)}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{downPaymentPct}% of property</p>
            </div>
          </div>

          {/* FOIR meter */}
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-600">FOIR Utilisation</p>
              <span className={`text-sm font-bold ${foirStatus.color}`}>{foirStatus.label}</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden flex">
              {existingEmis > 0 && (
                <div
                  className="h-full bg-red-400 transition-all"
                  style={{ width: `${Math.min(100, results.usedFoir)}%` }}
                  title="Existing EMIs"
                />
              )}
              <div
                className="h-full bg-saffron-400 transition-all"
                style={{ width: `${Math.min(100 - results.usedFoir, results.remainingFoir)}%` }}
                title="Available for home loan"
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>{results.usedFoir.toFixed(0)}% used by existing EMIs</span>
              <span>{results.remainingFoir.toFixed(0)}% available for home loan</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-2">
              FOIR = Fixed Obligation to Income Ratio. Banks allow max 40–50% of gross income for all EMIs combined.
            </p>
          </div>

          {/* Bank comparison */}
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
              Bank-wise Estimates
            </p>
            <div className="divide-y divide-neutral-100">
              {results.bankEstimates.map(b => (
                <div key={b.name} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{b.name}</p>
                    <p className="text-[10px] text-neutral-400">FOIR {b.foir}% · {b.rate}% rate</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy-500">{formatINR(b.maxLoan)}</p>
                    <p className="text-[10px] text-neutral-400">EMI: {formatINR(b.maxEmi)}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {results.maxLoan <= 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700">Your existing EMIs exceed the FOIR limit. Reduce existing debt before applying for a home loan.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-700">
                You are eligible for a home loan. A higher CIBIL score (750+) can get you a better interest rate, increasing your eligible amount.
              </p>
            </div>
          )}

          <div className="flex items-start gap-1.5 text-[10px] text-neutral-400">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            Estimates based on standard FOIR norms. Actual eligibility depends on CIBIL score, employer category, and bank policy. Apply to multiple banks to compare.
          </div>
        </div>
      </div>
    </div>
  )
}
