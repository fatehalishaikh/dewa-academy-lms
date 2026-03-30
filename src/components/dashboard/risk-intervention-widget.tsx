import { ShieldAlert, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AddContextButton } from './add-context-button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { riskTimeline, ilpRiskStudents } from '@/data/mock-ilp'

const riskStyles: Record<string, { badge: string; color: string }> = {
  high: { badge: 'bg-destructive/10 text-destructive border-destructive/20', color: '#EF4444' },
  moderate: { badge: 'bg-chart-5/10 text-chart-5 border-chart-5/20', color: '#FFC107' },
  low: { badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20', color: '#4CAF50' },
  none: { badge: 'bg-primary/10 text-primary border-primary/20', color: '#00B8A9' },
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-destructive" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-chart-4" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

const highRisk = ilpRiskStudents.filter(s => s.riskLevel === 'high').length

export function RiskInterventionWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Risk Analysis &amp; Interventions</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
              {highRisk} High Risk
            </Badge>
            <AddContextButton
              id="ilp-risk-intervention"
              entry={{
                label: 'Risk Analysis & Interventions',
                summary: `${highRisk} high-risk students identified. Risk score trending upward — predicted average risk score of 70 in 2 weeks. Highest risk: Omar Khalil (78, declining grades + low engagement). 2 moderate-risk students. Automated interventions triggered.`
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">14-day actual + 14-day AI risk forecast</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Risk timeline chart */}
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={riskTimeline} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="riskActualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="riskPredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC107" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[20, 80]} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <ReferenceLine
                y={70}
                stroke="#EF4444"
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{ value: 'High Risk', position: 'insideTopRight', fontSize: 9, fill: '#EF4444' }}
              />
              <Area type="monotone" dataKey="actual" stroke="#EF4444" strokeWidth={2}
                fill="url(#riskActualGrad)" name="Actual Risk" connectNulls={false} dot={false} />
              <Area type="monotone" dataKey="predicted" stroke="#FFC107" strokeWidth={2}
                strokeDasharray="5 3" fill="url(#riskPredGrad)" name="Predicted Risk" connectNulls={false} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ background: '#EF4444' }} />
            <span className="text-[11px] text-muted-foreground">Actual risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ borderTop: '2px dashed #FFC107' }} />
            <span className="text-[11px] text-muted-foreground">Predicted</span>
          </div>
        </div>

        {/* Risk students */}
        <div className="space-y-1.5">
          {ilpRiskStudents.map(s => {
            const cfg = riskStyles[s.riskLevel]
            return (
              <div key={s.name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
                <span className="text-xs font-medium text-foreground w-28 truncate">{s.name}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={s.riskScore} className="h-1.5 flex-1" />
                  <span className="text-[11px] font-semibold w-8 text-right" style={{ color: cfg.color }}>{s.riskScore}</span>
                </div>
                <TrendIcon trend={s.trend} />
                <Badge variant="outline" className={`text-[10px] capitalize ${cfg.badge}`}>
                  {s.riskLevel === 'none' ? 'Safe' : s.riskLevel === 'high' ? 'High' : s.riskLevel === 'moderate' ? 'Mod.' : 'Low'}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
