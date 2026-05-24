/**
 * Username utilities
 * Rules: alphanumeric only, max 19 chars, lowercase, unique in DB.
 */

import { prisma } from '@/lib/prisma'

/** Strip non-alphanumeric chars and lowercase */
function sanitize(str: string): string {
  return str.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

/**
 * Derive a base candidate from full name + email prefix.
 * e.g. "Ravi Kumar", "ravi.k@gmail.com" → "ravikumar"
 *      "Karthik Subramanian", "k.sub@mail.com" → "karthiksubramanian" (trim to 15)
 */
export function deriveBase(name: string, email: string): string {
  const fromName = sanitize(name.replace(/\s+/g, ''))
  const fromEmail = sanitize(email.split('@')[0])

  // Prefer name-derived; fall back to email prefix
  const base = fromName || fromEmail || 'user'

  // Cap at 15 chars so there's always room for a 4-digit suffix without exceeding 19
  return base.slice(0, 15)
}

/**
 * Find a unique username in the DB.
 * Tries `base` first, then `base1`, `base2`, … up to `base9999`.
 */
export async function makeUniqueUsername(name: string, email: string): Promise<string> {
  const base = deriveBase(name, email)

  // Try exact base first
  const taken = await prisma.user.findUnique({ where: { username: base }, select: { id: true } })
  if (!taken) return base

  // Try numeric suffixes
  for (let i = 1; i <= 9999; i++) {
    const candidate = `${base}${i}`
    const exists = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })
    if (!exists) return candidate
  }

  // Last resort: full timestamp suffix
  return `${base}${Date.now() % 100000}`
}

/**
 * Check if a username string is valid (format only, not uniqueness).
 */
export function isValidUsernameFormat(username: string): boolean {
  return /^[a-z0-9]{3,19}$/.test(username)
}

/**
 * Display helper — returns "@username" if present, else a safe fallback.
 * Used everywhere a user handle is shown in the UI.
 */
export function displayHandle(user: { username?: string | null; name: string }): string {
  return user.username ? `@${user.username}` : `@${sanitize(user.name).slice(0, 15) || 'user'}`
}
