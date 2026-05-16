/**
 * Lightweight in-memory rate limiter.
 *
 * Works per serverless instance — not shared across cold starts.
 * For high-traffic production use, replace with Upstash Redis.
 * Still provides meaningful burst protection within a single instance.
 */

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

// Purge stale entries periodically so the Map doesn't grow unbounded
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of store) {
      if (now > bucket.resetAt) store.delete(key)
    }
  }, 60_000)
}

/**
 * Returns true if the request is allowed, false if the limit is exceeded.
 *
 * @param key        Unique bucket key (e.g. `register:${ip}`)
 * @param max        Maximum requests per window
 * @param windowMs   Window duration in milliseconds
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || now > existing.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (existing.count >= max) return false

  existing.count++
  return true
}

/** Extract the best-effort client IP from Next.js request headers. */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
