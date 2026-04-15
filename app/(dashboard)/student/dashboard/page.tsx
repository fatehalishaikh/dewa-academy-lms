'use client'
import { useState, useEffect } from 'react'
import { 
  Sparkles, Clock, BookOpen, BarChart3, Calendar, CheckCircle2, 
  ArrowRight, ChevronRight, LogIn, LogOut, Fingerprint, TrendingUp,
  Bell, Zap, Target, Trophy, Play, ArrowUpRight, GraduationCap, 
  Flame, Star, BookMarked, MessageSquare
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
  { id: 'hw-001', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', due: 'Tomorrow', points: 20, color: '#2878C1', progress: 60 },
  { id: 'hw-002', title: "Newton's Laws Lab Report", subject: 'Physics', due: 'In 2 days', points: 30, color: '#004937', progress: 25 },
  { id: 'hw-003', title: 'Essay: Technology in Society', subject: 'English', due: 'In 4 days', points: 25, color: '#007560', progress: 0 },
]

const recentGrades = [
  { title: 'Chapter 4 Quiz', subject: 'Mathematics', grade: 92, maxGrade: 100, trend: '+5', color: '#2878C1' },
  { title: 'Midterm Exam', subject: 'Physics', grade: 78, maxGrade: 100, trend: '-2', color: '#004937' },
  { title: 'Reading Comprehension', subject: 'English', grade: 88, maxGrade: 100, trend: '+8', color: '#007560' },
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

function gradeBg(g: number) {
  if (g >= 90) return 'from-success/20 to-success/5'
  if (g >= 75) return 'from-warning/20 to-warning/5'
  return 'from-destructive/20 to-destructive/5'
}

export default function StudentDashboard() {
  const student = useCurrentStudent()
  const router = useRouter()
  const classes = student ? getClassesByStudent(student.id) : []
  const [clockedIn, setClockedIn] = useState(false)
  const [clockTime, setClockTime] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  const semesterWeek = 10
  const totalWeeks = 16
  const semesterProgress = Math.round((semesterWeek / totalWeeks) * 100)
  const streak = 12

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-variant p-6 md:p-8 lg:p-10">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-variant/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-warning/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left: Welcome & Time */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    <Flame className="w-3 h-3 mr-1" />
                    {streak} day streak
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    Week {semesterWeek}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                  {getGreeting()}, {student?.name.split(' ')[0] ?? 'Student'}
                </h1>
                <p className="text-white/80 text-lg">{today}</p>
                
                <div className="flex items-center gap-6 mt-6">
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                      {currentTime.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-white/60 mt-1">Current Time</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${clockedIn ? 'bg-success animate-pulse' : 'bg-white/40'}`} />
                      <span className="text-white font-medium">
                        {clockedIn ? `Checked in at ${clockTime}` : 'Not checked in'}
                      </span>
                    </div>
                    <Button 
                      onClick={handleClock}
                      variant={clockedIn ? "secondary" : "default"}
                      className={`mt-2 gap-2 ${
                        clockedIn 
                          ? 'bg-white/20 hover:bg-white/30 text-white border-0' 
                          : 'bg-white text-primary hover:bg-white/90'
                      }`}
                    >
                      {clockedIn ? <><LogOut className="w-4 h-4" />Clock Out</> : <><LogIn className="w-4 h-4" />Clock In</>}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right: Quick Stats */}
              <div className="grid grid-cols-2 gap-4 lg:w-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-warning" />
                    <span className="text-sm text-white/70">GPA</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{student?.gpa.toFixed(1) ?? '--'}</p>
                  <div className="flex items-center gap-1 mt-1 text-success text-sm">
                    <TrendingUp className="w-3 h-3" />
                    <span>+0.2</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm text-white/70">Attendance</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{student?.attendanceRate ?? 0}%</p>
                  <p className="text-white/50 text-sm mt-1">This term</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-warning" />
                    <span className="text-sm text-white/70">Due Soon</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{upcomingAssignments.length}</p>
                  <p className="text-white/50 text-sm mt-1">Assignments</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-info" />
                    <span className="text-sm text-white/70">Today</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{todayClasses.length}</p>
                  <p className="text-white/50 text-sm mt-1">Classes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          
          {/* Today's Schedule */}
          <Card className="col-span-12 lg:col-span-4 border-0 shadow-lg shadow-primary/5 bg-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-info via-info/80 to-info/50" />
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-info to-info/70 flex items-center justify-center shadow-lg shadow-info/25">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Today&apos;s Classes</h3>
                    <p className="text-xs text-muted-foreground">{todayClasses.length} scheduled</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 text-info" onClick={() => router.push('/student/schedule')}>
                  All <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {todayClasses.length === 0 ? (
                  <div className="text-center py-10 bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl border border-dashed border-border">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No classes today</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Enjoy your free time!</p>
                  </div>
                ) : (
                  todayClasses.slice(0, 5).map((cls, idx) => (
                    <div 
                      key={cls.id + cls.slot.time} 
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        idx === 0 ? 'bg-gradient-to-r from-info/10 to-transparent border border-info/20' : 'hover:bg-accent'
                      }`}
                    >
                      <div className={`text-center shrink-0 ${idx === 0 ? 'text-info' : 'text-muted-foreground'}`}>
                        <p className="text-sm font-bold">{cls.slot.time.split('–')[0]}</p>
                      </div>
                      <div className={`w-1 h-10 rounded-full ${idx === 0 ? 'bg-info' : 'bg-border'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${idx === 0 ? 'text-info' : 'text-foreground'}`}>{cls.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{cls.slot.room}</p>
                      </div>
                      {idx === 0 && (
                        <Badge className="bg-info text-white text-[10px] shrink-0">NOW</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="col-span-12 lg:col-span-8 border-0 shadow-lg shadow-primary/5 bg-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-warning via-warning/80 to-warning/50" />
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center shadow-lg shadow-warning/25">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Upcoming Assignments</h3>
                    <p className="text-xs text-muted-foreground">{upcomingAssignments.length} pending tasks</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 text-warning" onClick={() => router.push('/student/assignments')}>
                  All <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {upcomingAssignments.map((a, idx) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-accent/80 to-accent/30 hover:from-accent hover:to-accent/50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-border"
                    onClick={() => router.push(`/student/assignments/${a.id}`)}
                  >
                    <div 
                      className="w-2 h-14 rounded-full shrink-0" 
                      style={{ backgroundColor: a.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {a.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span style={{ color: a.color }} className="font-medium">{a.subject}</span>
                        <span>&middot;</span>
                        <span>{a.points} pts</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{a.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${a.progress}%`, backgroundColor: a.color }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          a.due === 'Tomorrow' 
                            ? 'border-destructive/40 text-destructive bg-destructive/5' 
                            : 'border-warning/40 text-warning bg-warning/5'
                        }`}
                      >
                        {a.due}
                      </Badge>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'AI Tutor', icon: Sparkles, href: '/student/ai-tutor', gradient: 'from-primary to-primary-variant', description: 'Get instant help' },
              { label: 'My Grades', icon: BarChart3, href: '/student/grades', gradient: 'from-warning to-warning/70', description: 'View performance' },
              { label: 'Messages', icon: MessageSquare, href: '/student/communication', gradient: 'from-info to-info/70', description: `${inboxItems.length} unread` },
              { label: 'My Plan', icon: Target, href: '/student/my-plan', gradient: 'from-success to-success/70', description: 'Learning goals' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl p-5 bg-card border border-border hover:border-transparent hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10 flex flex-col">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-base font-bold text-foreground group-hover:text-white transition-colors">{action.label}</p>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">{action.description}</p>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>

          {/* Recent Grades */}
          <Card className="col-span-12 border-0 shadow-lg shadow-primary/5 bg-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center shadow-lg shadow-primary/25">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Recent Grades</h3>
                    <p className="text-xs text-muted-foreground">Your latest achievements</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 text-primary" onClick={() => router.push('/student/grades')}>
                  All <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentGrades.map((g) => (
                  <div 
                    key={g.title} 
                    className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${gradeBg(g.grade)} border border-border/50 hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${g.color}20` }}
                      >
                        <BookMarked className="w-5 h-5" style={{ color: g.color }} />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        g.trend.startsWith('+') 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${g.trend.startsWith('-') ? 'rotate-180' : ''}`} />
                        {g.trend}
                      </div>
                    </div>
                    <p className="text-xs font-medium mb-1" style={{ color: g.color }}>{g.subject}</p>
                    <p className="text-sm font-semibold text-foreground mb-4 truncate">{g.title}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={`text-4xl font-bold ${gradeColor(g.grade)}`}>{g.grade}</span>
                        <span className="text-lg text-muted-foreground">/{g.maxGrade}</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= Math.floor(g.grade / 20) 
                                ? 'fill-warning text-warning' 
                                : 'text-muted-foreground/30'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Semester Progress */}
          <Card className="col-span-12 border-0 shadow-lg shadow-primary/5 bg-gradient-to-br from-card to-accent/20 overflow-hidden">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center shadow-lg shadow-warning/25">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Semester Progress</h3>
                    <p className="text-sm text-muted-foreground">Week {semesterWeek} of {totalWeeks} &middot; {semesterProgress}% complete</p>
                  </div>
                </div>
                <div className="flex-1 max-w-md">
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-warning rounded-full transition-all duration-1000"
                      style={{ width: `${semesterProgress}%` }}
                    />
                    <div 
                      className="absolute inset-y-0 bg-white/30 w-2 rounded-full animate-pulse"
                      style={{ left: `${semesterProgress - 2}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Start</span>
                    <span className="font-medium text-primary">You are here</span>
                    <span>Finals</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
