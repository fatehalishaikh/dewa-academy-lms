'use client'
import { useState } from 'react'
import { Sparkles, Clock, BookOpen, BarChart3, Calendar, CheckCircle2, ArrowRight, ChevronRight, LogIn, LogOut, Fingerprint, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentStudent } from '@/stores/role-store'
import { getClassesByStudent } from '@/data/mock-classes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const todayDay = DAYS[new Date().getDay() === 5 || new Date().getDay() === 6 ? 0 : new Date().getDay() === 0 ? 0 : new Date().getDay()]

const upcomingAssignments = [
  { id: 'hw-001', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', due: 'Tomorrow', dueDate: 'Mar 27', status: 'pending', points: 20 },
  { id: 'hw-002', title: 'Newton\'s Laws Lab Report', subject: 'Physics', due: 'Mar 28', dueDate: 'Mar 28', status: 'pending', points: 30 },
  { id: 'hw-003', title: 'Essay: Technology in Society', subject: 'English', due: 'Mar 30', dueDate: 'Mar 30', status: 'in-progress', points: 25 },
]

const recentGrades = [
  { title: 'Chapter 4 Quiz', subject: 'Mathematics', grade: 92, points: '23/25', date: 'Mar 20' },
  { title: 'Midterm Exam', subject: 'Physics', grade: 78, points: '78/100', date: 'Mar 18' },
  { title: 'Reading Comprehension', subject: 'English', grade: 88, points: '44/50', date: 'Mar 15' },
]

function gradeColor(g: number) {
  if (g >= 90) return 'text-emerald-500'
  if (g >= 75) return 'text-amber-500'
  return 'text-red-500'
}

function gradeBg(g: number) {
  if (g >= 90) return 'bg-emerald-500/10'
  if (g >= 75) return 'bg-amber-500/10'
  return 'bg-red-500/10'
}

export default function StudentDashboard() {
  const student = useCurrentStudent()
  const router = useRouter()
  const classes = student ? getClassesByStudent(student.id) : []
  const [clockedIn, setClockedIn] = useState(false)
  const [clockTime, setClockTime] = useState<string | null>(null)

  function handleClock() {
    const now = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })
    if (!clockedIn) { setClockedIn(true); setClockTime(now) }
    else { setClockedIn(false); setClockTime(null) }
  }
  const todayClasses = classes.flatMap(c =>
    c.schedule.filter(s => s.day === todayDay).map(s => ({ ...c, slot: s }))
  ).sort((a, b) => a.slot.time.localeCompare(b.slot.time))

  const today = new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })
  const inboxItems = getDashboardInbox('student', student?.id ?? '')

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/10 p-6 md:p-8">
        <div className="relative z-10">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">Student Dashboard</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {student?.name.split(' ')[0] ?? 'Student'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{today}</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button onClick={() => router.push('/student/ai-tutor')} className="gap-2 shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" />
              AI Tutor
            </Button>
            {inboxItems.length > 0 && (
              <Link
                href="/action-center"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-500">{inboxItems.length}</span>
                </span>
                Action Items
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current GPA', value: student?.gpa.toFixed(1) ?? '--', sub: 'out of 4.0', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10', trend: '+0.2' },
          { label: 'Attendance', value: `${student?.attendanceRate ?? 0}%`, sub: 'this semester', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: null },
          { label: 'Due Soon', value: upcomingAssignments.length.toString(), sub: 'assignments', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: null },
          { label: 'Today\'s Classes', value: todayClasses.length.toString(), sub: 'sessions', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: null },
        ].map(({ label, value, sub, icon: Icon, color, bg, trend }) => (
          <Card key={label} className="group relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {trend && (
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clock In/Out Card */}
      <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${clockedIn ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-primary/20 bg-primary/5'}`}>
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${clockedIn ? 'bg-emerald-500/20' : 'bg-primary/10'}`}>
                <Fingerprint className={`w-6 h-6 ${clockedIn ? 'text-emerald-500' : 'text-primary'}`} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-foreground">Today&apos;s Check-In</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                    <span className={`text-sm font-medium ${clockedIn ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {clockedIn ? `Checked in at ${clockTime}` : 'Not checked in'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {clockedIn ? 'Your attendance has been recorded for today.' : 'Tap to record your arrival for today.'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleClock}
              variant={clockedIn ? 'outline' : 'default'}
              className={`shrink-0 gap-2 min-w-[120px] ${clockedIn ? 'border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500' : ''}`}
            >
              {clockedIn
                ? <><LogOut className="w-4 h-4" />Clock Out</>
                : <><LogIn className="w-4 h-4" />Clock In</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No classes today</p>
              </div>
            ) : (
              todayClasses.map((cls) => (
                <div key={cls.id + cls.slot.time} className="flex items-start gap-3 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                  <div className="text-center shrink-0 min-w-[50px]">
                    <p className="text-xs font-bold text-primary">{cls.slot.time.split('–')[0]}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{cls.slot.room}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{cls.subject}</p>
                    <p className="text-xs text-muted-foreground">{cls.slot.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                </div>
                Upcoming Assignments
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-sm h-8 gap-1" onClick={() => router.push('/student/assignments')}>
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors cursor-pointer group"
                onClick={() => router.push(`/student/assignments/${a.id}`)}
              >
                <div className="w-1 h-12 rounded-full bg-amber-500/50 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.subject} &middot; {a.points} pts</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
                    {a.due}
                  </Badge>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              Recent Grades
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-sm h-8 gap-1" onClick={() => router.push('/student/grades')}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentGrades.map((g) => (
              <div key={g.title} className="p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs">{g.subject}</Badge>
                  <div className={`w-12 h-12 rounded-xl ${gradeBg(g.grade)} flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${gradeColor(g.grade)}`}>{g.grade}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{g.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{g.points} &middot; {g.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
