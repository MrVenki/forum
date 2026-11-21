-- Replies posted under star-rating reviews.
-- Safe to run more than once: every statement checks whether it has already been applied.
CREATE TABLE IF NOT EXISTS "public"."rating_replies" (
    "id" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rating_replies_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "rating_replies_ratingId_createdAt_idx" ON "public"."rating_replies"("ratingId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "public"."rating_replies" ADD CONSTRAINT "rating_replies_ratingId_fkey"
    FOREIGN KEY ("ratingId") REFERENCES "public"."ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "public"."rating_replies" ADD CONSTRAINT "rating_replies_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Same as every other table: block direct REST access, the app connects as the owner.
ALTER TABLE "public"."rating_replies" ENABLE ROW LEVEL SECURITY;
