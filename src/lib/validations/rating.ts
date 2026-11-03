import { z } from 'zod'

const subScore = z.number().int().min(1).max(5).nullable().optional()
const month = z
  .string()
  .regex(/^(20[0-4]\d)-(0[1-9]|1[0-2])$/, 'Use a valid month')
  .nullable()
  .optional()
const shortText = z.string().trim().max(300).nullable().optional()

export const upsertRatingSchema = z.object({
  score: z.number().int().min(1).max(5),
  review: z.string().max(2000).optional().nullable(),
  ownership: z.enum(['BOOKED', 'RESIDENT', 'EXPLORING']).nullable().optional(),
  constructionQuality: subScore,
  maintenanceScore: subScore,
  amenitiesScore: subScore,
  builderScore: subScore,
  pros: shortText,
  cons: shortText,
  promisedPossession: month,
  actualPossession: month,
  maintenancePerSqFt: z.number().min(0.5).max(50).nullable().optional(),
})

export type UpsertRatingInput = z.infer<typeof upsertRatingSchema>

/** "2026-03" -> first day of that month (UTC) */
export function monthToDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const [y, m] = value.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 1))
}

export function dateToMonth(value: Date | string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
