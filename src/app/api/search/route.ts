import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const citySlug = searchParams.get('city')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = 15

  if (!q || q.length < 2) return NextResponse.json({ topics: [], total: 0 })

  const where: Record<string, unknown> = {
    isPublished: true,
    OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { propertyName: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { address: { contains: q, mode: 'insensitive' } },
    ],
  }

  if (citySlug) {
    const city = await prisma.city.findUnique({ where: { slug: citySlug }, select: { id: true } })
    if (city) where.cityId = city.id
  }

  const [topics, total] = await Promise.all([
    prisma.topic.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        city: { select: { name: true, slug: true } },
        user: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.topic.count({ where }),
  ])

  return NextResponse.json({ topics, total, page, totalPages: Math.ceil(total / limit) })
}
