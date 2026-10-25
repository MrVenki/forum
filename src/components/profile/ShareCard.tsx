'use client'

import { useState } from 'react'
import { Copy, Mail, MessageCircle, QrCode, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  propertyName: string
  cityName: string
  url: string
  visitors: number
  comments: number
  wouldBuy: number
  totalComments: number
}

export function ShareCard({ propertyName, cityName, url, visitors, comments, wouldBuy, totalComments }: Props) {
  const [copied, setCopied] = useState<'link' | 'email' | null>(null)
  const [qr, setQr] = useState<string | null>(null)

  const message = `Hi, if you have visited or booked at ${propertyName}, ${cityName}, please share your honest experience on IndiaPropertyTalk. It helps other buyers decide: ${url}`
  const emailBody = `Hello,\n\nThank you for your interest in ${propertyName}. We would love your honest feedback on how your visit or purchase went, good or bad. Other buyers read these comments before they decide.\n\nShare your experience here (takes a minute, no long forms): ${url}\n\nRegards`
  const emailSubject = `Share your experience at ${propertyName}`

  async function copy(text: string, which: 'link' | 'email') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 1800)
    } catch {}
  }

  async function showQr() {
    if (qr) return setQr(null)
    const QRCode = (await import('qrcode')).default
    setQr(await QRCode.toDataURL(url, { margin: 1, width: 240 }))
  }

  return (
    <div className="card-base p-5 space-y-4">
      <div>
        <h2 className="font-heading font-bold text-navy-500">{propertyName}</h2>
        <p className="text-xs text-neutral-500">{cityName}</p>
      </div>

      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          aria-label="Share link"
          className="flex-1 min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600"
          onFocus={(e) => e.currentTarget.select()}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => copy(url, 'link')}>
          {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === 'link' ? 'Copied' : 'Copy link'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" /> Share on WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}>
            <Mail className="h-3.5 w-3.5" /> Email template
          </a>
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => copy(emailBody, 'email')}>
          {copied === 'email' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === 'email' ? 'Copied' : 'Copy email text'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={showQr}>
          <QrCode className="h-3.5 w-3.5" /> {qr ? 'Hide QR code' : 'QR code for site office'}
        </Button>
      </div>

      {qr && (
        <div className="flex items-center gap-4 rounded-lg border border-neutral-200 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={`QR code linking to ${propertyName}`} width={120} height={120} />
          <div className="text-xs text-neutral-500 space-y-2">
            <p>Print this for the site office or sales desk. Visitors scan it to leave feedback.</p>
            <a href={qr} download={`${propertyName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-qr.png`} className="font-semibold text-saffron-600 hover:underline">
              Download PNG
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-4 text-center">
        <Stat label="Visitors from your link" value={visitors} />
        <Stat label="Comments from them" value={comments} />
        <Stat label="Voted would buy" value={wouldBuy} />
      </div>
      <p className="text-xs text-neutral-400">
        {totalComments} comment{totalComments !== 1 ? 's' : ''} on this page in total. You can reply to buyers, but only they can edit their comments.
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3">
      <div className="text-xl font-semibold text-navy-500">{value}</div>
      <div className="text-[11px] text-neutral-500 leading-tight">{label}</div>
    </div>
  )
}
