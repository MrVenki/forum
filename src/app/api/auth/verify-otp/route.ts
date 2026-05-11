import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEmailVerificationConfig } from '@/lib/features'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const config = getEmailVerificationConfig()
    const now = new Date()

    // Find the most recent unused OTP for this email
    const otp = await prisma.emailOtp.findFirst({
      where: { email, used: false, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp) {
      return NextResponse.json(
        { error: 'Code expired or not found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check attempt limit
    if (otp.attempts >= config.maxVerifyAttempts) {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      )
    }

    if (otp.code !== code) {
      await prisma.emailOtp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      })
      const remaining = config.maxVerifyAttempts - otp.attempts - 1
      return NextResponse.json(
        { error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` },
        { status: 400 }
      )
    }

    // Mark OTP used and verify the user in a transaction
    await prisma.$transaction([
      prisma.emailOtp.update({ where: { id: otp.id }, data: { used: true } }),
      prisma.user.update({ where: { email }, data: { emailVerified: now } }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('verify-otp error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
