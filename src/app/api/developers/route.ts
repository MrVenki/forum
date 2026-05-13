import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

export async function GET() {
  const developers = await prisma.developer.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(developers)
}
