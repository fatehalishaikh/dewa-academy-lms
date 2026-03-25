import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Library } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { resourceStats, resourceRecommendations } from '@/data/mock-curriculum'
import { AddContextButton } from './add-context-button'

const typeStyles: Record<string, string> = {
  Video:       'bg-primary/10 text-primary border-primary/20',
  Document:    'bg-chart-3/10 text-chart-3 border-chart-3/20',
  Interactive: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Quiz:        'bg-chart-5/10 text-chart-5 border-chart-5/20',
}

function relevanceColor(score: number) {
  if (score >= 95) return '#4CAF50'
  if (score >= 88) return '#FFC107'
  return '#EF4444'
}

export function ResourceRecommendationsWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Resource Recommendations</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              AI Curated
            </Badge>
            <AddContextButton
              id="resource-recommendations"
              entry={{
                label: 'AI Resource Recommendations',
                summary: 'AI curated 191 learning resources across 4 subjects. Math: 54 resources (24 videos). Top recommendation: Quadratic Functions Visual Guide (98% relevance, addresses Grade 10 algebraic gap). Science Scientific Method Lab Series supports MOE-S-3.1 standard.',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI-recommended learning resources by subject &amp; type</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stacked bar chart */}
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceStats} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="videos"      stackId="a" fill="#3B82F6" name="Videos" />
              <Bar dataKey="documents"   stackId="a" fill="#FFC107" name="Documents" />
              <Bar dataKey="interactive" stackId="a" fill="#00B8A9" name="Interactive" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {[['Videos', '#3B82F6'], ['Documents', '#FFC107'], ['Interactive', '#00B8A9']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Top recommendations */}
        <div className="space-y-2">
          {resourceRecommendations.map(r => (
            <div key={r.title} className="flex items-start justify-between gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{r.reason}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[11px] font-semibold" style={{ color: relevanceColor(r.relevance) }}>{r.relevance}%</span>
                <Badge variant="outline" className={`text-[10px] ${typeStyles[r.resourceType]}`}>
                  {r.resourceType}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
