'use client'

import { useState } from 'react'
import { BuyIntentStrip, type Audience, type BuyIntent } from '@/components/topic/BuyIntentStrip'
import { CommentList } from './CommentList'
import type { CommentWithRelations } from '@/types'

const PROMPTS: Record<BuyIntent, string> = {
  YES: 'What convinced you? Share what you liked, what you saw on site, the price you were quoted…',
  MAYBE: 'What is holding you back? Price, possession date, location, the builder…',
  NO: 'What put you off? Help other buyers avoid the same problem…',
}

const AUDIENCE_PROMPTS: Partial<Record<Audience, string>> = {
  BOOKED: 'How has your booking experience been so far? Payments, updates, paperwork…',
  RESIDENT: 'What is it like living here? Maintenance, water, parking, neighbours…',
}

const DEFAULT_PROMPT = 'Share what you saw on the site visit, pricing you were quoted, questions…'

interface Props {
  topicId: string
  topicOwnerId: string
  propertyName: string
  initialComments: CommentWithRelations[]
}

export function DiscussionSection({ topicId, topicOwnerId, propertyName, initialComments }: Props) {
  const [state, setState] = useState<{ intent: BuyIntent | null; audience: Audience | null }>({ intent: null, audience: null })

  const prompt =
    (state.audience && AUDIENCE_PROMPTS[state.audience]) ||
    (state.intent && PROMPTS[state.intent]) ||
    DEFAULT_PROMPT

  return (
    <>
      <BuyIntentStrip topicId={topicId} propertyName={propertyName} onChange={setState} />
      <CommentList
        topicId={topicId}
        topicOwnerId={topicOwnerId}
        initialComments={initialComments}
        prompt={prompt}
      />
    </>
  )
}
