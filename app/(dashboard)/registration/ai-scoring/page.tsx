'use client'
import { useState } from 'react'
import { Brain, Sparkles, Flag, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { mockApplications, type Application } from '@/data/mock-registration'
import { useAcademyStore } from '@/stores/academy-store'

const baseScoredApps = mockApplications.filter(a => a.aiScore !== null && a.scoring !== null)
const baseFlaggedQueue = mockApplications.filter(a => a.flagged && a.aiScore !== null)

type AiResult = { id: string; compositeScore: number; recommendation: string; summary: string }

function scoreColor(score: number) {
  if (score >= 90) return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' }
  if (score >= 70) return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
  if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
  return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
}

function bandLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Marginal'
  return 'Below Threshold'
}

export default function AiScoring() {
  const [weights, setWeights] = useState({
    academic: 30, qudurat: 25, attendance: 15, extracurricular: 10, interview: 20,
  })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [aiResults, setAiResults] = useState<AiResult[]>([])
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [confirmedAdmits, setConfirmedAdmits] = useState<Set<string>>(new Set())
  const [confirmedFlags, setConfirmedFlags] = useState<Set<string>>(new Set())
  const [overriddenFlags, setOverriddenFlags] = useState<Set<string>>(new Set())
  const { advanceApplication, setApplicationStatus, flagApplication, assignReviewer } = useAcademyStore()

  const flaggedQueue = baseFlaggedQueue.filter(a => !overriddenFlags.has(a.id))

  const scoredApps = baseScoredApps.map(app => {
    const result = aiResults.find(r => r.id === app.id)
    if (!result) return app
    return {
      ...app,
      aiScore: result.compositeScore,
      scoring: app.scoring ? { ...app.scoring, rationale: result.summary, recommendation: result.recommendation as Application['scoring'] extends null ? never : NonNullable<Application['scoring']>['recommendation'] } : app.scoring,
    }
  })

  async function recalculateAll() {
    setIsRecalculating(true)
    try {
      const applications = baseScoredApps
        .filter(a => a.scoring !== null)
        .map(a => ({
          id: a.id,
          applicantName: a.nameEn,
          scores: {
            academic: a.scoring!.academic,
            qudurat: a.scoring!.qudurat,
            attendance: a.scoring!.attendance,
            extracurricular: a.scoring!.extracurricular,
            interview: a.scoring!.interview,
          },
        }))
      const res = await fetch('/api/ai/scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applications, weights }),
      })
      const results = await res.json() as AiResult[]
      setAiResults(results)
    } catch {
      // silently fail — keep existing scores
    } finally {
      setIsRecalculating(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Scoring config */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Scoring Criteria Weights</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />AI Engine v2.4
              </Badge>
              <Button size="sm" className="text-xs h-7 bg-primary hover:bg-primary/90" onClick={recalculateAll} disabled={isRecalculating}>
                {isRecalculating ? 'Recalculating...' : 'Recalculate All'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Adjust the weight of each criterion — total must equal 100%</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.entries(weights) as [keyof typeof weights, number][]).map(([key, val]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground capitalize">{key === 'extracurricular' ? 'Extracurriculars' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="font-bold text-primary">{val}%</span>
                </div>
                <Slider
                  value={[val]}
                  onValueChange={(vals) => { const arr = Array.isArray(vals) ? vals : [vals]; setWeights(w => ({ ...w, [key]: arr[0] })) }}
                  min={0} max={50} step={5}
                  className="h-1.5"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">Total weight:</span>
            <span className={`text-sm font-bold ${Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'text-green-400' : 'text-amber-400'}`}>
              {Object.values(weights).reduce((a, b) => a + b, 0)}%
            </span>
            {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
              <span className="text-xs text-amber-400">· Adjust to reach 100%</span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Scored applications table */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Scored Applications</h3>
            <Badge variant="outline" className="text-[11px]">{scoredApps.length} applicants</Badge>
          </div>
          <div className="space-y-2">
            {scoredApps.map(app => {
              const colors = scoreColor(app.aiScore!)
              const expanded = expandedId === app.id
              return (
                <div key={app.id} className={`rounded-xl border bg-card overflow-hidden transition-all ${colors.border}`}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedId(expanded ? null : app.id)}
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">{app.initials}</div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-semibold text-foreground">{app.nameEn}</p>
                      <p className="text-[11px] text-muted-foreground">{app.applicationType} · {app.gradeApplying}</p>
                    </div>
                    {/* Mini scores */}
                    <div className="hidden sm:flex items-center gap-3">
                      {app.scoring && [
                        { label: 'Acad', value: app.scoring.academic },
                        { label: 'Qud', value: app.scoring.qudurat },
                        { label: 'Att', value: app.scoring.attendance },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                          <p className="text-[11px] text-muted-foreground">{label}</p>
                          <p className="text-xs font-bold text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className={`flex flex-col items-center rounded-lg px-2.5 py-1 ${colors.bg}`}>
                      <p className={`text-lg font-bold leading-none ${colors.text}`}>{app.aiScore}</p>
                      <p className={`text-[8px] ${colors.text}`}>{bandLabel(app.aiScore!)}</p>
                    </div>
                    {app.flagged && <Flag className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>

                  {expanded && app.scoring && (
                    <div className="border-t border-border px-4 py-4 bg-muted/10 space-y-4">
                      {/* Score breakdown bars */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Academic Performance', value: app.scoring.academic },
                          { label: 'Qudurat Score', value: app.scoring.qudurat },
                          { label: 'Attendance History', value: app.scoring.attendance },
                          { label: 'Extracurriculars', value: app.scoring.extracurricular },
                          { label: 'Interview Score', value: app.scoring.interview },
                        ].map(({ label, value }) => (
                          <div key={label} className="space-y-1">
                            <div className="flex justify-between text-[11px] text-muted-foreground">
                              <span>{label}</span>
                              <span className={`font-semibold ${scoreColor(value).text}`}>{value}</span>
                            </div>
                            <Progress value={value} className="h-1" />
                          </div>
                        ))}
                      </div>
                      {/* Rationale */}
                      <div className="bg-card rounded-lg px-3 py-2.5 border border-border">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-primary" />AI Rationale
                        </p>
                        <p className="text-xs text-muted-foreground">{app.scoring.rationale}</p>
                      </div>
                      {/* Recommendation + actions */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-xs ${
                          app.scoring.recommendation === 'Admit' ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : app.scoring.recommendation === 'Waitlist' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          AI Recommendation: {app.scoring.recommendation}
                        </Badge>
                        <div className="flex gap-2">
                          {confirmedAdmits.has(app.id) ? (
                            <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-600 cursor-default gap-1">
                              ✓ Admitted
                            </Button>
                          ) : (
                            <Button size="sm" className="text-xs h-7 bg-primary hover:bg-primary/90" onClick={() => {
                              setConfirmedAdmits(prev => new Set([...prev, app.id]))
                              setApplicationStatus(app.id, 'Approved')
                              advanceApplication(app.id, 'admin')
                            }}>Confirm Admit</Button>
                          )}
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setApplicationStatus(app.id, 'Rejected')}>Override</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Flagged queue */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="w-3.5 h-3.5 text-red-400" />
            <h3 className="text-sm font-semibold text-foreground">Flagged Queue</h3>
            <Badge variant="outline" className="text-[11px] bg-red-500/10 text-red-400 border-red-500/20 ml-auto">{flaggedQueue.length}</Badge>
          </div>
          <div className="space-y-2">
            {flaggedQueue.map(app => (
              <Card key={app.id} className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-[11px] font-bold text-red-400 shrink-0">{app.initials}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{app.nameEn}</p>
                      <p className="text-[11px] text-muted-foreground">Score: {app.aiScore}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {app.flagReasons.map(r => (
                      <Badge key={r} variant="outline" className="text-[11px] bg-red-500/10 text-red-400 border-red-500/20">{r}</Badge>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-muted-foreground">Assign Reviewer</p>
                    <div className="flex gap-1.5">
                      {[{ initials: 'SA', id: 'tch-001' }, { initials: 'OH', id: 'tch-002' }, { initials: 'FA', id: 'tch-003' }].map(({ initials, id }) => (
                        <button key={initials} onClick={() => assignReviewer(app.id, id, initials)} className="w-6 h-6 rounded-full bg-muted hover:bg-primary/20 hover:text-primary flex items-center justify-center text-[11px] font-bold text-muted-foreground transition-colors">
                          {initials}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {confirmedFlags.has(app.id) ? (
                      <Button size="sm" variant="outline" className="flex-1 text-[11px] h-6 text-red-400 border-red-500/30 cursor-default">Flagged ✓</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1 text-[11px] h-6" onClick={() => {
                        setConfirmedFlags(prev => new Set([...prev, app.id]))
                        flagApplication(app.id, true)
                      }}>Confirm Flag</Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1 text-[11px] h-6 text-green-400 border-green-500/30 hover:bg-green-500/10" onClick={() => {
                      setOverriddenFlags(prev => new Set([...prev, app.id]))
                      flagApplication(app.id, false)
                    }}>Override</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
