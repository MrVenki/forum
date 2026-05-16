import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Called by Vercel cron every 5 minutes to keep Neon from auto-suspending.
// Protected by a shared secret so arbitrary callers cannot trigger DB queries.
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  await prisma.$queryRaw`SELECT 1`
  return NextResponse.json({ ok: true })
}
