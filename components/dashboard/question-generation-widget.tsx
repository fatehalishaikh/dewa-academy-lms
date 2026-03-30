import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { questionBankStats, recentGenerations } from '@/data/mock-assessments'
import { AddContextButton } from './add-context-button'

const difficultyStyles: Record<string, string> = {
  Mixed: 'bg-primary/10 text-primary border-primary/20',
  Easy: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Medium: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Hard: 'bg-destructive/10 text-destructive border-destructive/20',
}

export function QuestionGenerationWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Question Generator</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              1,240 Generated
            </Badge>
            <AddContextButton
              id="question-gen"
              entry={{ label: 'Question Generator', summary: '1,240 AI-generated questions across 5 subjects. Math leads with 340 questions. Difficulty split: 30% easy, 45% medium, 25% hard. Latest: 24 Math questions generated 2 hrs ago.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Question bank by subject &amp; difficulty level</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stacked bar chart */}
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <BarChart data={questionBankStats} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="easy" stackId="a" fill="#4CAF50" name="Easy" />
              <Bar dataKey="medium" stackId="a" fill="#FFC107" name="Medium" />
              <Bar dataKey="hard" stackId="a" fill="#EF4444" name="Hard" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {[['Easy', '#4CAF50'], ['Medium', '#FFC107'], ['Hard', '#EF4444']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Recent generations */}
        <div className="space-y-2">
          {recentGenerations.map(g => (
            <div key={g.subject} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
              <div>
                <p className="text-xs font-medium text-foreground">{g.subject}</p>
                <p className="text-[10px] text-muted-foreground">{g.count} questions · {g.timeAgo}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] ${difficultyStyles[g.difficulty]}`}>
                {g.difficulty}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
