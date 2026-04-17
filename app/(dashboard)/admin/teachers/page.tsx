'use client'
import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { teachers } from '@/data/mock-teachers'
import { getClassesByTeacher } from '@/data/mock-classes'

const departments = ['All', ...Array.from(new Set(teachers.map(t => t.department)))]

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
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #271500 55%, #0f1420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 p-7 flex flex-col justify-center gap-3">
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2">Staff Management</p>
              <h1 className="text-2xl font-bold text-white tracking-tight">All Teachers</h1>
              <p className="text-white/40 text-sm mt-1">
                {teachers.length} teachers across {uniqueDepts} departments
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-500/30 text-blue-300" style={{ background: 'rgba(14,165,233,0.12)' }}>
                {uniqueDepts} Departments
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15 text-white/60" style={{ background: 'rgba(255,255,255,0.06)' }}>
                Avg {avgExp}y experience
              </span>
            </div>
          </div>

          {/* Right — rings */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* Total Teachers */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.12)', border: '5px solid rgba(245,158,11,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{teachers.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Teachers</p>
                <p className="text-[11px] text-white/35">total</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Departments ring */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={uniqueDepts} max={10} color="var(--accent-teacher)" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{uniqueDepts}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Departments</p>
                <p className="text-[11px] text-white/35">active</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Avg Experience */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.12)', border: '5px solid rgba(139,92,246,0.35)' }}
              >
                <span className="text-lg font-bold text-white">{avgExp}y</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Avg Exp.</p>
                <p className="text-[11px] text-white/35">years</p>
              </div>
            </div>
          </div>
        </div>
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                dept === d
                  ? 'border-primary/30 bg-primary/10 text-primary'
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
            <div
              key={teacher.id}
              className="flex items-center gap-4 p-3.5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xs bg-card transition-all cursor-pointer"
              onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
            >
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
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No teachers found.</div>
        )}
      </div>
    </div>
  )
}
