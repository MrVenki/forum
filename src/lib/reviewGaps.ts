import { prisma } from '@/lib/prisma'

export interface ReviewGap {
  topicId: string
  propertyName: string
  url: string
  missing: string[]
}

/** The user's ratings that lack the details powering the possession tracker and maintenance figures. */
export async function getReviewGaps(userId: string): Promise<ReviewGap[]> {
  const ratings = await prisma.rating.findMany({
    where: { userId, topic: { isPublished: true } },
    orderBy: { updatedAt: 'desc' },
    select: {
      ownership: true, promisedPossession: true, actualPossession: true, maintenancePerSqFt: true,
      topic: { select: { id: true, slug: true, propertyName: true, city: { select: { slug: true } } } },
    },
  })

  const gaps: ReviewGap[] = []
  for (const r of ratings) {
    const missing: string[] = []
    if (!r.ownership) missing.push('your connection to the project')
    if ((r.ownership === 'BOOKED' || r.ownership === 'RESIDENT') && !r.promisedPossession) missing.push('the promised possession date')
    if (r.ownership === 'RESIDENT' && !r.actualPossession) missing.push('when you got possession')
    if (r.ownership === 'RESIDENT' && !r.maintenancePerSqFt) missing.push('the monthly maintenance charge')
    if (missing.length) {
      gaps.push({
        topicId: r.topic.id,
        propertyName: r.topic.propertyName,
        url: `/${r.topic.city.slug}/${r.topic.slug}#rate`,
        missing,
      })
    }
  }
  return gaps
}
