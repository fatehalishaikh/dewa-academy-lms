import { Sparkles, BarChart3, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

const gradesByClass = [
  { subject: 'Mathematics', teacher: 'Dr. Sarah Ahmed', average: 84, trend: 'up', assignments: [
    { title: 'Chapter 4 Quiz', grade: 92, date: 'Mar 20', points: '23/25' },
    { title: 'Problem Set 3', grade: 80, date: 'Mar 10', points: '40/50' },
    { title: 'Mid-Unit Test', grade: 88, date: 'Feb 28', points: '44/50' },
  ]},
  { subject: 'Physics', teacher: 'Mr. James Wilson', average: 76, trend: 'down', assignments: [
    { title: 'Midterm Exam', grade: 78, date: 'Mar 18', points: '78/100' },
    { title: 'Lab Report 2', grade: 75, date: 'Mar 5', points: '75/100' },
    { title: 'Waves Problem Set', grade: 71, date: 'Feb 20', points: '71/100' },
  ]},
]

const gpaTrend = [
  { period: 'Sep', gpa: 3.2 }, { period: 'Oct', gpa: 3.4 }, { period: 'Nov', gpa: 3.3 },
  { period: 'Dec', gpa: 3.5 }, { period: 'Jan', gpa: 3.6 }, { period: 'Feb', gpa: 3.7 }, { period: 'Mar', gpa: 3.7 },
]

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
  const child = parent ? getStudentById(parent.childIds[0]) : null

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
              <LineChart data={gpaTrend}>
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

      {gradesByClass.map((cls) => (
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
