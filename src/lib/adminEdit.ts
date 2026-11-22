import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export type EditTarget = 'TOPIC' | 'RATING' | 'RATING_REPLY' | 'COMMENT' | 'COMMUNITY_POST' | 'COMMUNITY_REPLY' | 'QUESTION' | 'ANSWER' | 'SITE_UPDATE'

export interface AdminUser {
  id: string
  name: string
}

/** The signed-in admin or moderator, or null for anyone else. */
export async function getAdmin(): Promise<AdminUser | null> {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) return null
  return { id: session.user.id, name: session.user.name || session.user.email || 'Admin' }
}

function asText(v: unknown): string | null {
  if (v === null || v === undefined) return null
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v)
}

/**
 * Fields whose change shows an "Edited by a moderator" note to readers.
 * Price, location and other factual fixes stay silent.
 */
export const WORDING_FIELDS: Partial<Record<EditTarget, string[]>> = {
  RATING: ['review', 'pros', 'cons'],
  RATING_REPLY: ['content'],
  COMMENT: ['content'],
  COMMUNITY_POST: ['title', 'body'],
  COMMUNITY_REPLY: ['content'],
}

/**
 * Records each field that really changed. Never throws: if the log table is missing
 * the edit itself has already been saved and only the history entry is lost.
 */
export async function logEdits(
  admin: AdminUser,
  target: { type: EditTarget; id: string; label: string; url?: string | null },
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Promise<void> {
  const rows = Object.keys(after)
    .map((field) => ({ field, oldValue: asText(before[field]), newValue: asText(after[field]) }))
    .filter((r) => r.oldValue !== r.newValue)
  if (rows.length === 0) return
  try {
    await prisma.adminEditLog.createMany({
      data: rows.map((r) => ({
        adminId: admin.id,
        adminName: admin.name,
        targetType: target.type,
        targetId: target.id,
        targetLabel: target.label.slice(0, 200),
        targetUrl: target.url ?? null,
        ...r,
      })),
    })
  } catch (err) {
    console.error('[adminEdit] could not write the edit log:', err)
  }
}

/**
 * Ids of items whose current wording is still the moderator's version. If the member
 * later rewrites the text themselves, the note goes away because the text no longer matches.
 */
export async function moderatorEditedIds(
  type: EditTarget,
  items: { id: string; values: Record<string, string | null | undefined> }[],
): Promise<Set<string>> {
  const fields = WORDING_FIELDS[type] ?? []
  const result = new Set<string>()
  if (items.length === 0 || fields.length === 0) return result
  try {
    const logs = await prisma.adminEditLog.findMany({
      where: { targetType: type, targetId: { in: items.map((i) => i.id) }, field: { in: fields } },
      orderBy: { createdAt: 'desc' },
      select: { targetId: true, field: true, newValue: true },
    })
    const latest = new Map<string, string | null>()
    for (const l of logs) {
      const key = `${l.targetId}:${l.field}`
      if (!latest.has(key)) latest.set(key, l.newValue)
    }
    for (const item of items) {
      for (const f of fields) {
        const key = `${item.id}:${f}`
        if (latest.has(key) && (latest.get(key) ?? null) === (item.values[f] ?? null)) {
          result.add(item.id)
          break
        }
      }
    }
  } catch {
    // Log table not there yet: show no notes
  }
  return result
}

/** Trimmed text, or null when empty. Rejects anything that is not a string. */
export function cleanText(v: unknown, max = 20_000): string | null | undefined {
  if (v === undefined) return undefined
  if (v === null) return null
  if (typeof v !== 'string') return undefined
  const t = v.trim().slice(0, max)
  return t.length ? t : null
}
