'use client'
import { BarChart3, TrendingUp, Award, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
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

function getGradeColorClass(grade: number) {
  if (grade >= 90) return 'text-success'
  if (grade >= 75) return 'text-warning'
  return 'text-destructive'
}

function getGradeBgClass(grade: number) {
  if (grade >= 90) return 'bg-success/10'
  if (grade >= 75) return 'bg-warning/10'
  return 'bg-destructive/10'
}

export default function StudentGrades() {
  const student = useCurrentStudent()

  const totalAssignments = gradesByClass.reduce((sum, cls) => sum + cls.assignments.length, 0)
  const avgGrade = Math.round(gradesByClass.reduce((sum, cls) => sum + cls.average, 0) / gradesByClass.length)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Academic Performance</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Grades</h1>
        <p className="text-sm text-muted-foreground mt-1">Current semester performance overview</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GPA Card */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current GPA</p>
                <p className="text-5xl font-bold text-primary tracking-tight">{student?.gpa.toFixed(1) ?? '--'}</p>
                <p className="text-sm text-muted-foreground mt-2">out of 4.0</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">+0.2</span>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
        </Card>

        {/* Average Grade */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Average Grade</p>
                <p className="text-5xl font-bold text-foreground tracking-tight">{avgGrade}%</p>
                <p className="text-sm text-muted-foreground mt-2">{letterGrade(avgGrade)} grade</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${getGradeBgClass(avgGrade)} flex items-center justify-center`}>
                <Award className={`w-7 h-7 ${getGradeColorClass(avgGrade)}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Graded */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Graded Work</p>
                <p className="text-5xl font-bold text-foreground tracking-tight">{totalAssignments}</p>
                <p className="text-sm text-muted-foreground mt-2">assignments this term</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GPA Trend Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            GPA Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaTrend}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007560" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#007560" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12, fill: 'currentColor' }} 
                  tickLine={false} 
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[2.5, 4]} 
                  tick={{ fontSize: 12, fill: 'currentColor' }} 
                  tickLine={false} 
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px', 
                    fontSize: 13,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#007560" 
                  strokeWidth={2.5} 
                  fill="url(#gpaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grades by Subject */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Grades by Subject</h2>
        
        <div className="grid gap-4">
          {gradesByClass.map((cls) => (
            <Card key={cls.classId} className="border-border/50 overflow-hidden">
              <CardHeader className="pb-4 bg-accent/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${getGradeBgClass(cls.average)} flex items-center justify-center`}>
                      <BookOpen className={`w-5 h-5 ${getGradeColorClass(cls.average)}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">{cls.subject}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{cls.teacher}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getGradeColorClass(cls.average)}`}>{cls.average}%</p>
                    <p className="text-xs text-muted-foreground">Class Average</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={cls.average} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {cls.assignments.map((a) => (
                    <div key={a.title} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${getGradeBgClass(a.grade)} flex items-center justify-center`}>
                          <span className={`text-sm font-bold ${getGradeColorClass(a.grade)}`}>{letterGrade(a.grade)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.date} &middot; {a.points}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${getGradeColorClass(a.grade)}`}>{a.grade}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
