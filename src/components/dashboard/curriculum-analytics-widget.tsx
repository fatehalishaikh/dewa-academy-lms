import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LayoutDashboard, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { curriculumHealthTimeline, curriculumInsights } from '@/data/mock-curriculum'
import { AddContextButton } from './add-context-button'

function healthColor(score: number) {
  if (score >= 88) return '#4CAF50'
  if (score >= 78) return '#FFC107'
  return '#EF4444'
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up')   return <TrendingUp   className="w-3 h-3 text-chart-4" />
  if (trend === 'down') return <TrendingDown  className="w-3 h-3 text-destructive" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

export function CurriculumAnalyticsWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Curriculum Analytics</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Term 2 2025-26
            </Badge>
            <AddContextButton
              id="curriculum-analytics"
              entry={{
                label: 'Curriculum Analytics',
                summary: 'Overall curriculum health reached 92/100 in Week 14, up from 72 at term start. Benchmark is 85. Mathematics leads at 92 health score, 95% standards covered. Social Studies lowest at 74 score, 68% coverage. Science trending down — needs attention.',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Overall curriculum health &amp; cross-subject AI insights — Term 2</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Area chart */}
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={curriculumHealthTimeline} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="currHealthScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="currBenchmarkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <ReferenceLine
                y={80}
                stroke="#FFC107"
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{ value: 'Min Target', position: 'insideTopRight', fontSize: 9, fill: '#FFC107' }}
              />
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 3"
                fill="url(#currBenchmarkGrad)"
                name="Benchmark"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="healthScore"
                stroke="#00B8A9"
                strokeWidth={2}
                fill="url(#currHealthScoreGrad)"
                name="Health Score"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-primary rounded" />
            <span className="text-[11px] text-muted-foreground">Health Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ background: '#3B82F6', borderTop: '2px dashed #3B82F6' }} />
            <span className="text-[11px] text-muted-foreground">Benchmark</span>
          </div>
        </div>

        {/* Subject insights */}
        <div className="space-y-1.5">
          {curriculumInsights.map(s => (
            <div key={s.subject} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-foreground w-32 truncate">{s.subject}</span>
              <div className="flex-1 flex items-center gap-2">
                <Progress value={s.healthScore} className="h-1.5 flex-1" />
                <span
                  className="text-[11px] font-semibold w-8 text-right"
                  style={{ color: healthColor(s.healthScore) }}
                >
                  {s.healthScore}
                </span>
              </div>
              <TrendIcon trend={s.trend} />
              <span className="text-[10px] text-muted-foreground w-24 text-right">
                {s.standardsCovered}% standards
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
