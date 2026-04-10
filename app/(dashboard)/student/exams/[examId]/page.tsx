'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Brain, Clock, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentStudent } from '@/stores/role-store'
import { useAdaptiveExamStore } from '@/stores/adaptive-exam-store'
import { useAcademyStore } from '@/stores/academy-store'
import { getExamById, type ExamQuestion } from '@/data/mock-assessments'
import type { Exam } from '@/data/mock-assessments'
import type { ExamAssignment } from '@/stores/adaptive-exam-store'

const levelColor: Record<string, string> = {
  Hard:   'border-red-500/30 text-red-400 bg-red-500/5',
  Medium: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  Easy:   'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
}

const diffBadge: Record<string, string> = {
  Hard:   'border-red-500/20 text-red-400',
  Medium: 'border-amber-500/20 text-amber-400',
  Easy:   'border-emerald-500/20 text-emerald-400',
}

export default function StudentExamTaking() {
  const params = useParams()!
  const router = useRouter()
  const examId = params.examId as string

  const student = useCurrentStudent()
  const { resolveAssignment, getAssignment } = useAdaptiveExamStore()
  const { addExamSubmission, customExams } = useAcademyStore()

  const [assignment, setAssignment] = useState<ExamAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const exam: Exam | undefined = getExamById(examId) ?? customExams.find(e => e.id === examId)

  const load = useCallback(async () => {
    if (!student || !exam) return
    setLoading(true)
    setError(null)
    try {
      const cached = getAssignment(examId, student.id)
      if (cached) {
        setAssignment(cached)
      } else {
        const resolved = await resolveAssignment(examId, student.id, exam)
        setAssignment(resolved)
      }
    } catch {
      setError('Could not load personalized questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [student, exam, examId, getAssignment, resolveAssignment])

  useEffect(() => { load() }, [load])

  if (!exam) {
    return (
      <div className="p-6 flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Exam not found.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          <p className="text-sm font-medium text-foreground">Personalizing your exam…</p>
        </div>
        <p className="text-xs text-muted-foreground">Selecting questions based on your performance level</p>
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-48 gap-3">
        <AlertCircle className="w-6 h-6 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button size="sm" variant="outline" onClick={load}>Retry</Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">Exam submitted!</p>
          <p className="text-xs text-muted-foreground mt-1">Your teacher will grade it shortly.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => router.push('/student/exams')}>
          Back to My Exams
        </Button>
      </div>
    )
  }

  if (!assignment) return null

  const questions = assignment.questions
  const current: ExamQuestion = questions[currentIdx]
  const totalQ = questions.length
  const answered = Object.keys(answers).length

  function setAnswer(qId: string, value: string) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  async function handleSubmit() {
    if (!student) return
    setSubmitting(true)
    addExamSubmission({
      examId,
      studentId: student.id,
      studentName: student.name,
      submittedAt: new Date().toISOString(),
      score: null,
      feedback: '',
      status: 'submitted',
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  const { easy, medium, hard } = assignment.mix

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      {/* Exam header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{exam.title}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" /> {exam.duration} min
            </span>
            <span className="text-[10px] text-muted-foreground">{totalQ} questions</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 ${levelColor[assignment.targetDifficulty]}`}>
          <Brain className="w-3.5 h-3.5" />
          Personalized · {assignment.targetDifficulty}
        </div>
      </div>

      {/* Adaptive composition bar */}
      <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your question mix</p>
        <div className="flex gap-3">
          {easy > 0 && (
            <span className="text-[10px] text-emerald-400 font-medium">{easy} easy</span>
          )}
          {medium > 0 && (
            <span className="text-[10px] text-amber-400 font-medium">{medium} medium</span>
          )}
          {hard > 0 && (
            <span className="text-[10px] text-red-400 font-medium">{hard} hard</span>
          )}
        </div>
        <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
          {easy > 0 && <div className="bg-emerald-500/60 rounded-full" style={{ flex: easy }} />}
          {medium > 0 && <div className="bg-amber-500/60 rounded-full" style={{ flex: medium }} />}
          {hard > 0 && <div className="bg-red-500/60 rounded-full" style={{ flex: hard }} />}
        </div>
        <p className="text-[10px] text-muted-foreground italic">{assignment.rationale}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(answered / totalQ) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0">{answered}/{totalQ} answered</span>
      </div>

      {/* Question card */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Question {currentIdx + 1} of {totalQ}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[9px] h-4 ${diffBadge[current.difficulty]}`}>
                {current.difficulty}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{current.points} pt{current.points !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{current.subject} · {current.topic}</p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <p className="text-sm font-medium text-foreground leading-relaxed">{current.text}</p>

          {/* MCQ */}
          {current.questionType === 'MCQ' && current.options && (
            <div className="space-y-2">
              {current.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    answers[current.id] === opt
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border hover:border-border/80 hover:bg-muted/20'
                  }`}
                >
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={answers[current.id] === opt}
                    onChange={() => setAnswer(current.id, opt)}
                    className="mt-0.5 accent-primary shrink-0"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {/* True-False */}
          {current.questionType === 'True-False' && (
            <div className="flex gap-3">
              {(current.options ?? ['True', 'False']).map(opt => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border cursor-pointer transition-colors flex-1 justify-center ${
                    answers[current.id] === opt
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted/20'
                  }`}
                >
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={answers[current.id] === opt}
                    onChange={() => setAnswer(current.id, opt)}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {/* Essay */}
          {current.questionType === 'Essay' && (
            <textarea
              rows={5}
              placeholder="Write your answer here…"
              value={answers[current.id] ?? ''}
              onChange={e => setAnswer(current.id, e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
            />
          )}

          {/* Matching (simplified as free-text) */}
          {current.questionType === 'Matching' && (
            <textarea
              rows={4}
              placeholder="Write your matching answers here…"
              value={answers[current.id] ?? ''}
              onChange={e => setAnswer(current.id, e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIdx(i => i - 1)}
          disabled={currentIdx === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        {/* Question dots */}
        <div className="flex items-center gap-1">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIdx ? 'bg-primary' : answers[q.id] ? 'bg-primary/40' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {currentIdx < totalQ - 1 ? (
          <Button size="sm" onClick={() => setCurrentIdx(i => i + 1)} className="gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-1.5"
          >
            {submitting
              ? <><span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /> Submitting…</>
              : <><CheckCircle2 className="w-3.5 h-3.5" /> Submit Exam</>
            }
          </Button>
        )}
      </div>

      {/* Answered summary on last question */}
      {currentIdx === totalQ - 1 && answered < totalQ && (
        <p className="text-xs text-amber-400 text-center">
          {totalQ - answered} question{totalQ - answered > 1 ? 's' : ''} unanswered — you can still submit.
        </p>
      )}
    </div>
  )
}
