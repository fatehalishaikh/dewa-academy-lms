'use client'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles, Users, CheckCircle2, Clock, XCircle, AlertCircle, Pencil, Send, Archive, ListChecks } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useHomeworkStore } from '@/stores/homework-store'
import { getStudentById } from '@/data/mock-students'
import { getClassById } from '@/data/mock-classes'

const statusConfig = {
  'not-submitted': { label: 'Not Submitted', color: 'text-muted-foreground', border: 'border-border', icon: XCircle },
  submitted: { label: 'Submitted', color: 'text-blue-400', border: 'border-blue-500/30', icon: CheckCircle2 },
  late: { label: 'Late', color: 'text-amber-400', border: 'border-amber-500/30', icon: AlertCircle },
  graded: { label: 'Graded', color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
}

const hwStatusConfig = {
  draft: { label: 'Draft', color: 'text-amber-400', border: 'border-amber-500/30' },
  published: { label: 'Published', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  closed: { label: 'Closed', color: 'text-muted-foreground', border: 'border-border' },
}

export default function HomeworkDetail() {
  const _params = useParams()
  const id = (_params?.id ?? '') as string
  const router = useRouter()
  const { getHomeworkById, getSubmissionsForHomework, updateHomeworkStatus } = useHomeworkStore()

  const hw = getHomeworkById(id ?? '')
  const submissions = hw ? getSubmissionsForHomework(hw.id) : []
  const cls = hw ? getClassById(hw.classId) : undefined

  if (!hw) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        Assignment not found
      </div>
    )
  }

  const hwStatus = hwStatusConfig[hw.status]
  const submittedCount = submissions.filter(s => s.status !== 'not-submitted').length
  const gradedCount = submissions.filter(s => s.status === 'graded').length
  const pendingCount = submissions.filter(s => s.status === 'submitted' || s.status === 'late').length

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/teacher/homework')} className="gap-1.5 -ml-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Assignment info */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {hw.aiGenerated && (
                  <Badge variant="outline" className="text-[10px] h-4 border-primary/30 text-primary gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI Generated
                  </Badge>
                )}
                <Badge variant="outline" className={`text-[10px] h-4 ${hwStatus.color} ${hwStatus.border}`}>
                  {hwStatus.label}
                </Badge>
              </div>
              <CardTitle className="text-base">{hw.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {cls?.name} · Due {new Date(hw.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })} · {hw.totalPoints} pts
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {hw.status === 'draft' && (
                <Button size="sm" onClick={() => updateHomeworkStatus(hw.id, 'published')} className="gap-1.5 text-xs">
                  <Send className="w-3 h-3" />
                  Publish
                </Button>
              )}
              {hw.status === 'published' && (
                <Button size="sm" variant="outline" onClick={() => updateHomeworkStatus(hw.id, 'closed')} className="gap-1.5 text-xs">
                  <Archive className="w-3 h-3" />
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {hw.description && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-foreground leading-relaxed">{hw.description}</p>
            </div>
          )}
          {hw.instructions && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Instructions</p>
              <p className="text-sm text-foreground leading-relaxed">{hw.instructions}</p>
            </div>
          )}
          {hw.rubric.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grading Rubric</p>
              <div className="grid grid-cols-2 gap-1.5">
                {hw.rubric.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                    <p className="text-xs text-foreground">{r.label}</p>
                    <Badge variant="outline" className="text-[10px]">{r.maxPoints} pts</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      {hw.questions && hw.questions.length > 0 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-primary" />
                Questions
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{hw.questions.length} questions</Badge>
                <Badge variant="outline" className="text-[10px]">{hw.totalPoints} pts</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {hw.questions.map((q, i) => {
              const diffCls = q.difficulty === 'Easy' ? 'text-emerald-400 border-emerald-500/30' : q.difficulty === 'Hard' ? 'text-red-400 border-red-500/30' : 'text-amber-400 border-amber-500/30'
              return (
                <div key={q.id} className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">{i + 1}.</span>
                    <p className="text-sm text-foreground flex-1 leading-snug">{q.text}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant="outline" className={`text-[9px] h-4 ${diffCls}`}>{q.difficulty}</Badge>
                      <Badge variant="outline" className="text-[9px] h-4">{q.questionType}</Badge>
                      <Badge variant="outline" className="text-[9px] h-4 text-primary border-primary/30">{q.points}pt</Badge>
                    </div>
                  </div>
                  {q.questionType === 'MCQ' && q.options && (
                    <div className="pl-5 grid grid-cols-2 gap-1">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${opt === q.correctAnswer ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-muted-foreground'}`}>
                          {opt === q.correctAnswer && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {q.questionType !== 'MCQ' && (
                    <p className="pl-5 text-[10px] text-emerald-400">Answer: {q.correctAnswer}</p>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Submission stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: submissions.length, color: '#00B8A9', icon: Users },
          { label: 'Submitted', value: submittedCount, color: '#0EA5E9', icon: CheckCircle2 },
          { label: 'Pending Grading', value: pendingCount, color: '#F59E0B', icon: Clock },
          { label: 'Graded', value: gradedCount, color: '#10B981', icon: CheckCircle2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-1">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3 h-3" style={{ color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submissions table */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Submissions</CardTitle>
            {pendingCount > 0 && (
              <Button
                size="sm"
                onClick={() => {
                  const first = submissions.find(s => s.status === 'submitted' || s.status === 'late')
                  if (first) router.push(`/teacher/homework/${hw.id}/grade/${first.id}`)
                }}
                className="gap-1.5 text-xs"
              >
                <Pencil className="w-3 h-3" />
                Grade All ({pendingCount})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {submissions.map((sub) => {
              const student = getStudentById(sub.studentId)
              if (!student) return null
              const cfg = statusConfig[sub.status]
              const Icon = cfg.icon
              return (
                <div key={sub.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs font-bold text-white" style={{ background: student.avatarColor }}>
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {sub.submittedDate
                        ? `Submitted ${new Date(sub.submittedDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}`
                        : 'Not submitted yet'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.aiScore != null && sub.status !== 'graded' && (
                      <div className="text-center">
                        <p className="text-[9px] text-muted-foreground">AI Score</p>
                        <p className="text-xs font-semibold text-primary">{sub.aiScore}/{hw.totalPoints}</p>
                      </div>
                    )}
                    {sub.status === 'graded' && sub.grade != null && (
                      <div className="text-center">
                        <p className="text-[9px] text-muted-foreground">Grade</p>
                        <p className={`text-sm font-bold ${sub.grade / hw.totalPoints >= 0.9 ? 'text-emerald-400' : sub.grade / hw.totalPoints >= 0.75 ? 'text-amber-400' : 'text-red-400'}`}>
                          {sub.grade}/{hw.totalPoints}
                        </p>
                      </div>
                    )}
                    <Badge variant="outline" className={`text-[10px] h-5 ${cfg.color} ${cfg.border}`}>
                      <Icon className="w-2.5 h-2.5 mr-1" />
                      {cfg.label}
                    </Badge>
                    {(sub.status === 'submitted' || sub.status === 'late') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/teacher/homework/${hw.id}/grade/${sub.id}`)}
                        className="text-xs h-7 gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        Grade
                      </Button>
                    )}
                    {sub.status === 'graded' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/teacher/homework/${hw.id}/grade/${sub.id}`)}
                        className="text-xs h-7 gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
