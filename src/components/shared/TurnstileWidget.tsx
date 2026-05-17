'use client'

import { Turnstile } from '@marsidev/react-turnstile'

interface Props {
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  /** Use 'normal' to show the CF branding box, 'invisible' for completely hidden */
  size?: 'normal' | 'compact' | 'invisible'
}

/**
 * Cloudflare Turnstile widget.
 * Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (dev / pre-launch).
 */
export function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
  size = 'invisible',
}: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (!siteKey) return null

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{ theme: 'light', size }}
    />
  )
}
