'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, Target, BookOpen, CheckCircle2, AlertCircle,
  Plus, Brain, Star, AlertTriangle, TrendingUp, TrendingDown,
  Minus, ShieldAlert, Calendar, Clock, Zap, ClipboardList,
  Loader2, Lightbulb, Bot, ChevronDown, ChevronUp, Flame,
  GraduationCap, Activity, ArrowRight, Play, Trophy,
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
import { cn } from '@/lib/utils'

// ─── Config ───────────────────────────────────────────────────────────────────

const goalStatusConfig = {
  on_track:  { label: 'On Track',  color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  at_risk:   { label: 'At Risk',   color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  completed: { label: 'Completed', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
}

const categoryColors: Record<GoalCategory, { text: string; bg: string; border: string }> = {
  Academic:   { text: 'text-info', bg: 'bg-info/10', border: 'border-info/30' },
  Career:     { text: 'text-primary-variant', bg: 'bg-primary-variant/10', border: 'border-primary-variant/30' },
  Personal:   { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
  Behavioral: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
}

const riskLevelConfig = {
  high:     { label: 'High Risk',     color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', gradient: 'from-destructive/20 to-destructive/5' },
  moderate: { label: 'Moderate Risk', color: 'text-warning',     bg: 'bg-warning/10',     border: 'border-warning/30',     gradient: 'from-warning/20 to-warning/5' },
  low:      { label: 'Low Risk',      color: 'text-success',     bg: 'bg-success/10',     border: 'border-success/30',     gradient: 'from-success/20 to-success/5' },
  none:     { label: 'On Track',      color: 'text-primary',     bg: 'bg-primary/10',     border: 'border-primary/30',     gradient: 'from-primary/20 to-primary/5' },
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
      { subject: 'Mathematics', topic: 'Quadratic Equations', color: '#2878C1' },
      { subject: 'Physics', topic: "Newton's Laws of Motion", color: '#004937' },
      { subject: 'English', topic: 'Essay Structure & Thesis', color: '#007560' },
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
      { subject: 'Mathematics', topic: 'Statistics & Data Analysis', color: '#2878C1' },
      { subject: 'Physics', topic: 'Waves & Optics', color: '#004937' },
      { subject: 'English', topic: 'Persuasive Writing Techniques', color: '#007560' },
      { subject: 'Chemistry', topic: 'Periodic Table Trends', color: '#D4AF37' },
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
      { subject: 'Mathematics', topic: 'Algebra Mid-Unit Review', color: '#2878C1' },
      { subject: 'Physics', topic: 'Forces & Momentum', color: '#004937' },
      { subject: 'English', topic: 'Counter-Argument & Refutation', color: '#007560' },
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
      { subject: 'All Subjects', topic: 'Mid-Term Revision', color: '#007560' },
      { subject: 'Mathematics', topic: 'Mock Exam Practice', color: '#2878C1' },
      { subject: 'Physics', topic: 'Chapter 5–7 Review', color: '#004937' },
    ],
    assignments: [
      { title: 'Final Essay — Technology in Society', subject: 'English', dueDay: 'Tue', points: 25 },
      { title: 'Chapter Summary Portfolio', subject: 'All Subjects', dueDay: 'Fri', points: 40 },
    ],
  },
]

const weekStatusConfig = {
  completed: { label: 'Completed',   color: 'text-success',           bg: 'bg-success/10',     border: 'border-success/30', gradient: 'from-success to-primary' },
  active:    { label: 'In Progress', color: 'text-primary',           bg: 'bg-primary/10',     border: 'border-primary/30', gradient: 'from-primary to-info' },
  upcoming:  { label: 'Upcoming',    color: 'text-muted-foreground',  bg: 'bg-muted/30',       border: 'border-border',     gradient: 'from-muted to-muted' },
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
  const currentActiveWeek = WEEKS.find(w => w.status === 'active')
  const completedWeeks = WEEKS.filter(w => w.status === 'completed').length
  const overallProgress = Math.round(WEEKS.reduce((sum, w) => sum + w.progress, 0) / WEEKS.length)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-variant p-6 md:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-warning/20 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur mb-1">
                    AI-Powered Learning Path
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    My Plan
                  </h1>
                </div>
              </div>
              <p className="text-white/80 text-sm md:text-base max-w-lg">
                Your personalized learning pathway with AI-generated goals, risk analysis, and weekly structure to help you achieve academic excellence.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[110px]">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-white/70" />
                  <p className="text-xs text-white/70">GPA</p>
                </div>
                <p className="text-2xl font-bold text-white">{student.gpa.toFixed(1)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[110px]">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-white/70" />
                  <p className="text-xs text-white/70">Week</p>
                </div>
                <p className="text-2xl font-bold text-warning">{currentActiveWeek?.week ?? '-'}/4</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[110px]">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-white/70" />
                  <p className="text-xs text-white/70">Progress</p>
                </div>
                <p className="text-2xl font-bold text-white">{overallProgress}%</p>
              </div>
            </div>
          </div>
          
          {/* Quick action */}
          <div className="mt-6 flex items-center gap-3">
            <Button 
              onClick={() => router.push('/student/generate-course')}
              className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Course
            </Button>
            <Button 
              variant="outline"
              onClick={() => setMainTab('weekly')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2"
            >
              <Calendar className="w-4 h-4" />
              View Weekly Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="bg-card border border-border p-1 h-auto">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="w-4 h-4" />
            Weekly Structure
          </TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW TAB ── */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Academic Risk Analysis - Redesigned */}
              <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-border">
                <div className={cn("h-1 bg-gradient-to-r", riskCfg.gradient.replace('from-', 'from-').replace('to-', 'to-'))} style={{
                  background: `linear-gradient(to right, var(--${derivedRiskLevel === 'high' ? 'destructive' : derivedRiskLevel === 'moderate' ? 'warning' : derivedRiskLevel === 'low' ? 'success' : 'primary'}), var(--primary))`
                }} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", riskCfg.bg)}>
                        <ShieldAlert className={cn("w-5 h-5", riskCfg.color)} />
                      </div>
                      Academic Risk Analysis
                    </CardTitle>
                    <Badge className={cn("font-medium", riskCfg.bg, riskCfg.color, riskCfg.border)}>
                      {riskCfg.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 ring-1 ring-primary/20">
                      <div className="relative z-10">
                        <p className="text-xs text-muted-foreground mb-1">Current GPA</p>
                        <p className="text-2xl font-bold text-primary">{student.gpa.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">out of 4.0</p>
                      </div>
                      <GraduationCap className="absolute -bottom-2 -right-2 w-16 h-16 text-primary/10" />
                    </div>
                    <div className={cn(
                      "relative overflow-hidden rounded-xl p-4 ring-1",
                      student.attendanceRate >= 90 
                        ? "bg-gradient-to-br from-success/10 to-success/5 ring-success/20" 
                        : student.attendanceRate >= 75 
                        ? "bg-gradient-to-br from-warning/10 to-warning/5 ring-warning/20"
                        : "bg-gradient-to-br from-destructive/10 to-destructive/5 ring-destructive/20"
                    )}>
                      <div className="relative z-10">
                        <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          student.attendanceRate >= 90 ? "text-success" : student.attendanceRate >= 75 ? "text-warning" : "text-destructive"
                        )}>
                          {student.attendanceRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">this semester</p>
                      </div>
                      <Calendar className="absolute -bottom-2 -right-2 w-16 h-16 text-current opacity-10" />
                    </div>
                    <div className={cn(
                      "relative overflow-hidden rounded-xl p-4 ring-1",
                      atRiskSubjects.length > 0 
                        ? "bg-gradient-to-br from-destructive/10 to-destructive/5 ring-destructive/20"
                        : "bg-gradient-to-br from-success/10 to-success/5 ring-success/20"
                    )}>
                      <div className="relative z-10">
                        <p className="text-xs text-muted-foreground mb-1">Need Attention</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          atRiskSubjects.length > 0 ? "text-destructive" : "text-success"
                        )}>
                          {atRiskSubjects.length}
                        </p>
                        <p className="text-xs text-muted-foreground">subject{atRiskSubjects.length !== 1 ? 's' : ''} &lt;75%</p>
                      </div>
                      <AlertTriangle className="absolute -bottom-2 -right-2 w-16 h-16 text-current opacity-10" />
                    </div>
                  </div>

                  {/* Subject grades */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sortedSubjects.map(cls => {
                      const isStruggling = cls.average < 75
                      const TrendIcon = cls.trend === 'up' ? TrendingUp : cls.trend === 'down' ? TrendingDown : Minus
                      const trendColor = cls.trend === 'up' ? 'text-success' : cls.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                      const statusLabel = cls.average >= 90 ? 'Excellent' : cls.average >= 75 ? 'On Track' : cls.average >= 60 ? 'Needs Attention' : 'At Risk'
                      const statusColor = cls.average >= 90 ? 'bg-success/10 text-success border-success/30' : cls.average >= 75 ? 'bg-warning/10 text-warning border-warning/30' : 'bg-destructive/10 text-destructive border-destructive/30'
                      return (
                        <div 
                          key={cls.classId} 
                          className={cn(
                            "p-4 rounded-xl bg-card ring-1 transition-all hover:shadow-md",
                            isStruggling ? "ring-2 ring-destructive/30" : "ring-border"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">{cls.subject}</p>
                              <p className="text-xs text-muted-foreground truncate">{cls.teacher}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <TrendIcon className={cn("w-4 h-4", trendColor)} />
                              <p className={cn("text-2xl font-bold leading-none", gradeColor(cls.average))}>{cls.average}%</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={cn("font-medium", statusColor)}>{statusLabel}</Badge>
                            <Badge variant="outline" className="text-muted-foreground">{letterGrade(cls.average)}</Badge>
                          </div>
                          {/* Mini progress bar */}
                          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                cls.average >= 90 ? "bg-success" : cls.average >= 75 ? "bg-warning" : "bg-destructive"
                              )}
                              style={{ width: `${cls.average}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {atRiskSubjects.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-destructive/10 to-warning/5 ring-1 ring-destructive/20">
                      <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-destructive">
                          Attention Required: {atRiskSubjects.map(s => s.subject).join(' and ')}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use &ldquo;Generate AI Course&rdquo; to request a personalized course to help you catch up.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teacher Learning Path */}
              {teacherPublished && (
                <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-primary/20">
                  <div className="h-1 bg-gradient-to-r from-primary via-info to-warning" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span>Learning Path from Your Teacher</span>
                          <p className="text-xs font-normal text-muted-foreground mt-0.5">Published by {teacherPublished.teacherName}</p>
                        </div>
                      </CardTitle>
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        {new Date(teacherPublished.publishedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="p-4 rounded-xl bg-muted/30 ring-1 ring-border">
                      <p className="text-sm text-foreground leading-relaxed">{teacherPublished.path.overallStrategy}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Target className="w-4 h-4" /> Focus Areas
                      </p>
                      {teacherPublished.path.focusAreas.map((fa, i) => (
                        <div key={i} className="p-4 rounded-xl bg-card ring-1 ring-border space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">{fa.subject}</p>
                            <Badge className={cn(
                              fa.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/30' : 
                              fa.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/30' : 
                              'bg-success/10 text-success border-success/30'
                            )}>
                              {fa.priority} priority
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="text-warning border-warning/30">{fa.currentLevel}</Badge>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <Badge variant="outline" className="text-success border-success/30">{fa.targetLevel}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{fa.recommendation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 4-Week Plan
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {teacherPublished.path.weeklyPlan.map(week => (
                          <div key={week.week} className="flex gap-3 p-4 rounded-xl bg-card ring-1 ring-border">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary-foreground">W{week.week}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-foreground">{week.theme}</p>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{week.hoursRequired}h
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {week.activities.slice(0, 2).map((act, j) => (
                                  <li key={j} className="text-xs text-muted-foreground flex gap-2">
                                    <span className="text-primary shrink-0">-</span>
                                    <span className="line-clamp-1">{act}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Milestones
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {teacherPublished.path.milestones.map((m, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border">
                            <p className="text-sm text-foreground">{m.title}</p>
                            <Badge className="bg-primary/10 text-primary border-primary/30 shrink-0">Wk {m.targetWeek}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* My Goals - Redesigned */}
              <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-border">
                <div className="h-1 bg-gradient-to-r from-info via-primary to-warning" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <CardTitle className="text-base font-semibold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      My Goals
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "gap-2",
                          showAiSuggestions && "bg-primary/10 border-primary/30 text-primary"
                        )}
                        onClick={() => showAiSuggestions ? setShowAiSuggestions(false) : generateAiSuggestions()}
                      >
                        {loadingAiSuggestions ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        AI Suggestions
                        {!loadingAiSuggestions && (showAiSuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowAddGoal(v => !v)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Goal
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI suggestions panel */}
                  {showAiSuggestions && (
                    <div className="rounded-xl overflow-hidden ring-1 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-primary/5">
                        <Bot className="w-4 h-4 text-primary" />
                        <p className="text-sm font-medium text-primary">AI-Generated Suggestions</p>
                        <p className="text-xs text-muted-foreground ml-auto">Based on your performance data</p>
                      </div>
                      {loadingAiSuggestions ? (
                        <div className="flex items-center justify-center gap-3 py-10">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Analyzing your performance...</p>
                        </div>
                      ) : (
                        <div className="p-4 space-y-3">
                          {aiSuggestions.map((s, i) => {
                            const added = addedSuggestions.has(i)
                            const catColor = categoryColors[s.category]
                            return (
                              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-border">
                                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                                  <Lightbulb className="w-4 h-4 text-warning" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                  <p className="text-sm text-foreground leading-relaxed">{s.text}</p>
                                  <div className="flex items-center justify-between gap-2">
                                    <Badge className={cn("font-medium", catColor.bg, catColor.text, catColor.border)}>
                                      {s.category}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant={added ? 'outline' : 'default'}
                                      disabled={added}
                                      className={cn(
                                        "gap-1.5",
                                        added && "bg-success/10 text-success border-success/30"
                                      )}
                                      onClick={() => addSuggestionAsGoal(i)}
                                    >
                                      {added ? (
                                        <><CheckCircle2 className="w-3.5 h-3.5" />Added</>
                                      ) : (
                                        <><Plus className="w-3.5 h-3.5" />Add Goal</>
                                      )}
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
                    <div className="p-4 rounded-xl bg-muted/30 ring-1 ring-primary/20 space-y-3">
                      <Input
                        value={newGoalText}
                        onChange={e => setNewGoalText(e.target.value)}
                        placeholder="Describe your personal goal..."
                        className="bg-card"
                      />
                      <div className="flex items-center gap-2">
                        <Select value={newGoalCategory} onValueChange={v => setNewGoalCategory(v as GoalCategory)}>
                          <SelectTrigger className="flex-1 bg-card">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(['Academic', 'Career', 'Personal', 'Behavioral'] as GoalCategory[]).map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={addPrivateGoal} disabled={!newGoalText.trim()}>Save</Button>
                        <Button variant="ghost" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Private goals are only visible to you.</p>
                    </div>
                  )}

                  {allGoals.length === 0 && !showAddGoal && (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No goals yet. Add a personal goal or use AI suggestions to get started!</p>
                    </div>
                  )}

                  {allGoals.map((g, i) => {
                    const status = goalStatusConfig[g.status]
                    const catColor = categoryColors[g.category]
                    const isPrivate = privateGoals.some(p => p.goal === g.goal)
                    return (
                      <div key={i} className="p-4 rounded-xl bg-card ring-1 ring-border space-y-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-foreground flex-1">{g.goal}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            {isPrivate && (
                              <Badge variant="outline" className="text-muted-foreground">Private</Badge>
                            )}
                            <Badge className={cn("font-medium", status.bg, status.color, status.border)}>{status.label}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={g.progress} className="h-2 flex-1" />
                          <span className="text-sm font-semibold text-foreground shrink-0">{g.progress}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={cn("font-medium", catColor.bg, catColor.text, catColor.border)}>
                            {g.category}
                          </Badge>
                          {g.nextReflection !== '—' && (
                            <p className="text-xs text-muted-foreground">Reflection: {g.nextReflection}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Learning Profile */}
              {assessment ? (
                <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-border">
                  <div className="h-1 bg-gradient-to-r from-info to-primary" />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-info" />
                      </div>
                      Learning Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground">Learning Style</p>
                      <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold">{assessment.style}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Confidence Score</p>
                        <span className="text-sm font-bold text-foreground">{assessment.confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-primary to-info"
                          style={{ width: `${assessment.confidence}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Star className="w-4 h-4 text-success" /> Strengths
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {assessment.strengths.map(s => (
                          <Badge key={s} className="bg-success/10 text-success border-success/30">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {assessment.barriers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" /> Focus Areas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {assessment.barriers.map(b => (
                            <Badge key={b} className="bg-warning/10 text-warning border-warning/30">{b}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg ring-1 ring-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Learning profile assessment pending.</p>
                  </CardContent>
                </Card>
              )}

              {/* Risk Summary */}
              <Card className={cn("overflow-hidden border-0 shadow-lg ring-1", riskCfg.border)}>
                <div className="h-1" style={{
                  background: `linear-gradient(to right, var(--${derivedRiskLevel === 'high' ? 'destructive' : derivedRiskLevel === 'moderate' ? 'warning' : derivedRiskLevel === 'low' ? 'success' : 'primary'}), var(--primary))`
                }} />
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", riskCfg.bg)}>
                      <ShieldAlert className={cn("w-5 h-5", riskCfg.color)} />
                    </div>
                    Risk Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-4xl font-bold", riskCfg.color)}>{derivedRiskScore}</p>
                      <p className="text-xs text-muted-foreground">Risk Score / 100</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={cn("font-medium", riskCfg.bg, riskCfg.color, riskCfg.border)}>{riskCfg.label}</Badge>
                      {riskData && (
                        <div className="flex items-center gap-1 justify-end">
                          {riskData.trend === 'up' && <TrendingUp className="w-4 h-4 text-destructive" />}
                          {riskData.trend === 'down' && <TrendingDown className="w-4 h-4 text-success" />}
                          {riskData.trend === 'flat' && <Minus className="w-4 h-4 text-muted-foreground" />}
                          <p className="text-xs text-muted-foreground capitalize">{riskData.trend}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {riskData && riskData.factors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Factors</p>
                      {riskData.factors.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                          <p className="text-muted-foreground">{f}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {atRiskSubjects.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject Alerts</p>
                      {atRiskSubjects.map(s => (
                        <div key={s.classId} className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">{s.subject}</p>
                          <span className="text-sm font-bold text-destructive">{s.average}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {derivedRiskLevel === 'none' && atRiskSubjects.length === 0 && (
                    <p className="text-sm text-success flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      All subjects on track. Keep it up!
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground border-t border-border pt-3">
                    Based on grades, attendance &amp; engagement
                  </p>
                </CardContent>
              </Card>

              {/* Personalized Courses CTA */}
              <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <p className="text-base font-semibold text-foreground">AI Courses</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Short-form video courses, adaptive quizzes, and AI coaching tailored to your learning gaps.
                  </p>
                  {student.status === 'at-risk' && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10">
                      <Flame className="w-4 h-4 text-warning shrink-0" />
                      <p className="text-xs text-warning font-medium">Priority access enabled for at-risk students</p>
                    </div>
                  )}
                  <Button 
                    className="w-full gap-2 bg-gradient-to-r from-primary to-primary-variant hover:opacity-90"
                    onClick={() => router.push('/student/generate-course')}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Course
                  </Button>
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
              <p className="text-sm text-muted-foreground">Click a week to see details, topics, and assignments.</p>
              {WEEKS.map(week => {
                const wsCfg = weekStatusConfig[week.status]
                const isSelected = selectedWeek === week.week
                return (
                  <Card
                    key={week.week}
                    className={cn(
                      "overflow-hidden border-0 shadow-md cursor-pointer transition-all hover:shadow-lg",
                      isSelected ? "ring-2 ring-primary shadow-lg" : "ring-1 ring-border"
                    )}
                    onClick={() => setSelectedWeek(isSelected ? null : week.week)}
                  >
                    {/* Top accent */}
                    <div className={cn("h-1 bg-gradient-to-r", wsCfg.gradient)} />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0",
                          week.status === 'completed' ? "bg-gradient-to-br from-success to-primary" :
                          week.status === 'active' ? "bg-gradient-to-br from-primary to-info" :
                          "bg-muted"
                        )}>
                          <span className={cn(
                            "text-lg font-bold",
                            week.status === 'upcoming' ? "text-muted-foreground" : "text-white"
                          )}>W{week.week}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-base font-semibold text-foreground">{week.theme}</p>
                            <Badge className={cn("font-medium", wsCfg.bg, wsCfg.color, wsCfg.border)}>{wsCfg.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{week.dateRange}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <BookOpen className="w-3.5 h-3.5" />
                              {week.topics.length} topics
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <ClipboardList className="w-3.5 h-3.5" />
                              {week.assignments.length} assignments
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {week.studyHours}h study
                            </div>
                          </div>
                        </div>
                        <div className="w-14 h-14 relative shrink-0">
                          <svg className="w-14 h-14 -rotate-90">
                            <circle cx="28" cy="28" r="24" className="fill-none stroke-muted stroke-[4]" />
                            <circle
                              cx="28" cy="28" r="24"
                              className={cn(
                                "fill-none stroke-[4]",
                                week.status === 'completed' ? "stroke-success" :
                                week.status === 'active' ? "stroke-primary" :
                                "stroke-muted"
                              )}
                              strokeDasharray={`${week.progress * 1.5} 150`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-foreground">{week.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Week detail panel */}
            <div className="space-y-4">
              {activeWeek ? (
                <>
                  <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-primary/20">
                    <div className="h-1 bg-gradient-to-r from-primary via-info to-warning" />
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">W{activeWeek.week}</span>
                        </div>
                        <div>
                          <span>{activeWeek.theme}</span>
                          <p className="text-xs font-normal text-muted-foreground">{activeWeek.dateRange}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topics</p>
                        {activeWeek.topics.map((t, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                            <div className="w-2 h-8 rounded-full" style={{ background: t.color }} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{t.topic}</p>
                              <p className="text-xs text-muted-foreground">{t.subject}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignments</p>
                        {activeWeek.assignments.map((a, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card ring-1 ring-border">
                            <div>
                              <p className="text-sm font-medium text-foreground">{a.title}</p>
                              <p className="text-xs text-muted-foreground">{a.subject} - Due {a.dueDay}</p>
                            </div>
                            <Badge className="bg-warning/10 text-warning border-warning/30">{a.points} pts</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-0 shadow-lg ring-1 ring-border">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Select a week to see its details, topics, and assignments.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
