'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, GraduationCap, Mail, Users, BarChart3,
  CalendarDays, Sparkles, Brain, BookOpen, FileCheck,
  AlertTriangle, Target, Wand2, CalendarCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTeacherById } from '@/data/mock-teachers'
import { getClassesByTeacher } from '@/data/mock-classes'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const

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

export default function AdminTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const teacher = getTeacherById(id)
  const classes = teacher ? getClassesByTeacher(id) : []

  if (!teacher) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 space-y-3">
        <p className="text-sm text-muted-foreground">Teacher not found.</p>
      </div>
    )
  }

  const totalStudents = new Set(classes.flatMap(c => c.studentIds)).size
  const avgGrade = classes.length ? Math.round(classes.reduce((s, c) => s + c.averageGrade, 0) / classes.length) : 0
  const avgAttendance = classes.length ? Math.round(classes.reduce((s, c) => s + c.attendanceRate, 0) / classes.length) : 0

  // Build timetable from actual class schedules
  const allSlots = classes.flatMap(cls =>
    cls.schedule.map(slot => ({ ...slot, className: cls.name, subject: cls.subject, classId: cls.id }))
  )
  const uniqueTimes = [...new Set(allSlots.map(s => s.time))].sort()
  const timetableMap: Record<string, Record<string, typeof allSlots[0] | undefined>> = {}
  DAYS.forEach(d => { timetableMap[d] = {} })
  allSlots.forEach(slot => { timetableMap[slot.day][slot.time] = slot })

  const AI_FEATURES = [
    { title: 'Homework Generation', desc: 'Auto-generate assignments with rubrics', icon: BookOpen, color: '#00B8A9', href: '/teacher/homework/create' },
    { title: 'Question Bank', desc: 'Generate exam questions by difficulty', icon: FileCheck, color: '#0EA5E9', href: '/teacher/homework/create' },
    { title: 'AI Grading', desc: 'Smart scoring suggestions for submissions', icon: Wand2, color: '#8B5CF6', href: '/teacher/homework' },
    { title: 'Risk Assessment', desc: 'Identify at-risk students early', icon: AlertTriangle, color: '#EF4444', href: '/teacher/students' },
    { title: 'Learning Paths', desc: 'Personalized plans per student', icon: Target, color: '#10B981', href: '/teacher/students' },
    { title: 'AI Tutor', desc: 'Context-aware AI teaching assistant', icon: Brain, color: '#F59E0B', href: '/teacher/classes' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push('/admin/teachers')}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        All Teachers
      </button>

      {/* Identity card */}
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <Avatar className="w-16 h-16 shrink-0">
              <AvatarFallback className="text-xl font-bold text-white" style={{ background: teacher.avatarColor }}>
                {teacher.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h1 className="text-xl font-bold text-foreground">{teacher.name}</h1>
                <p className="text-sm text-muted-foreground">{teacher.qualification}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary">
                  {teacher.department}
                </Badge>
                {teacher.subjects.map(s => (
                  <span key={s} className="text-[11px] bg-muted/40 text-muted-foreground px-2 py-0.5 rounded-full border border-border">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                {teacher.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Classes', value: classes.length, color: '#00B8A9', icon: CalendarDays },
          { label: 'Total Students', value: totalStudents, color: '#0EA5E9', icon: Users },
          { label: 'Avg Class Grade', value: `${avgGrade}%`, color: avgGrade >= 80 ? '#10B981' : avgGrade >= 70 ? '#F59E0B' : '#EF4444', icon: BarChart3 },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, color: avgAttendance >= 90 ? '#10B981' : avgAttendance >= 80 ? '#F59E0B' : '#EF4444', icon: CalendarCheck },
          { label: 'Years Experience', value: `${teacher.yearsExperience}y`, color: '#8B5CF6', icon: GraduationCap },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/30 border border-border h-9">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="timetable" className="text-xs">Timetable</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">AI Tools</TabsTrigger>
        </TabsList>

        {/* Overview: classes list */}
        <TabsContent value="overview" className="space-y-3 mt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Classes</p>
          {classes.map(cls => (
            <Card key={cls.id} className="rounded-2xl border-border bg-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className="w-2 h-10 rounded-full shrink-0"
                  style={{ background: SUBJECT_COLORS[cls.subject] ?? '#6B7280' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{cls.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] text-muted-foreground">{cls.gradeLevel}</span>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-muted-foreground">Room {cls.room}</span>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-muted-foreground">{cls.studentIds.length} students</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <p className={`text-sm font-bold ${gradeColor(cls.averageGrade)}`}>{cls.averageGrade}%</p>
                    <p className="text-[11px] text-muted-foreground">Avg Grade</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${attendanceColor(cls.attendanceRate)}`}>{cls.attendanceRate}%</p>
                    <p className="text-[11px] text-muted-foreground">Attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Timetable */}
        <TabsContent value="timetable" className="mt-4">
          <Card className="rounded-2xl border-border overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-4">
              {uniqueTimes.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">No schedule data available.</p>
              ) : (
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
                                    className="px-2 py-1.5 rounded-lg text-[11px] leading-tight"
                                    style={{ background: `${color}20`, borderLeft: `2px solid ${color}` }}
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
              )}
              {/* Legend */}
              {uniqueTimes.length > 0 && (
                <div className="flex flex-wrap gap-3 px-5 pt-3">
                  {teacher.subjects.map(s => {
                    const color = SUBJECT_COLORS[s] ?? '#6B7280'
                    return (
                      <div key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                        {s}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tools */}
        <TabsContent value="ai" className="mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available AI Features</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {AI_FEATURES.map(feature => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="rounded-2xl border-border bg-card">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${feature.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{feature.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
