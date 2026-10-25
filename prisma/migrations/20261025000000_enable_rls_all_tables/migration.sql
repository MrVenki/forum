-- Enable Row-Level Security on all public tables.
-- Prisma connects as the postgres superuser which bypasses RLS,
-- so the app is unaffected. This blocks direct REST API access
-- via the Supabase anon/authenticated roles.

ALTER TABLE "public"."users"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."email_otps"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."cities"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."developers"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."topics"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."comments"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ratings"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bookmarks"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."topic_subscriptions"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."topic_updates"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."price_logs"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."comment_reactions"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."questions"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."answers"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."polls"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."poll_votes"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."status_votes"         ENABLE ROW LEVEL SECURITY;
