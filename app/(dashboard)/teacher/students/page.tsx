'use client'
import { useState } from 'react'
import { Sparkles, Search, Users, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { students } from '@/data/mock-students'

export default function TeacherStudents() {
  const router = useRouter()
  const teacher = useCurrentTeacher()
  const classes = teacher ? getClassesByTeacher(teacher.id) : []
  const myStudentIds = new Set(classes.flatMap(c => c.studentIds))
  const myStudents = students.filter(s => myStudentIds.has(s.id))

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'at-risk'>('all')

  const filtered = myStudents
    .filter(s => filter === 'all' || s.status === 'at-risk')
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))

  function gradeColor(g: number) {
    if (g >= 3.5) return 'text-emerald-400'
    if (g >= 2.5) return 'text-amber-400'
    return 'text-red-400'
  }

  function attendanceColor(r: number) {
    if (r >= 90) return 'text-emerald-400'
    if (r >= 80) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">My Students</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Student Roster</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{myStudents.length} students across {classes.length} classes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Students', value: myStudents.length, color: '#00B8A9', icon: Users },
          { label: 'On Track', value: myStudents.filter(s => s.status === 'active').length, color: '#10B981', icon: CheckCircle2 },
          { label: 'At Risk', value: myStudents.filter(s => s.status === 'at-risk').length, color: '#EF4444', icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-4.5 h-4.5" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'at-risk'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${filter === f ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
            >
              {f === 'all' ? 'All' : 'At Risk'}
            </button>
          ))}
        </div>
      </div>

      {/* Student list */}
      <div className="space-y-2">
        {filtered.map((stu) => {
          const studentClasses = classes.filter(c => c.studentIds.includes(stu.id))
          return (
            <div
              key={stu.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-border hover:border-primary/30 bg-card transition-colors cursor-pointer"
              onClick={() => router.push(`/teacher/students/${stu.id}`)}
            >
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarFallback className="text-xs font-bold text-white" style={{ background: stu.avatarColor }}>
                  {stu.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{stu.name}</p>
                  {stu.status === 'at-risk' && (
                    <Badge variant="outline" className="text-[10px] h-4 border-red-500/30 text-red-400">At Risk</Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {stu.gradeLevel} · {studentClasses.map(c => c.subject).join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <p className={`text-sm font-bold ${gradeColor(stu.gpa)}`}>{stu.gpa.toFixed(1)}</p>
                  <p className="text-[9px] text-muted-foreground">GPA</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${attendanceColor(stu.attendanceRate)}`}>{stu.attendanceRate}%</p>
                  <p className="text-[9px] text-muted-foreground">Attend.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No students found</p>
        )}
      </div>
    </div>
  )
}
