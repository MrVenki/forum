import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Called by Vercel cron every 5 minutes to keep Neon from auto-suspending
export async function GET() {
  await prisma.$queryRaw`SELECT 1`
  return NextResponse.json({ ok: true })
}
