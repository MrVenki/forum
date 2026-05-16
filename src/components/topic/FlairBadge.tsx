import React from 'react'

const FLAIR_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  OWNER:      { label: 'Owner',      emoji: '🏠', color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  BUYER:      { label: 'Buyer',      emoji: '🔑', color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200'    },
  RESEARCHER: { label: 'Researcher', emoji: '🔍', color: 'text-purple-700',  bg: 'bg-purple-50',   border: 'border-purple-200'  },
  NRI:        { label: 'NRI',        emoji: '🌏', color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200'  },
  BROKER:     { label: 'Broker',     emoji: '💼', color: 'text-neutral-700', bg: 'bg-neutral-100', border: 'border-neutral-300' },
}

export function FlairBadge({ flair }: { flair: string }) {
  const cfg = FLAIR_CONFIG[flair]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
      <span>{cfg.emoji}</span> {cfg.label}
    </span>
  )
}

export function FlairPicker({
  value,
  onChange,
  saving,
}: {
  value: string | null
  onChange: (flair: string | null) => void
  saving?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-neutral-600">Your community role</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(FLAIR_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => onChange(value === key ? null : key)}
            disabled={saving}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all
              ${value === key
                ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-sm`
                : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
              } disabled:opacity-50`}
          >
            {cfg.emoji} {cfg.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-400">
        Shown on all your comments. Select your most relevant role — or none.
      </p>
    </div>
  )
}

export { FLAIR_CONFIG }
