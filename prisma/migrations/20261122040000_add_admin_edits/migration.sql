-- CreateTable
CREATE TABLE IF NOT EXISTS "admin_edit_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetLabel" TEXT NOT NULL,
    "targetUrl" TEXT,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_edit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "topic_redirects" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "topic_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "admin_edit_logs_targetType_targetId_idx" ON "admin_edit_logs"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "admin_edit_logs_createdAt_idx" ON "admin_edit_logs"("createdAt" DESC);
CREATE UNIQUE INDEX IF NOT EXISTS "topic_redirects_cityId_slug_key" ON "topic_redirects"("cityId", "slug");

ALTER TABLE "admin_edit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "topic_redirects" ENABLE ROW LEVEL SECURITY;
