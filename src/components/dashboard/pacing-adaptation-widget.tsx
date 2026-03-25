import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gauge } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { pacingTimeline, pacingAdjustments } from '@/data/mock-curriculum'
import { AddContextButton } from './add-context-button'

const urgencyStyles: Record<string, string> = {
  high:     'bg-destructive/10 text-destructive border-destructive/20',
  moderate: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  low:      'bg-chart-4/10 text-chart-4 border-chart-4/20',
}

export function PacingAdaptationWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Pacing &amp; AI Adaptation</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-chart-5/10 text-chart-5 border-chart-5/20">
              3 Adjustments
            </Badge>
            <AddContextButton
              id="pacing-adaptation"
              entry={{
                label: 'Pacing & AI Adaptation',
                summary: 'Curriculum is currently 9% behind planned pace (91% vs 100% target at Week 12). Science needs acceleration: 2.5 weeks behind. Math recommended to slow down due to low comprehension. English on track.',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Planned vs actual curriculum pacing with AI adjustments</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dual area chart */}
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pacingTimeline} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="currPacingPlannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="currPacingActualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 3"
                fill="url(#currPacingPlannedGrad)"
                name="Planned Pace"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#00B8A9"
                strokeWidth={2}
                fill="url(#currPacingActualGrad)"
                name="Actual Progress"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ background: '#3B82F6', borderTop: '2px dashed #3B82F6' }} />
            <span className="text-[11px] text-muted-foreground">Planned Pace</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-primary rounded" />
            <span className="text-[11px] text-muted-foreground">Actual Progress</span>
          </div>
        </div>

        {/* AI adjustments */}
        <div className="space-y-2">
          {pacingAdjustments.map(a => (
            <div key={a.subject} className="flex items-start justify-between gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground">{a.subject}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{a.recommendation}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] capitalize shrink-0 ${urgencyStyles[a.urgency]}`}>
                {a.urgency === 'high' ? 'Urgent' : a.urgency === 'moderate' ? 'Review' : 'On Track'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
