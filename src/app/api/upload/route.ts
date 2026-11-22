import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'
import { UPLOAD } from '@/lib/constants/config'

// Burned into every uploaded photo by Cloudinary as it is stored (an incoming
// transformation): the photo is first capped at 1600px, then the site name is
// written in the bottom-right corner.
const WATERMARK_TRANSFORMATION =
  'c_limit,w_1600,h_1600/l_text:Arial_40_bold:indiapropertytalk.com,co_white,o_60,g_south_east,x_28,y_22'

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const timestamp = Math.round(new Date().getTime() / 1000)

  // Every signed parameter must also be sent to Cloudinary exactly as signed, so the
  // route returns them as `params` and the browser appends all of them. Signing
  // allowed_formats and the watermark means a client cannot drop either one.
  const params: Record<string, string | number> = {
    timestamp,
    folder: UPLOAD.FOLDER,
    allowed_formats: 'jpg,jpeg,png,webp',
    transformation: WATERMARK_TRANSFORMATION,
  }
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  if (preset) params.upload_preset = preset

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!)

  return NextResponse.json({
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    params,
  })
}
