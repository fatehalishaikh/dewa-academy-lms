'use client'
import { useState } from 'react'
import { startOfMonth } from 'date-fns'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import {
  Sparkles, FileText, RefreshCw, Printer,
  Bot, AlertCircle, ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'
import { ilpRiskStudents } from '@/data/mock-ilp'
import { MarkdownRenderer } from '@/components/ui/markdown'

const MOCK_GRADES: Record<string, { subject: string; grade: number }[]> = {
  'stu-001': [
    { subject: 'Mathematics', grade: 88 },
    { subject: 'Physics', grade: 82 },
    { subject: 'English', grade: 91 },
  ],
  'stu-002': [
    { subject: 'Chemistry', grade: 79 },
    { subject: 'Biology', grade: 85 },
    { subject: 'English', grade: 93 },
  ],
}

function formatDateRange(range: DateRange): string {
  if (!range.from) return 'Selected period'
  if (!range.to) return format(range.from, 'MMM d, yyyy')
  return `${format(range.from, 'MMM d')} – ${format(range.to, 'MMM d, yyyy')}`
}

export default function ParentReportsPage() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? '')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })
  const [reportText, setReportText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const selectedChild = children.find(c => c?.id === selectedChildId)
  const riskData = selectedChild ? ilpRiskStudents.find(r => r.studentId === selectedChild.id) : null

  async function generateReport() {
    if (!selectedChild) return
    setIsGenerating(true)
    setReportText('')
    setError('')

    const recentGrades = MOCK_GRADES[selectedChild.id] ?? [
      { subject: 'Mathematics', grade: Math.round(selectedChild.gpa * 25) },
      { subject: 'English', grade: Math.round(selectedChild.gpa * 26) },
    ]

    try {
      const res = await fetch('/api/ai/parent-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedChild.name,
          gpa: selectedChild.gpa,
          attendanceRate: selectedChild.attendanceRate,
          status: selectedChild.status,
          dateFrom: dateRange.from?.toISOString(),
          dateTo: dateRange.to?.toISOString(),
          gradeLevel: selectedChild.gradeLevel,
          recentGrades,
          riskFactors: riskData?.factors ?? [],
          goals: [],
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No response stream')
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setReportText(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch {
      setError('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!parent || children.length === 0) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No children found.</p></div>
  }

  const ACCENT = '#8B5CF6'

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0d0920 0%, #150d2e 55%, #070d1f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 p-7 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`, border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }}
              >
                <Bot className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Parent Portal</p>
                <h1 className="text-xl font-bold text-white mt-0.5">AI Progress Reports</h1>
                <p className="text-white/40 text-sm mt-0.5">Generate personalized AI-powered progress briefs</p>
              </div>
            </div>
            {/* Controls embedded in hero */}
            <div className="flex items-end gap-3 flex-wrap">
              {children.length > 1 && (
                <div className="space-y-1.5 flex-1 min-w-36">
                  <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Child</p>
                  <Select value={selectedChildId} onValueChange={v => v && setSelectedChildId(v)}>
                    <SelectTrigger className="h-9 text-sm text-white border-white/20" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map(c => c && (
                        <SelectItem key={c.id} value={c.id} className="text-sm">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5 flex-1 min-w-52">
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Report Period</p>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="shrink-0 gap-1.5"
                style={{ background: ACCENT, borderColor: ACCENT }}
              >
                {isGenerating
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</>
                  : <><Sparkles className="w-3.5 h-3.5" />Generate Report</>}
              </Button>
              {reportText && (
                <Button variant="outline" size="sm" className="shrink-0 border-white/20 text-white hover:bg-white/10" onClick={() => window.print()}>
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print
                </Button>
              )}
            </div>
          </div>
          {/* Right — status indicators */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)', border: '5px solid rgba(16,185,129,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{selectedChild?.gpa.toFixed(1)}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">GPA</p>
                <p className="text-[11px] text-white/35">{selectedChild?.name.split(' ')[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Report output */}
      {(reportText || isGenerating) && selectedChild && (
        <Card className="border overflow-hidden pt-0 gap-0" style={{ borderColor: 'color-mix(in srgb, #8B5CF6 30%, var(--border))' }}>
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #8B5CF6, color-mix(in srgb, #8B5CF6 20%, transparent))' }} />
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Progress Report — {selectedChild.name}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDateRange(dateRange)} · Generated by AI
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary">
                  <Bot className="w-2.5 h-2.5 mr-1" />
                  AI Generated
                </Badge>
                {isGenerating && (
                  <Badge variant="outline" className="text-[11px] h-5 border-amber-500/30 text-amber-400">
                    <RefreshCw className="w-2.5 h-2.5 mr-1 animate-spin" />
                    Generating
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="max-w-none">
              <MarkdownRenderer content={reportText} size="sm" />
              {isGenerating && (
                <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!reportText && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'color-mix(in srgb, #8B5CF6 12%, var(--muted))', border: '1px solid color-mix(in srgb, #8B5CF6 25%, transparent)' }}
          >
            <Bot className="w-7 h-7" style={{ color: '#8B5CF6' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No report generated yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Select a child and date range above, then click &ldquo;Generate Report&rdquo; to create an AI-powered progress brief.
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
        </div>
      )}
    </div>
  )
}
