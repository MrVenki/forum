'use client'

import { useState, useMemo } from 'react'
import { IndianRupee, TrendingUp, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react'

function fmt(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function calcEMI(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || annualRate <= 0 || months <= 0) return 0
  const r = annualRate / 12 / 100
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function calcFdMaturity(principal: number, annualRate: number, years: number) {
  // Compound quarterly (typical Indian FD)
  return principal * Math.pow(1 + annualRate / 100 / 4, 4 * years)
}

function StatCard({
  label, value, sub, color = 'text-navy-500', bg = 'bg-white',
}: { label: string; value: string; sub?: string; color?: string; bg?: string }) {
  return (
    <div className={`${bg} rounded-xl border border-neutral-100 p-4`}>
      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function SliderField({
  label, value, min, max, step, onChange, display, hint,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; display: string; hint?: string
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-sm font-semibold text-neutral-700">{label}</label>
        <span className="text-sm font-bold text-saffron-600">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-saffron-500"
      />
      <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
        <span>{typeof min === 'number' && min >= 1_00_000 ? fmt(min) : min}</span>
        <span>{typeof max === 'number' && max >= 1_00_000 ? fmt(max) : max}</span>
      </div>
      {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
    </div>
  )
}

export function LoanAgainstFdCalculator() {
  const [fdAmount, setFdAmount] = useState(5_00_000)
  const [fdRate, setFdRate] = useState(7.0)
  const [fdTenureYears, setFdTenureYears] = useState(3)
  const [loanAmount, setLoanAmount] = useState(3_00_000)
  const [loanRate, setLoanRate] = useState(9.0)
  const [loanTenureMonths, setLoanTenureMonths] = useState(24)
  const [breakFdPenalty, setBreakFdPenalty] = useState(1.0)

  const r = useMemo(() => {
    const maxLoan = fdAmount * 0.9
    const clampedLoan = Math.min(loanAmount, maxLoan)
    const emi = calcEMI(clampedLoan, loanRate, loanTenureMonths)
    const totalPaid = emi * loanTenureMonths
    const totalLoanInterest = totalPaid - clampedLoan

    const loanYears = loanTenureMonths / 12
    const fdMaturityFull = calcFdMaturity(fdAmount, fdRate, fdTenureYears)
    const fdInterestTotal = fdMaturityFull - fdAmount

    // FD interest earned during loan period only
    const fdValueAtLoanEnd = calcFdMaturity(fdAmount, fdRate, Math.min(loanYears, fdTenureYears))
    const fdInterestDuringLoan = fdValueAtLoanEnd - fdAmount

    // Net cost = loan interest paid - FD interest earned during loan period
    const netCostOfBorrowing = totalLoanInterest - fdInterestDuringLoan

    // Effective annual rate (net cost annualised)
    const effectiveRate = loanRate - fdRate

    // Break-FD scenario: you break FD, lose penalty interest
    // Penalty reduces FD rate by breakFdPenalty%
    const penalisedFdRate = Math.max(0, fdRate - breakFdPenalty)
    // You only get simple interest at penalised rate (most Indian banks give this on premature withdrawal)
    const fdPrematureValue = fdAmount * (1 + (penalisedFdRate / 100) * loanYears)
    const fdPrematureInterest = fdPrematureValue - fdAmount

    // If you break FD: you get fdAmount back, but lose the full maturity interest
    // Opportunity cost = fdMaturityFull - fdPrematureValue (interest you'd have earned)
    const oppCostBreakFd = fdInterestTotal - fdPrematureInterest

    // Breakeven: month at which cumulative loan interest = cumulative FD interest earned
    let breakevenMonth = null
    {
      let cumLoanInterest = 0
      let cumFdInterest = 0
      const monthlyR = loanRate / 12 / 100
      let balance = clampedLoan
      for (let m = 1; m <= Math.max(loanTenureMonths, fdTenureYears * 12); m++) {
        const interestThisMonth = balance * monthlyR
        cumLoanInterest += interestThisMonth
        balance = Math.max(0, balance - (emi - interestThisMonth))
        cumFdInterest = calcFdMaturity(fdAmount, fdRate, m / 12) - fdAmount
        if (breakevenMonth === null && cumFdInterest >= cumLoanInterest) {
          breakevenMonth = m
        }
      }
    }

    // Yearly breakdown
    const yearlyRows: {
      year: number; fdValue: number; loanBalance: number; cumLoanInterest: number; cumEmiPaid: number
    }[] = []
    {
      let balance = clampedLoan
      let cumInterest = 0
      let cumEmi = 0
      const monthlyR = loanRate / 12 / 100
      for (let y = 1; y <= Math.max(fdTenureYears, Math.ceil(loanYears)); y++) {
        for (let m = 0; m < 12; m++) {
          if (balance <= 0) break
          const interest = balance * monthlyR
          cumInterest += interest
          cumEmi += emi
          balance = Math.max(0, balance - (emi - interest))
        }
        yearlyRows.push({
          year: y,
          fdValue: calcFdMaturity(fdAmount, fdRate, y),
          loanBalance: balance,
          cumLoanInterest: cumInterest,
          cumEmiPaid: cumEmi,
        })
      }
    }

    return {
      clampedLoan, maxLoan, emi, totalPaid, totalLoanInterest,
      fdMaturityFull, fdInterestTotal, fdInterestDuringLoan,
      netCostOfBorrowing, effectiveRate, breakevenMonth,
      fdPrematureInterest, oppCostBreakFd, yearlyRows, loanYears,
    }
  }, [fdAmount, fdRate, fdTenureYears, loanAmount, loanRate, loanTenureMonths, breakFdPenalty])

  const loanExceedsMax = loanAmount > r.maxLoan
  const netPositive = r.netCostOfBorrowing < 0

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* FD Details */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h2 className="font-heading font-bold text-navy-500 text-lg">Fixed Deposit Details</h2>
          </div>
          <SliderField
            label="FD Amount" value={fdAmount} min={1_00_000} max={50_00_000} step={50_000}
            onChange={setFdAmount} display={fmt(fdAmount)}
          />
          <SliderField
            label="FD Interest Rate" value={fdRate} min={4} max={9} step={0.1}
            onChange={setFdRate} display={`${fdRate.toFixed(1)}% p.a.`}
            hint="SBI 7.1% · HDFC 7.4% · Post Office 7.5% (as of 2025)"
          />
          <SliderField
            label="FD Tenure" value={fdTenureYears} min={1} max={10} step={1}
            onChange={setFdTenureYears} display={`${fdTenureYears} yr${fdTenureYears > 1 ? 's' : ''}`}
          />
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
            <p className="text-xs text-emerald-700 font-medium">FD Maturity Value</p>
            <p className="text-xl font-bold text-emerald-700">{fmt(r.fdMaturityFull)}</p>
            <p className="text-xs text-emerald-600">Interest earned: {fmt(r.fdInterestTotal)} (compounded quarterly)</p>
          </div>
        </div>

        {/* Loan Details */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-5 w-5 text-saffron-500" />
            <h2 className="font-heading font-bold text-navy-500 text-lg">Loan Details</h2>
          </div>

          <SliderField
            label="Loan Amount" value={loanAmount} min={50_000} max={Math.min(fdAmount, 50_00_000)} step={10_000}
            onChange={setLoanAmount} display={fmt(loanAmount)}
            hint={`Max eligible: ${fmt(r.maxLoan)} (90% of FD)`}
          />
          {loanExceedsMax && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 -mt-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Loan capped at {fmt(r.maxLoan)} (90% of FD). Banks typically lend 70–90% of FD value.
              </p>
            </div>
          )}

          <SliderField
            label="Loan Interest Rate" value={loanRate} min={5} max={14} step={0.1}
            onChange={setLoanRate} display={`${loanRate.toFixed(1)}% p.a.`}
            hint="Typically FD rate + 1–2%. SBI charges FD rate + 1%."
          />
          <SliderField
            label="Loan Tenure" value={loanTenureMonths} min={6} max={60} step={6}
            onChange={setLoanTenureMonths}
            display={loanTenureMonths >= 12 ? `${Math.floor(loanTenureMonths / 12)} yr${loanTenureMonths >= 24 ? 's' : ''} ${loanTenureMonths % 12 > 0 ? `${loanTenureMonths % 12} mo` : ''}`.trim() : `${loanTenureMonths} months`}
            hint="Must not exceed FD maturity date"
          />
          <SliderField
            label="Premature FD Penalty" value={breakFdPenalty} min={0} max={2} step={0.25}
            onChange={setBreakFdPenalty} display={`${breakFdPenalty}%`}
            hint="Rate deducted if FD is broken early (typically 0.5–1%)"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div>
        <h2 className="font-heading font-bold text-navy-500 text-lg mb-4">Loan Repayment Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Monthly EMI" value={fmt(r.emi)} sub={`for ${loanTenureMonths} months`} color="text-saffron-600" bg="bg-saffron-50" />
          <StatCard label="Total Paid" value={fmt(r.totalPaid)} sub="principal + interest" />
          <StatCard label="Total Interest" value={fmt(r.totalLoanInterest)} sub="cost of the loan" color="text-red-600" />
          <StatCard label="FD Interest Earned" value={fmt(r.fdInterestDuringLoan)} sub={`during ${loanTenureMonths}-month loan`} color="text-emerald-600" bg="bg-emerald-50" />
        </div>
      </div>

      {/* Net Cost */}
      <div className={`rounded-2xl border-2 p-6 ${netPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-start gap-3">
          {netPositive
            ? <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            : <Info className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          }
          <div>
            <h3 className={`font-bold text-lg mb-1 ${netPositive ? 'text-emerald-700' : 'text-amber-700'}`}>
              {netPositive ? 'FD earnings cover the loan cost' : 'Net borrowing cost'}
            </h3>
            <p className={`text-sm mb-3 ${netPositive ? 'text-emerald-600' : 'text-amber-700'}`}>
              {netPositive
                ? `Your FD earns ${fmt(r.fdInterestDuringLoan)} during the loan period vs ${fmt(r.totalLoanInterest)} loan interest — the FD income offsets the loan cost.`
                : `After subtracting FD earnings of ${fmt(r.fdInterestDuringLoan)}, your net borrowing cost is ${fmt(r.netCostOfBorrowing)}.`
              }
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Effective Borrowing Cost</p>
                <p className="text-xl font-bold text-navy-500">{r.effectiveRate.toFixed(1)}% p.a.</p>
                <p className="text-xs text-neutral-500">= {loanRate}% loan − {fdRate}% FD</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Net Cost</p>
                <p className={`text-xl font-bold ${netPositive ? 'text-emerald-600' : 'text-amber-700'}`}>
                  {r.netCostOfBorrowing < 0 ? `−${fmt(Math.abs(r.netCostOfBorrowing))}` : fmt(r.netCostOfBorrowing)}
                </p>
                <p className="text-xs text-neutral-500">over loan tenure</p>
              </div>
              {r.breakevenMonth && (
                <div>
                  <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">FD Covers Loan By</p>
                  <p className="text-xl font-bold text-navy-500">Month {r.breakevenMonth}</p>
                  <p className="text-xs text-neutral-500">FD interest = loan interest</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* vs Breaking FD */}
      <div>
        <h2 className="font-heading font-bold text-navy-500 text-lg mb-4">Loan Against FD vs Breaking FD</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border border-neutral-200">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 rounded-tl-lg">Factor</th>
                <th className="text-center px-4 py-3 font-semibold text-saffron-600">Loan Against FD</th>
                <th className="text-center px-4 py-3 font-semibold text-neutral-600 rounded-tr-lg">Break the FD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 border border-t-0 border-neutral-200">
              <tr>
                <td className="px-4 py-3 text-neutral-600">FD continues earning</td>
                <td className="px-4 py-3 text-center"><span className="text-emerald-600 font-semibold">✓ Yes</span></td>
                <td className="px-4 py-3 text-center"><span className="text-red-500 font-semibold">✗ No</span></td>
              </tr>
              <tr className="bg-neutral-50/50">
                <td className="px-4 py-3 text-neutral-600">Interest earned during loan period</td>
                <td className="px-4 py-3 text-center font-semibold text-emerald-600">{fmt(r.fdInterestDuringLoan)}</td>
                <td className="px-4 py-3 text-center font-semibold text-neutral-500">{fmt(r.fdPrematureInterest)} <span className="text-xs text-neutral-400">(penalised)</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-neutral-600">Interest you pay</td>
                <td className="px-4 py-3 text-center font-semibold text-red-500">{fmt(r.totalLoanInterest)}</td>
                <td className="px-4 py-3 text-center font-semibold text-emerald-600">₹0 (no loan needed)</td>
              </tr>
              <tr className="bg-neutral-50/50">
                <td className="px-4 py-3 text-neutral-600">Premature withdrawal penalty</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-semibold">None</td>
                <td className="px-4 py-3 text-center text-red-500 font-semibold">{breakFdPenalty}% rate cut</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-neutral-600">FD maturity benefit lost</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-semibold">None</td>
                <td className="px-4 py-3 text-center text-amber-600 font-semibold">{fmt(r.oppCostBreakFd)} <span className="text-xs">(lost interest)</span></td>
              </tr>
              <tr className="bg-neutral-50/50">
                <td className="px-4 py-3 text-neutral-600 font-semibold">Monthly EMI burden</td>
                <td className="px-4 py-3 text-center font-bold text-navy-500">{fmt(r.emi)}/mo</td>
                <td className="px-4 py-3 text-center font-bold text-emerald-600">₹0/mo</td>
              </tr>
              <tr className="bg-saffron-50">
                <td className="px-4 py-3 font-bold text-navy-500">Net cost of accessing funds</td>
                <td className="px-4 py-3 text-center font-bold text-navy-500">
                  {r.netCostOfBorrowing < 0 ? `You gain ${fmt(Math.abs(r.netCostOfBorrowing))}` : fmt(r.netCostOfBorrowing)}
                </td>
                <td className="px-4 py-3 text-center font-bold text-navy-500">{fmt(r.oppCostBreakFd)} <span className="text-xs font-normal">opportunity cost</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Breaking FD: you no longer need to repay, but you give up future FD compounding and pay the penalty.
        </p>
      </div>

      {/* Yearly Breakdown */}
      <div>
        <h2 className="font-heading font-bold text-navy-500 text-lg mb-4">Year-by-Year Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border border-neutral-200">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 rounded-tl-lg">Year</th>
                <th className="text-right px-4 py-3 font-semibold text-neutral-600">FD Value</th>
                <th className="text-right px-4 py-3 font-semibold text-neutral-600">Loan Balance</th>
                <th className="text-right px-4 py-3 font-semibold text-neutral-600">EMI Paid (Cum.)</th>
                <th className="text-right px-4 py-3 font-semibold text-neutral-600 rounded-tr-lg">Interest Paid (Cum.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 border border-t-0 border-neutral-200">
              {r.yearlyRows.map((row) => (
                <tr key={row.year} className={row.year % 2 === 0 ? 'bg-neutral-50/50' : ''}>
                  <td className="px-4 py-3 font-medium text-neutral-700">Year {row.year}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{fmt(row.fdValue)}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">
                    {row.loanBalance <= 0 ? <span className="text-emerald-600 font-semibold">Paid off</span> : fmt(row.loanBalance)}
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-600">{fmt(row.cumEmiPaid)}</td>
                  <td className="px-4 py-3 text-right text-red-500">{fmt(row.cumLoanInterest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl bg-navy-500 text-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-saffron-400" />
          <h2 className="font-heading font-bold text-lg">How Loan Against FD Works in India</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-saffron-300 mb-1">Maximum Loan Amount</p>
              <p className="text-navy-200">Most Indian banks lend 70–90% of your FD value. SBI and HDFC offer up to 90%, while smaller banks may cap at 75%.</p>
            </div>
            <div>
              <p className="font-semibold text-saffron-300 mb-1">Interest Rate</p>
              <p className="text-navy-200">Banks charge FD interest rate + 1–2%. SBI charges exactly FD rate + 1%. So if your FD earns 7%, the loan rate is 8%.</p>
            </div>
            <div>
              <p className="font-semibold text-saffron-300 mb-1">No Credit Score Required</p>
              <p className="text-navy-200">Since the FD is the collateral, your CIBIL score does not matter. Processing is faster — usually within 24 hours.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-saffron-300 mb-1">FD Continues to Earn</p>
              <p className="text-navy-200">Your FD is marked as collateral but keeps compounding interest at the original rate throughout the loan tenure.</p>
            </div>
            <div>
              <p className="font-semibold text-saffron-300 mb-1">Loan Tenure</p>
              <p className="text-navy-200">Loan tenure cannot exceed FD maturity date. You can take a shorter loan and repay before FD matures — FD is then released.</p>
            </div>
            <div>
              <p className="font-semibold text-saffron-300 mb-1">When It Makes Sense</p>
              <p className="text-navy-200">Best for short-term liquidity needs. At only 1–2% net cost, it is cheaper than personal loans (12–18%) or credit card loans (36–42%).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
