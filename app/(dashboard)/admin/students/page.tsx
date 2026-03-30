'use client'
import { useState } from 'react'
import { Search, Users, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { students } from '@/data/mock-students'

type GradeFilter = 'all' | 'at-risk' | 'Grade 9' | 'Grade 10' | 'Grade 11'

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

export default function AdminStudents() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<GradeFilter>('all')

  const filtered = students
    .filter(s => {
      if (filter === 'at-risk') return s.status === 'at-risk'
      if (filter === 'Grade 9' || filter === 'Grade 10' || filter === 'Grade 11') return s.gradeLevel === filter
      return true
    })
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))

  const FILTERS: GradeFilter[] = ['all', 'at-risk', 'Grade 9', 'Grade 10', 'Grade 11']
  const FILTER_LABELS: Record<GradeFilter, string> = {
    all: 'All', 'at-risk': 'At Risk', 'Grade 9': 'Grade 9', 'Grade 10': 'Grade 10', 'Grade 11': 'Grade 11',
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">All Students</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{students.length} students school-wide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Students', value: students.length,                                       color: '#00B8A9', icon: Users },
          { label: 'On Track',       value: students.filter(s => s.status === 'active').length,    color: '#10B981', icon: CheckCircle2 },
          { label: 'At Risk',        value: students.filter(s => s.status === 'at-risk').length,   color: '#EF4444', icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
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
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                filter === f ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Student list */}
      <div className="space-y-2">
        {filtered.map(stu => (
          <div
            key={stu.id}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-border hover:border-primary/30 bg-card transition-colors cursor-pointer"
            onClick={() => router.push(`/admin/students/${stu.id}`)}
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
                {stu.gradeLevel} · Section {stu.section} · {stu.emiratesId}
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
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No students found</p>
        )}
      </div>
    </div>
  )
}
