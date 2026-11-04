// Marks demo users created by prisma/seed*.ts so they never receive email.
// Dry run by default; pass --apply to write. Safe to re-run.
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const apply = process.argv.includes('--apply')
const prisma = new PrismaClient()

async function main() {
  const sources = [
    [path.join(__dirname, '..', 'prisma'), /^seed.*\.ts$/],
    [__dirname, /^seed.*\.js$/],
  ]
  const emails = new Set()
  for (const [dir, pattern] of sources) {
    for (const file of fs.readdirSync(dir).filter((f) => pattern.test(f))) {
      const text = fs.readFileSync(path.join(dir, file), 'utf8')
      for (const m of text.matchAll(/['"`]([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})['"`]/gi)) emails.add(m[1].toLowerCase())
    }
  }

  const owner = (process.env.ADMIN_ALERT_EMAIL || '').toLowerCase()
  const users = await prisma.user.findMany({
    where: { email: { in: Array.from(emails) } },
    select: { id: true, email: true, role: true, isSeeded: true, _count: { select: { accounts: true } } },
  })
  const requestedCode = new Set(
    (await prisma.emailOtp.findMany({ where: { email: { in: users.map((u) => u.email) } }, select: { email: true }, distinct: ['email'] }))
      .map((o) => o.email.toLowerCase())
  )

  const skipped = []
  const toFlag = []
  for (const u of users) {
    const e = u.email.toLowerCase()
    if (u.role !== 'USER') skipped.push(`${e} (staff)`)
    else if (e === owner) skipped.push(`${e} (owner)`)
    else if (u._count.accounts > 0) skipped.push(`${e} (Google sign-in)`)
    else if (requestedCode.has(e)) skipped.push(`${e} (requested a sign-in code)`)
    else if (!u.isSeeded) toFlag.push(u.id)
  }

  console.log(`emails in seed files: ${emails.size}`)
  console.log(`matching users: ${users.length}, already flagged: ${users.filter((u) => u.isSeeded).length}, to flag: ${toFlag.length}`)
  if (skipped.length) console.log(`skipped as possibly real:\n  ${skipped.join('\n  ')}`)

  if (apply && toFlag.length) {
    const res = await prisma.user.updateMany({ where: { id: { in: toFlag } }, data: { isSeeded: true } })
    console.log(`flagged ${res.count} users`)
  } else if (!apply) {
    console.log('dry run, nothing written (use --apply)')
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
