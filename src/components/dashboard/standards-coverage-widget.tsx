import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ShieldCheck } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { standardItems } from '@/data/mock-curriculum'
import { AddContextButton } from './add-context-button'

const COVERAGE_COLORS = ['#00B8A9', '#FFC107', '#EF4444']

const coverageData = [
  { name: 'Covered',  value: 74 },
  { name: 'Partial',  value: 14 },
  { name: 'Gaps',     value: 12 },
]

const statusStyles: Record<string, string> = {
  covered:   'bg-chart-4/10 text-chart-4 border-chart-4/20',
  partial:   'bg-chart-5/10 text-chart-5 border-chart-5/20',
  gap:       'bg-destructive/10 text-destructive border-destructive/20',
  redundant: 'bg-primary/10 text-primary border-primary/20',
}

const statusLabels: Record<string, string> = {
  covered:   'Covered',
  partial:   'Partial',
  gap:       'Gap',
  redundant: 'Redundant',
}

function coverageBarColor(status: string) {
  if (status === 'covered')   return '#4CAF50'
  if (status === 'partial')   return '#FFC107'
  if (status === 'gap')       return '#EF4444'
  return '#00B8A9'
}

export function StandardsCoverageWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Standards Coverage</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
              12 Gaps Found
            </Badge>
            <AddContextButton
              id="standards-coverage"
              entry={{
                label: 'Standards Coverage',
                summary: '74% of KHDA/MOE standards fully covered, 14% partially covered, 12% have gaps. Key gap: KHDA-E-2.3 Critical Reading at 28% coverage. Redundant standard: MOE-A-5.1 Classical Arabic Forms at 100%.',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">KHDA/MOE standards coverage with gap identification</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donut chart */}
        <div className="relative h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={coverageData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={54}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {coverageData.map((_, i) => (
                  <Cell key={i} fill={COVERAGE_COLORS[i]} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">74%</span>
            <span className="text-[10px] text-muted-foreground">Covered</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {coverageData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: COVERAGE_COLORS[i] }} />
              <span className="text-[11px] text-muted-foreground">{d.value}% {d.name}</span>
            </div>
          ))}
        </div>

        {/* Standards list */}
        <div className="space-y-2">
          {standardItems.map(s => (
            <div key={s.code} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{s.code}</span>
                  <span className="text-xs font-medium text-foreground truncate">{s.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Progress value={s.coverage} className="h-1.5 flex-1" style={{ '--progress-background': coverageBarColor(s.status) } as React.CSSProperties} />
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{s.coverage}%</span>
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] shrink-0 ${statusStyles[s.status]}`}>
                {statusLabels[s.status]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
