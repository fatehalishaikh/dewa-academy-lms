'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ChevronLeft, Sparkles, Clock, BookOpen, CheckCircle2,
  Send, FileText, Star, AlertCircle, Bot,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useCurrentStudent } from '@/stores/role-store'
import { getStudentAssignments, type StudentAssignmentView } from '@/lib/academy-selectors'
import { useAcademyStore } from '@/stores/academy-store'

const statusConfig = {
  'not-submitted': { label: 'Pending',   color: 'text-amber-400',   border: 'border-amber-500/30',   icon: Clock },
  submitted:       { label: 'Submitted', color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  late:            { label: 'Late',      color: 'text-red-400',     border: 'border-red-500/30',     icon: Clock },
  graded:          { label: 'Graded',    color: 'text-primary',     border: 'border-primary/30',     icon: CheckCircle2 },
}

const subjectColors: Record<string, string> = {
  Mathematics:       '#3B82F6',
  Physics:           '#8B5CF6',
  'English Language':'#10B981',
  English:           '#10B981',
  Chemistry:         '#F59E0B',
  Arabic:            '#EC4899',
}

export default function AssignmentDetailPage() {
  const params = useParams()
  const id = (params?.id ?? '') as string
  const router = useRouter()
  const student = useCurrentStudent()
  const submitHomework = useAcademyStore(s => s.submitHomework)
  // Subscribe to store so UI reflects newly submitted work
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

  function handleSubmit() {
    if (!submissionText.trim() || !student) return
    submitHomework(id, student.id, submissionText)
    setLocalSubmitted(true)
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
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
          <Badge variant="outline" className={`text-xs h-6 ${cfg.color} ${cfg.border}`}>
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
          ...(assignment.submittedDate ? [{ label: 'Submitted', value: assignment.submittedDate, color: '#10B981' }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} className="px-3 py-2 rounded-xl bg-card border border-border">
            <p className="text-[10px] text-muted-foreground">{label}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: description + instructions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <Card className="rounded-2xl border-border bg-card">
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
          {assignment.instructions && !isGraded && (
            <Card className="rounded-2xl border-border bg-card">
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

          {/* Submit / submitted state */}
          {canSubmit && (
            <Card className="rounded-2xl border-border bg-card">
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

          {/* Awaiting grading */}
          {(isSubmitted && !isGraded) && (
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Your Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                  {localSubmitted ? 'Submitted just now — awaiting grading' : `Submitted on ${assignment.submittedDate} — awaiting grading`}
                </div>
                {(assignment.submittedContent || submissionText) && (
                  <div className="p-3 rounded-xl bg-muted/30 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {assignment.submittedContent ?? submissionText}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Graded result */}
          {isGraded && (
            <>
              <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    Grade & Feedback
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
                      <div className="p-3 rounded-xl bg-muted/30 text-sm text-muted-foreground leading-relaxed">
                        {assignment.feedback}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {assignment.aiFeedback && (
                <Card className="rounded-2xl border-primary/20 bg-primary/5">
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
            </>
          )}
        </div>

        {/* Right column: rubric */}
        <div className="space-y-4">
          {assignment.rubric.length > 0 && (
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold">Rubric</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {assignment.rubric.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/20 space-y-1">
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

          {canSubmit && (
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {[
                  'Read the rubric carefully before starting',
                  'Check your work against each criterion',
                  'Submit before the due date to avoid late penalties',
                  'Use the AI Tutor if you need help with the subject',
                ].map((tip, i) => (
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
