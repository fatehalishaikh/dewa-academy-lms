'use client'
import { useState } from 'react'
import { BookOpen, Clock, CheckCircle2, ChevronRight, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useCurrentStudent } from '@/stores/role-store'
import { getStudentAssignments, type StudentAssignmentView } from '@/lib/academy-selectors'
import { useAcademyStore } from '@/stores/academy-store'

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#00B8A9',
  Physics: '#0EA5E9',
  English: '#8B5CF6',
  'English Language': '#8B5CF6',
  'Social Studies': '#F59E0B',
}
function subjectColor(s: string) { return SUBJECT_COLORS[s] ?? '#10B981' }

const statusConfig = {
  'not-submitted': { label: 'Pending',   color: '#F59E0B', icon: Clock },
  submitted:       { label: 'Submitted', color: '#10B981', icon: CheckCircle2 },
  late:            { label: 'Late',      color: '#EF4444', icon: AlertCircle },
  graded:          { label: 'Graded',    color: 'var(--accent-student)', icon: CheckCircle2 },
}

function gradeColor(g: number) {
  if (g >= 90) return '#10B981'
  if (g >= 75) return '#F59E0B'
  return '#EF4444'
}

function AssignmentCard({ a }: { a: StudentAssignmentView }) {
  const router = useRouter()
  const cfg = statusConfig[a.status] ?? statusConfig['not-submitted']
  const StatusIcon = cfg.icon
  const col = subjectColor(a.subject)

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const isOverdue = a.status === 'not-submitted' && a.dueDate < today
  const isDueToday = a.dueDate === today
  const isDueTomorrow = a.dueDate === tomorrow

  const urgency = isOverdue
    ? { bg: 'rgba(239,68,68,0.08)', text: '#EF4444', border: 'rgba(239,68,68,0.25)' }
    : isDueToday || isDueTomorrow
    ? { bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', border: 'rgba(245,158,11,0.25)' }
    : { bg: 'rgba(100,116,139,0.06)', text: '#64748B', border: 'rgba(100,116,139,0.18)' }

  const dueLabel = isOverdue
    ? `Overdue · ${a.dueDate}`
    : isDueToday ? 'Due today'
    : isDueTomorrow ? 'Due tomorrow'
    : `Due ${a.dueDate}`

  return (
    <div
      className="flex items-stretch rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xs transition-all cursor-pointer bg-card"
      onClick={() => router.push(`/student/assignments/${a.id}`)}
    >
      {/* Subject color strip */}
      <div className="w-1 shrink-0" style={{ background: col }} />

      {/* Subject badge */}
      <div className="flex items-center px-3 py-3.5 shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
          style={{ background: col }}
        >
          {a.subject.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 py-3.5 pr-3">
        <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{a.subject} · {a.className} · {a.totalPoints} pts</p>
      </div>

      {/* Right — status + due */}
      <div className="pr-4 flex flex-col items-end justify-center gap-1.5 shrink-0 py-3.5">
        <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: cfg.color }}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap"
          style={{ background: urgency.bg, color: urgency.text, borderColor: urgency.border }}
        >
          {dueLabel}
        </span>
        {a.grade != null && (
          <span className="text-sm font-bold" style={{ color: gradeColor(a.grade) }}>
            {a.grade}/{a.totalPoints}
          </span>
        )}
      </div>

      {/* Chevron */}
      <div className="flex items-center pr-3">
        <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
      </div>
    </div>
  )
}

function SectionDivider({ label, color, count }: { label: string; color: string; count: number }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <div className="w-1 h-3.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
        {count}
      </span>
      <div className="flex-1 h-px" style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }} />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
        <FileText className="w-5 h-5 text-muted-foreground/40" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}

export default function StudentAssignments() {
  const [tab, setTab] = useState('upcoming')
  const student = useCurrentStudent()
  useAcademyStore(s => s.homework)

  const allAssignments = student ? getStudentAssignments(student.id) : []
  const today = new Date().toISOString().split('T')[0]

  const upcoming  = allAssignments.filter(a => a.status === 'not-submitted' && a.dueDate >= today)
  const overdue   = allAssignments.filter(a => a.status === 'not-submitted' && a.dueDate < today)
  const submitted = allAssignments.filter(a => a.status === 'submitted' || a.status === 'late')
  const graded    = allAssignments.filter(a => a.status === 'graded')

  const completionRate = allAssignments.length
    ? Math.round(((submitted.length + graded.length) / allAssignments.length) * 100)
    : 0

  const stats = [
    { label: 'Upcoming',  value: upcoming.length,  color: '#F59E0B', icon: Clock,         trend: overdue.length > 0 ? `${overdue.length} overdue` : 'On track' },
    { label: 'Overdue',   value: overdue.length,   color: '#EF4444', icon: AlertCircle,   trend: overdue.length === 0 ? 'All clear' : 'Needs attention' },
    { label: 'Submitted', value: submitted.length, color: '#10B981', icon: CheckCircle2,  trend: 'Awaiting grade' },
    { label: 'Graded',    value: graded.length,    color: 'var(--accent-student)', icon: BookOpen, trend: `${completionRate}% completion` },
  ]

  return (
    <div className="p-6 space-y-5">

      {/* ── PAGE HEADER ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative flex items-center justify-between gap-6 px-7 py-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent-student) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-student) 30%, transparent)' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Student Portal</p>
              <h1 className="text-xl font-bold text-white mt-0.5">Assignments</h1>
              <p className="text-white/40 text-sm mt-0.5">Track and submit your coursework</p>
            </div>
          </div>

          {/* Completion ring */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Completion</p>
              <p className="text-2xl font-bold text-white mt-0.5">{completionRate}%</p>
              <p className="text-white/40 text-xs">{submitted.length + graded.length} of {allAssignments.length} done</p>
            </div>
            <div className="relative w-16 h-16 shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent-student)" strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - completionRate / 100)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, color, icon: Icon, trend }) => (
          <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0">
            <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
            <CardContent className="p-4 pt-3">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] font-semibold mt-1" style={{ color }}>{trend}</p>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── TABS + LIST ── */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card border border-border h-9">
          <TabsTrigger value="upcoming" className="text-xs gap-1.5">
            Upcoming
            {upcoming.length + overdue.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500">
                {upcoming.length + overdue.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted" className="text-xs gap-1.5">
            Submitted
            {submitted.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                {submitted.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="graded" className="text-xs gap-1.5">
            Graded
            {graded.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold" style={{ background: 'color-mix(in srgb, var(--accent-student) 15%, transparent)', color: 'var(--accent-student)' }}>
                {graded.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-2 mt-4">
          {overdue.length === 0 && upcoming.length === 0 && <EmptyState message="No pending assignments — you're all caught up!" />}
          {overdue.length > 0 && (
            <>
              <SectionDivider label="Overdue" color="#EF4444" count={overdue.length} />
              {overdue.map(a => <AssignmentCard key={a.id} a={a} />)}
            </>
          )}
          {upcoming.length > 0 && (
            <>
              {overdue.length > 0 && <div className="pt-1" />}
              <SectionDivider label="Due upcoming" color="#F59E0B" count={upcoming.length} />
              {upcoming.map(a => <AssignmentCard key={a.id} a={a} />)}
            </>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-2 mt-4">
          {submitted.length === 0
            ? <EmptyState message="No submitted assignments yet" />
            : submitted.map(a => <AssignmentCard key={a.id} a={a} />)
          }
        </TabsContent>

        <TabsContent value="graded" className="space-y-2 mt-4">
          {graded.length === 0
            ? <EmptyState message="No graded assignments yet" />
            : graded.map(a => <AssignmentCard key={a.id} a={a} />)
          }
        </TabsContent>
      </Tabs>
    </div>
  )
}
