import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { FlairTag } from '@prisma/client'

const schema = z.object({
  flairTag: z.nativeEnum(FlairTag).nullable(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid flair' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { flairTag: parsed.data.flairTag },
    select: { flairTag: true },
  })

  return NextResponse.json(user)
}
