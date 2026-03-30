import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { AddContextButton } from './add-context-button'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'
import { engagementTimeline, studentEngagement } from '@/data/mock-class-activities'

const statusStyles: Record<string, { badge: string; color: string }> = {
  'at-risk': { badge: 'bg-destructive/10 text-destructive border-destructive/20', color: '#EF4444' },
  'engaged': { badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20', color: '#4CAF50' },
  'stable': { badge: 'bg-primary/10 text-primary border-primary/20', color: '#00B8A9' },
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-chart-4" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

export function EngagementWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Engagement & Risk Analytics</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
              2 At-Risk
            </Badge>
            <AddContextButton
              id="engagement"
              entry={{ label: 'Engagement', summary: '2 at-risk students: Layla Mahmoud (42%, trending down) and Youssef Nabil (55%, trending down). Class average trending downward over 14 days.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">14-day engagement trend — all classes</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Area chart */}
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={engagementTimeline} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[50, 100]} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <ReferenceLine y={65} stroke="#EF4444" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: 'At-Risk', position: 'insideTopRight', fontSize: 9, fill: '#EF4444' }} />
              <Area type="monotone" dataKey="avg" stroke="#00B8A9" strokeWidth={2} fill="url(#engagementGrad)" name="Class Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Student table */}
        <div className="space-y-1.5">
          {studentEngagement.map(s => {
            const cfg = statusStyles[s.status]
            return (
              <div key={s.name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
                <span className="text-xs font-medium text-foreground w-32 truncate">{s.name}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={s.score} className="h-1.5 flex-1" />
                  <span className="text-[11px] font-semibold w-8 text-right" style={{ color: cfg.color }}>{s.score}%</span>
                </div>
                <TrendIcon trend={s.trend} />
                <Badge variant="outline" className={`text-[10px] capitalize ${cfg.badge}`}>
                  {s.status === 'at-risk' ? 'At Risk' : s.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
