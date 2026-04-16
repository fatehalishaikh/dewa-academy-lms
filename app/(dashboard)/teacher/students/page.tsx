'use client'
import { useState } from 'react'
import { Search, Users, AlertTriangle, CheckCircle2, ArrowRight, LayoutList, ShieldAlert, TrendingUp, TrendingDown, Minus, GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { students } from '@/data/mock-students'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1a2332', border: '1px solid #2d4057', borderRadius: 12, fontSize: 12, padding: '10px 14px' },
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

const RISK_COLORS = { high: '#B00020', moderate: '#D4AF37', low: '#007560' }
const RISK_BG = { high: 'bg-[#B00020]/10', moderate: 'bg-[#D4AF37]/10', low: 'bg-[#007560]/10' }
const RISK_TEXT = { high: 'text-[#B00020]', moderate: 'text-[#D4AF37]', low: 'text-[#007560]' }
const RISK_BORDER = { high: 'border-[#B00020]/30', moderate: 'border-[#D4AF37]/30', low: 'border-[#007560]/30' }

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
    { label: 'High', count: riskCounts.high, fill: '#B00020' },
    { label: 'Moderate', count: riskCounts.moderate, fill: '#D4AF37' },
    { label: 'Low', count: riskCounts.low, fill: '#007560' },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2878C1] via-[#1a5a8a] to-[#0f3d5c] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#007560]/20 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70 uppercase tracking-wider">My Students</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Student Roster</h1>
            <p className="text-white/70">{myStudents.length} students across {classes.length} classes</p>
          </div>
          
          {/* View toggle */}
          <div className="flex gap-2 self-start md:self-auto">
            <button
              onClick={() => setView('roster')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${view === 'roster' ? 'bg-white text-[#2878C1] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <LayoutList className="w-4 h-4" />
              Roster
            </button>
            <button
              onClick={() => setView('risk-dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${view === 'risk-dashboard' ? 'bg-white text-[#B00020] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <ShieldAlert className="w-4 h-4" />
              Risk Dashboard
            </button>
          </div>
        </div>
        
        {/* Stats inside hero */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Students', value: myStudents.length, icon: Users, color: 'white' },
            { label: 'On Track', value: myStudents.filter(s => s.status === 'active').length, icon: CheckCircle2, color: '#7FC9BB' },
            { label: 'At Risk', value: myStudents.filter(s => s.status === 'at-risk').length, icon: AlertTriangle, color: '#B00020' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4" style={{ color }} />
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

      {view === 'roster' ? (
        <>
          {/* Search + filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full bg-card border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-lg transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'at-risk'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white shadow-lg' : 'bg-accent/50 text-muted-foreground hover:bg-accent border border-border/50'}`}
                >
                  {f === 'all' ? 'All Students' : 'At Risk Only'}
                </button>
              ))}
            </div>
          </div>

          {/* Student list */}
          <div className="space-y-3">
            {filtered.map((stu) => {
              const studentClasses = classes.filter(c => c.studentIds.includes(stu.id))
              const gpaColor = stu.gpa >= 3.5 ? '#007560' : stu.gpa >= 2.5 ? '#D4AF37' : '#B00020'
              const attColor = stu.attendanceRate >= 90 ? '#007560' : stu.attendanceRate >= 80 ? '#D4AF37' : '#B00020'
              
              return (
                <Card
                  key={stu.id}
                  className="group relative overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/teacher/students/${stu.id}`)}
                >
                  {stu.status === 'at-risk' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 shrink-0 shadow-lg">
                        <AvatarFallback 
                          className="text-sm font-bold text-white" 
                          style={{ background: `linear-gradient(135deg, ${stu.avatarColor}, ${stu.avatarColor}cc)` }}
                        >
                          {stu.initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{stu.name}</p>
                          {stu.status === 'at-risk' && (
                            <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5 gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              At Risk
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {stu.gradeLevel} · {studentClasses.map(c => c.subject).join(', ')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-8 shrink-0">
                        <div className="text-center">
                          <p className="text-xl font-bold" style={{ color: gpaColor }}>{stu.gpa.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">GPA</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold" style={{ color: attColor }}>{stu.attendanceRate}%</p>
                            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${stu.attendanceRate}%`, background: attColor }} />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {filtered.length === 0 && (
              <Card className="border-border/50">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">No students found</p>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        /* Risk Dashboard */
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {([
              { label: 'High Risk', key: 'high' as const, icon: AlertTriangle, description: 'Needs immediate attention' },
              { label: 'Moderate Risk', key: 'moderate' as const, icon: ShieldAlert, description: 'Monitor closely' },
              { label: 'Low Risk', key: 'low' as const, icon: CheckCircle2, description: 'On track' },
            ]).map(({ label, key, icon: Icon, description }) => (
              <Card key={key} className={`relative overflow-hidden border-border/50 hover:shadow-lg transition-all ${RISK_BORDER[key]}`}>
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: RISK_COLORS[key] }} />
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}
                      style={{ background: `linear-gradient(135deg, ${RISK_COLORS[key]}, ${RISK_COLORS[key]}cc)` }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{riskCounts[key]}</p>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk distribution chart */}
          <Card className="border-border/50 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <p className="text-base font-semibold text-foreground mb-4">Risk Distribution</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={distributionData} barSize={60}>
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#8B9BB4' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    {...TOOLTIP_STYLE}
                    formatter={(val) => [`${val} students`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {distributionData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sortable risk table */}
          <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-base font-semibold text-foreground">Student Risk Table</p>
                <div className="flex gap-2">
                  {(['risk', 'gpa', 'attendance'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${sortBy === s ? 'bg-primary text-white shadow' : 'bg-accent/50 text-muted-foreground hover:bg-accent border border-border/50'}`}
                    >
                      {s === 'risk' ? 'Risk Score' : s === 'gpa' ? 'GPA' : 'Attendance'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_100px_140px_80px_32px] gap-3 px-3 py-2 border-b border-border/50 mb-2">
                {['Student', 'GPA', 'Attendance', 'Risk Score', 'Status', ''].map(h => (
                  <p key={h} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</p>
                ))}
              </div>

              <div className="space-y-2">
                {sortedRiskStudents.map(stu => {
                  const TrendIcon = stu.trend === 'up' ? TrendingUp : stu.trend === 'down' ? TrendingDown : Minus
                  const trendColor = stu.trend === 'up' ? '#007560' : stu.trend === 'down' ? '#B00020' : '#6B7280'
                  const gpaColor = stu.gpa >= 3.5 ? '#007560' : stu.gpa >= 2.5 ? '#D4AF37' : '#B00020'
                  const attColor = stu.attendanceRate >= 90 ? '#007560' : stu.attendanceRate >= 80 ? '#D4AF37' : '#B00020'
                  
                  return (
                    <div
                      key={stu.id}
                      className="grid grid-cols-[1fr_80px_100px_140px_80px_32px] gap-3 items-center px-3 py-3 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors border border-transparent hover:border-border/50"
                      onClick={() => router.push(`/teacher/students/${stu.id}`)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback 
                            className="text-xs font-bold text-white" 
                            style={{ background: `linear-gradient(135deg, ${stu.avatarColor}, ${stu.avatarColor}cc)` }}
                          >
                            {stu.initials}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-foreground truncate">{stu.name}</p>
                      </div>
                      <p className="text-sm font-bold" style={{ color: gpaColor }}>{stu.gpa.toFixed(1)}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold" style={{ color: attColor }}>{stu.attendanceRate}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${stu.riskScore}%`, background: RISK_COLORS[stu.riskLevel] }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-6 text-right ${RISK_TEXT[stu.riskLevel]}`}>{stu.riskScore}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-5 px-2 ${RISK_BORDER[stu.riskLevel]} ${RISK_TEXT[stu.riskLevel]} ${RISK_BG[stu.riskLevel]}`}
                        >
                          {stu.riskLevel}
                        </Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
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
