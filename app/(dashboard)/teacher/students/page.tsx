'use client'
import { useState } from 'react'
import { Sparkles, Search, Users, AlertTriangle, CheckCircle2, ArrowRight, LayoutList, ShieldAlert, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { students } from '@/data/mock-students'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' },
  labelStyle: { color: '#e2e8f0', fontWeight: 600 },
  itemStyle: { color: '#cbd5e1' },
  cursor: { fill: 'rgba(255,255,255,0.05)' },
}

function computeRiskScore(gpa: number, attendance: number) {
  return Math.max(0, Math.min(100, Math.round((4.0 - gpa) * 20 + (100 - attendance) * 0.5)))
}

function riskLevelFromScore(score: number): 'high' | 'moderate' | 'low' {
  if (score > 60) return 'high'
  if (score > 35) return 'moderate'
  return 'low'
}

const RISK_COLORS = { high: '#EF4444', moderate: '#F59E0B', low: '#10B981' }
const RISK_BG = { high: 'bg-red-500/10', moderate: 'bg-amber-500/10', low: 'bg-emerald-500/10' }
const RISK_TEXT = { high: 'text-red-400', moderate: 'text-amber-400', low: 'text-emerald-400' }
const RISK_BORDER = { high: 'border-red-500/30', moderate: 'border-amber-500/30', low: 'border-emerald-500/30' }

export default function TeacherStudents() {
  const router = useRouter()
  const teacher = useCurrentTeacher()
  const classes = teacher ? getClassesByTeacher(teacher.id) : []
  const myStudentIds = new Set(classes.flatMap(c => c.studentIds))
  const myStudents = students.filter(s => myStudentIds.has(s.id))

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'at-risk'>('all')
  const [view, setView] = useState<'roster' | 'risk-dashboard'>('roster')
  const [sortBy, setSortBy] = useState<'risk' | 'gpa' | 'attendance'>('risk')

  const filtered = myStudents
    .filter(s => filter === 'all' || s.status === 'at-risk')
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))

  // Risk data derived from student metrics
  const riskStudents = myStudents.map(s => ({
    ...s,
    riskScore: computeRiskScore(s.gpa, s.attendanceRate),
    riskLevel: riskLevelFromScore(computeRiskScore(s.gpa, s.attendanceRate)),
    trend: s.status === 'at-risk' ? 'down' : s.gpa >= 3.5 ? 'up' : 'flat',
  }))

  const sortedRiskStudents = [...riskStudents].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore
    if (sortBy === 'gpa') return a.gpa - b.gpa
    return a.attendanceRate - b.attendanceRate
  })

  const riskCounts = {
    high: riskStudents.filter(s => s.riskLevel === 'high').length,
    moderate: riskStudents.filter(s => s.riskLevel === 'moderate').length,
    low: riskStudents.filter(s => s.riskLevel === 'low').length,
  }

  const distributionData = [
    { label: 'High', count: riskCounts.high, fill: '#EF4444' },
    { label: 'Moderate', count: riskCounts.moderate, fill: '#F59E0B' },
    { label: 'Low', count: riskCounts.low, fill: '#10B981' },
  ]

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
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">My Students</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Student Roster</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{myStudents.length} students across {classes.length} classes</p>
        </div>
        {/* View toggle */}
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() => setView('roster')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${view === 'roster' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Roster
          </button>
          <button
            onClick={() => setView('risk-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${view === 'risk-dashboard' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-border text-muted-foreground hover:bg-accent'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Risk Dashboard
          </button>
        </div>
      </div>

      {view === 'roster' ? (
        <>
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
                    <p className="text-[11px] text-muted-foreground">{label}</p>
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
                        <Badge variant="outline" className="text-[11px] h-4 border-red-500/30 text-red-400">At Risk</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {stu.gradeLevel} · {studentClasses.map(c => c.subject).join(', ')}
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
              )
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No students found</p>
            )}
          </div>
        </>
      ) : (
        /* ── Risk Dashboard ── */
        <div className="space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {([
              { label: 'High Risk', key: 'high' as const, icon: AlertTriangle },
              { label: 'Moderate Risk', key: 'moderate' as const, icon: ShieldAlert },
              { label: 'Low Risk', key: 'low' as const, icon: CheckCircle2 },
            ]).map(({ label, key, icon: Icon }) => (
              <Card key={key} className="rounded-2xl border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${RISK_BG[key]}`}>
                    <Icon className={`w-4 h-4 ${RISK_TEXT[key]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{riskCounts[key]}</p>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk distribution chart */}
          <Card className="rounded-2xl border-border">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-foreground mb-3">Risk Distribution</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={distributionData} barSize={40}>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    {...TOOLTIP_STYLE}
                    formatter={(val) => [`${val} students`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {distributionData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sortable risk table */}
          <Card className="rounded-2xl border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-foreground">Student Risk Table</p>
                <div className="flex gap-1">
                  {(['risk', 'gpa', 'attendance'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${sortBy === s ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
                    >
                      {s === 'risk' ? 'Risk Score' : s === 'gpa' ? 'GPA' : 'Attendance'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_80px_100px_60px_32px] gap-2 px-2 mb-1">
                {['Student', 'GPA', 'Attend.', 'Risk Score', 'Trend', ''].map(h => (
                  <p key={h} className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</p>
                ))}
              </div>

              <div className="space-y-1.5">
                {sortedRiskStudents.map(stu => {
                  const TrendIcon = stu.trend === 'up' ? TrendingUp : stu.trend === 'down' ? TrendingDown : Minus
                  const trendColor = stu.trend === 'up' ? 'text-emerald-400' : stu.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                  return (
                    <div
                      key={stu.id}
                      className="grid grid-cols-[1fr_80px_80px_100px_60px_32px] gap-2 items-center px-2 py-2 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/teacher/students/${stu.id}`)}
                    >
                      {/* Student */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarFallback className="text-[11px] font-bold text-white" style={{ background: stu.avatarColor }}>
                            {stu.initials}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-medium text-foreground truncate">{stu.name}</p>
                      </div>
                      {/* GPA */}
                      <p className={`text-xs font-bold ${gradeColor(stu.gpa)}`}>{stu.gpa.toFixed(1)}</p>
                      {/* Attendance */}
                      <p className={`text-xs font-bold ${attendanceColor(stu.attendanceRate)}`}>{stu.attendanceRate}%</p>
                      {/* Risk score */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${stu.riskScore}%`, background: RISK_COLORS[stu.riskLevel] }}
                          />
                        </div>
                        <span className={`text-[11px] font-bold w-6 text-right ${RISK_TEXT[stu.riskLevel]}`}>{stu.riskScore}</span>
                      </div>
                      {/* Trend */}
                      <div className="flex items-center gap-1">
                        <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-4 px-1.5 ${RISK_BORDER[stu.riskLevel]} ${RISK_TEXT[stu.riskLevel]}`}
                        >
                          {stu.riskLevel}
                        </Badge>
                      </div>
                      {/* Arrow */}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
