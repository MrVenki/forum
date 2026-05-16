'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Pencil, Trash2, Check, X, CheckCircle2, HelpCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/format'

interface Answer {
  id: string
  body: string
  isBest: boolean
  createdAt: string
  user: { name: string }
}

interface Question {
  id: string
  body: string
  isAnswered: boolean
  createdAt: string
  user: { name: string }
  answers: Answer[]
  topic: {
    propertyName: string
    slug: string
    city: { name: string; slug: string }
  } | null
}

interface Props {
  initialQuestions: Question[]
}

function AnswerRow({
  answer,
  questionId,
  onDelete,
}: {
  answer: Answer
  questionId: string
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(answer.body)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (body.trim().length < 10) { setError('Min 10 characters'); return }
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/answers/${answer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: body.trim() }),
    })
    if (res.ok) { setEditing(false) } else { setError('Failed to save') }
    setSaving(false)
  }

  async function del() {
    if (!confirm('Delete this answer?')) return
    const res = await fetch(`/api/admin/answers/${answer.id}`, { method: 'DELETE' })
    if (res.ok) onDelete(answer.id)
  }

  return (
    <div className={`ml-6 rounded-lg p-3 text-sm ${answer.isBest ? 'bg-emerald-50 border border-emerald-200' : 'bg-neutral-50 border border-neutral-100'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {answer.isBest && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
            <span className="text-xs font-medium text-neutral-700">{answer.user.name}</span>
            <span className="text-xs text-neutral-400">{formatRelativeTime(new Date(answer.createdAt))}</span>
            {answer.isBest && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">Best Answer</span>}
          </div>
          {editing ? (
            <div className="space-y-1.5">
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={3}
                className="w-full rounded border border-neutral-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-none"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-1.5">
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-1 rounded bg-saffron-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
                  <Check className="h-3 w-3" /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setBody(answer.body); setError('') }}
                  className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100">
                  <X className="h-3 w-3" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-600 leading-relaxed">{body}</p>
          )}
        </div>
        {!editing && (
          <div className="flex gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-neutral-200 transition-colors" title="Edit">
              <Pencil className="h-3.5 w-3.5 text-neutral-500" />
            </button>
            <button onClick={del} className="p-1 rounded hover:bg-red-100 transition-colors" title="Delete">
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionRow({ question, onDelete }: { question: Question; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(question.body)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState<Answer[]>(question.answers)

  async function save() {
    if (body.trim().length < 10) { setError('Min 10 characters'); return }
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/questions/${question.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: body.trim() }),
    })
    if (res.ok) { setEditing(false) } else { setError('Failed to save') }
    setSaving(false)
  }

  async function del() {
    if (!confirm(`Delete this question and all ${answers.length} answer(s)?`)) return
    const res = await fetch(`/api/admin/questions/${question.id}`, { method: 'DELETE' })
    if (res.ok) onDelete(question.id)
  }

  function deleteAnswer(answerId: string) {
    setAnswers(prev => prev.filter(a => a.id !== answerId))
  }

  const topicHref = question.topic
    ? `/${question.topic.city.slug}/${question.topic.slug}`
    : null

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Question header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <HelpCircle className={`h-4 w-4 mt-0.5 shrink-0 ${question.isAnswered ? 'text-emerald-500' : 'text-saffron-500'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs font-semibold text-neutral-700">{question.user.name}</span>
              <span className="text-xs text-neutral-400">{formatRelativeTime(new Date(question.createdAt))}</span>
              {question.topic && topicHref && (
                <Link href={topicHref} target="_blank"
                  className="text-xs text-saffron-600 hover:underline font-medium truncate max-w-[180px]">
                  {question.topic.propertyName} · {question.topic.city.name}
                </Link>
              )}
              {question.isAnswered && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Answered</span>
              )}
            </div>

            {editing ? (
              <div className="space-y-2">
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={3}
                  className="w-full rounded border border-neutral-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-none"
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={save} disabled={saving}
                    className="inline-flex items-center gap-1 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 disabled:opacity-50">
                    <Check className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => { setEditing(false); setBody(question.body); setError('') }}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-800 leading-relaxed">{body}</p>
            )}
          </div>

          {!editing && (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded hover:bg-neutral-100">
                {answers.length} ans {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setEditing(true)} className="p-1.5 rounded hover:bg-neutral-100" title="Edit">
                <Pencil className="h-4 w-4 text-neutral-500" />
              </button>
              <button onClick={del} className="p-1.5 rounded hover:bg-red-100" title="Delete question + answers">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Answers */}
      {expanded && answers.length > 0 && (
        <div className="px-4 pb-4 space-y-2 border-t border-neutral-100 pt-3">
          {answers.map(a => (
            <AnswerRow key={a.id} answer={a} questionId={question.id} onDelete={deleteAnswer} />
          ))}
        </div>
      )}
    </div>
  )
}

export function QATable({ initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [search, setSearch] = useState('')

  function deleteQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const filtered = questions.filter(q =>
    !search ||
    q.body.toLowerCase().includes(search.toLowerCase()) ||
    q.user.name.toLowerCase().includes(search.toLowerCase()) ||
    (q.topic?.propertyName.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const answeredCount = questions.filter(q => q.isAnswered).length
  const totalAnswers = questions.reduce((sum, q) => sum + q.answers.length, 0)

  return (
    <div>
      {/* Summary chips */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="rounded-full bg-saffron-50 text-saffron-700 text-xs font-semibold px-3 py-1">
          {questions.length} questions
        </span>
        <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1">
          {answeredCount} answered
        </span>
        <span className="rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1">
          {totalAnswers} total answers
        </span>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search questions, users, or properties…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400">
          {search ? 'No questions match your search.' : 'No questions yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <QuestionRow key={q.id} question={q} onDelete={deleteQuestion} />
          ))}
        </div>
      )}
    </div>
  )
}
