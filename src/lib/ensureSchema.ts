import { prisma } from '@/lib/prisma'

/**
 * Creates tables that were added after the live database was set up.
 * The Oracle deploy does not run Prisma migrations, so the app applies these itself
 * on start-up, using its own database connection. Every statement is idempotent
 * (same SQL as prisma/migrations/20261121000000_add_rating_replies).
 */
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "public"."rating_replies" (
    "id" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rating_replies_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "rating_replies_ratingId_createdAt_idx" ON "public"."rating_replies"("ratingId", "createdAt")`,
  `DO $$ BEGIN
    ALTER TABLE "public"."rating_replies" ADD CONSTRAINT "rating_replies_ratingId_fkey"
      FOREIGN KEY ("ratingId") REFERENCES "public"."ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN
    ALTER TABLE "public"."rating_replies" ADD CONSTRAINT "rating_replies_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `ALTER TABLE "public"."rating_replies" ENABLE ROW LEVEL SECURITY`,
]

export async function ensureSchema(): Promise<void> {
  const exists = await reviewRepliesTableExists()
  if (exists) return
  for (const sql of STATEMENTS) await prisma.$executeRawUnsafe(sql)
  console.log('[ensureSchema] created table rating_replies')
}

export async function reviewRepliesTableExists(): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`SELECT to_regclass('public.rating_replies') IS NOT NULL AS "exists"`
  return rows[0]?.exists === true
}
