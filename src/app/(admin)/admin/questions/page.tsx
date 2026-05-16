import { prisma } from '@/lib/prisma'
import { QATable } from '@/components/admin/QATable'

export const revalidate = 0

export default async function AdminQuestionsPage() {
  const questions = await prisma.question.findMany({
    where: { topicId: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 500,
    include: {
      user: { select: { name: true } },
      answers: {
        orderBy: [{ isBest: 'desc' }, { createdAt: 'asc' }],
        include: { user: { select: { name: true } } },
      },
      topic: {
        select: {
          propertyName: true,
          slug: true,
          city: { select: { name: true, slug: true } },
        },
      },
    },
  })

  const serialized = questions.map(q => ({
    ...q,
    createdAt: q.createdAt.toISOString(),
    answers: q.answers.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    updatedAt: q.updatedAt.toISOString(),
  }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-500">Q&amp;A Moderation</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review questions and answers from property discussions. Edit content or delete inappropriate entries.
            Expanding a question shows all its answers inline.
          </p>
        </div>
        <span className="text-sm text-neutral-400">{questions.length} questions</span>
      </div>
      <QATable initialQuestions={serialized} />
    </div>
  )
}
