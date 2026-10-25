import { prisma } from '@/lib/prisma'
import { formatRelativeTime } from '@/lib/utils/format'

export const revalidate = 0

export default async function AdminLeadsPage() {
  const leads = await prisma.loanLead.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-navy-500 mb-1">Loan Leads</h1>
      <p className="text-sm text-neutral-500 mb-6">
        {leads.length} most recent. Share only with partners the user consented to (see consent time).
      </p>
      <div className="overflow-x-auto rounded-xl bg-white border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              {['Name', 'Phone', 'City', 'Loan', 'Income/mo', 'Source', 'When', 'Status'].map(h => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id} className="border-t border-neutral-100">
                <td className="px-3 py-2">{l.name}</td>
                <td className="px-3 py-2 font-mono">{l.phone}</td>
                <td className="px-3 py-2">{l.city ?? '—'}</td>
                <td className="px-3 py-2">{l.loanAmount ? `₹${l.loanAmount.toLocaleString('en-IN')}` : '—'}</td>
                <td className="px-3 py-2">{l.monthlyIncome ? `₹${l.monthlyIncome.toLocaleString('en-IN')}` : '—'}</td>
                <td className="px-3 py-2">{l.source}</td>
                <td className="px-3 py-2">{formatRelativeTime(l.createdAt)}</td>
                <td className="px-3 py-2">{l.status}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-neutral-400">No leads yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
