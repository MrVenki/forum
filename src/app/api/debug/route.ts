import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT SET'
  const masked = dbUrl.replace(/:([^@]+)@/, ':***@').substring(0, 100)
  try {
    const count = await prisma.city.count()
    return NextResponse.json({ ok: true, cityCount: count, dbUrl: masked })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e), dbUrl: masked }, { status: 500 })
  }
}
