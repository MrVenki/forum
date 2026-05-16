import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { LayoutDashboard, FileText, MessageSquare, Shield, ArrowLeft, HelpCircle, Construction } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') redirect('/')

  return (
    <div className="min-h-screen flex bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-navy-500 text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-saffron-400" />
            <span className="font-heading font-bold text-base">Admin Panel</span>
          </div>
          <p className="text-xs text-navy-200 truncate">{session.user.name}</p>
          <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-saffron-500/20 text-saffron-300 px-1.5 py-0.5 rounded">
            {session.user.role}
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/posts', label: 'Posts', icon: FileText },
            { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
            { href: '/admin/questions', label: 'Q&A', icon: HelpCircle },
            { href: '/admin/updates', label: 'Site Updates', icon: Construction },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
