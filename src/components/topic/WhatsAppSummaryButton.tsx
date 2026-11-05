import { MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants/config'
import { buildShareTexts, getShareSummaries } from '@/lib/shareKit'

export async function WhatsAppSummaryButton({ topicId }: { topicId: string }) {
  const [summary] = await getShareSummaries({ topicIds: [topicId] })
  if (!summary) return null
  const { whatsapp } = buildShareTexts(summary, SITE_CONFIG.url)

  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(whatsapp)}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Share a summary on WhatsApp"
      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-600 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-700"
    >
      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
    </a>
  )
}
