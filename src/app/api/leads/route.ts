import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { sendLeadNotification } from '@/lib/email'

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^(\+91|91|0)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
  email: z.string().trim().email().max(120).optional().or(z.literal('')),
  city: z.string().trim().max(60).optional(),
  loanAmount: z.number().int().min(0).max(1_000_000_000).optional(),
  monthlyIncome: z.number().int().min(0).max(100_000_000).optional(),
  source: z.string().trim().max(60),
  consent: z.literal(true),
  turnstileToken: z.string().optional().nullable(),
  website: z.string().max(0).optional(), // honeypot
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`lead:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  const parsed = leadSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid details' },
      { status: 400 }
    )
  }
  if (!(await verifyTurnstile(parsed.data.turnstileToken))) {
    return NextResponse.json({ error: 'Bot check failed' }, { status: 400 })
  }

  const d = parsed.data
  const phone = d.phone.replace(/^(\+91|91|0)/, '')
  const recent = await prisma.loanLead.findFirst({
    where: { phone, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    select: { id: true },
  })
  if (!recent) {
    await prisma.loanLead.create({
      data: {
        name: d.name,
        phone,
        email: d.email || null,
        city: d.city || null,
        loanAmount: d.loanAmount ?? null,
        monthlyIncome: d.monthlyIncome ?? null,
        source: d.source,
        consent: true,
      },
    })
    await sendLeadNotification({
      name: d.name,
      phone,
      email: d.email || null,
      city: d.city || null,
      loanAmount: d.loanAmount ?? null,
      monthlyIncome: d.monthlyIncome ?? null,
      source: d.source,
    })
  }
  // Same response for duplicates so the endpoint can't be used to probe numbers
  return NextResponse.json({ success: true })
}
