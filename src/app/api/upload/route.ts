import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'
import { UPLOAD } from '@/lib/constants/config'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const timestamp = Math.round(new Date().getTime() / 1000)

  // allowed_formats is included in paramsToSign so Cloudinary enforces the
  // restriction cryptographically — a client cannot bypass it by calling the
  // Cloudinary API directly with this signature.
  const paramsToSign = {
    timestamp,
    folder:         UPLOAD.FOLDER,
    upload_preset:  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    allowed_formats: 'jpg,jpeg,png,webp',
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({
    signature,
    timestamp,
    apiKey:        process.env.CLOUDINARY_API_KEY,
    cloudName:     process.env.CLOUDINARY_CLOUD_NAME,
    folder:        UPLOAD.FOLDER,
    uploadPreset:  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    allowedFormats: 'jpg,jpeg,png,webp',
  })
}
