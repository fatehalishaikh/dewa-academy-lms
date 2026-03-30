'use client'
import { useState } from 'react'
import { Sparkles, BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'

const allAssignments = [
  { id: 'hw-001', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', due: 'Mar 27, 2026', status: 'pending', points: 20, description: 'Solve problems 1-20 from Chapter 5. Show all working.' },
  { id: 'hw-002', title: "Newton's Laws Lab Report", subject: 'Physics', due: 'Mar 28, 2026', status: 'pending', points: 30, description: 'Write a 500-word lab report on the Newton\'s Laws experiment.' },
  { id: 'hw-003', title: 'Essay: Technology in Society', subject: 'English', due: 'Mar 30, 2026', status: 'in-progress', points: 25, description: 'Write a 600-word essay on the impact of AI in modern education.' },
  { id: 'hw-004', title: 'Chapter 6 Reading Summary', subject: 'English', due: 'Mar 22, 2026', status: 'submitted', points: 15, description: 'Summarize chapters 6-8 of the textbook.' },
  { id: 'hw-005', title: 'Algebra Mid-Unit Test', subject: 'Mathematics', due: 'Mar 18, 2026', status: 'graded', points: 50, grade: 92, feedback: 'Excellent work! Very clear working shown.' },
  { id: 'hw-006', title: 'Waves & Optics Problem Set', subject: 'Physics', due: 'Mar 15, 2026', status: 'graded', points: 25, grade: 78, feedback: 'Good effort. Review refraction concepts.' },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-400', border: 'border-amber-500/30', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', border: 'border-blue-500/30', icon: BookOpen },
  submitted: { label: 'Submitted', color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  graded: { label: 'Graded', color: 'text-primary', border: 'border-primary/30', icon: CheckCircle2 },
}

function AssignmentCard({ a }: { a: typeof allAssignments[0] }) {
  const router = useRouter()
  const cfg = statusConfig[a.status as keyof typeof statusConfig]
  const Icon = cfg.icon
  return (
    <div
      className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
      onClick={() => router.push(`/student/assignments/${a.id}`)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{a.subject} · {a.points} pts</p>
        </div>
        <Badge variant="outline" className={`text-[10px] h-5 shrink-0 ${cfg.color} ${cfg.border}`}>
          <Icon className="w-2.5 h-2.5 mr-1" />
          {cfg.label}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">Due: {a.due}</p>
        {'grade' in a && a.grade != null && (
          <span className={`text-sm font-bold ${a.grade >= 90 ? 'text-emerald-400' : a.grade >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
            {a.grade}%
          </span>
        )}
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </div>
  )
}

export default function StudentAssignments() {
  const [tab, setTab] = useState('upcoming')
  const upcoming = allAssignments.filter(a => a.status === 'pending' || a.status === 'in-progress')
  const submitted = allAssignments.filter(a => a.status === 'submitted')
  const graded = allAssignments.filter(a => a.status === 'graded')

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">My Assignments</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track and submit your coursework</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Upcoming', value: upcoming.length, color: '#F59E0B' },
          { label: 'Submitted', value: submitted.length, color: '#10B981' },
          { label: 'Graded', value: graded.length, color: '#00B8A9' },
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
          <TabsTrigger value="upcoming" className="text-xs">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="submitted" className="text-xs">Submitted ({submitted.length})</TabsTrigger>
          <TabsTrigger value="graded" className="text-xs">Graded ({graded.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.map(a => <AssignmentCard key={a.id} a={a} />)}
        </TabsContent>
        <TabsContent value="submitted" className="space-y-3 mt-4">
          {submitted.map(a => <AssignmentCard key={a.id} a={a} />)}
          {submitted.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No submitted assignments</p>}
        </TabsContent>
        <TabsContent value="graded" className="space-y-3 mt-4">
          {graded.map(a => <AssignmentCard key={a.id} a={a} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
