import { redirect } from 'next/navigation'
import { isNewTopicEnabled } from '@/lib/features'
import NewTopicForm from './NewTopicForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start a Property Discussion',
  description: 'Share your experience with a property and help thousands of Indian buyers make informed decisions.',
}

export default function NewTopicPage() {
  // If the feature is disabled, redirect home immediately — no flash, no blink
  if (!isNewTopicEnabled()) redirect('/')

  return <NewTopicForm />
}
