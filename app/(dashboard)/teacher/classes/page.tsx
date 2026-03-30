'use client'
import { Sparkles, LayoutGrid, Users, BarChart3, ArrowRight, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { students } from '@/data/mock-students'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const todayDay = DAYS[new Date().getDay() === 5 || new Date().getDay() === 6 ? 0 : new Date().getDay() === 0 ? 0 : new Date().getDay()] as string

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

  return (
    <div className="p-6 space-y-6 max-w-5xl">
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
                    <p className="text-[10px] font-bold text-primary">{cls.slot.time.split('–')[0]}</p>
                    <p className="text-[9px] text-muted-foreground">{cls.slot.room}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{cls.subject}</p>
                    <p className="text-[10px] text-muted-foreground">{cls.name.split('—')[0].trim()}</p>
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
                      <p className="text-[10px] text-muted-foreground">Average</p>
                      <p className={`text-sm font-bold ${gradeColor(cls.averageGrade)}`}>{cls.averageGrade}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Attendance</p>
                      <p className={`text-sm font-bold ${attendanceColor(cls.attendanceRate)}`}>{cls.attendanceRate}%</p>
                    </div>
                    {atRiskCount > 0 && (
                      <Badge variant="outline" className="text-[10px] h-5 border-red-500/30 text-red-400 ml-auto">
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
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
