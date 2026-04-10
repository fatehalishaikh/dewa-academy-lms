'use client'
import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, Wand2, CheckCircle2, Clock, Sparkles, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StudentNameLink } from '@/components/ui/student-name-link'
import { exams, examSubmissions, examQuestions, type ExamSubmission } from '@/data/mock-assessments'
import { getClassById } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { useAcademyStore } from '@/stores/academy-store'

type AiGradeResult = {
  score: number
  confidence: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

export default function AssessmentsGrading() {
  const { gradeExamSubmission, examSubmissions: storeSubmissions } = useAcademyStore()
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null)
  const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<ExamSubmission>>>({})

  // Merge seed data with runtime store submissions; apply local grade overrides on top
  const submissions: ExamSubmission[] = useMemo(() => {
    const merged: ExamSubmission[] = [
      ...examSubmissions,
      ...storeSubmissions
        .filter(s => !examSubmissions.some(seed => seed.id === s.id))
        .map(s => ({
          id: s.id,
          examId: s.examId,
          studentId: s.studentId,
          answers: {},
          score: s.score,
          submissionStatus: (s.status === 'graded' ? 'graded' : 'pending') as 'graded' | 'pending',
          feedback: s.feedback,
          submittedAt: s.submittedAt,
        })),
    ]
    return merged.map(s => ({ ...s, ...localOverrides[s.id] }))
  }, [storeSubmissions, localOverrides])
  const [gradingForm, setGradingForm] = useState<Record<string, { score: string; feedback: string }>>({})
  const [aiSuggestingId, setAiSuggestingId] = useState<string | null>(null)
  const [aiResults, setAiResults] = useState<Record<string, AiGradeResult>>({})
  const [gradingSubId, setGradingSubId] = useState<string | null>(null)

  // Only show exams that have submissions
  const examsWithSubs = exams.filter(e => submissions.some(s => s.examId === e.id))

  const totalPending = submissions.filter(s => s.submissionStatus === 'pending').length
  const totalGraded = submissions.filter(s => s.submissionStatus === 'graded').length
  // Count MCQ submissions as auto-gradable
  const autoGraded = submissions.filter(s => {
    const exam = exams.find(e => e.id === s.examId)
    if (!exam) return false
    const qs = examQuestions.filter(q => exam.questionIds?.includes(q.id))
    return qs.length > 0 && qs.every(q => q.questionType === 'MCQ' || q.questionType === 'True-False')
  }).length

  function getForm(subId: string) {
    const sub = submissions.find(s => s.id === subId)
    return gradingForm[subId] ?? { score: sub?.score?.toString() ?? '', feedback: sub?.feedback ?? '' }
  }

  function setFormField(subId: string, field: 'score' | 'feedback', value: string) {
    setGradingForm(prev => ({ ...prev, [subId]: { ...getForm(subId), [field]: value } }))
  }

  async function handleAiSuggest(subId: string, maxPoints: number, examId: string) {
    setAiSuggestingId(subId)
    const sub = submissions.find(s => s.id === subId)
    const exam = exams.find(e => e.id === examId)
    // Try to get first question from exam for context
    const firstQ = exam?.questionIds?.[0]
      ? examQuestions.find(q => q.id === exam.questionIds![0])
      : null

    try {
      const res = await fetch('/api/ai/grading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: firstQ?.text ?? `Exam: ${exam?.title ?? 'Assessment'}`,
          questionType: firstQ?.questionType ?? 'Essay',
          correctAnswer: firstQ?.correctAnswer,
          studentAnswer: sub?.answers ? Object.values(sub.answers).join('\n') : `Student submission for exam: ${exam?.title}`,
          maxPoints,
          subject: firstQ?.subject ?? exam?.title,
        }),
      })
      if (res.ok) {
        const result: AiGradeResult = await res.json()
        setAiResults(prev => ({ ...prev, [subId]: result }))
        setGradingForm(prev => ({
          ...prev,
          [subId]: { score: String(result.score), feedback: result.feedback },
        }))
      }
    } catch {
      // Fallback to mock
      const mockScore = Math.round(maxPoints * (0.65 + Math.random() * 0.25))
      setGradingForm(prev => ({
        ...prev,
        [subId]: { score: String(mockScore), feedback: 'Demonstrates reasonable understanding. Review key concepts for improvement.' },
      }))
    } finally {
      setAiSuggestingId(null)
    }
  }

  function handleSaveGrade(subId: string) {
    const form = getForm(subId)
    const numScore = Number(form.score)
    if (isNaN(numScore)) return
    setLocalOverrides(prev => ({
      ...prev,
      [subId]: { score: numScore, feedback: form.feedback, submissionStatus: 'graded' },
    }))
    gradeExamSubmission(subId, numScore, form.feedback)
    setGradingSubId(null)
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending Grading', value: totalPending, color: '#F59E0B', icon: Clock },
          { label: 'Graded',          value: totalGraded,  color: '#10B981', icon: CheckCircle2 },
          { label: 'Auto-Graded',     value: autoGraded,   color: '#0EA5E9', icon: Sparkles },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exam list */}
      <div className="space-y-3">
        {examsWithSubs.map(exam => {
          const examSubs = submissions.filter(s => s.examId === exam.id)
          const gradedCount = examSubs.filter(s => s.submissionStatus === 'graded').length
          const pendingCount = examSubs.filter(s => s.submissionStatus === 'pending').length
          const cls = getClassById(exam.classId)
          const pct = examSubs.length > 0 ? Math.round((gradedCount / examSubs.length) * 100) : 0
          const isExpanded = expandedExamId === exam.id

          return (
            <Card key={exam.id} className="rounded-2xl border-border overflow-hidden">
              {/* Exam header row */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/10 transition-colors"
                onClick={() => setExpandedExamId(isExpanded ? null : exam.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{exam.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {cls?.name ?? '—'} · {new Date(exam.date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">{gradedCount}/{examSubs.length}</p>
                    <p className="text-[10px] text-muted-foreground">graded</p>
                  </div>
                  <div className="w-20">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right mt-0.5">{pct}%</p>
                  </div>
                  {pendingCount > 0 && (
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">{pendingCount} pending</Badge>
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Student submissions */}
              {isExpanded && (
                <div className="border-t border-border">
                  {examSubs.map(sub => {
                    const student = getStudentById(sub.studentId)
                    if (!student) return null
                    const isGrading = gradingSubId === sub.id
                    const form = getForm(sub.id)

                    return (
                      <div key={sub.id} className="border-b border-border last:border-0">
                        <div className="flex items-center gap-3 px-5 py-3">
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarFallback className="text-[10px] font-bold text-white" style={{ background: student.avatarColor }}>
                              {student.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <StudentNameLink studentId={student.id} name={student.name} className="text-sm font-medium text-foreground" />
                            <p className="text-[10px] text-muted-foreground">
                              Submitted {new Date(sub.submittedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {sub.submissionStatus === 'graded' && sub.score != null && (
                              <div className="text-center">
                                <p className="text-xs font-bold text-foreground">{sub.score}/{exam.totalPoints}</p>
                                <p className="text-[10px] text-muted-foreground">{Math.round((sub.score / exam.totalPoints) * 100)}%</p>
                              </div>
                            )}
                            <Badge variant="outline" className={`text-[10px] h-5 ${
                              sub.submissionStatus === 'graded'
                                ? 'border-emerald-500/30 text-emerald-400'
                                : 'border-amber-500/30 text-amber-400'
                            }`}>
                              {sub.submissionStatus === 'graded' ? 'Graded' : 'Pending'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setGradingSubId(isGrading ? null : sub.id)}
                              className="h-7 text-xs gap-1"
                            >
                              {sub.submissionStatus === 'graded' ? 'Edit' : 'Grade'}
                            </Button>
                          </div>
                        </div>

                        {/* Inline grading form */}
                        {isGrading && (
                          <div className="px-5 pb-4 space-y-3 bg-muted/5 border-t border-border">
                            <div className="flex items-center gap-3 pt-3">
                              <div>
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Score</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={form.score}
                                    onChange={e => setFormField(sub.id, 'score', e.target.value)}
                                    min={0}
                                    max={exam.totalPoints}
                                    className="w-16 bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-primary/50"
                                  />
                                  <span className="text-xs text-muted-foreground">/ {exam.totalPoints}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAiSuggest(sub.id, exam.totalPoints, exam.id)}
                                disabled={aiSuggestingId === sub.id}
                                className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10 self-end"
                              >
                                {aiSuggestingId === sub.id
                                  ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Suggesting…</>
                                  : <><Wand2 className="w-3 h-3" /> AI Suggest</>}
                              </Button>
                              {aiResults[sub.id] && (
                                <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary self-end">
                                  {aiResults[sub.id].confidence}% confident
                                </Badge>
                              )}
                            </div>
                            {/* AI strengths/improvements */}
                            {aiResults[sub.id] && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                  <p className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5" /> Strengths
                                  </p>
                                  {aiResults[sub.id].strengths.map((s, i) => (
                                    <p key={i} className="text-[10px] text-muted-foreground">· {s}</p>
                                  ))}
                                </div>
                                <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                  <p className="text-[9px] font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <TrendingDown className="w-2.5 h-2.5" /> Improve
                                  </p>
                                  {aiResults[sub.id].improvements.map((s, i) => (
                                    <p key={i} className="text-[10px] text-muted-foreground">· {s}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div>
                              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Feedback</label>
                              <textarea
                                value={form.feedback}
                                onChange={e => setFormField(sub.id, 'feedback', e.target.value)}
                                rows={3}
                                placeholder="Write feedback for this student…"
                                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary/50"
                              />
                            </div>
                            <Button size="sm" onClick={() => handleSaveGrade(sub.id)} disabled={!form.score} className="gap-1 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Save Grade
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
