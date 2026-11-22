import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  targetType: z.enum(['POST', 'REPLY']),
  id: z.string().min(1).max(40),
  action: z.enum(['hide', 'restore', 'delete']),
})

/** PATCH — hide, restore or delete a community post or reply. Restoring also clears its reports. */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { targetType, id, action } = parsed.data

  let slug: string
  if (targetType === 'POST') {
    const post = await prisma.communityPost.findUnique({ where: { id }, select: { slug: true } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    slug = post.slug
    await prisma.communityPost.update({
      where: { id },
      data: action === 'delete' ? { isDeleted: true } : { isHidden: action === 'hide' },
    })
  } else {
    const reply = await prisma.communityReply.findUnique({ where: { id }, select: { postId: true, isDeleted: true, post: { select: { slug: true } } } })
    if (!reply) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    slug = reply.post.slug
    if (action === 'delete') {
      if (!reply.isDeleted) {
        // A deleted answer takes its own replies with it
        const ids = [id, ...(await prisma.communityReply.findMany({ where: { parentId: id, isDeleted: false }, select: { id: true } })).map((r) => r.id)]
        await prisma.communityReply.updateMany({ where: { id: { in: ids } }, data: { isDeleted: true } })
        await prisma.communityPost.update({ where: { id: reply.postId }, data: { replyCount: { decrement: ids.length } } })
      }
    } else {
      await prisma.communityReply.update({ where: { id }, data: { isHidden: action === 'hide' } })
    }
  }

  if (action !== 'hide') {
    await prisma.communityReport.updateMany({ where: { targetType, targetId: id, isResolved: false }, data: { isResolved: true } })
  }
  revalidatePath(`/community/${slug}`)
  revalidatePath('/community')
  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
