'use client'
import { BarChart3, TrendingUp, BookOpen, Star, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useCurrentStudent } from '@/stores/role-store'
import { gradesByClass, gradeColor, letterGrade } from '@/data/mock-grades'

const gpaTrend = [
  { period: 'Sep', gpa: 3.2 },
  { period: 'Oct', gpa: 3.4 },
  { period: 'Nov', gpa: 3.3 },
  { period: 'Dec', gpa: 3.5 },
  { period: 'Jan', gpa: 3.6 },
  { period: 'Feb', gpa: 3.7 },
  { period: 'Mar', gpa: 3.7 },
]


export default function StudentGrades() {
  const student = useCurrentStudent()

  const bestSubject = gradesByClass.reduce((best, cls) => cls.average > best.average ? cls : best, gradesByClass[0])
  const totalAssignments = gradesByClass.reduce((sum, cls) => sum + cls.assignments.length, 0)
  const gpa = student?.gpa ?? 0
  const attendance = student?.attendanceRate ?? 0

  return (
    <div className="p-6 space-y-6">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 px-7 py-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent-student) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-student) 30%, transparent)' }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Student Portal</p>
              <h1 className="text-xl font-bold text-white mt-0.5">Grades</h1>
              <p className="text-white/40 text-sm mt-0.5">Current semester academic performance</p>
            </div>
          </div>

          {/* Right — GPA + Attendance solid circles */}
          <div className="lg:col-span-2 px-7 py-6 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: 'rgba(0,184,169,0.12)', border: '5px solid rgba(0,184,169,0.35)' }}>
                <span className="text-xl font-bold text-white">{gpa.toFixed(1)}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">GPA</p>
                <p className="text-[11px] text-white/35">out of 4.0</p>
              </div>
            </div>
            <div className="w-px h-14 bg-white/[0.08]" />
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '5px solid rgba(16,185,129,0.35)' }}>
                <span className="text-xl font-bold text-white">{attendance}%</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Attendance</p>
                <p className="text-[11px] text-white/35">this semester</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Current GPA',  value: gpa.toFixed(1),         color: 'var(--accent-student)', icon: TrendingUp,  trend: '+0.2 this term' },
          { label: 'Subjects',     value: gradesByClass.length,   color: '#0EA5E9',               icon: BookOpen,    trend: 'This semester' },
          { label: 'Best Subject', value: bestSubject?.subject.split(' ')[0] ?? '—', color: '#F59E0B', icon: Star, trend: `${bestSubject?.average ?? 0}% avg` },
          { label: 'Assignments',  value: totalAssignments,       color: '#10B981',               icon: Award,       trend: 'Graded' },
        ].map(({ label, value, color, icon: Icon, trend }) => (
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
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GPA Trend — full width */}
      <Card className="rounded-xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            GPA Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160} minWidth={0}>
            <AreaChart data={gpaTrend}>
              <defs>
                <linearGradient id="studentGpaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.25 }} />
                  <stop offset="95%" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis domain={[2.5, 4]} tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="gpa" stroke="#27a086" strokeWidth={2} fill="url(#studentGpaAreaGrad)" dot={{ r: 2, fill: '#27a086' }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grades by class */}
      <div className="space-y-4">
        {gradesByClass.map((cls) => (
          <Card key={cls.classId} className="rounded-xl border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{cls.subject}</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{cls.teacher}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${gradeColor(cls.average)}`}>{cls.average}%</p>
                  <p className="text-[11px] text-muted-foreground">Class avg</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cls.assignments.map((a) => (
                  <div key={a.title} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground">{a.date} · {a.points}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] h-5">
                        {letterGrade(a.grade)}
                      </Badge>
                      <span className={`text-sm font-bold ${gradeColor(a.grade)}`}>{a.grade}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
