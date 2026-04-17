'use client'
import { useState } from 'react'
import { Search, Users, CheckCircle2, Clock, ArrowRight, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { staff } from '@/data/mock-staff'

const departments = ['All', ...Array.from(new Set(staff.map(s => s.department)))]

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

export default function AdminStaffPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')

  const filtered = staff
    .filter(s => dept === 'All' || s.department === dept)
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.role.toLowerCase().includes(query.toLowerCase()))

  const activeCount = staff.filter(s => s.status === 'active').length
  const onLeaveCount = staff.filter(s => s.status === 'on-leave').length
  const activePct = Math.round((activeCount / staff.length) * 100)
  const uniqueDepts = new Set(staff.map(s => s.department)).size

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
              <h1 className="text-2xl font-bold text-white tracking-tight">All Staff</h1>
              <p className="text-white/40 text-sm mt-1">
                {staff.length} staff members across {uniqueDepts} departments
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-300" style={{ background: 'rgba(16,185,129,0.12)' }}>
                {activeCount} Active
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-300" style={{ background: 'rgba(245,158,11,0.12)' }}>
                {onLeaveCount} On Leave
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
                <span className="text-xl font-bold text-white">{staff.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Total</p>
                <p className="text-[11px] text-white/35">staff</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Active ring */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={activePct} max={100} color="#10B981" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{activePct}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Active</p>
                <p className="text-[11px] text-white/35">{activeCount} members</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* On Leave */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.12)', border: '5px solid rgba(245,158,11,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{onLeaveCount}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">On Leave</p>
                <p className="text-[11px] text-white/35">this period</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Staff', value: staff.length, sub: 'school-wide', color: '#00B8A9', icon: Users, trend: 'All departments' },
          { label: 'Active', value: activeCount, sub: 'currently working', color: '#10B981', icon: CheckCircle2, trend: `${activePct}% of total` },
          { label: 'On Leave', value: onLeaveCount, sub: 'this period', color: '#F59E0B', icon: Clock, trend: 'Temporarily away' },
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
            placeholder="Search staff…"
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
        {filtered.map(member => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-3.5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xs bg-card transition-all cursor-pointer"
            onClick={() => router.push(`/admin/staff/${member.id}`)}
          >
            <Avatar className="w-10 h-10 shrink-0">
              <AvatarFallback className="text-sm font-semibold text-white" style={{ background: member.avatarColor }}>
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">{member.name}</p>
                <Badge variant="outline" className="text-[11px] h-5 border-border text-muted-foreground">{member.role}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{member.department} · {member.email}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Badge
                variant="outline"
                className={`text-[11px] h-5 ${
                  member.status === 'active'
                    ? 'border-emerald-500/30 text-emerald-400'
                    : 'border-amber-500/30 text-amber-400'
                }`}
              >
                {member.status === 'active' ? 'Active' : 'On Leave'}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{member.yearsExperience}y</p>
                <p className="text-[11px] text-muted-foreground">Experience</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No staff members found.</div>
        )}
      </div>
    </div>
  )
}
