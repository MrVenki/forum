import { redirect } from 'next/navigation'
import { isNewTopicEnabled } from '@/lib/features'

export default function NewTopicLayout({ children }: { children: React.ReactNode }) {
  if (!isNewTopicEnabled()) redirect('/')
  return <>{children}</>
}
