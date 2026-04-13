import { Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AddContextButton } from './add-context-button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { goalCompletions, studentGoals } from '@/data/mock-ilp'

const statusStyles: Record<string, { badge: string; color: string }> = {
  on_track: { badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20', color: '#4CAF50' },
  at_risk: { badge: 'bg-destructive/10 text-destructive border-destructive/20', color: '#EF4444' },
  completed: { badge: 'bg-primary/10 text-primary border-primary/20', color: '#00B8A9' },
}

const totalActive = goalCompletions.reduce((s, g) => s + g.active, 0)

export function GoalReflectionWidget() {
  const chartData = goalCompletions.map(g => ({
    category: g.category,
    pct: Math.round((g.completed / g.active) * 100),
    color: g.color,
  }))

  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Goal Setting &amp; Reflections</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {totalActive} Goals Active
            </Badge>
            <AddContextButton
              id="ilp-goal-reflection"
              entry={{
                label: 'Goal Setting & Reflections',
                summary: `287 active goals across 4 categories. Academic goal completion: 47% (58/124). Career: 36% (24/67). Personal: 68% (38/56). Behavioral: 55% (22/40). AI advisor conducting weekly reflections. Sara Al-Mansoori completed English Mastery goal. Omar Khalil's behavioral goal at risk (38% progress).`
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Goal completion by category + AI-assisted reflection schedule</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goal completion bar chart */}
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false}
                  domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#8B9BB4' }}
                  tickLine={false} axisLine={false} width={72} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  formatter={(val: any) => [`${val}% completion`]}
                />
                <Bar dataKey="pct" radius={[0, 3, 3, 0]} maxBarSize={20}>
                  {chartData.map(d => (
                    <Cell key={d.category} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category legend */}
          <div className="flex flex-col justify-center gap-2.5">
            {goalCompletions.map(g => (
              <div key={g.category} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: g.color }} />
                  <span className="text-xs text-muted-foreground">{g.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={Math.round((g.completed / g.active) * 100)} className="w-16 h-1.5" />
                  <span className="text-[11px] font-semibold text-foreground w-12 text-right">
                    {g.completed}/{g.active}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student goals */}
        <div className="space-y-1.5">
          {studentGoals.map(s => {
            const cfg = statusStyles[s.status]
            return (
              <div key={s.student} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-primary">
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{s.goal}</p>
                  <p className="text-[10px] text-muted-foreground">{s.student} · Next reflection: {s.nextReflection}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    <Progress value={s.progress} className="w-14 h-1.5" />
                    <span className="text-[11px] font-semibold w-8 text-right" style={{ color: cfg.color }}>{s.progress}%</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${cfg.badge}`}>
                    {s.status === 'on_track' ? 'On Track' : s.status === 'at_risk' ? 'At Risk' : 'Done'}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
