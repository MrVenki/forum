import { z } from 'zod'

export const createTopicSchema = z.object({
  cityId: z.string().min(1, 'City is required'),
  propertyName: z.string().min(3, 'Property name must be at least 3 characters').max(300),
  propertyType: z.enum([
    'APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL', 'PENTHOUSE', 'INDEPENDENT_HOUSE', 'BUILDER_FLOOR',
  ]),
  title: z.string().min(10, 'Title must be at least 10 characters').max(300),
  description: z.string().min(100, 'Description must be at least 100 characters').max(10000),
  address: z.string().max(500).optional(),
  priceMin: z.number().positive().optional().nullable(),
  priceMax: z.number().positive().optional().nullable(),
  image1Url: z.string().url().optional().nullable(),
  image1PubId: z.string().optional().nullable(),
  image2Url: z.string().url().optional().nullable(),
  image2PubId: z.string().optional().nullable(),
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>
