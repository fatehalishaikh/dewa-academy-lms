import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flag, Search, ChevronRight, CheckCircle2, Clock, AlertCircle, X,
  LayoutGrid, List, PlusCircle, User, Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockApplications, type Application, type KanbanStage } from '@/data/mock-registration'

const STAGES: KanbanStage[] = [
  'Application Submitted',
  'Emirates ID Verified',
  'Documents Under Review',
  'AI Scored',
  'Decision Made',
  'Enrolled',
]

const STAGE_COLORS: Record<KanbanStage, { bg: string; border: string; text: string; dot: string }> = {
  'Application Submitted':   { bg: 'bg-blue-500/8',   border: 'border-blue-500/20',   text: 'text-blue-400',   dot: '#3B82F6' },
  'Emirates ID Verified':    { bg: 'bg-purple-500/8',  border: 'border-purple-500/20',  text: 'text-purple-400', dot: '#A855F7' },
  'Documents Under Review':  { bg: 'bg-amber-500/8',   border: 'border-amber-500/20',   text: 'text-amber-400',  dot: '#FFC107' },
  'AI Scored':               { bg: 'bg-primary/8',     border: 'border-primary/20',     text: 'text-primary',    dot: '#00B8A9' },
  'Decision Made':           { bg: 'bg-indigo-500/8',  border: 'border-indigo-500/20',  text: 'text-indigo-400', dot: '#6366F1' },
  'Enrolled':                { bg: 'bg-green-500/8',   border: 'border-green-500/20',   text: 'text-green-400',  dot: '#4CAF50' },
}

function scoreColor(score: number) {
  if (score >= 90) return 'text-green-400'
  if (score >= 70) return 'text-primary'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

function checklistProgress(app: Application) {
  const done = app.checklist.filter(c => c.completed).length
  return { done, total: app.checklist.length, pct: Math.round((done / app.checklist.length) * 100) }
}

function ChecklistIcon({ completed, flagged }: { completed: boolean; flagged?: boolean }) {
  if (flagged) return <AlertCircle className="w-3 h-3 text-red-400" />
  if (completed) return <CheckCircle2 className="w-3 h-3 text-green-400" />
  return <Clock className="w-3 h-3 text-muted-foreground" />
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────

function AppCard({ app, onClick }: { app: Application; onClick: () => void }) {
  const { done, total, pct } = checklistProgress(app)

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-xl p-3 hover:border-primary/30 hover:bg-primary/5 transition-all space-y-2.5 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            {app.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{app.nameEn}</p>
            <p className="text-[9px] text-muted-foreground truncate">{app.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {app.flagged && <Flag className="w-3 h-3 text-red-400" />}
          <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1 flex-wrap">
        <Badge variant="outline" className="text-[9px] bg-muted/40 border-border px-1.5 py-0">{app.applicationType}</Badge>
        <Badge variant="outline" className="text-[9px] bg-muted/40 border-border px-1.5 py-0">{app.gradeApplying}</Badge>
        {app.aiScore !== null && (
          <Badge variant="outline" className={`text-[9px] border-transparent px-1.5 py-0 font-bold ${scoreColor(app.aiScore)}`}>
            {app.aiScore}
          </Badge>
        )}
      </div>

      {/* Checklist progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>Documents</span>
          <span>{done}/{total}</span>
        </div>
        <Progress value={pct} className="h-1" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">{app.submittedDate}</span>
        {app.reviewerInitials && (
          <div className="w-4 h-4 rounded-full bg-chart-4/30 flex items-center justify-center text-[8px] font-bold text-chart-4">
            {app.reviewerInitials}
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ app, onClose }: { app: Application; onClose: () => void }) {
  const statusColors: Record<string, string> = {
    Approved: 'bg-green-500/15 text-green-400 border-green-500/20',
    Rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
    Waitlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Pending: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  }

  return (
    <div className="w-80 shrink-0 flex flex-col border-l border-border bg-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{app.initials}</div>
          <div>
            <p className="text-sm font-semibold text-foreground">{app.nameEn}</p>
            <p className="text-[10px] text-muted-foreground">{app.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Type', value: app.applicationType },
              { label: 'Grade', value: app.gradeApplying },
              { label: 'Nationality', value: app.nationality },
              { label: 'Gender', value: app.gender },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/30 rounded-lg px-2.5 py-2">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-xs font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Status + AI Score */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${statusColors[app.status]}`}>{app.status}</Badge>
            {app.aiScore !== null && (
              <Badge variant="outline" className={`text-xs font-bold border-transparent ${scoreColor(app.aiScore)}`}>
                AI Score: {app.aiScore}
              </Badge>
            )}
            {app.flagged && <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/20">Flagged</Badge>}
          </div>

          {/* Document Checklist */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Document Checklist</p>
            <div className="space-y-1.5">
              {app.checklist.map(({ document, required, completed, flagged }) => (
                <div key={document} className="flex items-center gap-2 bg-muted/20 rounded-lg px-2.5 py-2">
                  <ChecklistIcon completed={completed} flagged={flagged} />
                  <span className="text-xs text-foreground flex-1">{document}</span>
                  {required && <span className="text-[9px] text-muted-foreground">Required</span>}
                </div>
              ))}
            </div>
          </div>

          {/* AI Scoring breakdown */}
          {app.scoring && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                AI Scoring Breakdown
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Academic', value: app.scoring.academic },
                  { label: 'Qudurat', value: app.scoring.qudurat },
                  { label: 'Attendance', value: app.scoring.attendance },
                  { label: 'Extracurricular', value: app.scoring.extracurricular },
                  { label: 'Interview', value: app.scoring.interview },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{label}</span>
                      <span className={`font-semibold ${scoreColor(value)}`}>{value}</span>
                    </div>
                    <Progress value={value} className="h-1" />
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-muted/30 rounded-lg p-2.5">
                <p className="text-[9px] text-muted-foreground">{app.scoring.rationale}</p>
              </div>
            </div>
          )}

          {/* Stage timeline */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Registration Timeline</p>
            <div className="space-y-2">
              {app.timeline.map((event, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                    {i < app.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-2 min-w-0">
                    <p className="text-xs font-medium text-foreground">{event.stage}</p>
                    <p className="text-[9px] text-muted-foreground">{event.actor} · {event.date}</p>
                    {event.note && <p className="text-[9px] text-muted-foreground/80 mt-0.5 italic">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Actions</p>
            <Button size="sm" className="w-full text-xs bg-primary hover:bg-primary/90">Advance to Next Stage</Button>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs">Assign Reviewer</Button>
              <Button size="sm" variant="outline" className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10">Flag</Button>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs text-muted-foreground">Reject Application</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Table View ───────────────────────────────────────────────────────────────

function TableView({ apps, onSelect }: { apps: Application[]; onSelect: (app: Application) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/20">
            {['ID', 'Name', 'Type', 'Stage', 'Score', 'Submitted', 'Flag'].map(h => (
              <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.id} onClick={() => onSelect(app)} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors">
              <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">{app.id}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary shrink-0">{app.initials}</div>
                  <span className="font-medium text-foreground whitespace-nowrap">{app.nameEn}</span>
                </div>
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{app.applicationType}</td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <Badge variant="outline" className="text-[9px]">{app.stage}</Badge>
              </td>
              <td className="px-3 py-2.5">
                {app.aiScore !== null
                  ? <span className={`font-bold ${scoreColor(app.aiScore)}`}>{app.aiScore}</span>
                  : <span className="text-muted-foreground">—</span>
                }
              </td>
              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{app.submittedDate}</td>
              <td className="px-3 py-2.5">{app.flagged && <Flag className="w-3 h-3 text-red-400" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Applications() {
  const navigate = useNavigate()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')

  const filtered = mockApplications.filter(app => {
    const matchesSearch = search === '' ||
      app.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || app.applicationType === typeFilter
    const matchesStage = stageFilter === 'all' || app.stage === stageFilter
    return matchesSearch && matchesType && matchesStage
  })

  return (
    <div className="space-y-4 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Select value={typeFilter} onValueChange={v => setTypeFilter(v ?? 'all')}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Transfer">Transfer</SelectItem>
            <SelectItem value="International">International</SelectItem>
            <SelectItem value="Special Program">Special Program</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={v => setStageFilter(v ?? 'all')}>
          <SelectTrigger className="h-8 text-xs w-44">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 ml-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90"
          onClick={() => navigate('/registration/new-application')}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          New Application
        </Button>
      </div>

      {viewMode === 'table' ? (
        <TableView apps={filtered} onSelect={setSelectedApp} />
      ) : (
        /* Kanban board */
        <div className="flex gap-1 min-h-0" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="flex-1 flex gap-3 overflow-x-auto pb-2">
            {STAGES.map(stage => {
              const stageApps = filtered.filter(a => a.stage === stage)
              const colors = STAGE_COLORS[stage]
              return (
                <div key={stage} className="flex-shrink-0 w-52 flex flex-col">
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl border mb-2 ${colors.bg} ${colors.border}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: colors.dot }} />
                      <span className={`text-[10px] font-semibold ${colors.text}`}>{stage}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${colors.text}`}>{stageApps.length}</span>
                  </div>

                  {/* Cards */}
                  <ScrollArea className="flex-1">
                    <div className="space-y-2 pr-1">
                      {stageApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <User className="w-5 h-5 text-muted-foreground/30 mb-1" />
                          <p className="text-[10px] text-muted-foreground/50">No applications</p>
                        </div>
                      ) : (
                        stageApps.map(app => (
                          <AppCard
                            key={app.id}
                            app={app}
                            onClick={() => setSelectedApp(app)}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )
            })}
          </div>

          {/* Detail panel */}
          {selectedApp && (
            <DetailPanel app={selectedApp} onClose={() => setSelectedApp(null)} />
          )}
        </div>
      )}
    </div>
  )
}
