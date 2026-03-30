import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wand2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { lessonGenStats, recentLessons } from '@/data/mock-curriculum'
import { AddContextButton } from './add-context-button'

function alignmentColor(score: number) {
  if (score >= 90) return '#4CAF50'
  if (score >= 80) return '#FFC107'
  return '#EF4444'
}

export function LessonGeneratorWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Lesson Generator</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              156 Generated
            </Badge>
            <AddContextButton
              id="lesson-generator"
              entry={{
                label: 'AI Lesson Generator',
                summary: '156 AI-generated lesson plans this term. Math leads with 35 lessons. KHDA alignment: 69 lessons, MOE alignment: 55 lessons, custom: 32 lessons. Latest: Quadratic Equations (Grade 10) with 96% KHDA alignment.',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI-generated lessons by subject &amp; KHDA/MOE alignment</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stacked bar chart */}
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={lessonGenStats} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="khdaAligned" stackId="a" fill="#00B8A9" name="KHDA Aligned" />
              <Bar dataKey="moeAligned"  stackId="a" fill="#3B82F6" name="MOE Aligned" />
              <Bar dataKey="custom"      stackId="a" fill="#FFC107" name="Custom" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {[['KHDA Aligned', '#00B8A9'], ['MOE Aligned', '#3B82F6'], ['Custom', '#FFC107']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Recent lessons */}
        <div className="space-y-2">
          {recentLessons.map(l => (
            <div key={l.topic} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
              <div>
                <p className="text-xs font-medium text-foreground">{l.topic}</p>
                <p className="text-[10px] text-muted-foreground">{l.subject} · {l.grade} · {l.timeAgo}</p>
              </div>
              <span className="text-[11px] font-semibold" style={{ color: alignmentColor(l.alignment) }}>
                {l.alignment}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
