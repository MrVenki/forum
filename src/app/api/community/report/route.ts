import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'
import { REPORTS_TO_HIDE, targetSchema } from '@/lib/community'

const reportSchema = targetSchema.extend({
  reason: z.enum(['spam', 'promotion', 'abusive', 'false', 'other']),
})

/** POST — report a post or reply. Enough open reports hide it until an admin reviews it. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Sign in to report.' }, { status: 401 })
  if (!checkRateLimit(`community-report:${session.user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many reports. Please wait a little.' }, { status: 429 })
  }
  const parsed = reportSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'Pick a reason.' }, { status: 400 })
  const { targetType, targetId, reason } = parsed.data

  const target =
    targetType === 'POST'
      ? await prisma.communityPost.findFirst({ where: { id: targetId, isDeleted: false }, select: { userId: true, slug: true } })
      : await prisma.communityReply.findFirst({ where: { id: targetId, isDeleted: false }, select: { userId: true, post: { select: { slug: true } } } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.userId === session.user.id) return NextResponse.json({ error: 'You cannot report your own post.' }, { status: 400 })

  await prisma.communityReport.upsert({
    where: { userId_targetType_targetId: { userId: session.user.id, targetType, targetId } },
    create: { userId: session.user.id, targetType, targetId, reason },
    update: { reason, isResolved: false },
  })

  const open = await prisma.communityReport.count({ where: { targetType, targetId, isResolved: false } })
  if (open >= REPORTS_TO_HIDE) {
    const slug = 'slug' in target ? target.slug : target.post.slug
    if (targetType === 'POST') await prisma.communityPost.update({ where: { id: targetId }, data: { isHidden: true } })
    else await prisma.communityReply.update({ where: { id: targetId }, data: { isHidden: true } })
    revalidatePath(`/community/${slug}`)
    revalidatePath('/community')
  }
  return NextResponse.json({ ok: true })
}
