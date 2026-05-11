import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400 // 24h

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { topics: { where: { isPublished: true } } } } },
    })
    return NextResponse.json(cities)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}
