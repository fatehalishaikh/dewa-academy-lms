import { useState } from 'react'
import { Sparkles, BarChart3, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

const SUBJECTS = [
  { subject: 'Mathematics', teacher: 'Dr. Sarah Ahmed', assignmentTitles: ['Chapter 4 Quiz', 'Problem Set 3', 'Mid-Unit Test'], points: ['23/25', '40/50', '44/50'] },
  { subject: 'Physics', teacher: 'Mr. James Wilson', assignmentTitles: ['Midterm Exam', 'Lab Report 2', 'Waves Problem Set'], points: ['78/100', '75/100', '71/100'] },
  { subject: 'Arabic Language', teacher: 'Ms. Fatima Al-Rashidi', assignmentTitles: ['Essay Writing', 'Grammar Test', 'Reading Comprehension'], points: ['18/20', '35/40', '42/50'] },
  { subject: 'Islamic Studies', teacher: 'Dr. Khalid Hassan', assignmentTitles: ['Recitation Assessment', 'Written Test', 'Project'], points: ['9/10', '45/50', '28/30'] },
]

const DATES = ['Mar 20', 'Mar 10', 'Feb 28', 'Mar 18', 'Mar 5', 'Feb 20', 'Mar 15', 'Mar 2', 'Feb 25']

function getGradesByClass(studentId: string) {
  let seed = 0
  for (const c of studentId) seed = (seed * 31 + c.charCodeAt(0)) & 0xffff

  return SUBJECTS.map((s) => {
    const assignments = s.assignmentTitles.map((title, i) => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      const grade = 55 + (seed % 46) // 55–100
      return { title, grade, date: DATES[(seed % DATES.length)], points: s.points[i] }
    })
    const average = Math.round(assignments.reduce((sum, a) => sum + a.grade, 0) / assignments.length)
    return { subject: s.subject, teacher: s.teacher, average, assignments }
  })
}

function getGpaTrend(gpa: number) {
  // Generate a plausible semester trend ending at the child's current GPA
  const start = Math.max(2.0, gpa - 0.5)
  const periods = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  return periods.map((period, i) => ({
    period,
    gpa: parseFloat((start + (gpa - start) * (i / (periods.length - 1)) + (i % 2 === 0 ? 0 : -0.05)).toFixed(2)),
  }))
}

function gradeColor(g: number) {
  if (g >= 90) return 'text-emerald-400'
  if (g >= 75) return 'text-amber-400'
  return 'text-red-400'
}

function letterGrade(g: number) {
  if (g >= 90) return 'A'
  if (g >= 80) return 'B'
  if (g >= 70) return 'C'
  if (g >= 60) return 'D'
  return 'F'
}

export function ParentGrades() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const child = children[selectedIdx] ?? null

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Academic Progress</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">{child?.name ?? 'Child'}'s Grades</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Current semester performance — {child?.gradeLevel} Section {child?.section}</p>
      </div>

      {children.length > 1 && (
        <div className="flex gap-2">
          {children.map((c, i) => (
            <button
              key={c!.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                i === selectedIdx
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {c!.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border">
          <CardContent className="p-5 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current GPA</p>
            <p className="text-4xl font-bold text-primary">{child?.gpa.toFixed(1) ?? '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">out of 4.0</p>
            <div className="mt-3 flex items-center justify-center gap-1 text-emerald-400 text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Improving this semester</span>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              GPA Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={getGpaTrend(child?.gpa ?? 3.5)}>
                <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis domain={[2.5, 4]} tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="gpa" stroke="#00B8A9" strokeWidth={2} dot={{ r: 2, fill: '#00B8A9' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {(child ? getGradesByClass(child.id) : []).map((cls) => (
        <Card key={cls.subject} className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">{cls.subject}</CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">{cls.teacher}</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${gradeColor(cls.average)}`}>{cls.average}%</p>
                <p className="text-[10px] text-muted-foreground">{letterGrade(cls.average)} grade</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cls.assignments.map((a) => (
                <div key={a.title} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.date} · {a.points}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-5">{letterGrade(a.grade)}</Badge>
                    <span className={`text-sm font-bold ${gradeColor(a.grade)}`}>{a.grade}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
