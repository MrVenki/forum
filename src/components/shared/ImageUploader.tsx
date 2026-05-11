'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { UPLOAD } from '@/lib/constants/config'
import { toast } from '@/hooks/use-toast'

interface UploadedImage {
  url: string
  publicId: string
}

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxFiles?: number
}

async function getUploadSignature() {
  const res = await fetch('/api/upload', { method: 'POST' })
  if (!res.ok) throw new Error('Failed to get upload signature')
  return res.json()
}

async function uploadToCloudinary(file: File, sigData: Record<string, string>): Promise<UploadedImage> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', sigData.signature)
  formData.append('timestamp', sigData.timestamp)
  formData.append('api_key', sigData.apiKey)
  formData.append('folder', sigData.folder)
  if (sigData.uploadPreset) formData.append('upload_preset', sigData.uploadPreset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) throw new Error('Cloudinary upload failed')
  const data = await res.json()
  return { url: data.secure_url, publicId: data.public_id }
}

export function ImageUploader({ value, onChange, maxFiles = 2 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const canUpload = value.length < maxFiles

  const handleFiles = async (files: FileList | null) => {
    if (!files || !canUpload) return

    const remaining = maxFiles - value.length
    const toUpload = Array.from(files).slice(0, remaining)

    for (const file of toUpload) {
      if (!UPLOAD.ALLOWED_FORMATS.includes(file.type)) {
        toast({ title: 'Invalid file type', description: 'Only JPEG, PNG, and WebP allowed.', variant: 'destructive' })
        return
      }
      if (file.size > UPLOAD.MAX_SIZE_MB * 1024 * 1024) {
        toast({ title: 'File too large', description: `Max ${UPLOAD.MAX_SIZE_MB}MB per image.`, variant: 'destructive' })
        return
      }
    }

    setUploading(true)
    try {
      const sigData = await getUploadSignature()
      const uploaded: UploadedImage[] = []
      for (const file of toUpload) {
        const img = await uploadToCloudinary(file, sigData)
        uploaded.push(img)
      }
      onChange([...value, ...uploaded])
    } catch {
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {/* Previews */}
      {value.length > 0 && (
        <div className="flex gap-3">
          {value.map((img, i) => (
            <div key={i} className="relative h-28 w-40 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
              <Image src={img.url} alt={`Property image ${i + 1}`} fill className="object-cover" sizes="160px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {canUpload && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all',
            dragOver ? 'border-saffron-400 bg-saffron-50' : 'border-neutral-300 bg-neutral-50 hover:border-saffron-400 hover:bg-saffron-50/50',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={UPLOAD.ALLOWED_FORMATS.join(',')}
            multiple={maxFiles > 1}
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-saffron-500 border-t-transparent" />
              <p className="text-sm text-neutral-500">Uploading…</p>
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron-100">
                <Upload className="h-5 w-5 text-saffron-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700">
                  {value.length === 0 ? 'Upload property images' : 'Add another image'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Drag & drop or click • JPEG, PNG, WebP • Max {UPLOAD.MAX_SIZE_MB}MB
                </p>
              </div>
              <p className="text-xs text-neutral-400">
                <ImageIcon className="inline h-3.5 w-3.5 mr-1" />
                {value.length}/{maxFiles} images
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex items-start gap-1.5 text-xs text-neutral-400">
        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>Upload property exterior/interior photos. Max {maxFiles} images, {UPLOAD.MAX_SIZE_MB}MB each.</span>
      </div>
    </div>
  )
}
