import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomInt } from 'crypto'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { isEmailVerificationEnabled, getEmailVerificationConfig } from '@/lib/features'
import { sendOtpEmail } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'

// crypto.randomInt is a CSPRNG — never use Math.random() for security tokens
function generateOtp(): string {
  return randomInt(100000, 1000000).toString()
}

export async function POST(req: NextRequest) {
  // 5 registration attempts per IP per hour
  const ip = getClientIp(req)
  if (!checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()

    // Bot protection
    const humanVerified = await verifyTurnstile(body.cfToken)
    if (!humanVerified) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 403 })
    }

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, username, email, password } = parsed.data

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ])
    if (existingEmail) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    if (existingUsername) {
      return NextResponse.json({ error: 'That username is already taken. Please choose another.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({ data: { name, username, email, passwordHash } })

    if (isEmailVerificationEnabled()) {
      const config = getEmailVerificationConfig()
      const code = generateOtp()
      const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000)
      await prisma.emailOtp.create({ data: { email, code, expiresAt } })
      try {
        await sendOtpEmail(email, code)
      } catch (emailErr) {
        console.error('register email delivery failed:', emailErr)
        // Account created, OTP saved — user can resend from verify page
      }
      return NextResponse.json({ success: true, requiresVerification: true }, { status: 201 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
