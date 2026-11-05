import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getReviewGaps } from '@/lib/reviewGaps'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ gaps: [] })
  return NextResponse.json({ gaps: await getReviewGaps(session.user.id) })
}
