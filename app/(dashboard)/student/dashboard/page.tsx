'use client'
import { useState } from 'react'
import {
  Sparkles, Clock, BookOpen, BarChart3, Calendar, CheckCircle2,
  ArrowRight, ChevronRight, LogIn, LogOut, Fingerprint, TrendingUp, AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCurrentStudent } from '@/stores/role-store'
import { getClassesByStudent } from '@/data/mock-classes'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const todayDay = DAYS[new Date().getDay() === 5 || new Date().getDay() === 6 ? 0 : new Date().getDay() === 0 ? 0 : new Date().getDay()]

const upcomingAssignments = [
  { id: 'hw-001', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', due: 'Tomorrow', dueDate: 'Mar 27', status: 'pending', points: 20, urgency: 'high' },
  { id: 'hw-002', title: "Newton's Laws Lab Report", subject: 'Physics', due: 'Mar 28', dueDate: 'Mar 28', status: 'pending', points: 30, urgency: 'medium' },
  { id: 'hw-003', title: 'Essay: Technology in Society', subject: 'English', due: 'Mar 30', dueDate: 'Mar 30', status: 'in-progress', points: 25, urgency: 'low' },
]

const recentGrades = [
  { title: 'Chapter 4 Quiz', subject: 'Mathematics', grade: 92, points: '23/25', date: 'Mar 20' },
  { title: 'Midterm Exam', subject: 'Physics', grade: 78, points: '78/100', date: 'Mar 18' },
  { title: 'Reading Comprehension', subject: 'English', grade: 88, points: '44/50', date: 'Mar 15' },
]

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#00B8A9',
  Physics: '#0EA5E9',
  English: '#8B5CF6',
  'English Language': '#8B5CF6',
  'Social Studies': '#F59E0B',
}
function subjectColor(s: string) { return SUBJECT_COLORS[s] ?? '#10B981' }

function gradeColor(g: number) {
  if (g >= 90) return '#10B981'
  if (g >= 75) return '#F59E0B'
  return '#EF4444'
}
function gradeLabel(g: number) {
  if (g >= 90) return 'Excellent'
  if (g >= 80) return 'Good'
  if (g >= 75) return 'Average'
  return 'Below avg'
}

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
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const inboxItems = getDashboardInbox('student', student?.id ?? '')
  const gpa = student?.gpa ?? 0
  const attendance = student?.attendanceRate ?? 0

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        {/* Dot-grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left — identity + actions */}
          <div className="lg:col-span-3 p-7 flex flex-col gap-5">
            {/* Identity row */}
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 shrink-0 ring-2 ring-white/20 ring-offset-0">
                <AvatarFallback
                  className="text-base font-bold text-white"
                  style={{ background: student?.avatarColor ?? 'var(--accent-student)' }}
                >
                  {student?.initials ?? 'S'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Good {timeOfDay}</p>
                <h1 className="text-2xl font-bold text-white mt-0.5">
                  {student?.name.split(' ')[0] ?? 'Student'} 👋
                </h1>
                <p className="text-white/40 text-sm mt-0.5">{today}</p>
              </div>
            </div>

            {/* Check-in strip */}
            <div className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 border transition-all ${
              clockedIn
                ? 'bg-emerald-500/15 border-emerald-500/30'
                : 'bg-white/[0.05] border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${clockedIn ? 'bg-emerald-500/25' : 'bg-white/10'}`}>
                  <Fingerprint className={`w-4 h-4 ${clockedIn ? 'text-emerald-400' : 'text-white/50'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Today's Check-In</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${clockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                    <p className={`text-xs ${clockedIn ? 'text-emerald-300' : 'text-white/35'}`}>
                      {clockedIn ? `Checked in at ${clockTime}` : 'Not checked in yet'}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleClock}
                size="sm"
                variant="ghost"
                className={`shrink-0 gap-1.5 text-xs font-medium border transition-all ${
                  clockedIn
                    ? 'bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500/25'
                    : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                }`}
              >
                {clockedIn
                  ? <><LogOut className="w-3 h-3" />Clock Out</>
                  : <><LogIn className="w-3 h-3" />Clock In</>}
              </Button>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push('/student/ai-tutor')}
                className="gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/18 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI Tutor
              </Button>
              {inboxItems.length > 0 && (
                <Link
                  href="/action-center"
                  className="flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {inboxItems.length} {inboxItems.length === 1 ? 'item needs' : 'items need'} your attention
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Right — ring metrics */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* GPA */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={gpa} max={4} color="var(--accent-student)" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{gpa.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">GPA</p>
                <p className="text-[11px] text-white/35">out of 4.0</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Attendance */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={attendance} max={100} color="#10B981" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{attendance}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Attendance</p>
                <p className="text-[11px] text-white/35">this semester</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Classes today */}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Current GPA', value: gpa.toFixed(1), sub: 'out of 4.0', icon: TrendingUp, color: 'var(--accent-student)', trend: '+0.2 this term' },
          { label: 'Attendance', value: `${attendance}%`, sub: 'this semester', icon: CheckCircle2, color: '#10B981', trend: 'Above target' },
          { label: 'Due Soon', value: `${upcomingAssignments.length}`, sub: 'assignments', icon: Clock, color: '#F59E0B', trend: '1 due tomorrow' },
          { label: "Today's Classes", value: `${todayClasses.length}`, sub: 'sessions', icon: Calendar, color: '#0EA5E9', trend: 'Next at 09:00' },
        ].map(({ label, value, sub, icon: Icon, color, trend }) => (
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
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── SCHEDULE + ASSIGNMENTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Today's Schedule — timeline */}
        <Card className="border-border">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Today's Schedule</span>
            </div>
            <Badge variant="outline" className="text-[11px] h-5">{todayClasses.length} classes</Badge>
          </div>
          <CardContent className="px-5 pb-5">
            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Calendar className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No classes today</p>
              </div>
            ) : (
              <div className="relative space-y-1">
                <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />
                {todayClasses.map((cls, i) => {
                  const col = subjectColor(cls.subject)
                  const isNext = i === 0
                  return (
                    <div key={cls.id + cls.slot.time} className="flex items-start gap-3 relative">
                      <div
                        className="w-[18px] h-[18px] rounded-full shrink-0 mt-2 z-10 border-2 border-card"
                        style={{ background: isNext ? col : `color-mix(in srgb, ${col} 35%, var(--muted))` }}
                      />
                      <div className={`flex-1 rounded-xl p-3 mb-1 border transition-colors ${
                        isNext ? 'border-border bg-card shadow-xs' : 'border-border/50 bg-muted/20'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{cls.subject}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{cls.slot.time} · {cls.slot.room}</p>
                          </div>
                          {isNext && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap"
                              style={{ background: `color-mix(in srgb, ${col} 12%, transparent)`, color: col }}>
                              Up next
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="border-border lg:col-span-2">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Upcoming Assignments</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => router.push('/student/assignments')}>
              View all <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          <CardContent className="px-5 pb-5 space-y-2">
            {upcomingAssignments.map((a) => {
              const col = subjectColor(a.subject)
              const urgencyStyle: Record<string, { bg: string; text: string; border: string }> = {
                high:   { bg: 'rgba(239,68,68,0.08)',   text: '#EF4444', border: 'rgba(239,68,68,0.25)'   },
                medium: { bg: 'rgba(245,158,11,0.08)',  text: '#F59E0B', border: 'rgba(245,158,11,0.25)'  },
                low:    { bg: 'rgba(100,116,139,0.06)', text: '#64748B', border: 'rgba(100,116,139,0.2)'  },
              }
              const us = urgencyStyle[a.urgency] ?? urgencyStyle.low
              return (
                <div
                  key={a.id}
                  className="flex items-stretch rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xs transition-all cursor-pointer"
                  onClick={() => router.push(`/student/assignments/${a.id}`)}
                >
                  {/* Subject color strip */}
                  <div className="w-1 shrink-0" style={{ background: col }} />
                  <div className="flex items-center gap-3 px-3 py-3 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold text-white"
                      style={{ background: col }}
                    >
                      {a.subject.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{a.subject} · {a.points} pts</p>
                    </div>
                  </div>
                  <div className="pr-4 flex flex-col items-end justify-center gap-1 shrink-0">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap"
                      style={{ background: us.bg, color: us.text, borderColor: us.border }}
                    >
                      {a.due}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">{a.status.replace('-', ' ')}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── RECENT GRADES ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Recent Grades</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => router.push('/student/grades')}>
            View all <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recentGrades.map((g) => {
            const gc = gradeColor(g.grade)
            const sc = subjectColor(g.subject)
            return (
              <Card key={g.title} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0">
                <CardContent className="p-0">
                  {/* Gradient top bar */}
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${sc}, color-mix(in srgb, ${sc} 40%, transparent))` }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md text-white"
                        style={{ background: sc }}
                      >
                        {g.subject}
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold leading-none" style={{ color: gc }}>{g.grade}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{g.points}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate mb-3">{g.title}</p>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${g.grade}%`, background: gc }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[11px] font-semibold" style={{ color: gc }}>{gradeLabel(g.grade)}</p>
                      <p className="text-[11px] text-muted-foreground">{g.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

    </div>
  )
}
