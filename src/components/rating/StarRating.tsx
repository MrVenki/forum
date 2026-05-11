'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StarRatingProps {
  value?: number
  onChange?: (score: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  count?: number
}

const SIZES = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' }

export function StarRating({ value = 0, onChange, readonly = false, size = 'md', showCount, count }: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const displayValue = hover || value

  return (
    <div className="flex items-center gap-1.5" role={readonly ? undefined : 'radiogroup'} aria-label={readonly ? `Rating: ${value} out of 5` : 'Rate this property'}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            role={readonly ? undefined : 'radio'}
            aria-checked={readonly ? undefined : value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}${readonly ? ` — current rating` : ''}`}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={cn(
              'transition-all',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
            )}
          >
            <Star
              className={cn(
                SIZES[size],
                'transition-colors',
                displayValue >= star ? 'fill-gold text-gold' : 'fill-transparent text-neutral-300'
              )}
            />
          </button>
        ))}
      </div>
      {showCount !== false && value > 0 && (
        <span className="text-sm font-semibold text-neutral-700">
          {value.toFixed(1)}
          {count !== undefined && <span className="font-normal text-neutral-500 ml-1">({count})</span>}
        </span>
      )}
    </div>
  )
}
