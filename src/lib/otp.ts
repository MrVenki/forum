import { prisma } from '@/lib/prisma'
import { getEmailVerificationConfig } from '@/lib/features'

export type OtpResult = { ok: true } | { ok: false; error: string }

/** Checks a 6-digit email code and marks it used when correct. */
export async function consumeOtp(email: string, code: string): Promise<OtpResult> {
  const config = getEmailVerificationConfig()

  const otp = await prisma.emailOtp.findFirst({
    where: { email, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  })
  if (!otp) return { ok: false, error: 'Code expired or not found. Request a new one.' }

  if (otp.attempts >= config.maxVerifyAttempts) {
    return { ok: false, error: 'Too many incorrect attempts. Request a new code.' }
  }

  if (otp.code !== code) {
    await prisma.emailOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } })
    const remaining = config.maxVerifyAttempts - otp.attempts - 1
    return { ok: false, error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} left.` }
  }

  await prisma.emailOtp.update({ where: { id: otp.id }, data: { used: true } })
  return { ok: true }
}
