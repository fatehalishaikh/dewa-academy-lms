'use client'
import { Sparkles, BookOpen, Users, ClipboardList, BarChart3, Clock, ArrowRight, CheckCircle2, AlertCircle, LayoutDashboard, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu'

const pendingSubmissions = [
  { student: 'Ahmed Al-Rashid', initials: 'AR', assignment: 'Quadratic Equations Set', class: 'Grade 10A', submitted: '2h ago', color: '#00B8A9' },
  { student: 'Sara Al-Marzouqi', initials: 'SM', assignment: 'Statistics Report', class: 'Grade 9B', submitted: '5h ago', color: '#0EA5E9' },
  { student: 'Yousef Mahmoud', initials: 'YM', assignment: 'Quadratic Equations Set', class: 'Grade 10A', submitted: 'Yesterday', color: '#F59E0B' },
  { student: 'Reem Al-Khoury', initials: 'RK', assignment: 'Statistics Report', class: 'Grade 9B', submitted: 'Yesterday', color: '#8B5CF6' },
]

const upcomingLessons = [
  { title: 'Introduction to Calculus', class: 'Grade 10A', date: 'Tomorrow', topic: 'Limits & Continuity' },
  { title: 'Probability & Statistics', class: 'Grade 9B', date: 'Thu', topic: 'Bayes Theorem' },
  { title: 'Algebra Review', class: 'Grade 10A', date: 'Fri', topic: 'Polynomials' },
]

export default function TeacherDashboard() {
  const teacher = useCurrentTeacher()
  const router = useRouter()
  const classes = teacher ? getClassesByTeacher(teacher.id) : []

  const todayDayIndex = new Date().getDay()
  const todayKey = DAYS[todayDayIndex] as Day
  const isWeekend = todayDayIndex === 5 || todayDayIndex === 6
  const effectiveDay: Day = isWeekend ? 'Sun' : todayKey

  const todayClasses = classes
    .flatMap(c =>
      c.schedule
        .filter(s => s.day === effectiveDay)
        .map(s => ({ ...c, slot: s }))
    )
    .sort((a, b) => a.slot.time.localeCompare(b.slot.time))

  const totalStudents = classes.reduce((acc, c) => acc + c.studentIds.length, 0)
  const avgScore = classes.length
    ? Math.round(classes.reduce((acc, c) => acc + c.averageGrade, 0) / classes.length)
    : 0

  const today = new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const inboxItems = getDashboardInbox('teacher', teacher?.id ?? '')

  return (
    <div className="p-6 space-y-6">
      {/* Hero: greeting + inbox */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2 p-4 lg:border-r border-border">
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Teacher Dashboard</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{greeting}, {teacher?.name.split(' ').slice(1, 2)[0] ?? 'Teacher'} 👋</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
            <Button size="sm" variant="outline" onClick={() => router.push('/teacher/homework')} className="mt-3 gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              Grade Submissions
            </Button>
          </div>
          <div className="lg:col-span-3 p-4 flex flex-col justify-center">
            {inboxItems.length === 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">All caught up</p>
                  <p className="text-xs text-muted-foreground">Nothing needs your attention right now.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-amber-400">{inboxItems.length}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {inboxItems.length === 1 ? '1 thing needs' : `${inboxItems.length} things need`} your attention
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {inboxItems.filter(i => i.urgency === 'high').length > 0 && (
                      <span className="text-amber-400 font-medium">{inboxItems.filter(i => i.urgency === 'high').length} urgent</span>
                    )}
                    {inboxItems.filter(i => i.urgency === 'high').length > 0 && inboxItems.filter(i => i.urgency !== 'high').length > 0 && ' · '}
                    {inboxItems.filter(i => i.urgency !== 'high').length > 0 && (
                      <span>{inboxItems.filter(i => i.urgency !== 'high').length} follow-up</span>
                    )}
                  </p>
                  <Link
                    href="/action-center"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    Open Action Center <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Classes', value: classes.length.toString(), sub: 'active this term', icon: BookOpen, color: '#00B8A9' },
          { label: 'Total Students', value: totalStudents.toString(), sub: 'across all classes', icon: Users, color: '#0EA5E9' },
          { label: 'Pending Grading', value: '7', sub: 'submissions awaiting', icon: ClipboardList, color: '#F59E0B' },
          { label: 'Avg Class Score', value: `${avgScore}%`, sub: 'across all classes', icon: BarChart3, color: '#10B981' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content grid */}
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
            {todayClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
                <div className="w-1 h-10 rounded-full bg-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{cls.name}</p>
                  <p className="text-[10px] text-muted-foreground">{cls.slot.time} · {cls.slot.room}</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-[10px] shrink-0">{cls.studentIds.length} students</Badge>
              </div>
            ))}
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
            {classes.map(cls => {
              const scoreColor = cls.averageGrade >= 80 ? '#10B981' : cls.averageGrade >= 65 ? '#F59E0B' : '#EF4444'
              const attColor = cls.attendanceRate >= 90 ? '#10B981' : cls.attendanceRate >= 75 ? '#F59E0B' : '#EF4444'
              return (
                <div key={cls.id} className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{cls.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cls.studentIds.length} students</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Avg Score</p>
                      <p className="text-xs font-semibold" style={{ color: scoreColor }}>{cls.averageGrade}%</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Attendance</p>
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

        {/* Recent Submissions */}
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
            {pendingSubmissions.map((sub, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: sub.color }}
                >
                  {sub.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{sub.student}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{sub.assignment} · {sub.class}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{sub.submitted}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Lessons */}
        <Card className="rounded-2xl border-border lg:col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Upcoming Lessons
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/curriculum')}>
                Planner <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {upcomingLessons.map((lesson, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-muted/40 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground truncate">{lesson.title}</p>
                  <Badge variant="outline" className="text-[10px] shrink-0">{lesson.date}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{lesson.class} · {lesson.topic}</p>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
