'use client'
import { useState } from 'react'
import { Sparkles, Users, UserCheck, GraduationCap, AlertTriangle, Wand2, Download, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  enrollmentTrend, schoolHealth, teacherWorkload,
  aiInsights, type AiInsight,
} from '@/data/mock-reports'

const kpis = [
  { label: 'Total Enrollment', value: '312',   sub: '+17 since Sep', icon: Users,         color: '#00B8A9' },
  { label: 'Avg Attendance',   value: '91.4%', sub: '+1.2% vs last term', icon: UserCheck, color: '#10B981' },
  { label: 'School GPA',       value: '3.28',  sub: 'Target: 3.40',  icon: GraduationCap, color: '#7C3AED' },
  { label: 'AI Alerts',        value: '12',    sub: '4 critical',    icon: AlertTriangle,  color: '#EF4444' },
]

export default function ReportsDashboard() {
  const [insights, setInsights] = useState<AiInsight[]>(
    aiInsights.filter(i => i.tab === 'dashboard').slice(0, 4)
  )
  const [generating, setGenerating] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [exported, setExported] = useState<string | null>(null)

  function handleGenerateInsights() {
    setGenerating(true)
    setTimeout(() => {
      setInsights(aiInsights.filter(i => i.tab === 'dashboard'))
      setGenerating(false)
    }, 2000)
  }

  function handleExport(fmt: string) {
    setExportOpen(false)
    setExported(fmt)
    setTimeout(() => setExported(null), 2500)
  }

  const severityColor = (s: AiInsight['severity']) =>
    s === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : s === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-sky-400 bg-sky-500/10 border-sky-500/20'

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                <p className="text-[10px] text-primary">{sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Enrollment trend */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <AreaChart data={enrollmentTrend}>
                <defs>
                  <linearGradient id="rptEnrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00B8A9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00B8A9" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="rptWithdrawGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[280, 320]} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
                />
                <Area dataKey="enrolled"  stroke="#00B8A9" fill="url(#rptEnrollGrad)"   strokeWidth={2} name="Enrolled"  dot={false} />
                <Area dataKey="withdrawn" stroke="#EF4444" fill="url(#rptWithdrawGrad)" strokeWidth={2} name="Withdrawn" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* School health */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              School Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {schoolHealth.map(({ category, score }) => (
              <div key={category} className="flex items-center gap-3">
                <p className="text-[11px] text-muted-foreground w-28 shrink-0">{category}</p>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-8 text-right ${score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                  {score}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Teacher workload + AI insights row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Teacher workload */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Teacher Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <BarChart data={teacherWorkload} layout="vertical">
                <defs>
                  <linearGradient id="rptWorkloadGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#00B8A9" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="teacher" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="students" fill="url(#rptWorkloadGrad)" radius={[0, 4, 4, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Insights
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateInsights}
                disabled={generating}
                className="h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                {generating
                  ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Analyzing…</>
                  : <><Wand2 className="w-3 h-3" /> Full Analysis</>}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map(ins => (
              <div key={ins.id} className={`px-3 py-2 rounded-xl border text-[11px] leading-relaxed ${severityColor(ins.severity)}`}>
                {ins.text}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Export row */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(o => !o)}
            className="gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
          {exportOpen && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
              {['PDF', 'Excel', 'CSV'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-muted/50 transition-colors"
                >
                  Export as {fmt}
                </button>
              ))}
            </div>
          )}
        </div>
        {exported && (
          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {exported} download started
          </Badge>
        )}
      </div>
    </div>
  )
}
