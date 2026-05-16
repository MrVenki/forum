'use client'

import { useState, useMemo } from 'react'
import { Home, Info, TrendingUp, TrendingDown } from 'lucide-react'

function formatINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function calcEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0
  const r = annualRate / 12 / 100
  return principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1)
}

interface YearResult {
  year: number
  totalRentCost: number
  totalBuyCost: number
  propertyValue: number
  investmentValue: number   // what down payment would be worth if invested
  buyNetCost: number        // buy cost minus property appreciation gain
  rentNetCost: number       // rent cost minus investment gain on down payment
  buyWins: boolean
}

export function RentVsBuyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(8000000)
  const [currentRent, setCurrentRent] = useState(25000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [interestRate, setInterestRate] = useState(8.75)
  const [tenureYears, setTenureYears] = useState(20)
  const [rentAppreciation, setRentAppreciation] = useState(5)      // rent increase % per year
  const [propertyAppreciation, setPropertyAppreciation] = useState(6) // property value increase % per year
  const [investmentReturn, setInvestmentReturn] = useState(10)     // if down payment invested elsewhere
  const [showYear, setShowYear] = useState(10)

  const results = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPct) / 100
    const loanAmount = propertyPrice - downPayment
    const emi = calcEMI(loanAmount, interestRate, tenureYears * 12)

    const yearlyResults: YearResult[] = []

    let cumulativeRent = 0
    let cumulativeBuyCost = 0
    let currentMonthlyRent = currentRent

    for (let year = 1; year <= 30; year++) {
      // Rent path: rent goes up by rentAppreciation% each year
      for (let m = 0; m < 12; m++) {
        cumulativeRent += currentMonthlyRent
      }
      // Buy path: fixed EMI + maintenance (~0.5% of property value per year)
      const maintenanceCost = propertyPrice * 0.005
      cumulativeBuyCost += emi * 12 + maintenanceCost

      // Property value grows
      const propertyValue = propertyPrice * Math.pow(1 + propertyAppreciation / 100, year)
      // Down payment invested at market return
      const investmentValue = downPayment * Math.pow(1 + investmentReturn / 100, year)

      // Net cost comparison:
      // Rent net = cumulative rent paid - investment gains (on down payment invested)
      const rentNetCost = cumulativeRent - (investmentValue - downPayment)
      // Buy net = cumulative EMI+maintenance - property appreciation gain + down payment (opportunity cost)
      const propertyGain = propertyValue - propertyPrice
      const buyNetCost = cumulativeBuyCost - propertyGain

      yearlyResults.push({
        year,
        totalRentCost: cumulativeRent,
        totalBuyCost: cumulativeBuyCost,
        propertyValue,
        investmentValue,
        buyNetCost,
        rentNetCost,
        buyWins: buyNetCost < rentNetCost,
      })

      currentMonthlyRent *= 1 + rentAppreciation / 100
    }

    // Find break-even year (when buying becomes cheaper than renting on net basis)
    const breakEvenYear = yearlyResults.find(r => r.buyWins)?.year ?? null

    const selected = yearlyResults[showYear - 1]
    return { yearlyResults, breakEvenYear, selected, emi, downPayment, loanAmount }
  }, [propertyPrice, currentRent, downPaymentPct, interestRate, tenureYears,
      rentAppreciation, propertyAppreciation, investmentReturn, showYear])

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

  const { selected, breakEvenYear } = results
  const diff = selected ? Math.abs(selected.buyNetCost - selected.rentNetCost) : 0
  const buyIsChEaper = selected?.buyWins

  return (
    <div className="card-base p-6">
      <div className="flex items-center gap-2 mb-6">
        <Home className="h-5 w-5 text-saffron-500" />
        <h2 className="font-heading font-bold text-xl text-navy-500">Rent vs Buy Calculator</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Property Details</p>
            <div className="space-y-4">
              <SliderField label="Property Price" value={propertyPrice} min={1000000} max={50000000} step={200000}
                onChange={setPropertyPrice} display={formatINR(propertyPrice)} />
              <SliderField label="Down Payment" value={downPaymentPct} min={10} max={50} step={5}
                onChange={setDownPaymentPct} display={`${downPaymentPct}% (${formatINR(results.downPayment)})`} />
              <SliderField label="Home Loan Rate (p.a.)" value={interestRate} min={6} max={14} step={0.25}
                onChange={setInterestRate} display={`${interestRate.toFixed(2)}%`} />
              <SliderField label="Loan Tenure" value={tenureYears} min={5} max={30} step={1}
                onChange={setTenureYears} display={`${tenureYears} years`} />
            </div>
          </div>

          <div className="border-b border-neutral-100 pb-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Assumptions</p>
            <div className="space-y-4">
              <SliderField label="Current Monthly Rent" value={currentRent} min={5000} max={200000} step={1000}
                onChange={setCurrentRent} display={formatINR(currentRent)} />
              <SliderField label="Annual Rent Increase" value={rentAppreciation} min={0} max={15} step={0.5}
                onChange={setRentAppreciation} display={`${rentAppreciation}%`}
                hint="Typical Indian city rental increase: 5–8% p.a." />
              <SliderField label="Property Appreciation" value={propertyAppreciation} min={0} max={15} step={0.5}
                onChange={setPropertyAppreciation} display={`${propertyAppreciation}%`}
                hint="Historical average in major Indian cities: 5–8% p.a." />
              <SliderField label="Investment Return (if renting)" value={investmentReturn} min={4} max={18} step={0.5}
                onChange={setInvestmentReturn} display={`${investmentReturn}%`}
                hint="What the down payment earns if invested (equity funds: ~12%, FD: ~7%)" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">View analysis at year</p>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 25, 30].map(y => (
                <button key={y} onClick={() => setShowYear(y)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    showYear === y ? 'bg-saffron-500 text-white' : 'border border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}>{y}yr</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Verdict */}
          <div className={`rounded-xl p-5 text-white text-center ${buyIsChEaper ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              {buyIsChEaper
                ? <TrendingUp className="h-5 w-5" />
                : <TrendingDown className="h-5 w-5" />}
              <p className="text-sm font-medium opacity-90">At Year {showYear}</p>
            </div>
            <p className="text-2xl font-bold">
              {buyIsChEaper ? 'Buying saves' : 'Renting saves'}
            </p>
            <p className="text-3xl font-bold mt-1">{formatINR(diff)}</p>
            <p className="text-xs opacity-70 mt-1">net of appreciation &amp; opportunity cost</p>
          </div>

          {/* Monthly comparison */}
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
              Monthly Outgo
            </p>
            <div className="divide-y divide-neutral-100">
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-neutral-600">If you rent (today)</span>
                <span className="font-bold text-blue-600">{formatINR(currentRent)}/mo</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-neutral-600">If you buy (EMI)</span>
                <span className="font-bold text-emerald-600">{formatINR(results.emi)}/mo</span>
              </div>
            </div>
          </div>

          {/* Cumulative at selected year */}
          {selected && (
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
                Cumulative at Year {showYear}
              </p>
              <div className="divide-y divide-neutral-100">
                <div className="px-4 py-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">🏠 Buying path</span>
                    <span className="font-bold text-emerald-600">{formatINR(selected.buyNetCost)} net cost</span>
                  </div>
                  <div className="text-xs text-neutral-400 space-y-0.5">
                    <div className="flex justify-between">
                      <span>EMI + maintenance paid</span><span>{formatINR(selected.totalBuyCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Property value by yr {showYear}</span><span>{formatINR(selected.propertyValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Appreciation gain</span><span>−{formatINR(selected.propertyValue - propertyPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">🏢 Renting path</span>
                    <span className="font-bold text-blue-600">{formatINR(selected.rentNetCost)} net cost</span>
                  </div>
                  <div className="text-xs text-neutral-400 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Total rent paid</span><span>{formatINR(selected.totalRentCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down payment invested</span><span>{formatINR(selected.investmentValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment gain</span><span>−{formatINR(selected.investmentValue - results.downPayment)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Break-even */}
          <div className={`rounded-xl border p-4 ${breakEvenYear ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <p className="text-xs font-semibold text-neutral-700 mb-1">Break-even Point</p>
            {breakEvenYear ? (
              <p className="text-sm text-emerald-700">
                Buying becomes financially better than renting after <strong>Year {breakEvenYear}</strong> with these assumptions.
              </p>
            ) : (
              <p className="text-sm text-amber-700">
                With these assumptions, renting + investing remains more cost-effective over a 30-year horizon. Try adjusting property appreciation or investment return.
              </p>
            )}
          </div>

          <div className="flex items-start gap-1.5 text-[10px] text-neutral-400">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            Analysis is illustrative. Excludes tax benefits (Sec 80C, 24b), GST, stamp duty, and maintenance. Actual returns vary.
          </div>
        </div>
      </div>
    </div>
  )
}
