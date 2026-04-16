'use client'
import { Sparkles, BookOpen, Users, ClipboardList, BarChart3, Clock, ArrowRight, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'
import { useSubjectStore } from '@/stores/subject-store'
import { useHomeworkStore } from '@/stores/homework-store'
import { subjectColor } from '@/lib/subject-colors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu'

function RingProgress({ value, max, color, size = 80 }: { value: number; max: number; color: string; size?: number }) {
  const sw = 5
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - Math.min(value / max, 1) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  )
}

export default function TeacherDashboard() {
  const teacher = useCurrentTeacher()
  const router = useRouter()
  const allClasses = teacher ? getClassesByTeacher(teacher.id) : []
  const { activeSubject } = useSubjectStore()
  const { homework, getSubmissionsForHomework } = useHomeworkStore()

  const todayDayIndex = new Date().getDay()
  const todayKey = DAYS[todayDayIndex] as Day
  const isWeekend = todayDayIndex === 5 || todayDayIndex === 6
  const effectiveDay: Day = isWeekend ? 'Sun' : todayKey

  // Filter classes by active subject
  const classes = activeSubject === 'all'
    ? allClasses
    : allClasses.filter(c => c.subject === activeSubject)

  const todayClasses = classes
    .flatMap(c =>
      c.schedule
        .filter(s => s.day === effectiveDay)
        .map(s => ({ ...c, slot: s }))
    )
    .sort((a, b) => a.slot.time.localeCompare(b.slot.time))

  const totalStudents = new Set(classes.flatMap(c => c.studentIds)).size
  const avgScore = classes.length
    ? Math.round(classes.reduce((acc, c) => acc + c.averageGrade, 0) / classes.length)
    : 0

  // Pending grading count (filtered by subject)
  const teacherHomework = homework.filter(h =>
    h.teacherId === teacher?.id &&
    (activeSubject === 'all' || h.subject === activeSubject)
  )
  const pendingGrading = teacherHomework.reduce((sum, hw) => {
    const subs = getSubmissionsForHomework(hw.id)
    return sum + subs.filter(s => s.status === 'submitted' || s.status === 'late').length
  }, 0)

  // Per-subject summary (for "all" view)
  const subjects = teacher?.subjects ?? []
  const subjectStats = subjects.map(subject => {
    const subClasses = allClasses.filter(c => c.subject === subject)
    const subStudents = new Set(subClasses.flatMap(c => c.studentIds)).size
    const subAvg = subClasses.length
      ? Math.round(subClasses.reduce((a, c) => a + c.averageGrade, 0) / subClasses.length)
      : 0
    const subHw = homework.filter(h => h.teacherId === teacher?.id && h.subject === subject && h.status === 'published')
    const subPending = subHw.reduce((sum, hw) => {
      const subs = getSubmissionsForHomework(hw.id)
      return sum + subs.filter(s => s.status === 'submitted' || s.status === 'late').length
    }, 0)
    const nextDue = subHw
      .filter(h => new Date(h.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
    return { subject, subClasses, subStudents, subAvg, subPending, nextDue }
  })

  const today = new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const inboxItems = getDashboardInbox('teacher', teacher?.id ?? '')

  return (
    <div className="p-6 space-y-6">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-3 p-7 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 shrink-0 ring-2 ring-white/20 ring-offset-0">
                <AvatarFallback
                  className="text-base font-bold text-white"
                  style={{ background: teacher?.avatarColor ?? 'var(--accent-teacher)' }}
                >
                  {teacher?.initials ?? 'T'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Good {timeOfDay}</p>
                <h1 className="text-2xl font-bold text-white mt-0.5">
                  {teacher?.name.split(' ').slice(1, 2)[0] ?? 'Teacher'} 👋
                </h1>
                <p className="text-white/40 text-sm mt-0.5">{today}</p>
              </div>
            </div>

            <div className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 border transition-all ${
              inboxItems.length > 0
                ? 'bg-amber-500/15 border-amber-500/30'
                : 'bg-white/[0.05] border-white/10'
            }`}>
              {inboxItems.length === 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/25 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">All caught up</p>
                    <p className="text-xs text-white/40">Nothing needs your attention right now.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/25 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {inboxItems.length === 1 ? '1 thing needs' : `${inboxItems.length} things need`} your attention
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {inboxItems.filter(i => i.urgency === 'high').length > 0 && (
                          <span className="text-amber-300 font-medium">{inboxItems.filter(i => i.urgency === 'high').length} urgent · </span>
                        )}
                        {inboxItems.filter(i => i.urgency !== 'high').length > 0 && (
                          <span>{inboxItems.filter(i => i.urgency !== 'high').length} follow-up</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/action-center"
                    className="inline-flex items-center gap-1 text-xs text-amber-300/90 hover:text-amber-200 transition-colors shrink-0"
                  >
                    Open <ChevronRight className="w-3 h-3" />
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push('/teacher/homework')}
                className="gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/18 text-xs"
              >
                <ClipboardList className="w-3.5 h-3.5 text-amber-300" />
                Grade Submissions
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push('/teacher/homework/create')}
                className="gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/18 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-teacher)' }} />
                New Assignment
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={avgScore} max={100} color="var(--accent-teacher)" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{avgScore}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Avg Score</p>
                <p className="text-[11px] text-white/35">{activeSubject === 'all' ? 'all classes' : activeSubject}</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,184,169,0.12)', border: '5px solid rgba(0,184,169,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{totalStudents}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Students</p>
                <p className="text-[11px] text-white/35">{activeSubject === 'all' ? 'all subjects' : activeSubject}</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.12)', border: '5px solid rgba(14,165,233,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{todayClasses.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Classes</p>
                <p className="text-[11px] text-white/35">today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Classes', value: classes.length.toString(), sub: activeSubject === 'all' ? 'active this term' : activeSubject, icon: BookOpen, color: '#00B8A9' },
          { label: 'Students', value: totalStudents.toString(), sub: activeSubject === 'all' ? 'across all classes' : 'in this subject', icon: Users, color: '#0EA5E9' },
          { label: 'Pending Grading', value: pendingGrading.toString(), sub: 'submissions awaiting', icon: ClipboardList, color: '#F59E0B' },
          { label: 'Avg Class Score', value: `${avgScore}%`, sub: activeSubject === 'all' ? 'across all classes' : activeSubject, icon: BarChart3, color: '#10B981' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0">
            <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
            <CardContent className="p-4 pt-3">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] font-semibold mt-1" style={{ color }}>{sub}</p>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── PER-SUBJECT BREAKDOWN (only when "All" is selected and teacher has multiple subjects) ── */}
      {activeSubject === 'all' && subjects.length > 1 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">By Subject</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjectStats.map(({ subject, subClasses, subStudents, subAvg, subPending, nextDue }) => {
              const color = subjectColor(subject)
              return (
                <Card key={subject} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0 cursor-pointer"
                  onClick={() => router.push('/teacher/classes')}>
                  <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">{subject}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{subClasses.length} class{subClasses.length !== 1 ? 'es' : ''} · {subStudents} student{subStudents !== 1 ? 's' : ''}</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${color}18` }}
                      >
                        <BarChart3 className="w-4 h-4" style={{ color }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[11px] text-muted-foreground">Avg Grade</p>
                        <p className={`text-sm font-bold ${subAvg >= 80 ? 'text-emerald-400' : subAvg >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
                          {subAvg}%
                        </p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">Pending</p>
                        <p className={`text-sm font-bold ${subPending > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {subPending} to grade
                        </p>
                      </div>
                      {nextDue && (
                        <>
                          <div className="w-px h-8 bg-border" />
                          <div>
                            <p className="text-[11px] text-muted-foreground">Next due</p>
                            <p className="text-sm font-bold text-foreground">
                              {new Date(nextDue.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ── CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Today's Schedule */}
        <Card className="rounded-2xl border-border lg:col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Today's Schedule
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/class-activities')}>
                Full timetable <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {todayClasses.length === 0 && (
              <p className="text-xs text-muted-foreground py-2">No classes scheduled today.</p>
            )}
            {todayClasses.map((cls, i) => {
              const color = subjectColor(cls.subject)
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ background: color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{cls.name}</p>
                    <p className="text-[11px] text-muted-foreground">{cls.slot.time} · {cls.slot.room}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-[11px] shrink-0">{cls.studentIds.length} students</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card className="rounded-2xl border-border lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Class Performance
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/teacher/gradebook')}>
                Full gradebook <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {classes.slice(0, 6).map(cls => {
              const scoreColor = cls.averageGrade >= 80 ? '#10B981' : cls.averageGrade >= 65 ? '#F59E0B' : '#EF4444'
              const attColor = cls.attendanceRate >= 90 ? '#10B981' : cls.attendanceRate >= 75 ? '#F59E0B' : '#EF4444'
              const color = subjectColor(cls.subject)
              return (
                <div key={cls.id} className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <p className="text-xs font-medium text-foreground truncate">{cls.name}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground pl-3.5">{cls.studentIds.length} students</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[11px] text-muted-foreground">Avg Score</p>
                      <p className="text-xs font-semibold" style={{ color: scoreColor }}>{cls.averageGrade}%</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-right">
                      <p className="text-[11px] text-muted-foreground">Attendance</p>
                      <p className="text-xs font-semibold" style={{ color: attColor }}>{cls.attendanceRate}%</p>
                    </div>
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cls.attendanceRate}%`, background: attColor }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Homework needing grading */}
        <Card className="rounded-2xl border-border lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Needs Grading
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/teacher/homework')}>
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {(() => {
              const pendingItems = teacherHomework.flatMap(hw => {
                const subs = getSubmissionsForHomework(hw.id)
                return subs
                  .filter(s => s.status === 'submitted' || s.status === 'late')
                  .slice(0, 2)
                  .map(s => ({ hw, sub: s }))
              }).slice(0, 4)

              if (pendingItems.length === 0) {
                return (
                  <div className="flex items-center gap-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs text-muted-foreground">All submissions graded.</p>
                  </div>
                )
              }

              return pendingItems.map(({ hw, sub }, i) => {
                const color = subjectColor(hw.subject)
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => router.push(`/teacher/homework/${hw.id}`)}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: color }}>
                      {hw.subject.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{hw.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">Student {sub.studentId} · {hw.subject}</p>
                    </div>
                    <Badge variant="outline" className={`text-[11px] shrink-0 ${sub.status === 'late' ? 'border-amber-500/30 text-amber-400' : 'border-blue-500/30 text-blue-400'}`}>
                      {sub.status === 'late' ? 'Late' : 'Submitted'}
                    </Badge>
                  </div>
                )
              })
            })()}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card className="rounded-2xl border-border lg:col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/teacher/homework')}>
                All <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {teacherHomework
              .filter(h => h.status === 'published' && new Date(h.dueDate) >= new Date())
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 3)
              .map((hw, i) => {
                const color = subjectColor(hw.subject)
                return (
                  <div key={i} className="p-2.5 rounded-xl bg-muted/40 space-y-1 cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => router.push(`/teacher/homework/${hw.id}`)}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                        <p className="text-xs font-medium text-foreground truncate">{hw.title}</p>
                      </div>
                      <Badge variant="outline" className="text-[11px] shrink-0">
                        {new Date(hw.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground pl-3.5">{hw.subject}</p>
                  </div>
                )
              })}
            {teacherHomework.filter(h => h.status === 'published' && new Date(h.dueDate) >= new Date()).length === 0 && (
              <p className="text-xs text-muted-foreground py-2">No upcoming deadlines.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
