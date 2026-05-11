import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().min(10, 'Comment must be at least 10 characters').max(5000),
  parentId: z.string().optional().nullable(),
})

export const updateCommentSchema = z.object({
  content: z.string().min(10).max(5000),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
