import nodemailer from 'nodemailer'
import crypto from 'crypto'

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: parseInt(SMTP_PORT || '587') === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@indiapropertytalk.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'IndiaPropertyTalk'

  const transporter = createTransporter()
  if (!transporter) {
    // Dev fallback: log to console when SMTP is not configured
    console.log(`\n[DEV EMAIL] To: ${email}\nOTP Code: ${otp}\n(valid for 10 minutes)\n`)
    return
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1e3a5f;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">${siteName}</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">India's Most Trusted Property Forum</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;color:#1e3a5f;font-size:20px;">Verify your email address</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.5;">
                Use the code below to verify your email address. This code expires in <strong>10 minutes</strong>.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <div style="display:inline-block;background:#fff7ed;border:2px solid #fb923c;border-radius:12px;padding:20px 48px;">
                  <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#ea580c;">${otp}</span>
                </div>
              </div>
              <p style="margin:0 0 8px;color:#888;font-size:13px;">If you did not create an account on ${siteName}, you can safely ignore this email.</p>
              <p style="margin:0;color:#888;font-size:13px;">Do not share this code with anyone.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"${siteName}" <${from}>`,
    to: email,
    subject: `Your verification code: ${otp}`,
    html,
    text: `Your ${siteName} verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
  })
}

// ── Subscription notifications ───────────────────────────────────────────────

export function generateUnsubscribeToken(userId: string, topicId: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  return crypto.createHmac('sha256', secret).update(`${userId}:${topicId}`).digest('hex')
}

export function verifyUnsubscribeToken(token: string, userId: string, topicId: string): boolean {
  return token === generateUnsubscribeToken(userId, topicId)
}

interface NotificationParams {
  subscriberEmail: string
  subscriberName: string
  commenterName: string
  commentContent: string
  propertyName: string
  cityName: string
  topicUrl: string
  unsubscribeUrl: string
}

export async function sendCommentNotification(params: NotificationParams): Promise<void> {
  const {
    subscriberEmail, subscriberName, commenterName, commentContent,
    propertyName, cityName, topicUrl, unsubscribeUrl,
  } = params

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@indiapropertytalk.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'IndiaPropertyTalk'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiapropertytalk.com'

  const preview = commentContent.length > 200 ? commentContent.slice(0, 200) + '…' : commentContent

  const transporter = createTransporter()
  if (!transporter) {
    console.log(`\n[DEV EMAIL] Notification to: ${subscriberEmail}\nNew reply on ${propertyName} by ${commenterName}\n${preview}\n`)
    return
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1e3a5f;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">${siteName}</h1>
              <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">India's Most Trusted Property Forum</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 6px;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">New reply in a thread you follow</p>
              <h2 style="margin:0 0 4px;color:#1e3a5f;font-size:20px;font-weight:700;">${propertyName}</h2>
              <p style="margin:0 0 24px;color:#888;font-size:13px;">${cityName}</p>

              <!-- Comment card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;">${commenterName}</p>
                    <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.6;">${preview}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${topicUrl}" style="display:inline-block;background:#ea580c;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;">View Full Discussion →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0 0 6px;color:#aaa;font-size:12px;">
                You're following <strong style="color:#666;">${propertyName}</strong> on ${siteName}.
              </p>
              <p style="margin:0;color:#aaa;font-size:12px;">
                <a href="${unsubscribeUrl}" style="color:#888;text-decoration:underline;">Unsubscribe from this thread</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}" style="color:#888;text-decoration:underline;">Visit ${siteName}</a>
              </p>
              <p style="margin:8px 0 0;color:#ccc;font-size:11px;">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"${siteName}" <${from}>`,
    to: subscriberEmail,
    subject: `New reply on ${propertyName} – ${cityName}`,
    html,
    text: `Hi ${subscriberName},\n\n${commenterName} replied in a thread you follow.\n\n${propertyName} · ${cityName}\n\n"${preview}"\n\nView the discussion: ${topicUrl}\n\nUnsubscribe: ${unsubscribeUrl}`,
  })
}
