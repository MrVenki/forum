import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'

const VISITOR_COOKIE = 'ipt_vid'
export const REFERRAL_COOKIE = 'ipt_ref'
const ONE_YEAR = 60 * 60 * 24 * 365

function hash(id: string): string {
  return createHash('sha256').update(id).digest('hex').slice(0, 32)
}

/** Stable anonymous key for a browser; sets the cookie when missing. Route handlers only. */
export function getVisitorKey(): string {
  const store = cookies()
  let id = store.get(VISITOR_COOKIE)?.value
  if (!id || !/^[a-f0-9]{32}$/.test(id)) {
    id = randomBytes(16).toString('hex')
    store.set(VISITOR_COOKIE, id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ONE_YEAR,
      path: '/',
    })
  }
  return `a:${hash(id)}`
}

/** Read-only variant: returns null instead of minting a new cookie. */
export function peekVisitorKey(): string | null {
  const id = cookies().get(VISITOR_COOKIE)?.value
  return id && /^[a-f0-9]{32}$/.test(id) ? `a:${hash(id)}` : null
}
