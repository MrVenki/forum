import { z } from 'zod'

// Only Cloudinary-hosted URLs are accepted for images.
// This prevents SSRF and cross-origin URL injection.
const cloudinaryUrl = z
  .string()
  .url()
  .refine(
    (url) => url.startsWith('https://res.cloudinary.com/'),
    { message: 'Image must be hosted on Cloudinary' }
  )

export const createTopicSchema = z.object({
  cityId:       z.string().min(1, 'City is required'),
  propertyName: z.string().min(3, 'Property name must be at least 3 characters').max(300),
  propertyType: z.enum([
    'APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL', 'PENTHOUSE', 'INDEPENDENT_HOUSE', 'BUILDER_FLOOR',
  ]),
  title:       z.string().min(10, 'Title must be at least 10 characters').max(300),
  description: z.string().min(100, 'Description must be at least 100 characters').max(10000),
  address:     z.string().max(500).optional(),
  priceMin:    z.number().positive().optional().nullable(),
  priceMax:    z.number().positive().optional().nullable(),

  // Only Cloudinary URLs accepted; pubIds must match a simple slug pattern
  image1Url:   cloudinaryUrl.optional().nullable(),
  image1PubId: z.string().regex(/^[\w\-/]+$/, 'Invalid public ID').max(200).optional().nullable(),
  image2Url:   cloudinaryUrl.optional().nullable(),
  image2PubId: z.string().regex(/^[\w\-/]+$/, 'Invalid public ID').max(200).optional().nullable(),

  // Developer fields: slug must be a safe slug-format string
  developerSlug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid developer slug').max(100).optional().nullable(),
  developerName: z.string().max(100).optional().nullable(),
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>
