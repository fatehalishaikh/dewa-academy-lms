'use client'
import { useState } from 'react'
import { Zap, Wand2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  engagementTrend, engagementBySubject, atRiskStudents,
  riskDistribution, aiInsights,
} from '@/data/mock-reports'
import { StudentNameLink } from '@/components/ui/student-name-link'

const stats = [
  { label: 'School Engagement',  value: '74%',  sub: '+6% vs last term',    color: '#00B8A9' },
  { label: 'Highly Engaged',     value: '198',  sub: 'Score ≥ 75',           color: '#10B981' },
  { label: 'At-Risk',            value: '10',   sub: 'Score < 60',           color: '#EF4444' },
  { label: 'Avg Improvement',    value: '+8pt', sub: 'Over 14 weeks',        color: '#7C3AED' },
]

const riskBadge = (level: string) =>
  level === 'High'     ? 'border-red-500/30 text-red-400 bg-red-500/10'
  : level === 'Moderate' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  : 'border-sky-500/30 text-sky-400 bg-sky-500/10'

const tooltipProps = {
  contentStyle: { background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' },
  labelStyle: { color: '#e2e8f0', fontWeight: 600 },
  itemStyle: { color: '#cbd5e1' },
}

export default function ReportsEngagement() {
  const [analysis, setAnalysis] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function handleAiAnalysis() {
    setLoading(true)
    setTimeout(() => {
      setAnalysis([
        aiInsights.find(i => i.id === 'ins-008')!.text,
        'Students with engagement <60 for 3+ consecutive weeks have a 72% probability of grade decline.',
        'Social Studies leads engagement at 84% — sharing lesson structure with other departments could lift school average by 5 points.',
      ])
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
              <p className="text-[11px] font-medium text-foreground mt-0.5">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement trend */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Engagement Trend (14 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <AreaChart data={engagementTrend}>
              <defs>
                <linearGradient id="rptEngTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00B8A9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[50, 85]} />
              <Tooltip {...tooltipProps} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }} />
              <ReferenceLine y={65} stroke="#F59E0B" strokeDasharray="4 2" label={{ value: 'Threshold', position: 'insideTopRight', fontSize: 9, fill: '#F59E0B' }} />
              <Area dataKey="score" stroke="#00B8A9" fill="url(#rptEngTrendGrad)" strokeWidth={2} name="Engagement Score" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* By subject + risk distribution */}
      <div className="grid grid-cols-2 gap-4">
        {/* By subject */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Engagement by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <BarChart data={engagementBySubject}>
                <defs>
                  <linearGradient id="rptEngSubjGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#00B8A9" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 8, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[50, 95]} />
                <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="score" fill="url(#rptEngSubjGrad)" radius={[4, 4, 0, 0]} name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk distribution donut */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {riskDistribution.map(({ name, value, fill }) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: fill }} />
                  <span className="text-[11px] text-muted-foreground">{name}</span>
                  <span className="text-[11px] font-semibold text-foreground ml-auto">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-risk table + AI */}
      <div className="grid grid-cols-2 gap-4">
        {/* At-risk table */}
        <Card className="rounded-2xl border-border overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              At-Risk Students
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Engage</th>
                  <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Attend</th>
                  <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
                  <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map(s => (
                  <tr key={s.studentId} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5">
                      <StudentNameLink studentId={s.studentId} name={s.name} className="text-xs font-medium text-foreground" />
                    </td>
                    <td className="px-4 py-2.5 text-center text-xs font-semibold text-red-400">{s.engagement}%</td>
                    <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">{s.attendance}%</td>
                    <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">{s.gpa}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant="outline" className={`text-[10px] h-5 ${riskBadge(s.riskLevel)}`}>
                        {s.riskLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* AI Risk Analysis */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Risk Analysis
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAiAnalysis}
                disabled={loading}
                className="h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                {loading
                  ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Analyzing…</>
                  : <><Wand2 className="w-3 h-3" /> Analyze Risks</>}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Click "Analyze Risks" to identify at-risk patterns and recommended interventions.</p>
            ) : (
              analysis.map((text, i) => (
                <div key={i} className="px-3 py-2 rounded-xl border text-[11px] leading-relaxed text-amber-400 bg-amber-500/10 border-amber-500/20">
                  {text}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
