import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: Awaited<ReturnType<typeof getServerSession<typeof authOptions>>>) {
  const role = session?.user?.role
  return role === 'ADMIN' || role === 'MODERATOR'
}

async function getQuestionWithTopic(questionId: string) {
  return prisma.question.findUnique({
    where: { id: questionId },
    include: { topic: { include: { city: { select: { slug: true } } } } },
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const question = await getQuestionWithTopic(params.questionId)
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof body.body === 'string' && body.body.trim().length >= 10) data.body = body.body.trim()
  if (Object.keys(data).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  await prisma.question.update({ where: { id: params.questionId }, data })
  if (question.topic) revalidatePath(`/${question.topic.city.slug}/${question.topic.slug}`)
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const question = await getQuestionWithTopic(params.questionId)
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Hard delete — cascades to answers via Prisma relation
  await prisma.question.delete({ where: { id: params.questionId } })
  if (question.topic) revalidatePath(`/${question.topic.city.slug}/${question.topic.slug}`)
  return NextResponse.json({ success: true })
}
