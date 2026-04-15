'use client'
import { useState } from 'react'
import { Search, GraduationCap, Users, Briefcase, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { teachers } from '@/data/mock-teachers'
import { getClassesByTeacher } from '@/data/mock-classes'

const departments = ['All', ...Array.from(new Set(teachers.map(t => t.department)))]

export default function AdminTeachersPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')

  const filtered = teachers
    .filter(t => dept === 'All' || t.department === dept)
    .filter(t => !query || t.name.toLowerCase().includes(query.toLowerCase()))

  const avgExp = Math.round(teachers.reduce((s, t) => s + t.yearsExperience, 0) / teachers.length)
  const uniqueDepts = new Set(teachers.map(t => t.department)).size

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Staff Management</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">All Teachers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{teachers.length} teachers across {uniqueDepts} departments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Teachers', value: teachers.length, color: '#00B8A9', icon: GraduationCap },
          { label: 'Departments', value: uniqueDepts, color: '#8B5CF6', icon: Briefcase },
          { label: 'Avg. Experience', value: `${avgExp}y`, color: '#10B981', icon: Users },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
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
            placeholder="Search teachers…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                dept === d
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(teacher => {
          const classes = getClassesByTeacher(teacher.id)
          const totalStudents = new Set(classes.flatMap(c => c.studentIds)).size
          return (
            <Card
              key={teacher.id}
              className="rounded-2xl border-border hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="text-sm font-semibold text-white" style={{ background: teacher.avatarColor }}>
                    {teacher.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{teacher.name}</p>
                    <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary">{teacher.department}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {teacher.subjects.map(s => (
                      <span key={s} className="text-[11px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{teacher.email}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <p className="text-sm font-bold text-foreground">{classes.length}</p>
                    <p className="text-[11px] text-muted-foreground">Classes</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{totalStudents}</p>
                    <p className="text-[11px] text-muted-foreground">Students</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{teacher.yearsExperience}y</p>
                    <p className="text-[11px] text-muted-foreground">Experience</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No teachers found.</div>
        )}
      </div>
    </div>
  )
}
