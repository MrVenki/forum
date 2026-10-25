import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendOtpEmail } from '@/lib/email'
import { getEmailVerificationConfig } from '@/lib/features'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { makeUniqueUsername } from '@/lib/utils/username'

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().min(2, 'Enter your name').max(50),
  cfToken: z.string().optional(),
})

/** Sends a sign-in code. Creates a password-less account on first use. */
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`quick-otp:${getClientIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }
  const { email, name, cfToken } = parsed.data

  if (!(await verifyTurnstile(cfToken))) {
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 })
  }

  const config = getEmailVerificationConfig()
  const recent = await prisma.emailOtp.count({
    where: { email, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
  })
  if (recent >= config.maxResendPerHour) {
    return NextResponse.json({ error: 'Too many codes requested. Wait a bit and try again.' }, { status: 429 })
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { isActive: true, role: true },
  })
  if (existing && !existing.isActive) {
    return NextResponse.json({ error: 'This account is not available.' }, { status: 403 })
  }
  if (existing && existing.role !== 'USER') {
    return NextResponse.json({ error: 'Staff accounts must sign in with a password.' }, { status: 403 })
  }

  if (!existing) {
    const username = await makeUniqueUsername(name, email)
    await prisma.user.create({ data: { name, username, email } })
  }

  const code = randomInt(100000, 1000000).toString()
  const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000)
  await prisma.emailOtp.create({ data: { email, code, expiresAt } })

  try {
    await sendOtpEmail(email, code)
  } catch (err) {
    console.error('quick-otp email delivery failed:', err)
    return NextResponse.json({ error: 'Could not send the code. Try again in a moment.' }, { status: 503 })
  }

  return NextResponse.json({ success: true })
}
