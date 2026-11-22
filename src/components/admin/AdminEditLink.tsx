'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Pencil } from 'lucide-react'

/** A small "Edit" link to the admin form, shown only to signed-in admins and moderators. */
export function AdminEditLink({ href, label = 'Edit', className = '' }: { href: string; label?: string; className?: string }) {
  const { data } = useSession()
  const role = data?.user?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') return null
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-600 hover:bg-navy-100 ${className}`}
      title="Admin: edit this"
    >
      <Pencil className="h-3 w-3" /> {label}
    </Link>
  )
}

/** The note readers see when a moderator changed a member's wording. */
export function ModeratorEditedNote({ className = '' }: { className?: string }) {
  return <p className={`mt-1 text-[11px] italic text-neutral-400 ${className}`}>Edited by a moderator</p>
}
