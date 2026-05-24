import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase().trim() ?? ''

  if (!q || q.length < 1) return NextResponse.json([])

  const users = await prisma.user.findMany({
    where: {
      username: { startsWith: q, mode: 'insensitive' },
      isActive: true,
    },
    select: { username: true, name: true },
    take: 6,
    orderBy: { username: 'asc' },
  })

  return NextResponse.json(users.filter((u) => u.username))
}
