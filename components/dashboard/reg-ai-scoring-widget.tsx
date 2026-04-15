import { Brain, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AddContextButton } from './add-context-button'
import { scoreDistribution, mockApplications } from '@/data/mock-registration'

const topScored = mockApplications
  .filter(a => a.aiScore !== null)
  .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
  .slice(0, 3)

function scoreColor(score: number) {
  if (score >= 90) return '#4CAF50'
  if (score >= 70) return '#00B8A9'
  if (score >= 50) return '#FFC107'
  return '#EF4444'
}

export function RegAiScoringWidget() {
  return (
    <Card className="col-span-1 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Eligibility Scoring</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <AddContextButton
              id="reg-ai-scoring"
              entry={{ label: 'AI Eligibility Scoring', summary: '186 scored: 42 excellent (90+), 98 good (70-89), 31 marginal (50-69), 15 below threshold (<50). AI recommendation accuracy 94%.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          Multi-criteria eligibility assessment engine
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score distribution bar chart */}
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <BarChart data={scoreDistribution} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <XAxis dataKey="band" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Applicants">
                {scoreDistribution.map((d) => (
                  <Cell key={d.band} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top scored */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top Applicants</p>
          {topScored.map(app => (
            <div key={app.id} className="bg-muted/30 rounded-lg px-2.5 py-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">{app.initials}</div>
                  <span className="text-xs font-medium text-foreground">{app.nameEn}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: scoreColor(app.aiScore!) }}>{app.aiScore}</span>
              </div>
              <Progress value={app.aiScore!} className="h-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
