'use client'
import { useState } from 'react'
import {
  Sparkles, FileText, RefreshCw, Printer, ChevronDown,
  Bot, AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'
import { ilpRiskStudents } from '@/data/mock-ilp'

type Period = 'this-week' | 'this-month' | 'this-term'
const PERIOD_LABELS: Record<Period, string> = {
  'this-week':  'This Week',
  'this-month': 'This Month',
  'this-term':  'This Term',
}

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

// Simple markdown renderer (bold, headings, bullets)
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return <h3 key={i} className="text-sm font-bold text-foreground mt-4 mb-1.5">{line.slice(3)}</h3>
    }
    if (line.startsWith('# ')) {
      return <h2 key={i} className="text-base font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h2>
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2)
      return (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </li>
      )
    }
    if (line.trim() === '') return <div key={i} className="h-1" />
    return (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
      />
    )
  })
}

export default function ParentReportsPage() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? '')
  const [period, setPeriod] = useState<Period>('this-month')
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
          period: PERIOD_LABELS[period],
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
    } catch (e) {
      setError('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!parent || children.length === 0) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No children found.</p></div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Progress Reports</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">AI Progress Reports</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Generate personalized progress briefs for your child</p>
      </div>

      {/* Controls */}
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="p-5">
          <div className="flex items-end gap-3 flex-wrap">
            {/* Child selector */}
            {children.length > 1 && (
              <div className="space-y-1.5 flex-1 min-w-36">
                <p className="text-xs text-muted-foreground">Child</p>
                <Select value={selectedChildId} onValueChange={v => v && setSelectedChildId(v)}>
                  <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
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
            {/* Period */}
            <div className="space-y-1.5 flex-1 min-w-36">
              <p className="text-xs text-muted-foreground">Report Period</p>
              <Select value={period} onValueChange={v => setPeriod(v as Period)}>
                <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Generate button */}
            <Button onClick={generateReport} disabled={isGenerating} className="shrink-0">
              {isGenerating
                ? <><RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />Generating…</>
                : <><Bot className="w-3.5 h-3.5 mr-2" />Generate Report</>}
            </Button>
            {reportText && (
              <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5 mr-2" />
                Print
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Report output */}
      {(reportText || isGenerating) && selectedChild && (
        <Card className="rounded-2xl border-primary/20 bg-card">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Progress Report — {selectedChild.name}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {PERIOD_LABELS[period]} · Generated by AI
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                  <Bot className="w-2.5 h-2.5 mr-1" />
                  AI Generated
                </Badge>
                {isGenerating && (
                  <Badge variant="outline" className="text-[10px] h-5 border-amber-500/30 text-amber-400">
                    <RefreshCw className="w-2.5 h-2.5 mr-1 animate-spin" />
                    Generating
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="prose-sm max-w-none space-y-1">
              {renderMarkdown(reportText)}
              {isGenerating && (
                <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!reportText && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">No report generated yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Select a child and period, then click &ldquo;Generate Report&rdquo; to create an AI-powered progress brief.
          </p>
          <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
        </div>
      )}
    </div>
  )
}
