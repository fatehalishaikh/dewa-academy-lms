'use client'
import { Sparkles, LayoutGrid, Users, BarChart3, ArrowRight, Calendar, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { students } from '@/data/mock-students'

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
  const classes = teacher ? getClassesByTeacher(teacher.id) : []

  const todayClasses = classes.flatMap(c =>
    c.schedule.filter(s => s.day === todayDay).map(s => ({ ...c, slot: s }))
  ).sort((a, b) => a.slot.time.localeCompare(b.slot.time))

  const totalStudents = new Set(classes.flatMap(c => c.studentIds)).size
  const overallAvg = classes.length ? Math.round(classes.reduce((s, c) => s + c.averageGrade, 0) / classes.length) : 0

  // Build personal timetable
  const allSlots = classes.flatMap(cls =>
    cls.schedule.map(slot => ({ ...slot, className: cls.name, subject: cls.subject, classId: cls.id }))
  )
  const uniqueTimes = [...new Set(allSlots.map(s => s.time))].sort()
  const timetableMap: Record<string, Record<string, typeof allSlots[0] | undefined>> = {}
  DAYS.forEach(d => { timetableMap[d] = {} })
  allSlots.forEach(slot => { timetableMap[slot.day][slot.time] = slot })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Teacher Portal</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Welcome, {teacher?.name.split(' ').slice(-1)[0] ?? 'Teacher'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button size="sm" onClick={() => router.push('/teacher/homework/create')} className="gap-1.5">
          + New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Classes', value: classes.length, icon: LayoutGrid, color: '#00B8A9' },
          { label: 'My Students', value: totalStudents, icon: Users, color: '#0EA5E9' },
          { label: 'Class Average', value: `${overallAvg}%`, icon: BarChart3, color: '#10B981' },
          { label: 'Today\'s Sessions', value: todayClasses.length, icon: Calendar, color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
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
              return (
                <div
                  key={cls.id}
                  className="p-3.5 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cls.name}</p>
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
