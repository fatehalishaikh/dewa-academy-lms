import { useState } from 'react'
import { FileCheck, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { examResults, gradeDistribution, difficultyAccuracy, subjectExamQuarters } from '@/data/mock-reports'

const stats = [
  { label: 'Total Exams',     value: '4',   sub: 'This term',           color: '#00B8A9' },
  { label: 'Avg Pass Rate',   value: '91%', sub: 'Across all exams',    color: '#10B981' },
  { label: 'Avg Score',       value: '79',  sub: 'Out of 100',          color: '#7C3AED' },
  { label: 'Pending Grading', value: '0',   sub: 'All graded',          color: '#F59E0B' },
]

const tooltipProps = {
  contentStyle: { background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' },
  labelStyle: { color: '#e2e8f0', fontWeight: 600 },
  itemStyle: { color: '#cbd5e1' },
}

export function ReportsExams() {
  const [exported, setExported] = useState<string | null>(null)

  function handleExport(fmt: string) {
    setExported(fmt)
    setTimeout(() => setExported(null), 2500)
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

      {/* Exam results table */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Exam Results Summary
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleExport('CSV')} className="h-7 text-xs gap-1">
                <Download className="w-3 h-3" /> CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport('PDF')} className="h-7 text-xs gap-1">
                <Download className="w-3 h-3" /> PDF
              </Button>
              {exported && (
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                  {exported} downloaded
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Exam</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Students</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Score</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pass Rate</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">High</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Low</th>
              </tr>
            </thead>
            <tbody>
              {examResults.map(e => (
                <tr key={e.examTitle} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{e.examTitle}</td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">{e.totalStudents}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold ${e.avgScore >= 80 ? 'text-emerald-400' : e.avgScore >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                      {e.avgScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold ${e.passRate >= 90 ? 'text-emerald-400' : e.passRate >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                      {e.passRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-emerald-400">{e.highScore}</td>
                  <td className="px-4 py-3 text-center text-xs text-red-400">{e.lowScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Grade distribution */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <BarChart data={gradeDistribution}>
                <defs>
                  <linearGradient id="rptGradeDistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00B8A9" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#00B8A9" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="grade" tick={{ fontSize: 7, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" fill="url(#rptGradeDistGrad)" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty analysis */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Difficulty Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <BarChart data={difficultyAccuracy}>
                <defs>
                  <linearGradient id="rptDiffGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="difficulty" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="avgAccuracy" fill="url(#rptDiffGrad)" radius={[4, 4, 0, 0]} name="Avg Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject exam trends */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Subject Quarterly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <BarChart data={subjectExamQuarters}>
                <defs>
                  <linearGradient id="rptSubjExamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4057" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[60, 95]} />
                <Tooltip {...tooltipProps} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="q1" fill="#F59E0B"                     radius={[2, 2, 0, 0]} name="Q1" opacity={0.6} />
                <Bar dataKey="q2" fill="#00B8A9"                     radius={[2, 2, 0, 0]} name="Q2" opacity={0.7} />
                <Bar dataKey="q3" fill="url(#rptSubjExamGrad)"       radius={[2, 2, 0, 0]} name="Q3"              />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
