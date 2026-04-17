'use client'
import { Sparkles, LayoutGrid, Users, BarChart3, ArrowRight, Calendar, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { students } from '@/data/mock-students'
import { useSubjectStore } from '@/stores/subject-store'
import { subjectColor } from '@/lib/subject-colors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const
const todayDay = DAYS[new Date().getDay() === 5 || new Date().getDay() === 6 ? 0 : new Date().getDay() === 0 ? 0 : new Date().getDay()] as string

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':     '#00B8A9',
  'Physics':         '#0EA5E9',
  'English Language':'#8B5CF6',
  'Chemistry':       '#F59E0B',
  'Biology':         '#10B981',
  'Arabic':          '#EF4444',
  'Social Studies':  '#EC4899',
}

function gradeColor(g: number) {
  if (g >= 80) return 'text-emerald-400'
  if (g >= 70) return 'text-amber-400'
  return 'text-red-400'
}

function attendanceColor(r: number) {
  if (r >= 90) return 'text-emerald-400'
  if (r >= 80) return 'text-amber-400'
  return 'text-red-400'
}

export default function TeacherClasses() {
  const router = useRouter()
  const teacher = useCurrentTeacher()
  const { activeSubject } = useSubjectStore()
  const allClasses = teacher ? getClassesByTeacher(teacher.id) : []
  const classes = activeSubject === 'all' ? allClasses : allClasses.filter(c => c.subject === activeSubject)

  const todayClasses = classes.flatMap(c =>
    c.schedule.filter(s => s.day === todayDay).map(s => ({ ...c, slot: s }))
  ).sort((a, b) => a.slot.time.localeCompare(b.slot.time))

  const totalStudents = new Set(classes.flatMap(c => c.studentIds)).size
  const overallAvg = classes.length ? Math.round(classes.reduce((s, c) => s + c.averageGrade, 0) / classes.length) : 0

  // Build personal timetable (always show full timetable)
  const allSlots = allClasses.flatMap(cls =>
    cls.schedule.map(slot => ({ ...slot, className: cls.name, subject: cls.subject, classId: cls.id }))
  )
  const uniqueTimes = [...new Set(allSlots.map(s => s.time))].sort()
  const timetableMap: Record<string, Record<string, typeof allSlots[0] | undefined>> = {}
  DAYS.forEach(d => { timetableMap[d] = {} })
  allSlots.forEach(slot => { timetableMap[slot.day][slot.time] = slot })

  const ACCENT = '#0EA5E9'

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #00111e 0%, #001a2e 55%, #07111f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 p-7 flex flex-col justify-center gap-3">
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2">Teacher Portal</p>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Classes
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {teacher?.name.split(' ').slice(-1)[0] ?? 'Teacher'} · {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                style={{ borderColor: `color-mix(in srgb, ${ACCENT} 35%, transparent)`, color: '#7dd3fc', background: `color-mix(in srgb, ${ACCENT} 12%, transparent)` }}
              >
                {classes.length} class{classes.length !== 1 ? 'es' : ''}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15 text-white/60" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {todayClasses.length} session{todayClasses.length !== 1 ? 's' : ''} today
              </span>
            </div>
          </div>

          {/* Right — rings */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* Classes */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`, border: `5px solid color-mix(in srgb, ${ACCENT} 35%, transparent)` }}>
                <span className="text-xl font-bold text-white">{classes.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Classes</p>
                <p className="text-[11px] text-white/35">this term</p>
              </div>
            </div>
            <div className="w-px h-14 bg-white/[0.08]" />
            {/* Students ring */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                {(() => {
                  const sw = 5, size = 80, r = (size - sw * 2) / 2
                  const circ = 2 * Math.PI * r
                  const pct = Math.min(totalStudents / 40, 1)
                  const offset = circ - pct * circ
                  return (
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ACCENT} strokeWidth={sw}
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                    </svg>
                  )
                })()}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{totalStudents}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Students</p>
                <p className="text-[11px] text-white/35">total</p>
              </div>
            </div>
            <div className="w-px h-14 bg-white/[0.08]" />
            {/* Avg */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)', border: '5px solid rgba(16,185,129,0.35)' }}>
                <span className="text-xl font-bold text-white">{overallAvg}%</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Avg Grade</p>
                <p className="text-[11px] text-white/35">overall</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Classes', value: classes.length, sub: 'this term', icon: LayoutGrid, color: '#00B8A9' },
          { label: 'My Students', value: totalStudents, sub: 'across all classes', icon: Users, color: '#0EA5E9' },
          { label: 'Class Average', value: `${overallAvg}%`, sub: 'overall', icon: BarChart3, color: '#10B981' },
          { label: "Today's Sessions", value: todayClasses.length, sub: 'scheduled today', icon: Calendar, color: '#F59E0B' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayClasses.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No classes scheduled today</p>
            ) : (
              todayClasses.map((cls) => (
                <div key={cls.id + cls.slot.time} className="flex items-start gap-3 p-2.5 rounded-xl bg-card border border-border">
                  <div className="text-center shrink-0">
                    <p className="text-[11px] font-bold text-primary">{cls.slot.time.split('–')[0]}</p>
                    <p className="text-[11px] text-muted-foreground">{cls.slot.room}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{cls.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{cls.name.split('—')[0].trim()}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card className="rounded-2xl border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" />
              My Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classes.map((cls) => {
              const classStudents = students.filter(s => cls.studentIds.includes(s.id))
              const atRiskCount = classStudents.filter(s => s.status === 'at-risk').length
              const color = subjectColor(cls.subject)
              return (
                <div
                  key={cls.id}
                  className="p-3.5 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{cls.name}</p>
                        {activeSubject === 'all' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ background: `${color}18`, color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                            {cls.subject}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {cls.studentIds.length} students · {cls.schedule.length}×/week · {cls.room}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Average</p>
                      <p className={`text-sm font-bold ${gradeColor(cls.averageGrade)}`}>{cls.averageGrade}%</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Attendance</p>
                      <p className={`text-sm font-bold ${attendanceColor(cls.attendanceRate)}`}>{cls.attendanceRate}%</p>
                    </div>
                    {atRiskCount > 0 && (
                      <Badge variant="outline" className="text-[11px] h-5 border-red-500/30 text-red-400 ml-auto">
                        {atRiskCount} at risk
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Grade Submissions', sub: '8 submissions pending review', to: '/teacher/gradebook', color: '#F59E0B', icon: BarChart3 },
          { label: 'Create Homework', sub: 'Assign new work to your classes', to: '/teacher/homework/create', color: '#00B8A9', icon: LayoutGrid },
          { label: 'View All Students', sub: 'Analyse individual performance', to: '/teacher/students', color: '#8B5CF6', icon: Users },
        ].map(({ label, sub, to, color, icon: Icon }) => (
          <button
            key={label}
            onClick={() => router.push(to)}
            className="p-4 rounded-2xl border border-border hover:border-primary/30 bg-card text-left transition-colors"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}20` }}>
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
          </button>
        ))}
      </div>

      {/* My Timetable */}
      {uniqueTimes.length > 0 && (
        <Card className="rounded-2xl border-border overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                My Weekly Timetable
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">{classes.length} classes · {allSlots.length} sessions/week</p>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-32">Time</th>
                    {DAYS.map(d => (
                      <th key={d} className="text-center px-3 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uniqueTimes.map((time, i) => (
                    <tr key={time} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/5'}`}>
                      <td className="px-4 py-2 text-xs text-muted-foreground font-mono whitespace-nowrap">{time}</td>
                      {DAYS.map(day => {
                        const entry = timetableMap[day]?.[time]
                        const color = entry ? (SUBJECT_COLORS[entry.subject] ?? '#6B7280') : null
                        return (
                          <td key={day} className="px-2 py-1.5 align-top">
                            {entry && color && (
                              <div
                                className="px-2 py-1.5 rounded-lg text-[11px] leading-tight cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ background: `${color}20`, borderLeft: `2px solid ${color}` }}
                                onClick={() => router.push(`/teacher/classes/${entry.classId}`)}
                              >
                                <p className="font-semibold truncate" style={{ color }}>{entry.subject}</p>
                                <p className="text-muted-foreground truncate">{entry.className.split('—')[0].trim()}</p>
                                <p className="text-muted-foreground">{entry.room}</p>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 px-5 pt-3">
              {teacher && [...new Set(classes.map(c => c.subject))].map(s => {
                const color = SUBJECT_COLORS[s] ?? '#6B7280'
                return (
                  <div key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    {s}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
