'use client'
import { useState } from 'react'
import { Wrench, Wand2, Download, Trash2, Play, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reportFields, savedReports, type SavedReport } from '@/data/mock-reports'

const DATE_PRESETS = ['Last 7 days', 'Last 30 days', 'Current Term', 'Full Year']

const PREVIEW_ROWS = [
  { name: 'Fatima Hassan',        grade: 'Grade 9',  gpa: 3.9, attendance: '98%', engagement: 82 },
  { name: 'Ahmed Al-Rashid',      grade: 'Grade 10', gpa: 3.7, attendance: '96%', engagement: 75 },
  { name: 'Mariam Al-Sayed',      grade: 'Grade 10', gpa: 3.8, attendance: '97%', engagement: 78 },
  { name: 'Layla Ibrahim',        grade: 'Grade 9',  gpa: 3.6, attendance: '95%', engagement: 71 },
  { name: 'Sara Al-Zaabi',        grade: 'Grade 10', gpa: 3.5, attendance: '94%', engagement: 69 },
  { name: 'Yousef Mahmoud',       grade: 'Grade 9',  gpa: 3.2, attendance: '91%', engagement: 65 },
  { name: 'Reem Al-Marzouqi',     grade: 'Grade 10', gpa: 3.3, attendance: '90%', engagement: 63 },
  { name: 'Nour Al-Hashimi',      grade: 'Grade 10', gpa: 3.4, attendance: '93%', engagement: 67 },
]

export default function ReportsBuilder() {
  const [reportName, setReportName] = useState('')
  const [datePreset, setDatePreset] = useState('Current Term')
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(['student_name', 'gpa', 'attendance']))
  const [gradeFilter, setGradeFilter] = useState('All')
  const [generating, setGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [aiSuggesting, setAiSuggesting] = useState(false)
  const [reports, setReports] = useState<SavedReport[]>(savedReports)
  const [exported, setExported] = useState<string | null>(null)

  function toggleField(id: string) {
    setSelectedFields(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setShowPreview(false)
  }

  function handleGenerate() {
    setGenerating(true)
    setShowPreview(false)
    setTimeout(() => {
      setGenerating(false)
      setShowPreview(true)
    }, 1500)
  }

  async function handleAiSuggest() {
    setAiSuggesting(true)
    try {
      const res = await fetch('/api/ai/report-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: reportName || undefined }),
      })
      if (res.ok) {
        const data = await res.json() as { reportName?: string; fields?: string[]; datePreset?: string; gradeFilter?: string }
        if (data.reportName) setReportName(data.reportName)
        if (data.fields) setSelectedFields(new Set(data.fields))
        if (data.datePreset && DATE_PRESETS.includes(data.datePreset)) setDatePreset(data.datePreset)
        if (data.gradeFilter) setGradeFilter(data.gradeFilter)
        setShowPreview(false)
      }
    } catch { /* silent */ }
    finally { setAiSuggesting(false) }
  }

  function handleDeleteReport(id: string) {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  function handleExport(fmt: string) {
    setExported(fmt)
    setTimeout(() => setExported(null), 2500)
  }

  const metrics     = reportFields.filter(f => f.fieldCategory === 'metric')
  const dimensions  = reportFields.filter(f => f.fieldCategory === 'dimension')

  return (
    <div className="space-y-5">
      {/* Builder + preview */}
      <div className="grid grid-cols-2 gap-5">
        {/* Config panel */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Report Configuration
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAiSuggest}
                disabled={aiSuggesting}
                className="h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                {aiSuggesting
                  ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Suggesting…</>
                  : <><Wand2 className="w-3 h-3" /> AI Suggest</>}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Report name */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Report Name</label>
              <input
                type="text"
                value={reportName}
                onChange={e => setReportName(e.target.value)}
                placeholder="e.g. Monthly Academic Summary"
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Date range */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Date Range</label>
              <div className="flex flex-wrap gap-1.5">
                {DATE_PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => setDatePreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                      datePreset === p
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:border-border/70'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Metrics</label>
              <div className="flex flex-wrap gap-1.5">
                {metrics.map(f => (
                  <button
                    key={f.id}
                    onClick={() => toggleField(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                      selectedFields.has(f.id)
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:border-border/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Dimensions</label>
              <div className="flex flex-wrap gap-1.5">
                {dimensions.map(f => (
                  <button
                    key={f.id}
                    onClick={() => toggleField(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                      selectedFields.has(f.id)
                        ? 'bg-violet-500/10 text-violet-400 border-violet-500/30'
                        : 'border-border text-muted-foreground hover:border-border/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade filter */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Grade Filter</label>
              <select
                value={gradeFilter}
                onChange={e => setGradeFilter(e.target.value)}
                className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50"
              >
                {['All', 'Grade 9', 'Grade 10', 'Grade 11'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleGenerate} disabled={generating || selectedFields.size === 0} className="w-full gap-1.5 text-xs">
              {generating
                ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Generating…</>
                : <><Sparkles className="w-3.5 h-3.5" /> Generate Preview</>}
            </Button>
          </CardContent>
        </Card>

        {/* Preview panel */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Preview
              </CardTitle>
              {showPreview && (
                <div className="flex items-center gap-2">
                  {(['CSV', 'PDF', 'Excel'] as const).map(fmt => (
                    <Button key={fmt} size="sm" variant="outline" onClick={() => handleExport(fmt)} className="h-7 text-xs gap-1">
                      <Download className="w-3 h-3" /> {fmt}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            {exported && (
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 gap-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {exported} download started
              </Badge>
            )}
            {generating && (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 rounded-lg bg-muted/40 animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
                ))}
              </div>
            )}
            {!generating && !showPreview && (
              <p className="text-[11px] text-muted-foreground">Select fields and click "Generate Preview" to see data.</p>
            )}
            {!generating && showPreview && (
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border">
                      {Array.from(selectedFields).map(id => (
                        <th key={id} className="px-2 py-1.5 text-left font-semibold text-muted-foreground uppercase tracking-wider">
                          {reportFields.find(f => f.id === id)?.label ?? id}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_ROWS.slice(0, 6).map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                        {Array.from(selectedFields).map(id => (
                          <td key={id} className="px-2 py-1.5 text-foreground">
                            {id === 'student_name' ? row.name
                             : id === 'grade_level' ? row.grade
                             : id === 'gpa'         ? row.gpa
                             : id === 'attendance'  ? row.attendance
                             : id === 'engagement'  ? `${row.engagement}%`
                             : id === 'at_risk'     ? (row.gpa < 2.5 ? 'Yes' : 'No')
                             : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-muted-foreground mt-2">Showing 6 of {PREVIEW_ROWS.length} rows (preview)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved reports */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            Saved Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fields</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Schedule</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground">{r.createdDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.fields.slice(0, 3).map(fid => (
                        <Badge key={fid} variant="outline" className="text-[9px] h-4 px-1.5">
                          {reportFields.find(f => f.id === fid)?.label ?? fid}
                        </Badge>
                      ))}
                      {r.fields.length > 3 && (
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 text-muted-foreground">+{r.fields.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {r.schedule
                      ? <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{r.schedule}</Badge>
                      : <span className="text-[11px] text-muted-foreground">One-time</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1" onClick={() => setShowPreview(true)}>
                        <Play className="w-2.5 h-2.5" /> Run
                      </Button>
                      <button
                        onClick={() => handleDeleteReport(r.id)}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[11px] text-muted-foreground">No saved reports.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
