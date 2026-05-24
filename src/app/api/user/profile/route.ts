import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { usernameSchema } from '@/lib/validations/auth'

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim(),
})

const usernameUpdateSchema = z.object({
  username: usernameSchema,
})

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Username update
  if ('username' in body) {
    const parsed = usernameUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const { username } = parsed.data
    const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } })
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 })
    }
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
      select: { username: true },
    })
    return NextResponse.json({ username: user.username })
  }

  // Name update
  const parsed = nameSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
    select: { name: true },
  })
  return NextResponse.json({ name: user.name })
}
