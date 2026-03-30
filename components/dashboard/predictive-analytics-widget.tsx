import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AddContextButton } from './add-context-button'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { performanceTimeline, riskStudents } from '@/data/mock-assessments'

const riskStyles: Record<string, { badge: string; color: string }> = {
  high: { badge: 'bg-destructive/10 text-destructive border-destructive/20', color: '#EF4444' },
  moderate: { badge: 'bg-chart-5/10 text-chart-5 border-chart-5/20', color: '#FFC107' },
  low: { badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20', color: '#4CAF50' },
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-chart-4" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

export function PredictiveAnalyticsWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Performance Predictions &amp; Risk</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
              7 At-Risk
            </Badge>
            <AddContextButton
              id="predictive-analytics"
              entry={{ label: 'Predictive Analytics', summary: '7 students predicted at-risk for upcoming assessments. Highest risk: Ahmed Khalil (predicted 42%), Layla Mahmoud (predicted 48%). Class average predicted at 68%, down from 73% current.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">14-day actual + 14-day AI forecast — all cohorts</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dual area chart */}
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <AreaChart data={performanceTimeline} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[50, 90]} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <ReferenceLine
                y={60}
                stroke="#EF4444"
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{ value: 'At-Risk', position: 'insideTopRight', fontSize: 9, fill: '#EF4444' }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#00B8A9"
                strokeWidth={2}
                fill="url(#actualGrad)"
                name="Actual"
                connectNulls={false}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 3"
                fill="url(#predictedGrad)"
                name="Predicted"
                connectNulls={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart legend */}
        <div className="flex items-center gap-5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-primary rounded" />
            <span className="text-[11px] text-muted-foreground">Actual performance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ background: '#3B82F6', borderTop: '2px dashed #3B82F6' }} />
            <span className="text-[11px] text-muted-foreground">AI Forecast</span>
          </div>
        </div>

        {/* Risk student table */}
        <div className="space-y-1.5">
          {riskStudents.map(s => {
            const cfg = riskStyles[s.riskLevel]
            return (
              <div key={s.name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
                <span className="text-xs font-medium text-foreground w-32 truncate">{s.name}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={s.predictedScore} className="h-1.5 flex-1" />
                  <span className="text-[11px] font-semibold w-8 text-right" style={{ color: cfg.color }}>{s.predictedScore}%</span>
                </div>
                <TrendIcon trend={s.trend} />
                <Badge variant="outline" className={`text-[10px] capitalize ${cfg.badge}`}>
                  {s.riskLevel === 'high' ? 'High Risk' : s.riskLevel === 'moderate' ? 'Moderate' : 'Low Risk'}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
