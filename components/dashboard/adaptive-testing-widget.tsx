import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SlidersHorizontal, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { adaptiveSummary, adaptiveStudents } from '@/data/mock-assessments'
import { AddContextButton } from './add-context-button'

const DIFFICULTY_COLORS = ['#4CAF50', '#FFC107', '#EF4444']

const difficultyBadge: Record<string, string> = {
  Easy: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Medium: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Hard: 'bg-destructive/10 text-destructive border-destructive/20',
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-chart-4" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

export function AdaptiveTestingWidget() {
  const data = [
    { name: 'Easy', value: adaptiveSummary.easy },
    { name: 'Medium', value: adaptiveSummary.medium },
    { name: 'Hard', value: adaptiveSummary.hard },
  ]

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Adaptive Testing</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Live
            </Badge>
            <AddContextButton
              id="adaptive-testing"
              entry={{ label: 'Adaptive Testing', summary: '312 students in adaptive testing. Difficulty distribution: 22% easy (68), 50% medium (156), 28% hard (88). Average accuracy 74%. 3 students recently elevated to hard difficulty.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Difficulty adjustment across {adaptiveSummary.total} students</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donut chart */}
        <div className="relative h-[120px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={54}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={DIFFICULTY_COLORS[i]} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{adaptiveSummary.total}</span>
            <span className="text-[11px] text-muted-foreground">Students</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: DIFFICULTY_COLORS[i] }} />
              <span className="text-[11px] text-muted-foreground">{d.value} {d.name}</span>
            </div>
          ))}
        </div>

        {/* Student rows */}
        <div className="space-y-2">
          {adaptiveStudents.map(s => (
            <div key={s.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="flex items-center gap-2">
                <TrendIcon trend={s.trend} />
                <div>
                  <p className="text-xs font-medium text-foreground">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.questionsAnswered} answered · {s.accuracy}% accuracy</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-[11px] ${difficultyBadge[s.difficulty]}`}>
                {s.difficulty}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
