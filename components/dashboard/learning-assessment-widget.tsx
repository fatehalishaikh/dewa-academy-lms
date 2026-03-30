import { Brain, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { styleDistribution, recentAssessments } from '@/data/mock-ilp'

const styleColors: Record<string, string> = {
  Visual: '#00B8A9',
  Auditory: '#3B82F6',
  'Reading-Writing': '#4CAF50',
  Kinesthetic: '#FFC107',
}

export function LearningAssessmentWidget() {
  const total = styleDistribution.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Learning Style Assessments</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {total} Assessed
            </Badge>
            <AddContextButton
              id="ilp-learning-assessment"
              entry={{
                label: 'Learning Style Assessments',
                summary: `287 students assessed. Style distribution: Visual 38% (109), Auditory 24% (69), Reading-Writing 21% (60), Kinesthetic 17% (49). Recent: Ahmed Al-Rashid — Visual, strengths in Geometry; Omar Khalil — Kinesthetic, barriers in Essay Writing.`
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI-detected learning profiles via adaptive diagnostic quizzes</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donut chart + legend side by side */}
        <div className="flex items-center gap-4">
          <div className="h-[120px] w-[120px] shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <PieChart>
                <Pie
                  data={styleDistribution.map(d => ({ count: d.count }))}
                  dataKey="count"
                  cx="50%" cy="50%"
                  innerRadius={36} outerRadius={54}
                >
                  {styleDistribution.map(d => (
                    <Cell key={d.style} fill={d.color} strokeWidth={0} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {styleDistribution.map(d => (
              <div key={d.style} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-[11px] text-muted-foreground">{d.style}</span>
                </div>
                <span className="text-[11px] font-semibold text-foreground">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent assessments */}
        <div className="space-y-1.5">
          {recentAssessments.map(a => (
            <div key={a.name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: styleColors[a.style] ?? '#00B8A9' }}>
                {a.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{a.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  ↑ {a.strengths[0]}
                  {a.barriers.length > 0 && ` · ↓ ${a.barriers[0]}`}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0"
                style={{ color: styleColors[a.style], borderColor: `${styleColors[a.style]}30`, background: `${styleColors[a.style]}10` }}>
                {a.style.split('-')[0]}
              </Badge>
              <div className="flex items-center gap-0.5 shrink-0">
                <TrendingUp className="w-3 h-3 text-chart-4" />
                <span className="text-[10px] font-semibold text-chart-4">{a.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
