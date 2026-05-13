import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: Awaited<ReturnType<typeof getServerSession<typeof authOptions>>>) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MODERATOR'
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
    include: { topic: { include: { city: { select: { slug: true } } } } },
  })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}

  if (typeof body.content === 'string' && body.content.trim().length > 0) {
    data.content = body.content.trim()
  }
  if (typeof body.isDeleted === 'boolean') {
    data.isDeleted = body.isDeleted
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  await prisma.comment.update({ where: { id: params.commentId }, data })

  revalidatePath(`/${comment.topic.city.slug}/${comment.topic.slug}`)

  return NextResponse.json({ success: true })
}

// Soft-delete shortcut (used by the Delete button)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
    include: { topic: { include: { city: { select: { slug: true } } } } },
  })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.comment.update({
    where: { id: params.commentId },
    data: { isDeleted: true },
  })

  revalidatePath(`/${comment.topic.city.slug}/${comment.topic.slug}`)

  return NextResponse.json({ success: true })
}
