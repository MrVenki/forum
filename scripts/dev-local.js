// Runs the dev server against the throwaway local Postgres (port 5433).
// Overrides every production-bound env var so nothing touches live data or sends real email.
const { spawn } = require('child_process')

const local = 'postgresql://postgres:localdev123@localhost:5433/forum_test?schema=public'
const port = process.env.PORT || '3100'

const env = {
  ...process.env,
  DATABASE_URL: local,
  DIRECT_URL: local,
  NEXTAUTH_URL: `http://localhost:${port}`,
  NEXT_PUBLIC_SITE_URL: `http://localhost:${port}`,
  SMTP_HOST: '',
  SMTP_USER: '',
  SMTP_PASS: '',
  TURNSTILE_SECRET_KEY: '',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
  CRON_SECRET: 'local-cron-secret',
}

const child = spawn('npx', ['next', 'dev', '-p', port], { stdio: 'inherit', env, shell: true })
child.on('exit', (code) => process.exit(code ?? 0))
