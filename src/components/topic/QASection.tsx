'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { HelpCircle, CheckCircle2, ChevronDown, ChevronUp, Send, MessageSquare } from 'lucide-react'
import { FlairBadge } from './FlairBadge'

interface Answer {
  id: string
  body: string
  isBest: boolean
  createdAt: string
  user: { id: string; name: string; flairTag: string | null }
}

interface Question {
  id: string
  body: string
  isAnswered: boolean
  createdAt: string
  user: { id: string; name: string; flairTag: string | null }
  answers: Answer[]
}

interface Props {
  topicId: string
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

function AnswerItem({
  answer,
  questionUserId,
  questionId,
  topicId,
  onBestToggle,
}: {
  answer: Answer
  questionUserId: string
  questionId: string
  topicId: string
  onBestToggle: (answerId: string) => void
}) {
  const { data: session } = useSession()
  const isQuestionAuthor = session?.user?.id === questionUserId
  const [marking, setMarking] = useState(false)

  async function markBest() {
    setMarking(true)
    await fetch(`/api/topics/${topicId}/questions/${questionId}/answers/${answer.id}`, {
      method: 'PATCH',
    })
    onBestToggle(answer.id)
    setMarking(false)
  }

  return (
    <div className={`rounded-xl p-4 ${answer.isBest ? 'bg-emerald-50 border border-emerald-200' : 'bg-neutral-50 border border-neutral-100'}`}>
      <div className="flex items-start gap-3">
        {answer.isBest && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          {answer.isBest && (
            <span className="inline-block mb-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Best Answer
            </span>
          )}
          <p className="text-sm text-neutral-700 whitespace-pre-line">{answer.body}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-neutral-500">{answer.user.name}</span>
            {answer.user.flairTag && <FlairBadge flair={answer.user.flairTag} />}
            <span className="text-xs text-neutral-400">{timeAgo(answer.createdAt)}</span>
            {isQuestionAuthor && (
              <button
                onClick={markBest}
                disabled={marking}
                className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                  answer.isBest
                    ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                    : 'text-neutral-500 bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                {answer.isBest ? '✓ Best Answer' : 'Mark as Best'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  topicId,
  onUpdate,
}: {
  question: Question
  topicId: string
  onUpdate: (q: Question) => void
}) {
  const { data: session } = useSession()
  const [expanded, setExpanded] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const hasAnswers = question.answers.length > 0

  async function submitAnswer(e: React.FormEvent) {
    e.preventDefault()
    if (!answerText.trim()) return
    setSubmitting(true); setError('')
    const res = await fetch(`/api/topics/${topicId}/questions/${question.id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: answerText.trim() }),
    })
    if (res.ok) {
      const newAnswer = await res.json()
      setAnswerText('')
      onUpdate({ ...question, answers: [...question.answers, newAnswer] })
      setExpanded(true)
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to post answer')
    }
    setSubmitting(false)
  }

  function handleBestToggle(answerId: string) {
    const updated = question.answers.map(a =>
      a.id === answerId ? { ...a, isBest: !a.isBest } : { ...a, isBest: false }
    )
    const anyBest = updated.some(a => a.isBest)
    onUpdate({ ...question, answers: updated, isAnswered: anyBest })
  }

  return (
    <div className="card-base p-4 space-y-3">
      {/* Question header */}
      <div className="flex items-start gap-3">
        <HelpCircle className={`h-4 w-4 mt-0.5 shrink-0 ${question.isAnswered ? 'text-emerald-500' : 'text-saffron-500'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-800 leading-relaxed">{question.body}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-neutral-500">{question.user.name}</span>
            {question.user.flairTag && <FlairBadge flair={question.user.flairTag} />}
            <span className="text-xs text-neutral-400">{timeAgo(question.createdAt)}</span>
            {question.isAnswered && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Answered
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Answers toggle */}
      {hasAnswers && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-saffron-600 font-medium hover:text-saffron-700 transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* Answers list */}
      {expanded && hasAnswers && (
        <div className="space-y-2 pl-2 border-l-2 border-neutral-100">
          {question.answers.map(answer => (
            <AnswerItem
              key={answer.id}
              answer={answer}
              questionUserId={question.user.id}
              questionId={question.id}
              topicId={topicId}
              onBestToggle={handleBestToggle}
            />
          ))}
        </div>
      )}

      {/* Answer form */}
      {session && (
        <form onSubmit={submitAnswer} className="flex gap-2 pt-1 border-t border-neutral-100">
          <textarea
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            placeholder="Write your answer…"
            rows={2}
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-400"
          />
          <button
            type="submit"
            disabled={submitting || !answerText.trim()}
            className="self-end rounded-lg bg-saffron-500 p-2.5 text-white hover:bg-saffron-600 disabled:opacity-40 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!session && (
        <p className="text-xs text-neutral-400 pt-1 border-t border-neutral-100">
          <a href="/login" className="underline hover:text-saffron-600">Sign in</a> to answer this question.
        </p>
      )}
    </div>
  )
}

export function QASection({ topicId }: Props) {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [questionText, setQuestionText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const fetchQuestions = useCallback(async () => {
    const res = await fetch(`/api/topics/${topicId}/questions`)
    if (res.ok) setQuestions(await res.json())
    setLoading(false)
  }, [topicId])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!questionText.trim()) return
    setSubmitting(true); setError('')
    const res = await fetch(`/api/topics/${topicId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: questionText.trim() }),
    })
    if (res.ok) {
      const q = await res.json()
      setQuestions(prev => [q, ...prev])
      setQuestionText('')
      setShowForm(false)
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to post question')
    }
    setSubmitting(false)
  }

  function updateQuestion(updated: Question) {
    setQuestions(prev => prev.map(q => (q.id === updated.id ? updated : q)))
  }

  const answeredCount = questions.filter(q => q.isAnswered).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-saffron-500" />
          <span className="font-semibold text-navy-500">
            Q&A
            {questions.length > 0 && (
              <span className="ml-1.5 text-sm font-normal text-neutral-400">
                ({questions.length} {questions.length === 1 ? 'question' : 'questions'}
                {answeredCount > 0 ? `, ${answeredCount} answered` : ''})
              </span>
            )}
          </span>
        </div>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-saffron-600 transition-colors"
          >
            Ask Question
          </button>
        )}
      </div>

      {/* Ask form */}
      {showForm && session && (
        <form onSubmit={handleAskQuestion} className="card-base p-4 space-y-3">
          <p className="text-sm font-semibold text-navy-500">Ask a Question</p>
          <textarea
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            placeholder="What would you like to know about this property? Be specific so others can give helpful answers."
            rows={3}
            minLength={10}
            maxLength={1000}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-400"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">{questionText.length}/1000 chars · min 10</span>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || questionText.trim().length < 10}
              className="rounded-lg bg-saffron-500 px-4 py-2 text-sm font-semibold text-white hover:bg-saffron-600 disabled:opacity-50"
            >
              {submitting ? 'Posting…' : 'Post Question'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError('') }}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Questions list */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-neutral-100" />)}
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center">
          <HelpCircle className="h-7 w-7 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">No questions yet.</p>
          {session ? (
            <p className="text-xs text-neutral-400 mt-1">Have a question about this property? Ask away.</p>
          ) : (
            <p className="text-xs text-neutral-400 mt-1">
              <a href="/login" className="underline hover:text-saffron-600">Sign in</a> to ask a question.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              topicId={topicId}
              onUpdate={updateQuestion}
            />
          ))}
        </div>
      )}
    </div>
  )
}
