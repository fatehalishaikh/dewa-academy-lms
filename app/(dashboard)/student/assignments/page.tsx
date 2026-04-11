'use client'
import { useState } from 'react'
import { Sparkles, BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useCurrentStudent } from '@/stores/role-store'
import { getStudentAssignments, type StudentAssignmentView } from '@/lib/academy-selectors'
import { useAcademyStore } from '@/stores/academy-store'

const statusConfig = {
  'not-submitted': { label: 'Pending',     color: 'text-amber-400',   border: 'border-amber-500/30',   icon: Clock },
  submitted:       { label: 'Submitted',   color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  late:            { label: 'Late',        color: 'text-red-400',     border: 'border-red-500/30',     icon: Clock },
  graded:          { label: 'Graded',      color: 'text-primary',     border: 'border-primary/30',     icon: CheckCircle2 },
}

function AssignmentCard({ a }: { a: StudentAssignmentView }) {
  const router = useRouter()
  const cfg = statusConfig[a.status] ?? statusConfig['not-submitted']
  const Icon = cfg.icon
  return (
    <div
      className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
      onClick={() => router.push(`/student/assignments/${a.id}`)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{a.subject} · {a.totalPoints} pts</p>
        </div>
        <Badge variant="outline" className={`text-[10px] h-5 shrink-0 ${cfg.color} ${cfg.border}`}>
          <Icon className="w-2.5 h-2.5 mr-1" />
          {cfg.label}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">Due: {a.dueDate}</p>
        {a.grade != null && (
          <span className={`text-sm font-bold ${a.grade >= 90 ? 'text-emerald-400' : a.grade >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
            {a.grade}/{a.totalPoints}
          </span>
        )}
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </div>
  )
}

export default function StudentAssignments() {
  const [tab, setTab] = useState('upcoming')
  const student = useCurrentStudent()
  // Subscribe to store so the list re-renders when new homework is created
  useAcademyStore(s => s.homework)

  const allAssignments = student ? getStudentAssignments(student.id) : []
  const today = new Date().toISOString().split('T')[0]

  const upcoming = allAssignments.filter(a => a.status === 'not-submitted' && a.dueDate >= today)
  const overdue  = allAssignments.filter(a => a.status === 'not-submitted' && a.dueDate < today)
  const submitted = allAssignments.filter(a => a.status === 'submitted' || a.status === 'late')
  const graded   = allAssignments.filter(a => a.status === 'graded')

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">My Assignments</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track and submit your coursework</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Upcoming', value: upcoming.length, color: '#F59E0B' },
          { label: 'Overdue',  value: overdue.length,  color: '#EF4444' },
          { label: 'Submitted', value: submitted.length, color: '#10B981' },
          { label: 'Graded',  value: graded.length,   color: '#00B8A9' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="upcoming" className="text-xs">Upcoming ({upcoming.length + overdue.length})</TabsTrigger>
          <TabsTrigger value="submitted" className="text-xs">Submitted ({submitted.length})</TabsTrigger>
          <TabsTrigger value="graded" className="text-xs">Graded ({graded.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {overdue.length > 0 && (
            <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Overdue</p>
          )}
          {overdue.map(a => <AssignmentCard key={a.id} a={a} />)}
          {upcoming.length > 0 && overdue.length > 0 && (
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mt-2">Due upcoming</p>
          )}
          {upcoming.map(a => <AssignmentCard key={a.id} a={a} />)}
          {upcoming.length === 0 && overdue.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No pending assignments</p>
          )}
        </TabsContent>
        <TabsContent value="submitted" className="space-y-3 mt-4">
          {submitted.map(a => <AssignmentCard key={a.id} a={a} />)}
          {submitted.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No submitted assignments</p>}
        </TabsContent>
        <TabsContent value="graded" className="space-y-3 mt-4">
          {graded.map(a => <AssignmentCard key={a.id} a={a} />)}
          {graded.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No graded assignments yet</p>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
