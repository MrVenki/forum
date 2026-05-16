'use client'

import { useState, useMemo } from 'react'
import { FileText, Info, IndianRupee } from 'lucide-react'

function formatINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

interface StateRule {
  name: string
  male: number        // stamp duty % for male
  female: number      // stamp duty % for female / joint (with female)
  joint: number       // joint male+female (some states same as male)
  registration: number // registration %
  regCap?: number      // registration fee cap in ₹
  transferDuty?: number // some states have transfer duty on top
  notes: string[]
}

const STATE_RULES: Record<string, StateRule> = {
  MH: {
    name: 'Maharashtra',
    male: 6, female: 5, joint: 6,
    registration: 1, regCap: 3_00_000,
    notes: [
      'Mumbai: 6% (male), 5% (female)',
      'Pune, Nagpur, Thane: same rates',
      'Registration capped at ₹3L for properties above ₹30L',
      'Additional 1% metro cess in Mumbai municipal limits',
    ],
  },
  KA: {
    name: 'Karnataka',
    male: 5, female: 5, joint: 5,
    registration: 1,
    notes: [
      'Properties below ₹20L: 2% stamp duty',
      'Properties ₹20L–₹45L: 3% stamp duty',
      'Above ₹45L: 5% stamp duty',
      'Registration: 1% (min ₹1,000)',
    ],
  },
  DL: {
    name: 'Delhi',
    male: 6, female: 4, joint: 5,
    registration: 1, regCap: 1_00_000,
    notes: [
      'Male buyers: 6% stamp duty',
      'Female buyers: 4% stamp duty (2% concession)',
      'Joint (male+female): 5%',
      'Registration: 1% (max ₹1L via sub-registrar)',
    ],
  },
  UP: {
    name: 'Uttar Pradesh',
    male: 7, female: 6, joint: 7,
    registration: 1,
    notes: [
      'Female buyers get 1% concession on stamp duty',
      'Additional surcharges may apply in some districts',
      'Registration: 1% of property value',
    ],
  },
  TS: {
    name: 'Telangana',
    male: 4, female: 4, joint: 4,
    registration: 0.5, transferDuty: 1.5,
    notes: [
      'Stamp duty: 4% flat (no gender concession)',
      'Transfer duty: 1.5% additional',
      'Registration: 0.5%',
      'Effective total: 6% (4 + 1.5 + 0.5)',
    ],
  },
  TN: {
    name: 'Tamil Nadu',
    male: 7, female: 7, joint: 7,
    registration: 4,
    notes: [
      'One of the highest stamp duty states in India',
      'Stamp duty: 7%, Registration: 4%',
      'Total outgo: 11% — factor this into your budget',
      'No gender concession currently',
    ],
  },
  GJ: {
    name: 'Gujarat',
    male: 4.9, female: 4.9, joint: 4.9,
    registration: 1,
    notes: [
      'Stamp duty: 4.9% (includes surcharge)',
      'Registration: 1%',
      'Affordable housing: lower rates may apply',
    ],
  },
  RJ: {
    name: 'Rajasthan',
    male: 6, female: 5, joint: 6,
    registration: 1,
    notes: [
      'Female buyers: 1% concession on stamp duty',
      'Registration: 1% of property value',
      'Additional surcharges in select urban areas',
    ],
  },
  HR: {
    name: 'Haryana',
    male: 7, female: 5, joint: 6,
    registration: 1,
    notes: [
      'Male: 7%, Female: 5%, Joint: 6%',
      'Registration: 1% (min ₹50,000 in some cities)',
      'Panchkula, Gurugram, Faridabad have additional levies',
    ],
  },
  WB: {
    name: 'West Bengal',
    male: 6, female: 6, joint: 6,
    registration: 1, transferDuty: 1,
    notes: [
      'Stamp duty: 6% (Kolkata municipal: +1%)',
      'Transfer duty: 1% additional',
      'Registration: 1%',
      'Effective total in Kolkata: ~9%',
    ],
  },
  MP: {
    name: 'Madhya Pradesh',
    male: 7.5, female: 5, joint: 7.5,
    registration: 3,
    notes: [
      'Male: 7.5%, Female: 5% stamp duty',
      'Registration: 3% (one of the highest)',
      'Total outgo for males can reach 10.5%',
    ],
  },
  AP: {
    name: 'Andhra Pradesh',
    male: 5, female: 5, joint: 5,
    registration: 1, transferDuty: 1.5,
    notes: [
      'Stamp duty: 5% flat',
      'Transfer duty: 1.5%',
      'Registration: 1%',
      'Effective total: 7.5%',
    ],
  },
  PB: {
    name: 'Punjab',
    male: 7, female: 5, joint: 6,
    registration: 1,
    notes: [
      'Male: 7%, Female: 5%, Joint: 6%',
      'Registration: 1% of property value',
    ],
  },
}

type Gender = 'male' | 'female' | 'joint'

export function StampDutyCalculator() {
  const [stateKey, setStateKey] = useState('MH')
  const [propertyValue, setPropertyValue] = useState(5000000)
  const [gender, setGender] = useState<Gender>('male')

  const state = STATE_RULES[stateKey]

  const result = useMemo(() => {
    const stampPct = state[gender]
    const regPct = state.registration
    const transferPct = state.transferDuty ?? 0

    const stampDuty = (propertyValue * stampPct) / 100
    let registration = (propertyValue * regPct) / 100
    if (state.regCap) registration = Math.min(registration, state.regCap)
    const transferDuty = (propertyValue * transferPct) / 100
    const total = stampDuty + registration + transferDuty
    const effectivePct = (total / propertyValue) * 100

    return { stampDuty, registration, transferDuty, total, effectivePct, stampPct }
  }, [stateKey, propertyValue, gender, state])

  const SliderField = ({
    label, value, min, max, step, onChange, display,
  }: {
    label: string; value: number; min: number; max: number; step: number
    onChange: (v: number) => void; display: string
  }) => (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-xs font-medium text-neutral-600">{label}</label>
        <span className="text-sm font-bold text-navy-500">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-saffron-500" />
    </div>
  )

  return (
    <div className="card-base p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-saffron-500" />
        <h2 className="font-heading font-bold text-xl text-navy-500">Stamp Duty &amp; Registration Calculator</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          {/* State selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">State</label>
            <select
              value={stateKey}
              onChange={e => setStateKey(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 bg-white"
            >
              {Object.entries(STATE_RULES).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">Buyer Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'joint'] as Gender[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-lg border py-2 text-sm font-medium transition-colors capitalize ${
                    gender === g
                      ? 'border-saffron-500 bg-saffron-50 text-saffron-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {g === 'joint' ? 'Joint' : g === 'female' ? 'Woman' : 'Man'}
                </button>
              ))}
            </div>
            {gender === 'female' && (
              <p className="mt-1.5 text-xs text-emerald-600 font-medium">
                ✓ Women buyers get a concession in most states
              </p>
            )}
          </div>

          <SliderField
            label="Property Value"
            value={propertyValue} min={500000} max={50000000} step={100000}
            onChange={setPropertyValue}
            display={formatINR(propertyValue)}
          />

          {/* State notes */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1.5">{state.name} — Key Rules</p>
                <ul className="space-y-1">
                  {state.notes.map(n => (
                    <li key={n} className="text-xs text-blue-600">{n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Hero total */}
          <div className="rounded-xl bg-navy-500 p-5 text-white text-center">
            <p className="text-sm text-white/70 mb-1">Total Government Charges</p>
            <p className="text-4xl font-bold">{formatINR(result.total)}</p>
            <p className="text-xs text-white/60 mt-1">
              {result.effectivePct.toFixed(1)}% of property value · {state.name}
            </p>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <div className="divide-y divide-neutral-100">
              <div className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Stamp Duty</p>
                  <p className="text-xs text-neutral-400">{result.stampPct}% of property value</p>
                </div>
                <p className="font-bold text-navy-500">{formatINR(result.stampDuty)}</p>
              </div>
              {result.transferDuty > 0 && (
                <div className="flex justify-between items-center px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Transfer Duty</p>
                    <p className="text-xs text-neutral-400">{state.transferDuty}% additional</p>
                  </div>
                  <p className="font-bold text-navy-500">{formatINR(result.transferDuty)}</p>
                </div>
              )}
              <div className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Registration Charges</p>
                  <p className="text-xs text-neutral-400">
                    {state.registration}%{state.regCap ? ` (capped at ${formatINR(state.regCap)})` : ''}
                  </p>
                </div>
                <p className="font-bold text-navy-500">{formatINR(result.registration)}</p>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-neutral-50">
                <p className="text-sm font-bold text-neutral-800">Total Charges</p>
                <p className="text-lg font-bold text-saffron-600">{formatINR(result.total)}</p>
              </div>
            </div>
          </div>

          {/* True cost */}
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">True Cost of Purchase</p>
            <div className="space-y-2">
              {[
                { label: 'Property value', val: propertyValue },
                { label: 'Stamp duty + registration', val: result.total },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-neutral-600">{row.label}</span>
                  <span className="font-medium text-neutral-800">{formatINR(row.val)}</span>
                </div>
              ))}
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm">
                <span className="font-bold text-neutral-700">Total outgo</span>
                <span className="font-bold text-saffron-600">{formatINR(propertyValue + result.total)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[10px] text-neutral-400">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            Rates are indicative and may vary. Verify with your sub-registrar or a registered valuer before transacting.
          </div>
        </div>
      </div>
    </div>
  )
}
