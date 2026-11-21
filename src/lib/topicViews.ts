import { prisma } from '@/lib/prisma'

/**
 * Count a page view without touching `updatedAt`.
 * `prisma.topic.update` bumps the @updatedAt column, so every visit (including
 * every crawler hit) made the topic look freshly edited in the sitemap's
 * <lastmod> and the page's dateModified. Search engines stop trusting those
 * dates when they always say "now", so views go through raw SQL instead.
 */
export function recordTopicView(topicId: string): void {
  prisma.$executeRaw`UPDATE "topics" SET "viewCount" = "viewCount" + 1 WHERE "id" = ${topicId}`.catch(() => {})
}
