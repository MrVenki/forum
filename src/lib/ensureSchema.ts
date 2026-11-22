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

const fk = (table: string, name: string, col: string, ref: string, onDelete: string) => `DO $$ BEGIN
    ALTER TABLE "public"."${table}" ADD CONSTRAINT "${name}"
      FOREIGN KEY ("${col}") REFERENCES "public"."${ref}"("id") ON DELETE ${onDelete} ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`

/**
 * Community posts (Nov 2026): same SQL as prisma/migrations/20261122000000_add_community,
 * written so that every statement can run again safely.
 */
const COMMUNITY_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "public"."community_posts" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "cityId" TEXT,
    "userId" TEXT NOT NULL,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "public"."community_replies" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "community_replies_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "public"."community_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "community_votes_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "public"."community_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "community_reports_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "community_posts_slug_key" ON "public"."community_posts"("slug")`,
  `CREATE INDEX IF NOT EXISTS "community_posts_createdAt_idx" ON "public"."community_posts"("createdAt" DESC)`,
  `CREATE INDEX IF NOT EXISTS "community_posts_cityId_createdAt_idx" ON "public"."community_posts"("cityId", "createdAt" DESC)`,
  `CREATE INDEX IF NOT EXISTS "community_replies_postId_createdAt_idx" ON "public"."community_replies"("postId", "createdAt")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "community_votes_userId_targetType_targetId_key" ON "public"."community_votes"("userId", "targetType", "targetId")`,
  `CREATE INDEX IF NOT EXISTS "community_reports_isResolved_createdAt_idx" ON "public"."community_reports"("isResolved", "createdAt" DESC)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "community_reports_userId_targetType_targetId_key" ON "public"."community_reports"("userId", "targetType", "targetId")`,
  fk('community_posts', 'community_posts_cityId_fkey', 'cityId', 'cities', 'SET NULL'),
  fk('community_posts', 'community_posts_userId_fkey', 'userId', 'users', 'RESTRICT'),
  fk('community_replies', 'community_replies_postId_fkey', 'postId', 'community_posts', 'CASCADE'),
  fk('community_replies', 'community_replies_userId_fkey', 'userId', 'users', 'RESTRICT'),
  `ALTER TABLE "public"."community_posts" ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE "public"."community_replies" ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE "public"."community_votes" ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE "public"."community_reports" ENABLE ROW LEVEL SECURITY`,
]

/** Creates the community tables if any is missing. Safe to run on every start. */
export async function ensureCommunitySchema(): Promise<void> {
  if (await communityTablesExist()) return
  for (const sql of COMMUNITY_STATEMENTS) await prisma.$executeRawUnsafe(sql)
  console.log('[ensureSchema] created community tables')
}

export async function communityTablesExist(): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`SELECT (
    to_regclass('public.community_posts') IS NOT NULL AND to_regclass('public.community_replies') IS NOT NULL AND
    to_regclass('public.community_votes') IS NOT NULL AND to_regclass('public.community_reports') IS NOT NULL
  ) AS "exists"`
  return rows[0]?.exists === true
}

/** Adds the TIER2 city tier (Nov 2026). Idempotent; ADD VALUE must run outside a transaction. */
export async function ensureCityTiers(): Promise<void> {
  await prisma.$executeRawUnsafe(`ALTER TYPE "public"."CityTier" ADD VALUE IF NOT EXISTS 'TIER2'`)
}

export async function reviewRepliesTableExists(): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`SELECT to_regclass('public.rating_replies') IS NOT NULL AS "exists"`
  return rows[0]?.exists === true
}
