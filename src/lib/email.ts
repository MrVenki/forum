import nodemailer from 'nodemailer'

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
