'use client'
import { useState } from 'react'
import { GraduationCap, TrendingUp, TrendingDown, Minus, Wand2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { gpaDistribution, subjectPerformance, gradeTrend, topPerformers, aiInsights } from '@/data/mock-reports'
import { StudentNameLink } from '@/components/ui/student-name-link'

const stats = [
  { label: 'School Avg GPA',  value: '3.28', sub: '+0.08 this term', color: '#00B8A9' },
  { label: 'Pass Rate',        value: '91%',  sub: 'Across all subjects', color: '#10B981' },
  { label: 'Honor Roll',       value: '87',   sub: 'Students (GPA ≥ 3.7)', color: '#7C3AED' },
  { label: 'At-Risk',          value: '10',   sub: 'GPA below 2.5', color: '#EF4444' },
]

export default function ReportsAcademic() {
  const [analysis, setAnalysis] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function handleAiAnalysis() {
    setLoading(true)
    setTimeout(() => {
      setAnalysis([
        aiInsights.find(i => i.id === 'ins-005')!.text,
        aiInsights.find(i => i.id === 'ins-006')!.text,
        'Top performers are predominantly from Grade 9 — early engagement programs showing results.',
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
              <p className="text-xl font-bold text-foreground" style={{ color }}>{value}</p>
              <p className="text-[11px] font-medium text-foreground mt-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* GPA Distribution */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              GPA Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <BarChart data={gpaDistribution}>
                <defs>
                  <linearGradient id="rptGpaDistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#00B8A9" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" fill="url(#rptGpaDistGrad)" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GPA Trend by Grade */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              GPA Trend by Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <LineChart data={gradeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[3.0, 3.5]} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: '#8B9BB4' }} />
                <Line dataKey="grade9"  stroke="#00B8A9" strokeWidth={2} dot={false} name="Grade 9"  />
                <Line dataKey="grade10" stroke="#7C3AED" strokeWidth={2} dot={false} name="Grade 10" />
                <Line dataKey="grade11" stroke="#F59E0B" strokeWidth={2} dot={false} name="Grade 11" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject performance */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <BarChart data={subjectPerformance}>
              <defs>
                <linearGradient id="rptSubjPerfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00B8A9" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
              <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="avgScore" fill="url(#rptSubjPerfGrad)" radius={[4, 4, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top performers + AI */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top performers table */}
        <Card className="rounded-2xl border-border overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
                  <th className="px-4 py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map(p => (
                  <tr key={p.studentId} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5">
                      <StudentNameLink studentId={p.studentId} name={p.name} className="text-xs font-medium text-foreground" />
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-muted-foreground">{p.grade}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-xs font-bold text-emerald-400">{p.gpa}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {p.trend === 'up'   && <TrendingUp   className="w-3.5 h-3.5 text-emerald-400 inline" />}
                      {p.trend === 'down' && <TrendingDown  className="w-3.5 h-3.5 text-red-400 inline" />}
                      {p.trend === 'same' && <Minus         className="w-3.5 h-3.5 text-muted-foreground inline" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* AI Academic Analysis */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Academic Analysis
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAiAnalysis}
                disabled={loading}
                className="h-7 text-[11px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                {loading
                  ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Analyzing…</>
                  : <><Wand2 className="w-3 h-3" /> Run Analysis</>}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Click "Run Analysis" to generate AI-powered academic insights.</p>
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
