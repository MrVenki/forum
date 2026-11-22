import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { cleanText, getAdmin, logEdits } from '@/lib/adminEdit'

/** Fix the wording of a reply to a review, or remove / restore it. */
export async function PATCH(req: NextRequest, { params: paramsPromise }: { params: Promise<{ replyId: string }> }) {
  const params = await paramsPromise
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const reply = await prisma.ratingReply.findUnique({
    where: { id: params.replyId },
    include: {
      user: { select: { name: true, username: true } },
      rating: { select: { id: true, topic: { select: { slug: true, propertyName: true, city: { select: { slug: true } } } } } },
    },
  })
  if (!reply) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const data: Record<string, unknown> = {}
  if ('content' in body) {
    const c = cleanText(body.content, 2000)
    if (!c) return NextResponse.json({ error: 'A reply cannot be empty.' }, { status: 400 })
    data.content = c
  }
  if (typeof body.isDeleted === 'boolean') data.isDeleted = body.isDeleted
  if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  await prisma.ratingReply.update({ where: { id: reply.id }, data: { ...data, updatedAt: reply.updatedAt } })

  const t = reply.rating.topic
  const who = reply.user.username ? `@${reply.user.username}` : reply.user.name
  await logEdits(
    admin,
    { type: 'RATING_REPLY', id: reply.id, label: `${who}'s reply on a ${t.propertyName} review`, url: `/${t.city.slug}/${t.slug}#review-${reply.rating.id}` },
    reply,
    data,
  )
  revalidatePath(`/${t.city.slug}/${t.slug}`)
  return NextResponse.json({ success: true })
}
