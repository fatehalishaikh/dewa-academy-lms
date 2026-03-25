import { Route, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { stageDistribution, pathwayRecommendations } from '@/data/mock-ilp'

const stageColors: Record<string, string> = {
  Assessment: '#8B9BB4',
  Foundation: '#EF4444',
  Core: '#3B82F6',
  Practice: '#FFC107',
  Mastery: '#00B8A9',
  Enrichment: '#4CAF50',
  Reflection: '#A855F7',
}

const moveStyles: Record<string, string> = {
  up: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  down: 'bg-destructive/10 text-destructive border-destructive/20',
  lateral: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
}

function getMoveDir(from: string, to: string) {
  const order = ['Assessment', 'Foundation', 'Core', 'Practice', 'Mastery', 'Enrichment', 'Reflection']
  const fi = order.indexOf(from), ti = order.indexOf(to)
  if (ti > fi) return 'up'
  if (ti < fi) return 'down'
  return 'lateral'
}

export function PathwayRecommendationsWidget() {
  const total = stageDistribution.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Pathway Recommendations</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {total} Active
            </Badge>
            <AddContextButton
              id="ilp-pathway-recommendations"
              entry={{
                label: 'Pathway Recommendations',
                summary: `287 students across 7 learning pathway stages. Most students (87) are in Core stage. 38 in Foundation (remedial). 4 AI-generated recommendations: Ahmed Al-Rashid moving Foundation→Core in Math (scored 82%), Omar Khalil regressing Core→Foundation in Chemistry (3 consecutive score drops).`
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Learning pathway stage distribution + AI adjustment suggestions</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage distribution bar chart */}
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageDistribution} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 8, fill: '#8B9BB4' }}
                tickLine={false} axisLine={false}
                interval={0}
                tickFormatter={s => s.slice(0, 4)}
              />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 2 }}
                itemStyle={{ color: '#94a3b8' }}
                formatter={(val: any) => [`${val} students`]}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={28}>
                {stageDistribution.map(d => (
                  <Cell key={d.stage} fill={stageColors[d.stage] ?? '#00B8A9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI recommendations */}
        <div className="space-y-1.5">
          {pathwayRecommendations.map(rec => {
            const dir = getMoveDir(rec.from, rec.to)
            const style = moveStyles[dir]
            return (
              <div key={rec.id} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-muted/40">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-primary">
                  {rec.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{rec.student}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{rec.subject} · {rec.reason}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{rec.from.slice(0,4)}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <Badge variant="outline" className={`text-[10px] ${style}`}>{rec.to.slice(0,4)}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
