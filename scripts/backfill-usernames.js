/**
 * backfill-usernames.js
 *
 * Generates unique usernames for all existing users who don't have one.
 * Safe to run multiple times — skips users that already have a username.
 *
 * Run: node scripts/backfill-usernames.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function sanitize(str) {
  return str.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function deriveBase(name, email) {
  const fromName = sanitize(name.replace(/\s+/g, ''))
  const fromEmail = sanitize((email || '').split('@')[0])
  const base = fromName || fromEmail || 'user'
  return base.slice(0, 15)
}

async function makeUnique(base, usedSet) {
  if (!usedSet.has(base)) { usedSet.add(base); return base }
  for (let i = 1; i <= 9999; i++) {
    const candidate = `${base}${i}`
    if (!usedSet.has(candidate)) { usedSet.add(candidate); return candidate }
  }
  const fallback = `${base}${Date.now() % 100000}`
  usedSet.add(fallback)
  return fallback
}

async function main() {
  console.log('=== Backfill Usernames ===\n')

  // Load all existing usernames into a set to avoid duplicates
  const existing = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { username: true },
  })
  const usedSet = new Set(existing.map(u => u.username))
  console.log(`  ${usedSet.size} existing usernames loaded\n`)

  // Fetch all users without a username
  const users = await prisma.user.findMany({
    where: { username: null },
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'asc' },
  })
  console.log(`  ${users.length} users need a username\n`)

  let count = 0
  for (const user of users) {
    const base = deriveBase(user.name, user.email)
    const username = await makeUnique(base, usedSet)
    await prisma.user.update({ where: { id: user.id }, data: { username } })
    count++
    if (count % 50 === 0) console.log(`  ... ${count}/${users.length} done`)
  }

  console.log(`\n✅ Done — ${count} usernames assigned`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
