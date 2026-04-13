'use client'
import { useState } from 'react'
import { Sparkles, Clock, BookOpen, BarChart3, Calendar, CheckCircle2, ArrowRight, LayoutDashboard, ChevronRight, LogIn, LogOut, Fingerprint } from 'lucide-react'
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
  if (g >= 90) return 'text-emerald-400'
  if (g >= 75) return 'text-amber-400'
  return 'text-red-400'
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
    <div className="p-6 space-y-6">
      {/* Hero: greeting + inbox */}
      <Card className="rounded-[10px] border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2 px-4 py-2 lg:border-r border-border">
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Student Dashboard</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {student?.name.split(' ')[0] ?? 'Student'} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
            <Button size="sm" onClick={() => router.push('/student/ai-tutor')} className="mt-3 gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Tutor
            </Button>
          </div>
          <div className="lg:col-span-3 px-4 py-2 flex flex-col justify-center">
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
                <div className="w-14 h-14 rounded-[10px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
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
          { label: 'Current GPA', value: student?.gpa.toFixed(1) ?? '—', sub: 'out of 4.0', icon: BarChart3, color: '#00B8A9' },
          { label: 'Attendance', value: `${student?.attendanceRate ?? 0}%`, sub: 'this semester', icon: CheckCircle2, color: '#10B981' },
          { label: 'Due Soon', value: upcomingAssignments.length.toString(), sub: 'assignments', icon: Clock, color: '#F59E0B' },
          { label: 'Today\'s Classes', value: todayClasses.length.toString(), sub: 'sessions scheduled', icon: Calendar, color: '#0EA5E9' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="rounded-[10px] border-border">
            <CardContent className="px-4 py-2">
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

      {/* Clock In / Out — primary action */}
      <Card className={`rounded-[10px] border-2 transition-colors ${clockedIn ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-primary/30 bg-primary/5'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${clockedIn ? 'bg-emerald-500/20' : 'bg-primary/10'}`}>
                <Fingerprint className={`w-5 h-5 ${clockedIn ? 'text-emerald-400' : 'text-primary'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">Today&apos;s Check-In</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground/30'}`} />
                    <span className={`text-xs font-medium ${clockedIn ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                      {clockedIn ? `Checked in at ${clockTime}` : 'Not checked in'}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {clockedIn ? 'Your attendance has been recorded for today.' : 'Tap to record your arrival for today.'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleClock}
              size="sm"
              variant={clockedIn ? 'outline' : 'default'}
              className={`shrink-0 gap-1.5 ${clockedIn ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : ''}`}
            >
              {clockedIn
                ? <><LogOut className="w-3.5 h-3.5" />Clock Out</>
                : <><LogIn className="w-3.5 h-3.5" />Clock In</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <Card className="rounded-[10px] border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayClasses.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No classes today</p>
            ) : (
              todayClasses.map((cls) => (
                <div key={cls.id + cls.slot.time} className="flex items-start gap-3 p-2.5 rounded-[10px] bg-card border border-border">
                  <div className="text-center shrink-0">
                    <p className="text-[10px] font-bold text-primary">{cls.slot.time.split('–')[0]}</p>
                    <p className="text-[9px] text-muted-foreground">{cls.slot.room}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{cls.subject}</p>
                    <p className="text-[10px] text-muted-foreground">{cls.slot.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="rounded-[10px] border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Upcoming Assignments
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => router.push('/student/assignments')}>
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-[10px] bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/student/assignments/${a.id}`)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.subject} · {a.points} pts</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="outline" className="text-[9px] h-4 border-amber-500/30 text-amber-400">
                    {a.due}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card className="rounded-[10px] border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Recent Grades
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => router.push('/student/grades')}>
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentGrades.map((g) => (
              <div key={g.title} className="p-3 rounded-[10px] bg-card border border-border">
                <div className="flex items-start justify-between mb-1.5">
                  <Badge variant="outline" className="text-[9px] h-4">{g.subject}</Badge>
                  <span className={`text-lg font-bold ${gradeColor(g.grade)}`}>{g.grade}</span>
                </div>
                <p className="text-xs font-medium text-foreground truncate">{g.title}</p>
                <p className="text-[10px] text-muted-foreground">{g.points} · {g.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
