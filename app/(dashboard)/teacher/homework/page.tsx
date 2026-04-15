'use client'
import { Sparkles, Plus, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useHomeworkStore } from '@/stores/homework-store'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassById } from '@/data/mock-classes'

const statusConfig = {
  published: { label: 'Published', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  draft: { label: 'Draft', color: 'text-amber-400', border: 'border-amber-500/30' },
  closed: { label: 'Closed', color: 'text-muted-foreground', border: 'border-border' },
}

export default function TeacherHomework() {
  const router = useRouter()
  const teacher = useCurrentTeacher()
  const { homework, getSubmissionsForHomework } = useHomeworkStore()

  const teacherHomework = homework.filter(h => h.teacherId === teacher?.id)

  const pendingGrading = teacherHomework.reduce((sum, hw) => {
    const subs = getSubmissionsForHomework(hw.id)
    return sum + subs.filter(s => s.status === 'submitted' || s.status === 'late').length
  }, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Assignment Management</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Homework</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pendingGrading > 0 ? `${pendingGrading} submission${pendingGrading > 1 ? 's' : ''} awaiting grading` : 'All submissions graded'}
          </p>
        </div>
        <Button size="sm" onClick={() => router.push('/teacher/homework/create')} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Assignments', value: teacherHomework.length, color: '#00B8A9' },
          { label: 'Published', value: teacherHomework.filter(h => h.status === 'published').length, color: '#10B981' },
          { label: 'Pending Grading', value: pendingGrading, color: '#F59E0B' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {teacherHomework.map((hw) => {
          const cfg = statusConfig[hw.status]
          const cls = getClassById(hw.classId)
          const subs = getSubmissionsForHomework(hw.id)
          const submittedCount = subs.filter(s => s.status !== 'not-submitted').length
          const pendingCount = subs.filter(s => s.status === 'submitted' || s.status === 'late').length
          const dueFormatted = new Date(hw.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })

          return (
            <Card
              key={hw.id}
              className="rounded-2xl border-border hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/teacher/homework/${hw.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{hw.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{cls?.name ?? hw.classId} · {hw.totalPoints} pts</p>
                  </div>
                  <Badge variant="outline" className={`text-[11px] h-5 shrink-0 ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Due {dueFormatted}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {submittedCount}/{subs.length} submitted
                    </div>
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-400">
                        <AlertCircle className="w-3 h-3" />
                        {pendingCount} to grade
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}

        {teacherHomework.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No assignments yet. Click <strong>New Assignment</strong> to create one.
          </div>
        )}
      </div>
    </div>
  )
}
