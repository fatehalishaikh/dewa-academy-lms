'use client'
import { LayoutGrid, Users, BarChart3, ArrowRight, Calendar, CalendarDays, TrendingUp, AlertTriangle, Plus, GraduationCap } from 'lucide-react'
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
  'Mathematics':     '#007560',
  'Physics':         '#2878C1',
  'English Language':'#004937',
  'Chemistry':       '#D4AF37',
  'Biology':         '#007560',
  'Arabic':          '#B00020',
  'Social Studies':  '#7FC9BB',
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

  const allSlots = classes.flatMap(cls =>
    cls.schedule.map(slot => ({ ...slot, className: cls.name, subject: cls.subject, classId: cls.id }))
  )
  const uniqueTimes = [...new Set(allSlots.map(s => s.time))].sort()
  const timetableMap: Record<string, Record<string, typeof allSlots[0] | undefined>> = {}
  DAYS.forEach(d => { timetableMap[d] = {} })
  allSlots.forEach(slot => { timetableMap[slot.day][slot.time] = slot })

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2878C1] via-[#1a5a8a] to-[#0f3d5c] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#007560]/20 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70 uppercase tracking-wider">My Classes</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome, {teacher?.name.split(' ').slice(-1)[0] ?? 'Teacher'}
            </h1>
            <p className="text-white/60">
              {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/teacher/homework/create')} 
            className="bg-white text-[#2878C1] hover:bg-white/90 gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'My Classes', value: classes.length, icon: LayoutGrid },
            { label: 'My Students', value: totalStudents, icon: Users },
            { label: 'Class Average', value: `${overallAvg}%`, icon: BarChart3 },
            { label: 'Today Sessions', value: todayClasses.length, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-info" />
              </div>
              Today&apos;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No classes scheduled today</p>
              </div>
            ) : (
              todayClasses.map((cls) => {
                const color = SUBJECT_COLORS[cls.subject] ?? '#007560'
                return (
                  <div 
                    key={cls.id + cls.slot.time} 
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shrink-0"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                    >
                      <p className="text-xs font-bold">{cls.slot.time.split('–')[0]}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">{cls.name.split('—')[0].trim()}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{cls.slot.room}</p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-primary" />
              </div>
              My Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classes.map((cls) => {
              const classStudents = students.filter(s => cls.studentIds.includes(s.id))
              const atRiskCount = classStudents.filter(s => s.status === 'at-risk').length
              const color = SUBJECT_COLORS[cls.subject] ?? '#007560'
              const scoreColor = cls.averageGrade >= 80 ? '#007560' : cls.averageGrade >= 70 ? '#D4AF37' : '#B00020'
              const attColor = cls.attendanceRate >= 90 ? '#007560' : cls.attendanceRate >= 80 ? '#D4AF37' : '#B00020'
              
              return (
                <div
                  key={cls.id}
                  className="group relative overflow-hidden p-5 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                      >
                        {cls.name.charAt(cls.name.length - 2)}{cls.name.charAt(cls.name.length - 1)}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.subject}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Users className="w-4 h-4" />
                    <span>{cls.studentIds.length} students</span>
                    <span className="text-muted-foreground/50">·</span>
                    <Calendar className="w-4 h-4" />
                    <span>{cls.schedule.length}x/week</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span>Room {cls.room}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold" style={{ color: scoreColor }}>{cls.averageGrade}%</p>
                          <TrendingUp className="w-4 h-4 text-success" />
                        </div>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold" style={{ color: attColor }}>{cls.attendanceRate}%</p>
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${cls.attendanceRate}%`, background: attColor }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {atRiskCount > 0 && (
                      <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5 gap-1">
                        <AlertTriangle className="w-3 h-3" />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Grade Submissions', sub: '8 submissions pending review', to: '/teacher/gradebook', color: '#D4AF37', icon: BarChart3 },
          { label: 'Create Homework', sub: 'Assign new work to your classes', to: '/teacher/homework/create', color: '#007560', icon: LayoutGrid },
          { label: 'View All Students', sub: 'Analyse individual performance', to: '/teacher/students', color: '#2878C1', icon: Users },
        ].map(({ label, sub, to, color, icon: Icon }) => (
          <button
            key={label}
            onClick={() => router.push(to)}
            className="group relative overflow-hidden p-5 rounded-2xl border border-border/50 hover:border-primary/30 bg-card text-left transition-all hover:shadow-lg"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${color}08, ${color}03)` }} />
            <div className="relative z-10">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
              <p className="text-sm text-muted-foreground mt-1">{sub}</p>
            </div>
            <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {uniqueTimes.length > 0 && (
        <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                My Weekly Timetable
              </CardTitle>
              <Badge variant="secondary">{classes.length} classes · {allSlots.length} sessions/week</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-accent/30 border-b border-border/50">
                    <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Time</th>
                    {DAYS.map(d => (
                      <th 
                        key={d} 
                        className={`text-center px-4 py-4 text-xs font-semibold uppercase tracking-wider ${d === todayDay ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
                      >
                        {d}
                        {d === todayDay && <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uniqueTimes.map((time, i) => (
                    <tr key={time} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-accent/10'}`}>
                      <td className="px-5 py-3 text-sm text-muted-foreground font-mono whitespace-nowrap">{time}</td>
                      {DAYS.map(day => {
                        const entry = timetableMap[day]?.[time]
                        const color = entry ? (SUBJECT_COLORS[entry.subject] ?? '#6B7280') : null
                        const isToday = day === todayDay
                        return (
                          <td key={day} className={`px-3 py-2 align-top ${isToday ? 'bg-primary/5' : ''}`}>
                            {entry && color && (
                              <div
                                className="px-3 py-2.5 rounded-xl text-xs leading-tight cursor-pointer hover:scale-[1.02] transition-transform border"
                                style={{ background: `${color}15`, borderColor: `${color}30` }}
                                onClick={() => router.push(`/teacher/classes/${entry.classId}`)}
                              >
                                <p className="font-semibold truncate" style={{ color }}>{entry.subject}</p>
                                <p className="text-muted-foreground truncate mt-0.5">{entry.className.split('—')[0].trim()}</p>
                                <p className="text-muted-foreground/70 mt-0.5">{entry.room}</p>
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
            <div className="flex flex-wrap gap-4 px-5 py-4 border-t border-border/50 bg-accent/20">
              {teacher && [...new Set(classes.map(c => c.subject))].map(s => {
                const color = SUBJECT_COLORS[s] ?? '#6B7280'
                return (
                  <div key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded" style={{ background: color }} />
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
