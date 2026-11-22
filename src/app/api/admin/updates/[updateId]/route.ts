import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAdmin, logEdits } from '@/lib/adminEdit'

function isAdmin(session: Awaited<ReturnType<typeof getServerSession<typeof authOptions>>>) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MODERATOR'
}

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ updateId: string }> }
) {
  const params = await paramsPromise
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const update = await prisma.topicUpdate.findUnique({
    where: { id: params.updateId },
    include: { topic: { include: { city: { select: { slug: true } } } } },
  })
  if (!update) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof body.content === 'string' && body.content.trim().length >= 10) data.content = body.content.trim()
  if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  await prisma.topicUpdate.update({ where: { id: params.updateId }, data })
  const admin = await getAdmin()
  if (admin) await logEdits(admin, { type: 'SITE_UPDATE', id: update.id, label: `Site update on ${update.topic.propertyName}`, url: `/${update.topic.city.slug}/${update.topic.slug}` }, update, data)
  revalidatePath(`/${update.topic.city.slug}/${update.topic.slug}`)
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ updateId: string }> }
) {
  const params = await paramsPromise
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const update = await prisma.topicUpdate.findUnique({
    where: { id: params.updateId },
    include: { topic: { include: { city: { select: { slug: true } } } } },
  })
  if (!update) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.topicUpdate.delete({ where: { id: params.updateId } })
  revalidatePath(`/${update.topic.city.slug}/${update.topic.slug}`)
  return NextResponse.json({ success: true })
}
