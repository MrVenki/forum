/**
 * Cloudflare Turnstile server-side verification.
 * If TURNSTILE_SECRET_KEY is not set, verification is skipped
 * (graceful degradation for development / before keys are configured).
 */
export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  // If not yet configured, allow all (dev / pre-launch)
  if (!secret) return true
  if (!token) return false

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: token }),
      }
    )
    const data = await res.json()
    return data.success === true
  } catch {
    // Network failure — don't hard-block users; log and allow
    console.error('[Turnstile] Verification request failed')
    return true
  }
}
