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

  const onTrackCount = students.filter(s => s.status === 'active').length
  const atRiskCount = students.filter(s => s.status === 'at-risk').length
  const onTrackPct = Math.round((onTrackCount / students.length) * 100)

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
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2">Student Management</p>
              <h1 className="text-2xl font-bold text-white tracking-tight">All Students</h1>
              <p className="text-white/40 text-sm mt-1">{students.length} students enrolled school-wide</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-300" style={{ background: 'rgba(16,185,129,0.12)' }}>
                {onTrackCount} On Track
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-500/30 text-red-300" style={{ background: 'rgba(239,68,68,0.12)' }}>
                {atRiskCount} At Risk
              </span>
            </div>
          </div>

          {/* Right — rings */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* Total */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.12)', border: '5px solid rgba(245,158,11,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{students.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Total</p>
                <p className="text-[11px] text-white/35">students</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* On Track ring */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={onTrackPct} max={100} color="#10B981" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{onTrackPct}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">On Track</p>
                <p className="text-[11px] text-white/35">{onTrackCount} students</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* At Risk */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)', border: '5px solid rgba(239,68,68,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{atRiskCount}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">At Risk</p>
                <p className="text-[11px] text-white/35">need support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Students', value: students.length, sub: 'enrolled this term', color: '#00B8A9', icon: Users, trend: 'School-wide' },
          { label: 'On Track', value: onTrackCount, sub: 'performing well', color: '#10B981', icon: CheckCircle2, trend: `${onTrackPct}% of total` },
          { label: 'At Risk', value: atRiskCount, sub: 'need intervention', color: '#EF4444', icon: AlertTriangle, trend: 'Needs attention' },
        ].map(({ label, value, sub, color, icon: Icon, trend }) => (
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
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xs bg-card transition-all cursor-pointer"
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
                  <Badge variant="outline" className="text-[11px] h-4 border-red-500/30 text-red-400">At Risk</Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {stu.gradeLevel} · Section {stu.section} · {stu.emiratesId}
              </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <p className={`text-sm font-bold ${gradeColor(stu.gpa)}`}>{stu.gpa.toFixed(1)}</p>
                <p className="text-[11px] text-muted-foreground">GPA</p>
              </div>
              <div className="text-center">
                <p className={`text-sm font-bold ${attendanceColor(stu.attendanceRate)}`}>{stu.attendanceRate}%</p>
                <p className="text-[11px] text-muted-foreground">Attend.</p>
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
