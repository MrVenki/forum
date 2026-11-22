import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAdmin, logEdits } from '@/lib/adminEdit'
import { COMMUNITY_CATEGORIES } from '@/lib/community'

const schema = z.object({
  targetType: z.enum(['POST', 'REPLY']),
  id: z.string().min(1).max(40),
  action: z.enum(['hide', 'restore', 'delete']),
})

const CATEGORY_SLUGS = COMMUNITY_CATEGORIES.map((c) => c.slug) as [string, ...string[]]

const editSchema = z.object({
  targetType: z.enum(['POST', 'REPLY']),
  id: z.string().min(1).max(40),
  action: z.literal('edit'),
  title: z.string().trim().min(15, 'The title needs at least 15 characters').max(150, 'Keep the title under 150 characters').optional(),
  body: z.string().trim().max(5000, 'Keep it under 5000 characters').optional(),
  category: z.enum(CATEGORY_SLUGS, { message: 'Pick a topic' }).optional(),
  cityId: z.string().max(40).nullable().optional(),
  content: z.string().trim().min(2, 'A reply cannot be empty').max(5000, 'Keep it under 5000 characters').optional(),
})

/** Fix the wording, topic or city of a post, or the wording of a reply. The post's address stays the same. */
async function edit(raw: unknown) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = editSchema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
  const { targetType, id, title, body, category, cityId, content } = parsed.data

  if (targetType === 'POST') {
    const post = await prisma.communityPost.findUnique({ where: { id }, include: { city: { select: { name: true } } } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const data: Record<string, unknown> = {}
    if (title !== undefined) data.title = title
    if (body !== undefined) data.body = body
    if (category !== undefined) data.category = category
    let cityName: string | null | undefined
    if (cityId !== undefined) {
      if (cityId === null) cityName = null
      else {
        const city = await prisma.city.findUnique({ where: { id: cityId }, select: { name: true } })
        if (!city) return NextResponse.json({ error: 'City not found' }, { status: 400 })
        cityName = city.name
      }
      data.cityId = cityId
    }
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    await prisma.communityPost.update({ where: { id }, data })
    const after: Record<string, unknown> = { ...data }
    if (cityId !== undefined) after.cityId = cityName
    await logEdits(admin, { type: 'COMMUNITY_POST', id, label: (title ?? post.title), url: `/community/${post.slug}` }, { ...post, cityId: post.city?.name ?? null }, after)
    revalidatePath(`/community/${post.slug}`)
  } else {
    if (content === undefined) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    const reply = await prisma.communityReply.findUnique({ where: { id }, include: { post: { select: { slug: true, title: true } }, user: { select: { name: true, username: true } } } })
    if (!reply) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.communityReply.update({ where: { id }, data: { content } })
    const who = reply.user.username ? `@${reply.user.username}` : reply.user.name || 'Member'
    await logEdits(admin, { type: 'COMMUNITY_REPLY', id, label: `${who}'s reply on "${reply.post.title}"`, url: `/community/${reply.post.slug}#reply-${id}` }, reply, { content })
    revalidatePath(`/community/${reply.post.slug}`)
  }
  revalidatePath('/community')
  return NextResponse.json({ ok: true })
}

/** PATCH — edit, hide, restore or delete a community post or reply. Restoring also clears its reports. */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const raw = await req.json().catch(() => ({}))
  if (raw && typeof raw === 'object' && (raw as { action?: unknown }).action === 'edit') return edit(raw)
  const parsed = schema.safeParse(raw)
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
