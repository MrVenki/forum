import Link from 'next/link'
import { Building2 } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: { label: string; href: string }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-50 mb-4">
        {icon || <Building2 className="h-8 w-8 text-saffron-400" />}
      </div>
      <h3 className="font-heading font-bold text-lg text-navy-500">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500 max-w-sm">{description}</p>
      {action && (
        <Link href={action.href} className="btn-primary mt-6 text-sm">
          {action.label}
        </Link>
      )}
    </div>
  )
}
