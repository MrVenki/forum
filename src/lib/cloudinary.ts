import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export function getCloudinaryUrl(publicId: string, options: { width?: number; height?: number; crop?: string } = {}) {
  const { width = 800, height, crop = 'limit' } = options
  const transforms = [`w_${width}`, `q_auto`, `f_auto`, `c_${crop}`]
  if (height) transforms.push(`h_${height}`)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`
}

export function getOgImageUrl(publicId: string) {
  return getCloudinaryUrl(publicId, { width: 1200, height: 630, crop: 'fill' })
}
