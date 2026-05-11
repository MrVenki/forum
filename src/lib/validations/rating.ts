import { z } from 'zod'

export const upsertRatingSchema = z.object({
  score: z.number().int().min(1).max(5),
  review: z.string().max(2000).optional().nullable(),
})

export type UpsertRatingInput = z.infer<typeof upsertRatingSchema>
