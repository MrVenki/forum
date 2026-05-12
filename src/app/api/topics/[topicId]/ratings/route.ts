import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { upsertRatingSchema } from '@/lib/validations/rating'
import { isEmailVerificationEnabled } from '@/lib/features'

export async function POST(req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (isEmailVerificationEnabled() && !session.user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before rating.', requiresVerification: true }, { status: 403 })
  }

  const body = await req.json()
  const parsed = upsertRatingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const topic = await prisma.topic.findUnique({ where: { id: params.topicId }, select: { userId: true } })
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
  if (topic.userId === session.user.id) return NextResponse.json({ error: 'You cannot rate your own topic.' }, { status: 400 })

  const { score, review } = parsed.data

  await prisma.rating.upsert({
    where: { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
    create: { topicId: params.topicId, userId: session.user.id, score, review },
    update: { score, review },
  })

  // Recalculate avg rating
  const agg = await prisma.rating.aggregate({
    where: { topicId: params.topicId },
    _avg: { score: true },
    _count: { score: true },
  })

  await prisma.topic.update({
    where: { id: params.topicId },
    data: {
      avgRating: agg._avg.score ?? 0,
      ratingCount: agg._count.score,
    },
  })

  const full = await prisma.topic.findUnique({
    where: { id: params.topicId },
    select: { slug: true, city: { select: { slug: true } } },
  })
  if (full) revalidatePath(`/${full.city.slug}/${full.slug}`)

  return NextResponse.json({ success: true, avgRating: agg._avg.score, ratingCount: agg._count.score })
}

export async function GET(req: NextRequest, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ userRating: null })

  const rating = await prisma.rating.findUnique({
    where: { topicId_userId: { topicId: params.topicId, userId: session.user.id } },
  })
  return NextResponse.json({ userRating: rating })
}
