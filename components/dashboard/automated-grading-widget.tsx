import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FileCheck2, Bot } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { gradingItems, gradingSummary } from '@/data/mock-assessments'
import { AddContextButton } from './add-context-button'

const GRADING_COLORS = ['#00B8A9', '#FFC107', '#EF4444']

const statusStyles: Record<string, string> = {
  graded: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  review: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  manual: 'bg-destructive/10 text-destructive border-destructive/20',
}

const statusLabels: Record<string, string> = {
  graded: 'Auto-Graded',
  review: 'Review',
  manual: 'Manual',
}

function confidenceColor(score: number) {
  if (score >= 90) return '#4CAF50'
  if (score >= 75) return '#FFC107'
  return '#EF4444'
}

export function AutomatedGradingWidget() {
  const data = [
    { name: 'Auto-Graded', value: gradingSummary.autoGraded },
    { name: 'Pending Review', value: gradingSummary.pendingReview },
    { name: 'Manual', value: gradingSummary.manualRequired },
  ]

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Automated Grading</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              NLP Active
            </Badge>
            <AddContextButton
              id="automated-grading"
              entry={{ label: 'Automated Grading', summary: '89% of 847 submissions auto-graded via NLP. 7% pending review, 4% require manual grading. NLP confidence: 94.7%. 3 items currently in review queue.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Auto-graded vs manual review queue</p>
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
                  <Cell key={i} fill={GRADING_COLORS[i]} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{gradingSummary.autoGraded}%</span>
            <span className="text-[11px] text-muted-foreground">Auto</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: GRADING_COLORS[i] }} />
              <span className="text-[11px] text-muted-foreground">{d.value}% {d.name}</span>
            </div>
          ))}
        </div>

        {/* Grading items */}
        <div className="space-y-2">
          {gradingItems.map(g => (
            <div key={g.student} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="flex items-center gap-2.5">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[11px] font-semibold text-white bg-muted-foreground">{g.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">{g.student}</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{g.assessment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold" style={{ color: confidenceColor(g.confidence) }}>{g.confidence}%</span>
                <Badge variant="outline" className={`text-[11px] ${statusStyles[g.status]}`}>
                  {statusLabels[g.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-3 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-primary" />
          NLP confidence: <span className="text-primary font-semibold">94.7%</span>
        </p>
      </CardContent>
    </Card>
  )
}
