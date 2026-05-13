import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, MessageSquare, Users, TrendingUp, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/format'

export const revalidate = 0

export default async function AdminDashboard() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [
    totalTopics,
    hiddenTopics,
    totalComments,
    deletedComments,
    totalUsers,
    newTopics24h,
    newComments24h,
    recentTopics,
    recentComments,
  ] = await Promise.all([
    prisma.topic.count({ where: { isPublished: true } }),
    prisma.topic.count({ where: { isPublished: false } }),
    prisma.comment.count({ where: { isDeleted: false } }),
    prisma.comment.count({ where: { isDeleted: true } }),
    prisma.user.count(),
    prisma.topic.count({ where: { createdAt: { gte: yesterday } } }),
    prisma.comment.count({ where: { createdAt: { gte: yesterday }, isDeleted: false } }),
    prisma.topic.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        propertyName: true,
        slug: true,
        isPublished: true,
        createdAt: true,
        city: { select: { name: true, slug: true } },
        user: { select: { name: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      where: { isDeleted: false },
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
        user: { select: { name: true } },
        topic: {
          select: {
            propertyName: true,
            slug: true,
            city: { select: { slug: true } },
          },
        },
      },
    }),
  ])

  const stats = [
    { label: 'Live Posts', value: totalTopics, icon: FileText, color: 'text-saffron-500', bg: 'bg-saffron-50' },
    { label: 'Hidden Posts', value: hiddenTopics, icon: EyeOff, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Comments', value: totalComments, icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Users', value: totalUsers, icon: Users, color: 'text-navy-500', bg: 'bg-navy-50' },
    { label: 'New Posts (24h)', value: newTopics24h, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', highlight: newTopics24h > 0 },
    { label: 'New Comments (24h)', value: newComments24h, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', highlight: newComments24h > 0 },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-navy-500">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Overview of IndiaPropertyTalk activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border bg-white p-4 ${s.highlight ? 'border-saffron-300 shadow-sm' : 'border-neutral-200'}`}
          >
            <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.bg} mb-2`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold font-heading text-navy-500">{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h2 className="font-heading font-bold text-navy-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-saffron-500" /> Latest Posts
            </h2>
            <Link href="/admin/posts" className="flex items-center gap-1 text-xs text-saffron-500 hover:text-saffron-600 font-medium transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {recentTopics.map((t) => (
              <li key={t.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{t.propertyName}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t.city.name} · {t.user.name} · {formatRelativeTime(t.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!t.isPublished && (
                    <span className="text-[10px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      Hidden
                    </span>
                  )}
                  <Link
                    href="/admin/posts"
                    className="text-xs text-saffron-500 hover:text-saffron-600 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Comments */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h2 className="font-heading font-bold text-navy-500 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-teal-600" /> Latest Comments
            </h2>
            <Link href="/admin/comments" className="flex items-center gap-1 text-xs text-saffron-500 hover:text-saffron-600 font-medium transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {recentComments.map((c) => (
              <li key={c.id} className="px-5 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-medium text-neutral-700">{c.user.name}</span>
                  {c.parentId && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1 py-0.5 rounded font-medium">reply</span>
                  )}
                  <span className="text-xs text-neutral-400">on</span>
                  <Link
                    href={`/${c.topic.city.slug}/${c.topic.slug}`}
                    target="_blank"
                    className="text-xs text-saffron-600 hover:underline font-medium truncate max-w-[120px]"
                  >
                    {c.topic.propertyName}
                  </Link>
                  <span className="text-xs text-neutral-400 ml-auto shrink-0">{formatRelativeTime(c.createdAt)}</span>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2">{c.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
