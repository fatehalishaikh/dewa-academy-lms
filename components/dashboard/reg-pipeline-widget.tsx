import { TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddContextButton } from './add-context-button'
import { pipelineData } from '@/data/mock-registration'

const COLORS = ['#8B9BB4', '#3B82F6', '#FFC107', '#00B8A9', '#A855F7', '#4CAF50']

export function RegPipelineWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Registration Pipeline</CardTitle>
          </div>
          <AddContextButton
            id="reg-pipeline"
            entry={{ label: 'Registration Pipeline', summary: 'Total 342 applications: 72 submitted, 58 ID verified, 45 docs review, 89 AI scored, 60 decision, 18 enrolled this cycle.' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Applications by stage — current academic cycle</p>
      </CardHeader>
      <CardContent>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <BarChart data={pipelineData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="stageName" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Applications">
                {pipelineData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
