import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'

function isAdmin(session: Awaited<ReturnType<typeof getServerSession<typeof authOptions>>>) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MODERATOR'
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: { city: { select: { slug: true } } },
  })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}

  // Edit description
  if (typeof body.description === 'string' && body.description.trim().length >= 20) {
    data.description = body.description.trim()
  }

  // Toggle publish
  if (typeof body.isPublished === 'boolean') {
    data.isPublished = body.isPublished
  }

  // Remove image 1
  if (body.removeImage1 === true && topic.image1PubId) {
    await cloudinary.uploader.destroy(topic.image1PubId).catch(() => {})
    data.image1Url = null
    data.image1PubId = null
  }

  // Remove image 2
  if (body.removeImage2 === true && topic.image2PubId) {
    await cloudinary.uploader.destroy(topic.image2PubId).catch(() => {})
    data.image2Url = null
    data.image2PubId = null
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  await prisma.topic.update({ where: { id: params.topicId }, data })

  // Revalidate affected pages
  revalidatePath(`/${topic.city.slug}/${topic.slug}`)
  revalidatePath(`/${topic.city.slug}`)
  revalidatePath('/')

  return NextResponse.json({ success: true })
}
