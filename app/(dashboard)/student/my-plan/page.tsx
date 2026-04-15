'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, Target, BookOpen, CheckCircle2, AlertCircle,
  Plus, Brain, Star, AlertTriangle, TrendingUp, TrendingDown,
  Minus, ShieldAlert, Calendar, Clock, Zap, ClipboardList,
  Loader2, Lightbulb, Bot, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentStudent } from '@/stores/role-store'
import { useLearningPathStore } from '@/stores/learning-path-store'
import {
  recentAssessments, studentGoals, ilpRiskStudents,
  type StudentGoal, type GoalCategory,
} from '@/data/mock-ilp'
import { gradesByClass, gradeColor, gradeBorderColor, letterGrade } from '@/data/mock-grades'

// ─── Config ───────────────────────────────────────────────────────────────────

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

const riskLevelConfig = {
  high:     { label: 'High Risk',     color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'     },
  moderate: { label: 'Moderate Risk', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30'   },
  low:      { label: 'Low Risk',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  none:     { label: 'On Track',      color: 'text-primary',     bg: 'bg-primary/10',     border: 'border-primary/30'     },
}

type PrivateGoal = { id: string; goal: string; category: GoalCategory; progress: number; status: 'on_track' }

// ─── Weekly Structure ──────────────────────────────────────────────────────────

type WeeklyTopic = { subject: string; topic: string; color: string }
type WeeklyAssignment = { title: string; subject: string; dueDay: string; points: number }
type WeekData = {
  week: number; theme: string; dateRange: string; progress: number; status: 'completed' | 'active' | 'upcoming'
  topics: WeeklyTopic[]
  assignments: WeeklyAssignment[]
  studyHours: number
}

const WEEKS: WeekData[] = [
  {
    week: 1, theme: 'Foundation Review', dateRange: 'Apr 14 – Apr 18', progress: 100, status: 'completed',
    studyHours: 12,
    topics: [
      { subject: 'Mathematics', topic: 'Quadratic Equations', color: '#3B82F6' },
      { subject: 'Physics', topic: "Newton's Laws of Motion", color: '#8B5CF6' },
      { subject: 'English', topic: 'Essay Structure & Thesis', color: '#10B981' },
    ],
    assignments: [
      { title: 'Quadratic Problem Set', subject: 'Mathematics', dueDay: 'Wed', points: 20 },
      { title: "Newton's Laws Worksheet", subject: 'Physics', dueDay: 'Fri', points: 15 },
    ],
  },
  {
    week: 2, theme: 'Core Skill Building', dateRange: 'Apr 21 – Apr 25', progress: 65, status: 'active',
    studyHours: 10,
    topics: [
      { subject: 'Mathematics', topic: 'Statistics & Data Analysis', color: '#3B82F6' },
      { subject: 'Physics', topic: 'Waves & Optics', color: '#8B5CF6' },
      { subject: 'English', topic: 'Persuasive Writing Techniques', color: '#10B981' },
      { subject: 'Chemistry', topic: 'Periodic Table Trends', color: '#F59E0B' },
    ],
    assignments: [
      { title: 'Statistics Data Report', subject: 'Mathematics', dueDay: 'Thu', points: 30 },
      { title: 'Essay Draft — Technology in Society', subject: 'English', dueDay: 'Fri', points: 25 },
    ],
  },
  {
    week: 3, theme: 'Applied Practice', dateRange: 'Apr 28 – May 2', progress: 0, status: 'upcoming',
    studyHours: 11,
    topics: [
      { subject: 'Mathematics', topic: 'Algebra Mid-Unit Review', color: '#3B82F6' },
      { subject: 'Physics', topic: 'Forces & Momentum', color: '#8B5CF6' },
      { subject: 'English', topic: 'Counter-Argument & Refutation', color: '#10B981' },
    ],
    assignments: [
      { title: 'Algebra Review Test', subject: 'Mathematics', dueDay: 'Wed', points: 50 },
      { title: "Newton's Laws Lab Report", subject: 'Physics', dueDay: 'Thu', points: 30 },
    ],
  },
  {
    week: 4, theme: 'Assessment & Reflection', dateRange: 'May 5 – May 9', progress: 0, status: 'upcoming',
    studyHours: 8,
    topics: [
      { subject: 'All Subjects', topic: 'Mid-Term Revision', color: '#00B8A9' },
      { subject: 'Mathematics', topic: 'Mock Exam Practice', color: '#3B82F6' },
      { subject: 'Physics', topic: 'Chapter 5–7 Review', color: '#8B5CF6' },
    ],
    assignments: [
      { title: 'Final Essay — Technology in Society', subject: 'English', dueDay: 'Tue', points: 25 },
      { title: 'Chapter Summary Portfolio', subject: 'All Subjects', dueDay: 'Fri', points: 40 },
    ],
  },
]

const weekStatusConfig = {
  completed: { label: 'Completed', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  active:    { label: 'In Progress', color: 'text-primary',   border: 'border-primary/30',     bg: 'bg-primary/10'     },
  upcoming:  { label: 'Upcoming',   color: 'text-muted-foreground', border: 'border-border',   bg: 'bg-muted/20'       },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentMyPlanPage() {
  const router = useRouter()
  const student = useCurrentStudent()
  const { getPublishedPath } = useLearningPathStore()
  const teacherPublished = student ? getPublishedPath(student.id) : undefined

  const assessment = student ? recentAssessments.find(a => a.studentId === student.id) : null
  const myGoals: StudentGoal[] = student ? studentGoals.filter(g => g.studentId === student.id) : []
  const riskData = student ? ilpRiskStudents.find(r => r.studentId === student.id) : null

  const sortedSubjects = [...gradesByClass].sort((a, b) => a.average - b.average)
  const atRiskSubjects = gradesByClass.filter(s => s.average < 75)
  const belowTargetSubjects = gradesByClass.filter(s => s.average < 80)

  const derivedRiskLevel =
    riskData?.riskLevel ??
    (atRiskSubjects.length >= 2 ? 'high' : atRiskSubjects.length === 1 ? 'moderate' : belowTargetSubjects.length >= 2 ? 'low' : 'none')
  const derivedRiskScore =
    riskData?.riskScore ??
    Math.round(100 - (gradesByClass.reduce((s, c) => s + c.average, 0) / gradesByClass.length))

  const [privateGoals, setPrivateGoals] = useState<PrivateGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState<GoalCategory>('Academic')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [mainTab, setMainTab] = useState('overview')

  // AI suggestions state
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{ text: string; category: GoalCategory }[]>([])
  const [addedSuggestions, setAddedSuggestions] = useState<Set<number>>(new Set())

  async function generateAiSuggestions() {
    setLoadingAiSuggestions(true)
    setShowAiSuggestions(true)
    setAddedSuggestions(new Set())
    await new Promise(r => setTimeout(r, 1300))

    // Personalise based on real grade + risk data
    const weak = gradesByClass.filter(s => s.average < 80)
    const struggling = gradesByClass.filter(s => s.average < 75)

    const suggestions: { text: string; category: GoalCategory }[] = []

    if (struggling.length > 0) {
      suggestions.push({
        text: `Raise ${struggling[0].subject} grade from ${struggling[0].average}% to 80% within 4 weeks by doing 3 AI Tutor sessions per week`,
        category: 'Academic',
      })
    }
    if (weak.length > 1) {
      suggestions.push({
        text: `Complete one past-paper practice per week for ${weak[1]?.subject ?? weak[0].subject} to build exam confidence`,
        category: 'Academic',
      })
    } else {
      suggestions.push({
        text: 'Submit all assignments on time for the remainder of the term to maintain a strong grade record',
        category: 'Academic',
      })
    }

    const attendanceSugg = student && student.attendanceRate < 90
      ? { text: `Improve attendance rate from ${student.attendanceRate}% to 95% by avoiding unexcused absences`, category: 'Behavioral' as GoalCategory }
      : { text: 'Participate actively in at least one class discussion per subject each week', category: 'Behavioral' as GoalCategory }
    suggestions.push(attendanceSugg)

    suggestions.push({
      text: 'Spend 20 minutes reviewing notes from each lesson within 24 hours to improve long-term retention',
      category: 'Personal',
    })
    suggestions.push({
      text: 'Research one potential career pathway and identify the academic requirements needed to pursue it',
      category: 'Career',
    })

    setAiSuggestions(suggestions)
    setLoadingAiSuggestions(false)
  }

  function addSuggestionAsGoal(index: number) {
    const s = aiSuggestions[index]
    if (!s) return
    setPrivateGoals(prev => [...prev, {
      id: `ai-${Date.now()}-${index}`,
      goal: s.text,
      category: s.category,
      progress: 0,
      status: 'on_track',
    }])
    setAddedSuggestions(prev => new Set(prev).add(index))
  }

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

  const riskCfg = riskLevelConfig[derivedRiskLevel]
  const activeWeek = selectedWeek !== null ? WEEKS.find(w => w.week === selectedWeek) : null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Learning Plan</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Plan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your personalized learning pathway</p>
        </div>
        <Button size="sm" className="shrink-0 gap-1.5" onClick={() => router.push('/student/generate-course')}>
          <Sparkles className="w-3.5 h-3.5" />
          Generate AI Course
        </Button>
      </div>

      {/* Main tabs */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">Weekly Structure</TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW TAB ── */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Academic Risk Analysis */}
              <Card className="rounded-xl border-border bg-card">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-primary" />
                      Academic Risk Analysis
                    </CardTitle>
                    <Badge variant="outline" className={`text-[11px] h-5 ${riskCfg.color} ${riskCfg.border}`}>
                      {riskCfg.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                      <p className="text-[11px] text-muted-foreground mb-1">Current GPA</p>
                      <p className="text-lg font-bold text-primary">{student.gpa.toFixed(1)}</p>
                      <p className="text-[11px] text-muted-foreground">out of 4.0</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                      <p className="text-[11px] text-muted-foreground mb-1">Attendance</p>
                      <p className={`text-lg font-bold ${student.attendanceRate >= 90 ? 'text-emerald-400' : student.attendanceRate >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                        {student.attendanceRate}%
                      </p>
                      <p className="text-[11px] text-muted-foreground">this semester</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                      <p className="text-[11px] text-muted-foreground mb-1">Need Attention</p>
                      <p className={`text-lg font-bold ${atRiskSubjects.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {atRiskSubjects.length}
                      </p>
                      <p className="text-[11px] text-muted-foreground">subject{atRiskSubjects.length !== 1 ? 's' : ''} &lt;75%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sortedSubjects.map(cls => {
                      const isStruggling = cls.average < 75
                      const TrendIcon = cls.trend === 'up' ? TrendingUp : cls.trend === 'down' ? TrendingDown : Minus
                      const trendColor = cls.trend === 'up' ? 'text-emerald-400' : cls.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                      const statusLabel = cls.average >= 90 ? 'Excellent' : cls.average >= 75 ? 'On Track' : cls.average >= 60 ? 'Needs Attention' : 'At Risk'
                      const statusColor = cls.average >= 90 ? 'text-emerald-400 border-emerald-500/30' : cls.average >= 75 ? 'text-amber-400 border-amber-500/30' : 'text-red-400 border-red-500/30'
                      return (
                        <div key={cls.classId} className={`p-3 rounded-xl bg-muted/20 border ${gradeBorderColor(cls.average)} ${isStruggling ? 'border-2' : ''}`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground">{cls.subject}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{cls.teacher}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                              <p className={`text-xl font-bold leading-none ${gradeColor(cls.average)}`}>{cls.average}%</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-[11px] h-4 ${statusColor}`}>{statusLabel}</Badge>
                            <Badge variant="outline" className="text-[11px] h-4 border-border text-muted-foreground">{letterGrade(cls.average)}</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {atRiskSubjects.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <p className="text-xs text-red-400 font-medium">
                          You are falling behind in {atRiskSubjects.map(s => s.subject).join(' and ')}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 ml-5">
                        Use &ldquo;Generate AI Course&rdquo; to request a personalized course.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teacher Learning Path */}
              {teacherPublished && (
                <Card className="rounded-xl border-primary/30 bg-primary/5">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Learning Path from Your Teacher
                      </CardTitle>
                      <Badge variant="outline" className="text-[11px] border-primary/30 text-primary">
                        {new Date(teacherPublished.publishedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Published by {teacherPublished.teacherName}</p>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-4">
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <p className="text-xs text-foreground leading-relaxed">{teacherPublished.path.overallStrategy}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3 h-3" /> Focus Areas
                      </p>
                      {teacherPublished.path.focusAreas.map((fa, i) => (
                        <div key={i} className="p-3 rounded-xl bg-card border border-border space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-foreground">{fa.subject}</p>
                            <Badge variant="outline" className={`text-[11px] h-4 ${fa.priority === 'high' ? 'border-red-500/30 text-red-400' : fa.priority === 'medium' ? 'border-amber-500/30 text-amber-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                              {fa.priority} priority
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{fa.currentLevel} → {fa.targetLevel}</p>
                          <p className="text-[11px] text-foreground">{fa.recommendation}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> 4-Week Plan
                      </p>
                      {teacherPublished.path.weeklyPlan.map(week => (
                        <div key={week.week} className="flex gap-3 p-3 rounded-xl bg-card border border-border">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">W{week.week}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-semibold text-foreground">{week.theme}</p>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{week.hoursRequired}h</span>
                            </div>
                            <ul className="space-y-0.5">
                              {week.activities.map((act, j) => (
                                <li key={j} className="text-[11px] text-muted-foreground flex gap-1.5"><span className="text-primary shrink-0">·</span>{act}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Milestones
                      </p>
                      {teacherPublished.path.milestones.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border">
                          <p className="text-[11px] font-medium text-foreground">{m.title}</p>
                          <Badge variant="outline" className="text-[11px] h-4 border-primary/30 text-primary shrink-0 ml-2">Wk {m.targetWeek}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── My Goals ── */}
              <Card className="rounded-xl border-border bg-card">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      My Goals
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 text-xs gap-1.5 ${showAiSuggestions ? 'border-primary/40 text-primary bg-primary/5' : ''}`}
                        onClick={() => showAiSuggestions ? setShowAiSuggestions(false) : generateAiSuggestions()}
                      >
                        {loadingAiSuggestions
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Sparkles className="w-3 h-3" />
                        }
                        AI Suggestions
                        {!loadingAiSuggestions && (showAiSuggestions
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                        )}
                      </Button>
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
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">

                  {/* AI suggestions panel */}
                  {showAiSuggestions && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-primary/10">
                        <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                        <p className="text-xs font-medium text-primary">AI-Generated Suggestions</p>
                        <p className="text-[11px] text-muted-foreground ml-auto">Based on your grades &amp; profile</p>
                      </div>
                      {loadingAiSuggestions ? (
                        <div className="flex items-center justify-center gap-2 py-6">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <p className="text-xs text-muted-foreground">Analysing your performance…</p>
                        </div>
                      ) : (
                        <div className="p-3 space-y-2">
                          {aiSuggestions.map((s, i) => {
                            const added = addedSuggestions.has(i)
                            return (
                              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-card border border-border">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <p className="text-[11px] text-foreground leading-relaxed">{s.text}</p>
                                  <div className="flex items-center justify-between gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-[11px] h-4 border-transparent shrink-0"
                                      style={{ color: categoryColors[s.category], background: `${categoryColors[s.category]}15` }}
                                    >
                                      {s.category}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant={added ? 'outline' : 'ghost'}
                                      disabled={added}
                                      className={`h-6 text-[11px] shrink-0 ${added ? 'text-emerald-400 border-emerald-500/30' : 'text-primary hover:bg-primary/10'}`}
                                      onClick={() => addSuggestionAsGoal(i)}
                                    >
                                      {added
                                        ? <><CheckCircle2 className="w-3 h-3 mr-1" />Added</>
                                        : <><Plus className="w-3 h-3 mr-1" />Add goal</>
                                      }
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

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
                        <Button size="sm" className="h-8 text-xs" onClick={addPrivateGoal} disabled={!newGoalText.trim()}>Save</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Private goals are only visible to you.</p>
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
                              <Badge variant="outline" className="text-[11px] h-4 border-muted-foreground/30 text-muted-foreground">Private</Badge>
                            )}
                            <Badge variant="outline" className={`text-[11px] h-5 ${status.color} ${status.border}`}>{status.label}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={g.progress} className="h-1.5 flex-1" />
                          <span className="text-[11px] text-muted-foreground shrink-0">{g.progress}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-[11px] h-4 border-transparent"
                            style={{ color: categoryColors[g.category], background: `${categoryColors[g.category]}15` }}
                          >
                            {g.category}
                          </Badge>
                          {g.nextReflection !== '—' && (
                            <p className="text-[11px] text-muted-foreground">Reflection: {g.nextReflection}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {assessment ? (
                <Card className="rounded-xl border-border bg-card">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Learning Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Learning Style</p>
                      <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary">{assessment.style}</Badge>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1.5">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={assessment.confidence} className="h-1.5 flex-1" />
                        <span className="text-xs font-semibold text-foreground">{assessment.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1">
                        <Star className="w-3 h-3 text-emerald-400" /> Strengths
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {assessment.strengths.map(s => (
                          <Badge key={s} variant="outline" className="text-[11px] h-5 border-emerald-500/30 text-emerald-400">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {assessment.barriers.length > 0 && (
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-400" /> Focus Areas
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {assessment.barriers.map(b => (
                            <Badge key={b} variant="outline" className="text-[11px] h-5 border-amber-500/30 text-amber-400">{b}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-xl border-border bg-card">
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground text-center">Learning profile assessment pending.</p>
                  </CardContent>
                </Card>
              )}

              <Card className={`rounded-xl ${riskCfg.border} border ${riskCfg.bg}`}>
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ShieldAlert className={`w-4 h-4 ${riskCfg.color}`} />
                    Risk Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-3xl font-bold ${riskCfg.color}`}>{derivedRiskScore}</p>
                      <p className="text-[11px] text-muted-foreground">Risk Score / 100</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className={`text-[11px] h-5 ${riskCfg.color} ${riskCfg.border}`}>{riskCfg.label}</Badge>
                      {riskData && (
                        <div className="flex items-center gap-1 justify-end">
                          {riskData.trend === 'up'   && <TrendingUp   className="w-3 h-3 text-red-400" />}
                          {riskData.trend === 'down'  && <TrendingDown className="w-3 h-3 text-emerald-400" />}
                          {riskData.trend === 'flat'  && <Minus        className="w-3 h-3 text-muted-foreground" />}
                          <p className="text-[11px] text-muted-foreground capitalize">{riskData.trend}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {riskData && riskData.factors.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Risk Factors</p>
                      {riskData.factors.map(f => (
                        <div key={f} className="flex items-center gap-1.5">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <p className="text-[11px] text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {atRiskSubjects.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Subject Alerts</p>
                      {atRiskSubjects.map(s => (
                        <div key={s.classId} className="flex items-center justify-between">
                          <p className="text-[11px] text-muted-foreground">{s.subject}</p>
                          <span className="text-[11px] font-semibold text-red-400">{s.average}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {derivedRiskLevel === 'none' && atRiskSubjects.length === 0 && (
                    <p className="text-[11px] text-emerald-400">All subjects on track. Keep it up!</p>
                  )}
                  <p className="text-[11px] text-muted-foreground border-t border-border pt-2">
                    Based on grades, attendance &amp; engagement
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-primary/20 bg-primary/5">
                <CardContent className="px-5 py-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Personalized Courses</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Short-form video courses, adaptive quizzes, and AI coaching — all tailored to your learning gaps and style.
                  </p>
                  {student.status === 'at-risk' && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <p className="text-[11px] text-amber-400 font-medium">Priority access enabled for at-risk students</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── WEEKLY STRUCTURE TAB ── */}
        <TabsContent value="weekly" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Week cards */}
            <div className="lg:col-span-2 space-y-4">
              <p className="text-xs text-muted-foreground">Click a week to see details, topics, and assignments.</p>
              {WEEKS.map(week => {
                const wsCfg = weekStatusConfig[week.status]
                const isSelected = selectedWeek === week.week
                return (
                  <Card
                    key={week.week}
                    className={`rounded-xl border transition-colors cursor-pointer ${isSelected ? 'border-primary/40 bg-primary/5' : 'border-border bg-card hover:border-primary/20'}`}
                    onClick={() => setSelectedWeek(isSelected ? null : week.week)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${week.status === 'active' ? 'bg-primary/20 text-primary' : week.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted/40 text-muted-foreground'}`}>
                            W{week.week}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{week.theme}</p>
                            <p className="text-[11px] text-muted-foreground">{week.dateRange} · {week.studyHours}h study</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-[11px] h-5 shrink-0 ${wsCfg.color} ${wsCfg.border} ${wsCfg.bg}`}>
                          {wsCfg.label}
                        </Badge>
                      </div>

                      {/* Progress bar */}
                      {week.status !== 'upcoming' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">Progress</span>
                            <span className="text-[11px] font-semibold text-foreground">{week.progress}%</span>
                          </div>
                          <Progress value={week.progress} className="h-1.5" />
                        </div>
                      )}

                      {/* Expanded detail */}
                      {isSelected && (
                        <div className="space-y-4 pt-2 border-t border-border">
                          {/* Topics */}
                          <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Topics This Week</p>
                            <div className="space-y-1.5">
                              {week.topics.map((t, i) => (
                                <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/20 border border-border">
                                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground">{t.topic}</p>
                                    <p className="text-[11px] text-muted-foreground">{t.subject}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Assignments */}
                          <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assignments</p>
                            {week.assignments.length === 0 ? (
                              <p className="text-[11px] text-muted-foreground">No assignments this week.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {week.assignments.map((a, i) => (
                                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border">
                                    <ClipboardList className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                                      <p className="text-[11px] text-muted-foreground">{a.subject} · {a.points} pts</p>
                                    </div>
                                    <Badge variant="outline" className="text-[11px] h-4 border-amber-500/30 text-amber-400 shrink-0">
                                      Due {a.dueDay}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Week overview sidebar */}
            <div className="space-y-4">
              {/* Summary stats */}
              <Card className="rounded-xl border-border bg-card">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Term Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  {WEEKS.map(w => (
                    <div key={w.week} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground">Week {w.week} — {w.theme}</span>
                        <span className={`text-[11px] font-semibold ${weekStatusConfig[w.status].color}`}>
                          {w.status === 'upcoming' ? '—' : `${w.progress}%`}
                        </span>
                      </div>
                      <Progress
                        value={w.progress}
                        className="h-1"
                      />
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Overall</span>
                      <span className="text-xs font-bold text-primary">
                        {Math.round(WEEKS.reduce((s, w) => s + w.progress, 0) / WEEKS.length)}%
                      </span>
                    </div>
                    <Progress value={Math.round(WEEKS.reduce((s, w) => s + w.progress, 0) / WEEKS.length)} className="h-1.5 mt-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Total assignments */}
              <Card className="rounded-xl border-primary/20 bg-primary/5">
                <CardContent className="px-5 py-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5 text-primary" />
                    All Assignments
                  </p>
                  {WEEKS.flatMap(w => w.assignments.map(a => ({ ...a, week: w.week }))).map((a, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-foreground truncate">{a.title}</p>
                      <Badge variant="outline" className="text-[11px] h-4 shrink-0 border-border text-muted-foreground">W{a.week}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
