'use client'
import { useState } from 'react'
import {
  Sparkles, Target, BookOpen, CheckCircle2, AlertCircle,
  TrendingUp, Plus, ChevronRight, Brain, Star, Lightbulb,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentStudent } from '@/stores/role-store'
import {
  recentAssessments, studentGoals, pathwayRecommendations,
  type StudentGoal, type GoalCategory, type PathwayStage,
} from '@/data/mock-ilp'

const PATHWAY_STAGES: PathwayStage[] = ['Assessment', 'Foundation', 'Core', 'Practice', 'Mastery', 'Enrichment', 'Reflection']

const stageColors: Record<PathwayStage, string> = {
  Assessment: '#94A3B8',
  Foundation: '#F59E0B',
  Core: '#3B82F6',
  Practice: '#8B5CF6',
  Mastery: '#10B981',
  Enrichment: '#00B8A9',
  Reflection: '#EC4899',
}

const goalStatusConfig = {
  on_track:  { label: 'On Track',  color: 'text-emerald-400', border: 'border-emerald-500/30' },
  at_risk:   { label: 'At Risk',   color: 'text-amber-400',   border: 'border-amber-500/30'   },
  completed: { label: 'Completed', color: 'text-primary',     border: 'border-primary/30'      },
}

const categoryColors: Record<GoalCategory, string> = {
  Academic:   '#3B82F6',
  Career:     '#8B5CF6',
  Personal:   '#10B981',
  Behavioral: '#F59E0B',
}

type PrivateGoal = { id: string; goal: string; category: GoalCategory; progress: number; status: 'on_track' }

export default function StudentMyPlanPage() {
  const student = useCurrentStudent()

  const assessment = student ? recentAssessments.find(a => a.studentId === student.id) : null
  const myGoals: StudentGoal[] = student ? studentGoals.filter(g => g.studentId === student.id) : []
  const myRec = student ? pathwayRecommendations.find(r => r.studentId === student.id) : null

  // Derive current pathway stage from recommendations or default
  const currentStage: PathwayStage = myRec?.from ?? 'Core'
  const currentStageIdx = PATHWAY_STAGES.indexOf(currentStage)

  const [privateGoals, setPrivateGoals] = useState<PrivateGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState<GoalCategory>('Academic')

  function addPrivateGoal() {
    if (!newGoalText.trim()) return
    setPrivateGoals(prev => [...prev, {
      id: `priv-${Date.now()}`,
      goal: newGoalText.trim(),
      category: newGoalCategory,
      progress: 0,
      status: 'on_track',
    }])
    setNewGoalText('')
    setShowAddGoal(false)
  }

  if (!student) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No student found.</p></div>
  }

  const allGoals = [
    ...myGoals,
    ...privateGoals.map(g => ({ ...g, student: student.name, initials: student.initials, nextReflection: '—', studentId: student.id })),
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">My Learning Plan</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">My Plan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your personalized learning pathway and goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: pathway + goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pathway Progress */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Learning Pathway
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {PATHWAY_STAGES.map((stage, idx) => {
                  const isCompleted = idx < currentStageIdx
                  const isCurrent = idx === currentStageIdx
                  const color = stageColors[stage]
                  return (
                    <div key={stage} className="flex items-center shrink-0">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[10px] font-bold transition-all ${
                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                            isCurrent   ? 'border-2 text-white' :
                                          'bg-card border-border text-muted-foreground'
                          }`}
                          style={isCurrent ? { background: color, borderColor: color } : {}}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <p className="text-[9px] font-medium text-center leading-tight max-w-[52px]"
                          style={{ color: isCurrent ? color : isCompleted ? '#10B981' : '#94A3B8' }}>
                          {stage}
                        </p>
                      </div>
                      {idx < PATHWAY_STAGES.length - 1 && (
                        <div className={`w-6 h-0.5 mx-0.5 ${idx < currentStageIdx ? 'bg-emerald-500' : 'bg-border'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
              {myRec && (
                <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <p className="text-xs text-foreground font-medium">
                      Ready to advance to <span className="text-primary">{myRec.to}</span> in {myRec.subject}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 ml-5">{myRec.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  My Goals
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowAddGoal(v => !v)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Personal Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {/* Add goal form */}
              {showAddGoal && (
                <div className="p-3 rounded-xl bg-muted/20 border border-primary/20 space-y-2">
                  <Input
                    value={newGoalText}
                    onChange={e => setNewGoalText(e.target.value)}
                    placeholder="Describe your personal goal…"
                    className="bg-muted/30 border-border text-sm h-8"
                  />
                  <div className="flex items-center gap-2">
                    <Select value={newGoalCategory} onValueChange={v => setNewGoalCategory(v as GoalCategory)}>
                      <SelectTrigger className="h-8 text-xs flex-1 bg-muted/30 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['Academic', 'Career', 'Personal', 'Behavioral'] as GoalCategory[]).map(c => (
                          <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="h-8 text-xs" onClick={addPrivateGoal} disabled={!newGoalText.trim()}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setShowAddGoal(false)}>
                      Cancel
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Private goals are only visible to you.</p>
                </div>
              )}

              {allGoals.length === 0 && !showAddGoal && (
                <p className="text-sm text-muted-foreground text-center py-6">No goals yet. Add a personal goal to get started!</p>
              )}

              {allGoals.map((g, i) => {
                const status = goalStatusConfig[g.status]
                const isPrivate = privateGoals.some(p => p.goal === g.goal)
                return (
                  <div key={i} className="p-3 rounded-xl bg-muted/20 border border-border space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-foreground flex-1">{g.goal}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isPrivate && (
                          <Badge variant="outline" className="text-[9px] h-4 border-muted-foreground/30 text-muted-foreground">
                            Private
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-[10px] h-5 ${status.color} ${status.border}`}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={g.progress} className="h-1.5 flex-1" />
                      <span className="text-[10px] text-muted-foreground shrink-0">{g.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 border-transparent"
                        style={{ color: categoryColors[g.category], background: `${categoryColors[g.category]}15` }}
                      >
                        {g.category}
                      </Badge>
                      {g.nextReflection !== '—' && (
                        <p className="text-[10px] text-muted-foreground">Reflection: {g.nextReflection}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: profile + recommendations */}
        <div className="space-y-4">
          {/* Learning Profile */}
          {assessment ? (
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Learning Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Learning Style</p>
                  <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                    {assessment.style}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5">Confidence Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={assessment.confidence} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold text-foreground">{assessment.confidence}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Star className="w-3 h-3 text-emerald-400" /> Strengths
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {assessment.strengths.map(s => (
                      <Badge key={s} variant="outline" className="text-[10px] h-5 border-emerald-500/30 text-emerald-400">{s}</Badge>
                    ))}
                  </div>
                </div>
                {assessment.barriers.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-400" /> Focus Areas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {assessment.barriers.map(b => (
                        <Badge key={b} variant="outline" className="text-[10px] h-5 border-amber-500/30 text-amber-400">{b}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl border-border bg-card">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground text-center">Learning profile assessment pending.</p>
              </CardContent>
            </Card>
          )}

          {/* Current stage card */}
          <Card className="rounded-2xl border-border bg-card" style={{ borderColor: `${stageColors[currentStage]}30` }}>
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: stageColors[currentStage] }} />
                Current Stage
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: stageColors[currentStage] }}
                >
                  {currentStage}
                </div>
                <p className="text-[10px] text-muted-foreground">Stage {currentStageIdx + 1} of {PATHWAY_STAGES.length}</p>
              </div>
              <Progress value={((currentStageIdx + 1) / PATHWAY_STAGES.length) * 100} className="h-1.5" />
            </CardContent>
          </Card>

          {/* AI tips */}
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                AI Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {[
                assessment?.style === 'Visual'           ? 'Use mind maps and diagrams when reviewing content' :
                assessment?.style === 'Auditory'         ? 'Try reading notes aloud or joining study groups' :
                assessment?.style === 'Kinesthetic'      ? 'Practice with hands-on exercises and labs' :
                                                            'Take structured notes and create summaries',
                `Focus extra time on: ${assessment?.barriers?.join(', ') ?? 'identified weak areas'}`,
                'Review your goals weekly and update your progress',
                'Use the AI Tutor for personalized practice questions',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
