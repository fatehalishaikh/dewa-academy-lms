'use client'
import { useState } from 'react'
import { BarChart3, TrendingUp, BookOpen, Star, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

const ACCENT = '#8B5CF6'

const SUBJECTS = [
  { subject: 'Mathematics', teacher: 'Dr. Sarah Ahmed', assignmentTitles: ['Chapter 4 Quiz', 'Problem Set 3', 'Mid-Unit Test'], points: ['23/25', '40/50', '44/50'] },
  { subject: 'Physics', teacher: 'Mr. James Wilson', assignmentTitles: ['Midterm Exam', 'Lab Report 2', 'Waves Problem Set'], points: ['78/100', '75/100', '71/100'] },
  { subject: 'Arabic Language', teacher: 'Ms. Fatima Al-Rashidi', assignmentTitles: ['Essay Writing', 'Grammar Test', 'Reading Comprehension'], points: ['18/20', '35/40', '42/50'] },
  { subject: 'Islamic Studies', teacher: 'Dr. Khalid Hassan', assignmentTitles: ['Recitation Assessment', 'Written Test', 'Project'], points: ['9/10', '45/50', '28/30'] },
]

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#00B8A9',
  Physics: '#0EA5E9',
  'Arabic Language': '#F59E0B',
  'Islamic Studies': '#10B981',
}

const DATES = ['Mar 20', 'Mar 10', 'Feb 28', 'Mar 18', 'Mar 5', 'Feb 20', 'Mar 15', 'Mar 2', 'Feb 25']

function getGradesByClass(studentId: string) {
  let seed = 5381
  for (let i = 0; i < studentId.length; i++) {
    seed = (((seed << 5) + seed) ^ studentId.charCodeAt(i)) | 0
  }
  seed = Math.abs(seed)
  return SUBJECTS.map((s) => {
    const assignments = s.assignmentTitles.map((title, i) => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      const grade = 55 + (seed % 46)
      return { title, grade, date: DATES[(seed % DATES.length)], points: s.points[i] }
    })
    const average = Math.round(assignments.reduce((sum, a) => sum + a.grade, 0) / assignments.length)
    return { subject: s.subject, teacher: s.teacher, average, assignments }
  })
}

function getGpaTrend(gpa: number) {
  const start = Math.max(2.0, gpa - 0.5)
  const periods = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  return periods.map((period, i) => ({
    period,
    gpa: parseFloat((start + (gpa - start) * (i / (periods.length - 1)) + (i % 2 === 0 ? 0 : -0.05)).toFixed(2)),
  }))
}

function gradeColorClass(g: number) {
  if (g >= 90) return 'text-emerald-400'
  if (g >= 75) return 'text-amber-400'
  return 'text-red-400'
}

function gradeColorHex(g: number) {
  if (g >= 90) return '#10B981'
  if (g >= 75) return '#F59E0B'
  return '#EF4444'
}

function letterGrade(g: number) {
  if (g >= 90) return 'A'
  if (g >= 80) return 'B'
  if (g >= 70) return 'C'
  if (g >= 60) return 'D'
  return 'F'
}

function gradeLabel(g: number) {
  if (g >= 90) return 'Excellent'
  if (g >= 80) return 'Good'
  if (g >= 75) return 'Average'
  return 'Below avg'
}

function subjectColor(s: string) { return SUBJECT_COLORS[s] ?? ACCENT }

export default function ParentGrades() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const child = children[selectedIdx] ?? null

  const gradesByClass = child ? getGradesByClass(child.id) : []
  const bestSubject = gradesByClass.reduce((best, cls) => cls.average > best.average ? cls : best, gradesByClass[0])
  const totalAssignments = gradesByClass.reduce((sum, cls) => sum + cls.assignments.length, 0)
  const gpa = child?.gpa ?? 0
  const attendance = child?.attendanceRate ?? 0

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0d0920 0%, #150d2e 55%, #070d1f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 p-7 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`, border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Parent Portal</p>
                <h1 className="text-xl font-bold text-white mt-0.5">
                  {child?.name.split(' ')[0] ?? 'Child'}&apos;s Grades
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                  {child?.gradeLevel} · Section {child?.section} · Current semester
                </p>
              </div>
            </div>

            {/* Child selector */}
            {children.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {children.map((c, i) => c && (
                  <button
                    key={c.id}
                    onClick={() => setSelectedIdx(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    style={i === selectedIdx
                      ? { background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`, borderColor: `color-mix(in srgb, ${ACCENT} 40%, transparent)`, color: '#fff' }
                      : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }
                    }
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: c.avatarColor }}>
                      {c.initials[0]}
                    </div>
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — metrics */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* GPA */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`, border: `5px solid color-mix(in srgb, ${ACCENT} 35%, transparent)` }}>
                <span className="text-xl font-bold text-white">{gpa.toFixed(1)}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">GPA</p>
                <p className="text-[11px] text-white/35">out of 4.0</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Attendance */}
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
          { label: 'Current GPA',  value: gpa.toFixed(1),                                        color: ACCENT,    icon: TrendingUp, trend: '+0.2 this term'                      },
          { label: 'Subjects',     value: gradesByClass.length,                                   color: '#0EA5E9', icon: BookOpen,   trend: 'This semester'                       },
          { label: 'Best Subject', value: bestSubject?.subject.split(' ')[0] ?? '—',              color: '#F59E0B', icon: Star,       trend: `${bestSubject?.average ?? 0}% avg`   },
          { label: 'Assignments',  value: totalAssignments,                                       color: '#10B981', icon: Award,      trend: 'Graded'                              },
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

      {/* ── GPA TREND ── */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            GPA Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160} minWidth={0}>
            <AreaChart data={getGpaTrend(gpa)}>
              <defs>
                <linearGradient id="parentGpaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  style={{ stopColor: ACCENT, stopOpacity: 0.25 }} />
                  <stop offset="95%" style={{ stopColor: ACCENT, stopOpacity: 0 }} />
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
              <Area type="monotone" dataKey="gpa" stroke={ACCENT} strokeWidth={2} fill="url(#parentGpaAreaGrad)" dot={{ r: 2, fill: ACCENT }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── GRADES BY SUBJECT ── */}
      <div className="space-y-4">
        {gradesByClass.map((cls) => {
          const sc = subjectColor(cls.subject)
          const gc = gradeColorHex(cls.average)
          return (
            <Card key={cls.subject} className="border-border overflow-hidden pt-0 gap-0">
              {/* Subject color top bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${sc}, color-mix(in srgb, ${sc} 30%, transparent))` }} />
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: sc }}>
                      {cls.subject.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{cls.subject}</CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{cls.teacher}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold leading-none ${gradeColorClass(cls.average)}`}>{cls.average}%</p>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${cls.average}%`, background: gc }} />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: gc }}>{gradeLabel(cls.average)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  {cls.assignments.map((a) => (
                    <div key={a.title} className="flex items-stretch rounded-xl border border-border overflow-hidden hover:border-primary/20 transition-colors">
                      <div className="w-1 shrink-0" style={{ background: gradeColorHex(a.grade) }} />
                      <div className="flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground">{a.title}</p>
                          <p className="text-[11px] text-muted-foreground">{a.date} · {a.points}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[11px] h-5">{letterGrade(a.grade)}</Badge>
                          <span className={`text-sm font-bold ${gradeColorClass(a.grade)}`}>{a.grade}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
