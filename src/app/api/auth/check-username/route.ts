import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidUsernameFormat } from '@/lib/utils/username'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase().trim()

  if (!q) return NextResponse.json({ available: false, error: 'Missing username' }, { status: 400 })
  if (!isValidUsernameFormat(q)) {
    return NextResponse.json({ available: false, error: 'Invalid format' })
  }

  const existing = await prisma.user.findUnique({ where: { username: q }, select: { id: true } })
  return NextResponse.json({ available: !existing })
}
