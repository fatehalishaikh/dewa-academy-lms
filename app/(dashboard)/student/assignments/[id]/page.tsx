'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ChevronLeft, Sparkles, Clock, BookOpen, CheckCircle2,
  Send, FileText, Star, AlertCircle, Bot, CircleDot,
  XCircle, CheckCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useCurrentStudent } from '@/stores/role-store'
import { getStudentAssignments, type StudentAssignmentView } from '@/lib/academy-selectors'
import { useAcademyStore } from '@/stores/academy-store'
import type { ExamQuestion } from '@/data/mock-assessments'

const statusConfig = {
  'not-submitted': { label: 'Pending',   color: 'text-warning',   border: 'border-warning/30',   bg: 'bg-warning/10',   icon: Clock },
  submitted:       { label: 'Submitted', color: 'text-success', border: 'border-success/30', bg: 'bg-success/10', icon: CheckCircle2 },
  late:            { label: 'Late',      color: 'text-destructive',     border: 'border-destructive/30',     bg: 'bg-destructive/10',     icon: Clock },
  graded:          { label: 'Graded',    color: 'text-primary',     border: 'border-primary/30',     bg: 'bg-primary/10',     icon: CheckCircle2 },
}

const subjectColors: Record<string, string> = {
  Mathematics:       '#2878C1',
  Physics:           '#004937',
  'English Language':'#007560',
  English:           '#007560',
  Chemistry:         '#D4AF37',
  Arabic:            '#7FC9BB',
}

// ── MCQ Question Component ───────────────────────────────────────────────────

function McqQuestion({ q, index, locked }: { q: ExamQuestion; index: number; locked: boolean }) {
  const [selected, setSelected] = useState<string | null>(null)
  const answered = selected !== null
  const isCorrect = selected === q.correctAnswer

  return (
    <div className="p-4 rounded-[10px] bg-muted/20 border border-border space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-primary">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed">{q.text}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[9px] h-4 border-border text-muted-foreground">{q.topic}</Badge>
            <Badge variant="outline" className="text-[9px] h-4 border-border text-muted-foreground">{q.points} pt{q.points > 1 ? 's' : ''}</Badge>
          </div>
        </div>
        {answered && (
          isCorrect
            ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            : <XCircle className="w-4 h-4 text-destructive shrink-0" />
        )}
      </div>

      <div className="space-y-2 ml-9">
        {(q.options ?? []).map((opt, oi) => {
          const isSelected = selected === opt
          const isAnswer = opt === q.correctAnswer
          let optClass = 'border-border bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
          if (answered) {
            if (isAnswer) optClass = 'border-success/50 bg-success/10 cursor-default'
            else if (isSelected) optClass = 'border-destructive/40 bg-destructive/8 cursor-default'
            else optClass = 'border-border bg-muted/10 opacity-60 cursor-default'
          }
          return (
            <button
              key={oi}
              disabled={answered || locked}
              onClick={() => !answered && !locked && setSelected(opt)}
              className={`w-full flex items-center gap-3 p-3 rounded-[10px] border text-left transition-all ${optClass}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                answered && isAnswer ? 'border-success bg-success' :
                answered && isSelected ? 'border-destructive bg-destructive' :
                isSelected ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {(isSelected || (answered && isAnswer)) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-xs leading-relaxed ${
                answered && isAnswer ? 'text-success font-medium' :
                answered && isSelected && !isAnswer ? 'text-destructive' :
                'text-foreground'
              }`}>{opt}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`ml-9 flex items-start gap-2 p-2.5 rounded-[10px] text-xs ${
          isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        }`}>
          {isCorrect
            ? <><CheckCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>Correct! Well done.</span></>
            : <><XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span>Incorrect. The correct answer is: <strong>{q.correctAnswer}</strong></span></>
          }
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AssignmentDetailPage() {
  const params = useParams()
  const id = (params?.id ?? '') as string
  const router = useRouter()
  const student = useCurrentStudent()
  const submitHomework = useAcademyStore(s => s.submitHomework)
  const submissions = useAcademyStore(s => s.submissions)

  const assignments = student ? getStudentAssignments(student.id) : []
  const assignment: StudentAssignmentView | undefined = assignments.find(a => a.id === id)

  const [submissionText, setSubmissionText] = useState(assignment?.submittedContent ?? '')
  const [localSubmitted, setLocalSubmitted] = useState(false)
  const [showAiFeedback, setShowAiFeedback] = useState(false)

  if (!assignment) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground">Assignment not found.</p>
        <Button variant="outline" onClick={() => router.push('/student/assignments')}>
          Back to Assignments
        </Button>
      </div>
    )
  }

  const cfg = statusConfig[assignment.status] ?? statusConfig['not-submitted']
  const StatusIcon = cfg.icon
  const accentColor = subjectColors[assignment.subject] ?? '#00B8A9'
  const isSubmitted = assignment.status === 'submitted' || assignment.status === 'late' || localSubmitted
  const isGraded = assignment.status === 'graded'
  const canSubmit = !isSubmitted && !isGraded && assignment.homeworkStatus !== 'closed'
  const gradePercent = isGraded && assignment.grade != null
    ? Math.round((assignment.grade / assignment.totalPoints) * 100)
    : 0
  const gradeColor = gradePercent >= 90 ? 'text-emerald-400' : gradePercent >= 75 ? 'text-amber-400' : 'text-red-400'

  const questions: ExamQuestion[] = (assignment as unknown as { questions?: ExamQuestion[] }).questions ?? []
  const hasMCQ = questions.length > 0

  function handleSubmit() {
    if (!submissionText.trim() || !student) return
    submitHomework(id, student.id, submissionText)
    setLocalSubmitted(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back + header */}
      <div>
        <button
          onClick={() => router.push('/student/assignments')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Assignments
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Assignment Detail</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{assignment.title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {assignment.className} · {assignment.teacherName}
            </p>
          </div>
          <Badge variant="outline" className={`text-xs h-6 ${cfg.color} ${cfg.border} ${cfg.bg}`}>
            <StatusIcon className="w-3 h-3 mr-1.5" />
            {cfg.label}
          </Badge>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Subject', value: assignment.subject, color: accentColor },
          { label: 'Due Date', value: assignment.dueDate, color: '#94A3B8' },
          { label: 'Points', value: `${assignment.totalPoints} pts`, color: '#94A3B8' },
          ...(hasMCQ ? [{ label: 'Questions', value: `${questions.length} MCQ`, color: '#8B5CF6' }] : []),
          ...(assignment.submittedDate ? [{ label: 'Submitted', value: assignment.submittedDate, color: '#10B981' }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} className="px-3 py-2 rounded-[10px] bg-card border border-border">
            <p className="text-[10px] text-muted-foreground">{label}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Graded result banner */}
      {isGraded && (
        <Card className="rounded-[10px] border-border bg-card">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Grade &amp; Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className={`text-4xl font-bold ${gradeColor}`}>{assignment.grade}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  /{assignment.totalPoints} pts ({gradePercent}%)
                </p>
              </div>
              <div className="flex-1">
                <Progress value={gradePercent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {gradePercent >= 90 ? 'Outstanding' : gradePercent >= 75 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>
            {assignment.feedback && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1.5">Teacher Feedback</p>
                <div className="p-3 rounded-[10px] bg-muted/30 text-sm text-muted-foreground leading-relaxed">
                  {assignment.feedback}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-2.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-400">Graded — results are final</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: description + MCQs + text submission */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <Card className="rounded-[10px] border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{assignment.description}</p>
            </CardContent>
          </Card>

          {/* Instructions */}
          {assignment.instructions && !hasMCQ && !isGraded && (
            <Card className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {assignment.instructions}
                </div>
              </CardContent>
            </Card>
          )}

          {/* MCQ Section */}
          {hasMCQ && (
            <Card className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-primary" />
                    Multiple Choice Questions
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] h-5 border-purple-500/30 text-purple-400">
                    {questions.length} questions · {questions.reduce((s, q) => s + q.points, 0)} pts
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Select an answer to see instant feedback.</p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {questions.map((q, i) => (
                  <McqQuestion key={q.id} q={q} index={i} locked={isGraded} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Submit / submitted state */}
          {canSubmit && !hasMCQ && (
            <Card className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  Submit Your Work
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <Textarea
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Type your answer or paste your work here…"
                  className="min-h-40 bg-muted/30 border-border text-sm resize-none"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!submissionText.trim()}
                  className="w-full"
                  size="sm"
                >
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Submit Assignment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* MCQ submit button */}
          {canSubmit && hasMCQ && (
            <Button className="w-full" size="sm" onClick={() => {
              if (!student) return
              submitHomework(id, student.id, 'MCQ answers submitted')
              setLocalSubmitted(true)
            }}>
              <Send className="w-3.5 h-3.5 mr-2" />
              Submit Answers
            </Button>
          )}

          {/* Awaiting grading */}
          {(isSubmitted && !isGraded) && (
            <Card className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Your Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="flex items-center gap-2 p-2.5 rounded-[10px] bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-xs font-medium text-amber-400">
                    {localSubmitted ? 'Submitted just now — awaiting grading' : `Submitted on ${assignment.submittedDate} — awaiting grading`}
                  </span>
                </div>
                {(assignment.submittedContent || submissionText) && !hasMCQ && (
                  <div className="p-3 rounded-[10px] bg-muted/30 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {assignment.submittedContent ?? submissionText}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Feedback */}
          {isGraded && assignment.aiFeedback && (
            <Card className="rounded-[10px] border-primary/20 bg-primary/5">
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    AI Learning Insights
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 text-primary"
                    onClick={() => setShowAiFeedback(v => !v)}
                  >
                    {showAiFeedback ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {showAiFeedback && (
                <CardContent className="px-5 pb-5">
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {assignment.aiFeedback}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Right column: rubric + tips */}
        <div className="space-y-4">
          {assignment.rubric.length > 0 && (
            <Card className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold">Rubric</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {assignment.rubric.map((item, i) => (
                  <div key={i} className="p-3 rounded-[10px] bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">{item.label}</p>
                      <Badge variant="outline" className="text-[10px] h-4 border-primary/30 text-primary">
                        {item.maxPoints} pts
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-foreground">Total</p>
                  <p className="text-xs font-bold text-primary">{assignment.totalPoints} pts</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grading status card */}
          <Card className={`rounded-[10px] border ${isGraded ? 'border-emerald-500/30 bg-emerald-500/5' : isSubmitted ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-card'}`}>
            <CardContent className="px-5 py-4 space-y-2">
              <div className="flex items-center gap-2">
                {isGraded
                  ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><p className="text-xs font-semibold text-emerald-400">Graded</p></>
                  : isSubmitted
                  ? <><Clock className="w-4 h-4 text-amber-400" /><p className="text-xs font-semibold text-amber-400">Pending Review</p></>
                  : <><Clock className="w-4 h-4 text-muted-foreground" /><p className="text-xs font-semibold text-muted-foreground">Not Submitted</p></>
                }
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isGraded
                  ? `Score: ${assignment.grade}/${assignment.totalPoints} (${gradePercent}%)`
                  : isSubmitted
                  ? 'Your teacher will review and grade this submission soon.'
                  : `Due: ${assignment.dueDate}`}
              </p>
            </CardContent>
          </Card>

          {canSubmit && (
            <Card className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {(hasMCQ
                  ? ['Read each question carefully before selecting', 'You get immediate feedback after each answer', 'All questions are required to submit', 'Use the AI Tutor if you need help understanding a concept']
                  : ['Read the rubric carefully before starting', 'Check your work against each criterion', 'Submit before the due date to avoid late penalties', 'Use the AI Tutor if you need help with the subject']
                ).map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
