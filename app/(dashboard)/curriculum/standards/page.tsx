'use client'
import { useState } from 'react'
import { CheckCircle2, Circle, AlertTriangle, GitBranch, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { standards, curriculumNodes, assessmentLinks, activityItems, type Framework } from '@/data/mock-curriculum'
import { useAcademyStore } from '@/stores/academy-store'

const coverageData = [
  { subject: 'Mathematics', grade: 'Grade 10', covered: 8, partial: 2, gap: 1 },
  { subject: 'Physics',     grade: 'Grade 11', covered: 5, partial: 3, gap: 2 },
  { subject: 'English',     grade: 'Grade 10', covered: 4, partial: 4, gap: 3 },
  { subject: 'Arabic',      grade: 'Grade 11', covered: 7, partial: 2, gap: 1 },
  { subject: 'Science',     grade: 'Grade 8',  covered: 6, partial: 3, gap: 2 },
]

export default function CurriculumStandards() {
  const mappings = useAcademyStore(s => s.standardMappings)
  const { linkStandard, unlinkStandard } = useAcademyStore()

  const [frameworkFilter, setFrameworkFilter] = useState<Framework | 'All'>('All')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedStdId, setSelectedStdId] = useState<string | null>(null)
  const [linkFeedback, setLinkFeedback] = useState(false)

  const filteredStandards = standards.filter(s => {
    if (frameworkFilter !== 'All' && s.framework !== frameworkFilter) return false
    return true
  })

  const leafNodes = curriculumNodes.filter(n => n.nodeType === 'lesson' || n.nodeType === 'unit')

  function isMapped(nodeId: string, stdId: string) {
    return mappings.some(m => m.nodeId === nodeId && m.standardId === stdId)
  }

  function handleLink() {
    if (!selectedNodeId || !selectedStdId) return
    if (isMapped(selectedNodeId, selectedStdId)) return
    linkStandard(selectedNodeId, selectedStdId)
    setLinkFeedback(true)
    setTimeout(() => setLinkFeedback(false), 2000)
  }

  function handleUnlink(nodeId: string, standardId: string) {
    unlinkStandard(nodeId, standardId)
  }

  const totalStds = standards.length
  const coveredStds = standards.filter(s => mappings.some(m => m.standardId === s.id)).length
  const coveragePct = Math.round((coveredStds / totalStds) * 100)
  const gapCount = coverageData.reduce((sum, r) => sum + r.gap, 0)

  function coverageCell(covered: number, partial: number, gap: number) {
    const total = covered + partial + gap
    if (covered / total >= 0.7) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
    if (partial / total >= 0.3) return 'bg-amber-500/20 text-amber-400 border-amber-500/20'
    return 'bg-red-500/20 text-red-400 border-red-500/20'
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Standards', value: totalStds, icon: Circle, color: '#0EA5E9' },
          { label: 'Coverage',        value: `${coveragePct}%`, icon: CheckCircle2, color: '#10B981' },
          { label: 'Gaps Detected',   value: gapCount, icon: AlertTriangle, color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column mapping */}
      <div className="grid grid-cols-2 gap-4">
        {/* Curriculum items */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm">Curriculum Items</CardTitle>
          </CardHeader>
          <CardContent className="p-2 max-h-64 overflow-y-auto">
            {leafNodes.map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(selectedNodeId === node.id ? null : node.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                  selectedNodeId === node.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/20 text-foreground'
                }`}
              >
                <Badge variant="outline" className="text-[8px] h-4 shrink-0 capitalize border-border">
                  {node.nodeType}
                </Badge>
                <span className="truncate">{node.title}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Standards */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Standards</CardTitle>
              <div className="flex gap-1">
                {(['All', 'KHDA', 'MOE'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFrameworkFilter(f)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors ${
                      frameworkFilter === f ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 max-h-64 overflow-y-auto">
            {filteredStandards.map(std => {
              const alreadyMapped = selectedNodeId ? isMapped(selectedNodeId, std.id) : false
              return (
                <button
                  key={std.id}
                  onClick={() => setSelectedStdId(selectedStdId === std.id ? null : std.id)}
                  className={`w-full text-left flex items-start gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                    selectedStdId === std.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/20'
                  }`}
                >
                  <Badge
                    variant="outline"
                    className={`text-[8px] h-4 shrink-0 ${std.framework === 'KHDA' ? 'border-blue-500/30 text-blue-400' : 'border-emerald-500/30 text-emerald-400'}`}
                  >
                    {std.framework}
                  </Badge>
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] text-muted-foreground block">{std.code}</span>
                    <span className="text-foreground line-clamp-1">{std.description}</span>
                  </div>
                  {alreadyMapped && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />}
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Link action */}
      {selectedNodeId && selectedStdId && (
        <div className="flex items-center gap-3 p-3 bg-muted/10 border border-border rounded-xl">
          <div className="flex-1 text-xs text-muted-foreground">
            Link <span className="text-foreground font-medium">{leafNodes.find(n => n.id === selectedNodeId)?.title}</span>
            {' ↔ '}
            <span className="text-foreground font-medium">{standards.find(s => s.id === selectedStdId)?.code}</span>
          </div>
          {linkFeedback && <span className="text-[10px] text-emerald-400">Linked!</span>}
          <Button size="sm" onClick={handleLink} className="h-7 text-xs gap-1">
            <CheckCircle2 className="w-3 h-3" /> Create Link
          </Button>
        </div>
      )}

      {/* Active mappings for selected node */}
      {selectedNodeId && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm">
              Mappings for: <span className="text-primary font-normal">{leafNodes.find(n => n.id === selectedNodeId)?.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {mappings.filter(m => m.nodeId === selectedNodeId).length === 0 ? (
              <p className="text-xs text-muted-foreground">No standards linked yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {mappings
                  .filter(m => m.nodeId === selectedNodeId)
                  .map(m => {
                    const std = standards.find(s => s.id === m.standardId)
                    return (
                      <div key={m.standardId} className="flex items-center gap-1 bg-muted/20 border border-border rounded-lg px-2 py-1">
                        <Badge
                          variant="outline"
                          className={`text-[8px] h-4 shrink-0 ${std?.framework === 'KHDA' ? 'border-blue-500/30 text-blue-400' : 'border-emerald-500/30 text-emerald-400'}`}
                        >
                          {std?.framework}
                        </Badge>
                        <span className="text-[10px] font-mono text-foreground">{std?.code ?? m.standardId}</span>
                        <button
                          onClick={() => handleUnlink(m.nodeId, m.standardId)}
                          className="w-4 h-4 flex items-center justify-center rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors ml-0.5"
                          title="Unlink standard"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Coverage heatmap */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm">Coverage Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="grid grid-cols-[160px_repeat(4,1fr)] gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
              <span>Subject</span>
              <span className="text-center">Covered</span>
              <span className="text-center">Partial</span>
              <span className="text-center">Gap</span>
              <span className="text-center">Assessed</span>
            </div>
            {coverageData.map(row => {
              // Count standards for this subject that have assessment links
              const subjectStds = standards.filter(s => s.subject === row.subject)
              const bothTypes = subjectStds.filter(s =>
                assessmentLinks.some(a => a.standardIds.includes(s.id) && a.type === 'formative') &&
                assessmentLinks.some(a => a.standardIds.includes(s.id) && a.type === 'summative')
              ).length
              const oneType = subjectStds.filter(s =>
                assessmentLinks.some(a => a.standardIds.includes(s.id)) &&
                !(assessmentLinks.some(a => a.standardIds.includes(s.id) && a.type === 'formative') &&
                  assessmentLinks.some(a => a.standardIds.includes(s.id) && a.type === 'summative'))
              ).length
              const assessedCell = bothTypes > 0
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                : oneType > 0
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/20'
                  : 'bg-red-500/20 text-red-400 border-red-500/20'
              const assessedLabel = bothTypes > 0 ? `${bothTypes} F+S` : oneType > 0 ? `${oneType}` : '—'
              return (
                <div key={row.subject} className="grid grid-cols-[160px_repeat(4,1fr)] gap-2 items-center">
                  <div>
                    <p className="text-xs font-medium text-foreground">{row.subject}</p>
                    <p className="text-[9px] text-muted-foreground">{row.grade}</p>
                  </div>
                  <div className={`text-center text-[10px] font-semibold py-1 rounded-lg border ${coverageCell(row.covered, row.partial, 0)}`}>
                    {row.covered}
                  </div>
                  <div className="text-center text-[10px] font-semibold py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    {row.partial}
                  </div>
                  <div className="text-center text-[10px] font-semibold py-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
                    {row.gap}
                  </div>
                  <div className={`text-center text-[10px] font-semibold py-1 rounded-lg border ${assessedCell}`}>
                    {assessedLabel}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-4 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/30 inline-block" /> Covered</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500/30 inline-block" /> Partial</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/30 inline-block" /> Gap</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/30 inline-block" /> Assessed (F+S = formative + summative)</span>
          </div>
        </CardContent>
      </Card>

      {/* Multi-level mapping summary */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm">Multi-Level Standards Mapping</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-[10px] text-muted-foreground mb-3">Standards are mapped across all curriculum levels — from courses down to individual activities within lessons.</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { level: 'Courses',    count: curriculumNodes.filter(n => n.nodeType === 'course' && mappings.some(m => m.nodeId === n.id)).length,  total: curriculumNodes.filter(n => n.nodeType === 'course').length,  color: 'text-primary border-primary/30' },
              { level: 'Units',      count: curriculumNodes.filter(n => n.nodeType === 'unit'   && mappings.some(m => m.nodeId === n.id)).length,  total: curriculumNodes.filter(n => n.nodeType === 'unit').length,    color: 'text-blue-400 border-blue-500/30' },
              { level: 'Lessons',    count: curriculumNodes.filter(n => n.nodeType === 'lesson' && mappings.some(m => m.nodeId === n.id)).length,  total: curriculumNodes.filter(n => n.nodeType === 'lesson').length,  color: 'text-emerald-400 border-emerald-500/30' },
              { level: 'Activities', count: activityItems.filter(a => a.standardIds.length > 0).length, total: activityItems.length, color: 'text-amber-400 border-amber-500/30' },
            ].map((item, i, arr) => (
              <div key={item.level} className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-xl border text-center min-w-[80px] ${item.color} bg-muted/5`}>
                  <p className="text-lg font-bold">{item.count}<span className="text-xs font-normal text-muted-foreground">/{item.total}</span></p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{item.level}</p>
                </div>
                {i < arr.length - 1 && <span className="text-muted-foreground/50 text-xs">→</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
