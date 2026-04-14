'use client'
import { useState } from 'react'
import { ClipboardList, Clock, CheckCircle2, ArrowRight, AlertCircle, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useCurrentStudent } from '@/stores/role-store'
import { getStudentAssignments, type StudentAssignmentView } from '@/lib/academy-selectors'
import { useAcademyStore } from '@/stores/academy-store'

const statusConfig = {
  'not-submitted': { label: 'Pending',     color: 'text-amber-500',   bg: 'bg-amber-500/10', border: 'border-amber-500/30',   icon: Clock },
  submitted:       { label: 'Submitted',   color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2 },
  late:            { label: 'Late',        color: 'text-red-500',     bg: 'bg-red-500/10', border: 'border-red-500/30',     icon: AlertCircle },
  graded:          { label: 'Graded',      color: 'text-primary',     bg: 'bg-primary/10', border: 'border-primary/30',     icon: CheckCircle2 },
}

function AssignmentCard({ a }: { a: StudentAssignmentView }) {
  const router = useRouter()
  const cfg = statusConfig[a.status] ?? statusConfig['not-submitted']
  const Icon = cfg.icon
  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => router.push(`/student/assignments/${a.id}`)}
    >
      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${cfg.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{a.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{a.subject} &middot; {a.totalPoints} pts</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Due</p>
          <p className="text-sm font-medium text-foreground">{a.dueDate}</p>
        </div>
        {a.grade != null && (
          <div className={`px-3 py-1.5 rounded-lg ${a.grade >= 90 ? 'bg-emerald-500/10' : a.grade >= 75 ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
            <span className={`text-sm font-bold ${a.grade >= 90 ? 'text-emerald-500' : a.grade >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
              {a.grade}/{a.totalPoints}
            </span>
          </div>
        )}
        <Badge variant="outline" className={`text-xs ${cfg.color} ${cfg.border}`}>
          {cfg.label}
        </Badge>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

export default function StudentAssignments() {
  const [tab, setTab] = useState('upcoming')
  const student = useCurrentStudent()
  useAcademyStore(s => s.homework)

  const allAssignments = student ? getStudentAssignments(student.id) : []
  const today = new Date().toISOString().split('T')[0]

  const upcoming = allAssignments.filter(a => a.status === 'not-submitted' && a.dueDate >= today)
  const overdue  = allAssignments.filter(a => a.status === 'not-submitted' && a.dueDate < today)
  const submitted = allAssignments.filter(a => a.status === 'submitted' || a.status === 'late')
  const graded   = allAssignments.filter(a => a.status === 'graded')

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">My Assignments</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and submit your coursework</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming', value: upcoming.length, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
          { label: 'Overdue', value: overdue.length, color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
          { label: 'Submitted', value: submitted.length, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
          { label: 'Graded', value: graded.length, color: 'text-primary', bg: 'bg-primary/10', icon: ClipboardList },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label} className="border-border/50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="bg-card border border-border h-10">
            <TabsTrigger value="upcoming" className="text-sm px-4">
              Upcoming
              {(upcoming.length + overdue.length) > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium flex items-center justify-center">
                  {upcoming.length + overdue.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="submitted" className="text-sm px-4">
              Submitted
              {submitted.length > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium flex items-center justify-center">
                  {submitted.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="graded" className="text-sm px-4">
              Graded
              {graded.length > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                  {graded.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {overdue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wider">Overdue</p>
              </div>
              {overdue.map(a => <AssignmentCard key={a.id} a={a} />)}
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="space-y-3">
              {overdue.length > 0 && (
                <div className="flex items-center gap-2 mt-6">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Due Soon</p>
                </div>
              )}
              {upcoming.map(a => <AssignmentCard key={a.id} a={a} />)}
            </div>
          )}
          {upcoming.length === 0 && overdue.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No pending assignments</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="space-y-3 mt-6">
          {submitted.map(a => <AssignmentCard key={a.id} a={a} />)}
          {submitted.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">No submissions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Submit your first assignment to see it here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="graded" className="space-y-3 mt-6">
          {graded.map(a => <AssignmentCard key={a.id} a={a} />)}
          {graded.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">No graded work yet</p>
              <p className="text-sm text-muted-foreground mt-1">Your graded assignments will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
