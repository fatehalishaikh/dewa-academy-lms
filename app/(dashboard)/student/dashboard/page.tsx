'use client'
import { useState } from 'react'
import { 
  Sparkles, Clock, BookOpen, BarChart3, Calendar, CheckCircle2, 
  ArrowRight, ChevronRight, LogIn, LogOut, Fingerprint, TrendingUp,
  Bell, Zap, Target, Trophy, Play, ArrowUpRight, GraduationCap
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCurrentStudent } from '@/stores/role-store'
import { getClassesByStudent } from '@/data/mock-classes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const todayDay = DAYS[new Date().getDay() === 5 || new Date().getDay() === 6 ? 0 : new Date().getDay() === 0 ? 0 : new Date().getDay()]

const upcomingAssignments = [
  { id: 'hw-001', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', due: 'Tomorrow', dueDate: 'Mar 27', status: 'pending', points: 20, color: '#2878C1' },
  { id: 'hw-002', title: "Newton's Laws Lab Report", subject: 'Physics', due: 'Mar 28', dueDate: 'Mar 28', status: 'pending', points: 30, color: '#004937' },
  { id: 'hw-003', title: 'Essay: Technology in Society', subject: 'English', due: 'Mar 30', dueDate: 'Mar 30', status: 'in-progress', points: 25, color: '#007560' },
]

const recentGrades = [
  { title: 'Chapter 4 Quiz', subject: 'Mathematics', grade: 92, maxGrade: 100, date: 'Mar 20' },
  { title: 'Midterm Exam', subject: 'Physics', grade: 78, maxGrade: 100, date: 'Mar 18' },
  { title: 'Reading Comp.', subject: 'English', grade: 88, maxGrade: 100, date: 'Mar 15' },
]

const quickActions = [
  { label: 'AI Tutor', icon: Sparkles, href: '/student/ai-tutor', color: 'bg-primary', description: 'Get instant help' },
  { label: 'Schedule', icon: Calendar, href: '/student/schedule', color: 'bg-info', description: 'View classes' },
  { label: 'Grades', icon: BarChart3, href: '/student/grades', color: 'bg-warning', description: 'Check progress' },
  { label: 'My Plan', icon: Target, href: '/student/my-plan', color: 'bg-primary-variant', description: 'Learning goals' },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function gradeColor(g: number) {
  if (g >= 90) return 'text-success'
  if (g >= 75) return 'text-warning'
  return 'text-destructive'
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

  const semesterProgress = 65

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{today}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-balance">
                {getGreeting()}, {student?.name.split(' ')[0] ?? 'Student'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {inboxItems.length > 0 && (
                <Link
                  href="/action-center"
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span>{inboxItems.length} actions</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                </Link>
              )}
              <Button onClick={() => router.push('/student/ai-tutor')} className="gap-2 rounded-xl h-10">
                <Sparkles className="w-4 h-4" />
                AI Tutor
              </Button>
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-5">
          
          {/* Check-in Card - Spans 8 cols on desktop */}
          <Card className={`col-span-12 lg:col-span-8 border-2 transition-all duration-300 ${
            clockedIn ? 'border-success/40 bg-success/5' : 'border-border'
          }`}>
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    clockedIn ? 'bg-success/20' : 'bg-primary/10'
                  }`}>
                    <Fingerprint className={`w-7 h-7 ${clockedIn ? 'text-success' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Today&apos;s Check-In</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${clockedIn ? 'bg-success animate-pulse' : 'bg-muted-foreground/30'}`} />
                      <span className={`text-sm ${clockedIn ? 'text-success font-medium' : 'text-muted-foreground'}`}>
                        {clockedIn ? `Checked in at ${clockTime}` : 'Not checked in yet'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleClock}
                  size="lg"
                  variant={clockedIn ? 'outline' : 'default'}
                  className={`shrink-0 gap-2 rounded-xl min-w-[140px] ${
                    clockedIn ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : ''
                  }`}
                >
                  {clockedIn
                    ? <><LogOut className="w-4 h-4" />Clock Out</>
                    : <><LogIn className="w-4 h-4" />Clock In</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Semester Progress - Spans 4 cols */}
          <Card className="col-span-12 sm:col-span-6 lg:col-span-4 border-border">
            <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Semester Progress</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{semesterProgress}%</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-warning" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={semesterProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Week 10 of 16</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Row - 4 cards */}
          {[
            { label: 'GPA', value: student?.gpa.toFixed(1) ?? '--', sub: 'of 4.0', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10', trend: '+0.2' },
            { label: 'Attendance', value: `${student?.attendanceRate ?? 0}%`, sub: 'this term', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', trend: null },
            { label: 'Due Soon', value: upcomingAssignments.length.toString(), sub: 'assignments', icon: Clock, color: 'text-warning', bg: 'bg-warning/10', trend: null },
            { label: 'Classes Today', value: todayClasses.length.toString(), sub: 'sessions', icon: Calendar, color: 'text-info', bg: 'bg-info/10', trend: null },
          ].map(({ label, value, sub, icon: Icon, color, bg, trend }, i) => (
            <Card key={label} className="col-span-6 sm:col-span-3 border-border hover:border-border/80 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  {trend && (
                    <div className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      {trend}
                    </div>
                  )}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label} <span className="text-muted-foreground/60">{sub}</span></p>
              </CardContent>
            </Card>
          ))}

          {/* Today's Schedule - 5 cols */}
          <Card className="col-span-12 lg:col-span-5 border-border">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Today&apos;s Schedule</h3>
                    <p className="text-xs text-muted-foreground">{todayClasses.length} classes</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8" onClick={() => router.push('/student/schedule')}>
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {todayClasses.length === 0 ? (
                  <div className="text-center py-8 bg-accent/30 rounded-xl">
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No classes scheduled today</p>
                  </div>
                ) : (
                  todayClasses.slice(0, 4).map((cls, idx) => (
                    <div 
                      key={cls.id + cls.slot.time} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-accent/40 hover:bg-accent transition-colors group cursor-pointer"
                    >
                      <div className="w-12 text-center shrink-0">
                        <p className="text-xs font-bold text-info">{cls.slot.time.split('–')[0]}</p>
                        <p className="text-[10px] text-muted-foreground">{cls.slot.room}</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{cls.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{cls.slot.time}</p>
                      </div>
                      <Play className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignments - 7 cols */}
          <Card className="col-span-12 lg:col-span-7 border-border">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Upcoming Assignments</h3>
                    <p className="text-xs text-muted-foreground">{upcomingAssignments.length} pending</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8" onClick={() => router.push('/student/assignments')}>
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {upcomingAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-accent/40 hover:bg-accent transition-colors cursor-pointer group"
                    onClick={() => router.push(`/student/assignments/${a.id}`)}
                  >
                    <div 
                      className="w-1.5 h-12 rounded-full shrink-0" 
                      style={{ backgroundColor: a.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.subject} &middot; {a.points} pts</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-warning/40 text-warning bg-warning/5 shrink-0"
                    >
                      {a.due}
                    </Badge>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Full width */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color}/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <action.icon className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Grades */}
          <Card className="col-span-12 border-border">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Recent Grades</h3>
                    <p className="text-xs text-muted-foreground">Your latest results</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8" onClick={() => router.push('/student/grades')}>
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentGrades.map((g) => (
                  <div key={g.title} className="p-4 rounded-xl bg-accent/40 hover:bg-accent transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs">{g.subject}</Badge>
                      <span className="text-xs text-muted-foreground">{g.date}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-3 truncate">{g.title}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={`text-2xl font-bold ${gradeColor(g.grade)}`}>{g.grade}</span>
                        <span className="text-sm text-muted-foreground">/{g.maxGrade}</span>
                      </div>
                      <div className="w-16">
                        <Progress 
                          value={g.grade} 
                          className="h-1.5" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
