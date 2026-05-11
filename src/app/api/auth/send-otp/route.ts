import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOtpEmail } from '@/lib/email'
import { getEmailVerificationConfig } from '@/lib/features'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const config = getEmailVerificationConfig()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    // Check resend rate limit
    const recentCount = await prisma.emailOtp.count({
      where: { email, createdAt: { gte: oneHourAgo } },
    })
    if (recentCount >= config.maxResendPerHour) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before requesting another code.' },
        { status: 429 }
      )
    }

    // Check if user already verified
    const user = await prisma.user.findUnique({ where: { email }, select: { emailVerified: true } })
    if (user?.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified.' }, { status: 409 })
    }

    const code = generateOtp()
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000)

    await prisma.emailOtp.create({ data: { email, code, expiresAt } })
    await sendOtpEmail(email, code)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
