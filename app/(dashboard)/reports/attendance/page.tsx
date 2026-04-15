'use client'
import { useState } from 'react'
import { UserCheck, TrendingUp, TrendingDown, Minus, Wand2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { attendanceTrend, classAttendance, dayAttendance, monthlyAttendance } from '@/data/mock-reports'

const stats = [
  { label: "Today's Attendance", value: '92%',  sub: '287 / 312 present', color: '#10B981' },
  { label: 'Weekly Average',     value: '91.4%', sub: '+0.8% vs prev week', color: '#00B8A9' },
  { label: 'Chronic Absentees',  value: '7',    sub: '>10% absences',      color: '#EF4444' },
  { label: 'Most Improved',      value: '+4.2%', sub: 'Grade 9B this month', color: '#7C3AED' },
]

const tooltipProps = {
  contentStyle: { background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' },
  labelStyle: { color: '#e2e8f0', fontWeight: 600 },
  itemStyle: { color: '#cbd5e1' },
}

export default function ReportsAttendance() {
  const [analysis, setAnalysis] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function handleAiAnalysis() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/attendance-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todayRate: stats[0].value,
          weeklyAvg: stats[1].value,
          chronicAbsentees: 7,
          classAttendance: classAttendance.map(c => ({ name: c.className, rate: c.rate })),
        }),
      })
      if (res.ok) {
        const data = await res.json() as { insights: string[] }
        setAnalysis(data.insights ?? [])
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
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
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly trend */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Weekly Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="rptAttPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="rptAttLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="rptAttAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip {...tooltipProps} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }} />
              <Area dataKey="presentRate" stroke="#10B981" fill="url(#rptAttPresent)" strokeWidth={2} name="Present %" dot={false} />
              <Area dataKey="lateRate"    stroke="#F59E0B" fill="url(#rptAttLate)"    strokeWidth={2} name="Late %"    dot={false} />
              <Area dataKey="absentRate"  stroke="#EF4444" fill="url(#rptAttAbsent)"  strokeWidth={2} name="Absent %"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Class comparison + Day of week */}
      <div className="grid grid-cols-2 gap-4">
        {/* Class comparison */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Class Attendance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <BarChart data={classAttendance} layout="vertical">
                <defs>
                  <linearGradient id="rptClassAttGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#00B8A9" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[70, 100]} />
                <YAxis type="category" dataKey="className" tick={{ fontSize: 8, fill: '#8B9BB4' }} tickLine={false} axisLine={false} width={90} />
                <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="rate" fill="url(#rptClassAttGrad)" radius={[0, 4, 4, 0]} name="Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Day of week */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Day-of-Week Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <BarChart data={dayAttendance}>
                <defs>
                  <linearGradient id="rptDayAttGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00B8A9" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#00B8A9" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="rate" fill="url(#rptDayAttGrad)" radius={[4, 4, 0, 0]} name="Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly summary table + AI */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly summary */}
        <Card className="rounded-2xl border-border overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Monthly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Month</th>
                  <th className="px-4 py-2 text-center text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Present</th>
                  <th className="px-4 py-2 text-center text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Late</th>
                  <th className="px-4 py-2 text-center text-[11px] font-semibold text-red-400 uppercase tracking-wider">Absent</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAttendance.map(m => (
                  <tr key={m.month} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5 text-xs font-medium text-foreground">{m.month}</td>
                    <td className="px-4 py-2.5 text-center text-xs font-semibold text-emerald-400">{m.presentPct}%</td>
                    <td className="px-4 py-2.5 text-center text-xs font-semibold text-amber-400">{m.latePct}%</td>
                    <td className="px-4 py-2.5 text-center text-xs font-semibold text-red-400">{m.absentPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* AI Attendance Patterns */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Attendance Patterns
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
                  : <><Wand2 className="w-3 h-3" /> Analyze</>}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">Click "Analyze" to identify attendance patterns and anomalies.</p>
            ) : (
              analysis.map((text, i) => (
                <div key={i} className="px-3 py-2 rounded-xl border text-[11px] leading-relaxed text-sky-400 bg-sky-500/10 border-sky-500/20">
                  {text}
                </div>
              ))
            )}
            {/* Change indicators legend */}
            {classAttendance.some(c => c.change !== 0) && (
              <div className="pt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Improving</div>
                <div className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-red-400" /> Declining</div>
                <div className="flex items-center gap-1"><Minus className="w-3 h-3" /> No change</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
