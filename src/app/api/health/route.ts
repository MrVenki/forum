import { NextResponse } from 'next/server'
import { communityTablesExist, reviewRepliesTableExists } from '@/lib/ensureSchema'

export const dynamic = 'force-dynamic'

/** Liveness plus a yes/no on schema the deploy cannot apply itself. No data is returned. */
export async function GET() {
  let reviewReplies: boolean | null = null
  let community: boolean | null = null
  try {
    reviewReplies = await reviewRepliesTableExists()
  } catch {
    reviewReplies = null
  }
  try {
    community = await communityTablesExist()
  } catch {
    community = null
  }
  return NextResponse.json({ ok: true, reviewReplies, community }, { headers: { 'Cache-Control': 'no-store' } })
}
