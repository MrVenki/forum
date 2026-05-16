'use client'

import { useState, useMemo } from 'react'
import { IndianRupee, TrendingUp, AlertCircle, Info } from 'lucide-react'

function formatINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function calcEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0
  const r = annualRate / 12 / 100
  return principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1)
}

interface Props {
  /** Pre-fill property price from a topic page */
  prefillPrice?: number
  compact?: boolean
}

export function EmiCalculator({ prefillPrice, compact = false }: Props) {
  const [propertyPrice, setPropertyPrice] = useState(prefillPrice ?? 8000000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [interestRate, setInterestRate] = useState(8.75)
  const [tenureYears, setTenureYears] = useState(20)
  const [monthlyIncome, setMonthlyIncome] = useState(100000)
  const [currentRent, setCurrentRent] = useState(25000)
  const [showDouble, setShowDouble] = useState(false)

  const results = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPct) / 100
    const loanAmount  = propertyPrice - downPayment
    const emi         = calcEMI(loanAmount, interestRate, tenureYears * 12)
    const totalPaid   = emi * tenureYears * 12
    const totalInterest = totalPaid - loanAmount
    const annualIncome  = monthlyIncome * 12
    const incomeYears   = annualIncome > 0 ? propertyPrice / annualIncome : 0
    const emiToIncome   = monthlyIncome > 0 ? (emi / monthlyIncome) * 100 : 0
    const doubleBurden  = emi + currentRent
    const doublePct     = monthlyIncome > 0 ? (doubleBurden / monthlyIncome) * 100 : 0
    return { downPayment, loanAmount, emi, totalPaid, totalInterest, incomeYears, emiToIncome, doubleBurden, doublePct }
  }, [propertyPrice, downPaymentPct, interestRate, tenureYears, monthlyIncome, currentRent])

  const affordabilityColor =
    results.incomeYears <= 4  ? 'text-emerald-600' :
    results.incomeYears <= 6  ? 'text-amber-600'   :
    results.incomeYears <= 9  ? 'text-orange-600'  : 'text-red-600'

  const emiColor =
    results.emiToIncome <= 30 ? 'text-emerald-600' :
    results.emiToIncome <= 40 ? 'text-amber-600'   :
    results.emiToIncome <= 50 ? 'text-orange-600'  : 'text-red-600'

  const SliderField = ({
    label, value, min, max, step, onChange, display, hint
  }: {
    label: string; value: number; min: number; max: number; step: number
    onChange: (v: number) => void; display: string; hint?: string
  }) => (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-xs font-medium text-neutral-600">{label}</label>
        <span className="text-sm font-bold text-navy-500">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-saffron-500"
      />
      {hint && <p className="text-[10px] text-neutral-400 mt-0.5">{hint}</p>}
    </div>
  )

  return (
    <div className={compact ? '' : 'card-base p-6'}>
      {!compact && (
        <div className="flex items-center gap-2 mb-6">
          <IndianRupee className="h-5 w-5 text-saffron-500" />
          <h2 className="font-heading font-bold text-xl text-navy-500">EMI & Affordability Calculator</h2>
        </div>
      )}

      <div className={`grid gap-8 ${compact ? '' : 'lg:grid-cols-2'}`}>
        {/* Inputs */}
        <div className="space-y-5">
          <SliderField
            label="Property Price"
            value={propertyPrice} min={1000000} max={50000000} step={100000}
            onChange={setPropertyPrice}
            display={formatINR(propertyPrice)}
          />
          <SliderField
            label="Down Payment"
            value={downPaymentPct} min={10} max={50} step={1}
            onChange={setDownPaymentPct}
            display={`${downPaymentPct}% (${formatINR(results.downPayment)})`}
            hint="Banks require minimum 10–20%. Higher down payment = lower EMI."
          />
          <SliderField
            label="Interest Rate (p.a.)"
            value={interestRate} min={6} max={14} step={0.05}
            onChange={setInterestRate}
            display={`${interestRate.toFixed(2)}%`}
            hint="Current SBI home loan rate is ~8.5–9%. Check your bank."
          />
          <SliderField
            label="Loan Tenure"
            value={tenureYears} min={5} max={30} step={1}
            onChange={setTenureYears}
            display={`${tenureYears} years`}
          />

          <div className="border-t border-neutral-100 pt-4 space-y-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Affordability Check</p>
            <SliderField
              label="Monthly Household Income"
              value={monthlyIncome} min={25000} max={1000000} step={5000}
              onChange={setMonthlyIncome}
              display={formatINR(monthlyIncome)}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="double-burden" checked={showDouble}
                onChange={e => setShowDouble(e.target.checked)}
                className="accent-saffron-500"
              />
              <label htmlFor="double-burden" className="text-xs text-neutral-600 cursor-pointer">
                I&apos;m currently paying rent (double burden during construction)
              </label>
            </div>
            {showDouble && (
              <SliderField
                label="Current Monthly Rent"
                value={currentRent} min={5000} max={200000} step={1000}
                onChange={setCurrentRent}
                display={formatINR(currentRent)}
              />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* EMI Hero */}
          <div className="rounded-xl bg-navy-500 p-5 text-white text-center">
            <p className="text-sm text-white/70 mb-1">Monthly EMI</p>
            <p className="text-4xl font-bold">{formatINR(results.emi)}</p>
            <p className="text-xs text-white/60 mt-1">
              Loan: {formatINR(results.loanAmount)} · {interestRate}% · {tenureYears}yr
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500">Total Amount Paid</p>
              <p className="font-bold text-navy-500 mt-0.5">{formatINR(results.totalPaid)}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xs text-neutral-500">Total Interest</p>
              <p className="font-bold text-red-500 mt-0.5">{formatINR(results.totalInterest)}</p>
            </div>
          </div>

          {/* Affordability indicators */}
          <div className="space-y-3">
            {/* Income multiple */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-neutral-600">Income Multiple</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Property price ÷ annual income</p>
                </div>
                <span className={`text-2xl font-bold ${affordabilityColor}`}>
                  {results.incomeYears.toFixed(1)}x
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${results.incomeYears <= 4 ? 'bg-emerald-500' : results.incomeYears <= 6 ? 'bg-amber-500' : results.incomeYears <= 9 ? 'bg-orange-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (results.incomeYears / 12) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                RBI guideline: 4–5× · &lt;4× Comfortable · 4–6× Manageable · &gt;9× Stretched
              </p>
            </div>

            {/* EMI to income */}
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-neutral-600">EMI-to-Income Ratio</p>
                  <p className="text-xs text-neutral-400 mt-0.5">EMI as % of monthly income</p>
                </div>
                <span className={`text-2xl font-bold ${emiColor}`}>
                  {results.emiToIncome.toFixed(0)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${results.emiToIncome <= 30 ? 'bg-emerald-500' : results.emiToIncome <= 40 ? 'bg-amber-500' : results.emiToIncome <= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, results.emiToIncome)}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                &lt;30% Healthy · 30–40% Manageable · &gt;50% High risk
              </p>
            </div>

            {/* Double burden */}
            {showDouble && (
              <div className={`rounded-xl border p-4 ${results.doublePct > 60 ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start gap-2">
                  <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${results.doublePct > 60 ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="text-xs font-semibold text-neutral-700">Double Burden (under construction)</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      EMI {formatINR(results.emi)} + Rent {formatINR(currentRent)} = <strong>{formatINR(results.doubleBurden)}/mo</strong>
                      {' '}({results.doublePct.toFixed(0)}% of income)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-1.5 text-[10px] text-neutral-400">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            For illustration only. Actual EMI varies by bank processing fees, GST, and insurance.
          </div>
        </div>
      </div>
    </div>
  )
}
