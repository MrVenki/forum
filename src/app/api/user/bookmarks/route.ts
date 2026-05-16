import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      topic: {
        select: {
          id: true,
          slug: true,
          title: true,
          propertyName: true,
          propertyType: true,
          avgRating: true,
          ratingCount: true,
          commentCount: true,
          image1Url: true,
          constructionStatus: true,
          priceMin: true,
          priceMax: true,
          city: { select: { id: true, name: true, slug: true, tier: true } },
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  })

  return NextResponse.json(bookmarks)
}
