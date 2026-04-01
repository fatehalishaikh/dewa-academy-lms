'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, Target, BookOpen, CheckCircle2, AlertCircle,
  Plus, Brain, Star, AlertTriangle, TrendingUp, TrendingDown,
  Minus, Loader2, Send, ChevronDown, ChevronUp, ExternalLink,
  ShieldAlert, BarChart2, Calendar, Clock, PlayCircle, BookMarked, Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentStudent } from '@/stores/role-store'
import { useLearningPathStore } from '@/stores/learning-path-store'
import { useStudentCourseStore } from '@/stores/student-course-store'
import {
  recentAssessments, studentGoals, ilpRiskStudents,
  type StudentGoal, type GoalCategory,
} from '@/data/mock-ilp'
import { gradesByClass, gradeColor, gradeBorderColor, letterGrade } from '@/data/mock-grades'

// ─── Types ────────────────────────────────────────────────────────────────────

type LearningPathResult = {
  focusAreas: { subject: string; priority: string; currentLevel: string; targetLevel: string; recommendation: string }[]
  weeklyPlan: { week: number; theme: string; activities: string[]; hoursRequired: number }[]
  resources: { title: string; type: string; subject: string; priority: string; estimatedTime: string }[]
  milestones: { title: string; targetWeek: number; metric: string; subject: string }[]
  overallStrategy: string
}

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

const resourceTypeColor: Record<string, string> = {
  video:     'text-purple-400 border-purple-500/30',
  practice:  'text-blue-400 border-blue-500/30',
  reading:   'text-amber-400 border-amber-500/30',
  tutoring:  'text-emerald-400 border-emerald-500/30',
  project:   'text-rose-400 border-rose-500/30',
}

const priorityColor: Record<string, string> = {
  high:   'text-red-400 border-red-500/30',
  medium: 'text-amber-400 border-amber-500/30',
  low:    'text-emerald-400 border-emerald-500/30',
}

type PrivateGoal = { id: string; goal: string; category: GoalCategory; progress: number; status: 'on_track' }

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentMyPlanPage() {
  const router = useRouter()
  const student = useCurrentStudent()
  const { getPublishedPath } = useLearningPathStore()
  const { createCourse } = useStudentCourseStore()
  const teacherPublished = student ? getPublishedPath(student.id) : undefined

  const assessment = student ? recentAssessments.find(a => a.studentId === student.id) : null
  const myGoals: StudentGoal[] = student ? studentGoals.filter(g => g.studentId === student.id) : []
  const riskData = student ? ilpRiskStudents.find(r => r.studentId === student.id) : null

  // Derive per-subject risk from grades
  const sortedSubjects = [...gradesByClass].sort((a, b) => a.average - b.average)
  const atRiskSubjects = gradesByClass.filter(s => s.average < 75)
  const belowTargetSubjects = gradesByClass.filter(s => s.average < 80)

  // Derive overall risk level if not in risk data
  const derivedRiskLevel =
    riskData?.riskLevel ??
    (atRiskSubjects.length >= 2 ? 'high' : atRiskSubjects.length === 1 ? 'moderate' : belowTargetSubjects.length >= 2 ? 'low' : 'none')
  const derivedRiskScore =
    riskData?.riskScore ??
    Math.round(100 - (gradesByClass.reduce((s, c) => s + c.average, 0) / gradesByClass.length))

  // Goals state
  const [privateGoals, setPrivateGoals] = useState<PrivateGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoalText, setNewGoalText] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState<GoalCategory>('Academic')

  // Learning path request state
  const [selectedSubject, setSelectedSubject] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [learningPath, setLearningPath] = useState<LearningPathResult | null>(null)
  const [courseRequested, setCourseRequested] = useState(false)
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)
  const [expandedWeeklyPlan, setExpandedWeeklyPlan] = useState(false)
  const [expandedResources, setExpandedResources] = useState(false)

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

  function selectRecommendedSubject(subjectName: string, avg: number) {
    setSelectedSubject(subjectName)
    const barriers = assessment?.barriers ?? []
    const topics = barriers.length > 0 ? `Recent trouble areas include: ${barriers.join(', ')}.` : ''
    setDescription(
      `I need help improving in ${subjectName} — currently scoring ${avg}%. ${topics} Please suggest a focused learning path to help me understand the key concepts and improve my performance.`.trim()
    )
    setLearningPath(null)
    setCourseRequested(false)
  }

  async function generateWithAI() {
    if (!student || !selectedSubject) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          gpa: student.gpa,
          attendanceRate: student.attendanceRate,
          learningStyle: assessment?.style,
          subjects: [selectedSubject],
          goals: myGoals.map(g => g.goal),
          gradeLevel: student.gradeLevel,
        }),
      })
      const data = await res.json() as LearningPathResult
      setLearningPath(data)
    } catch {
      // fallback — show a basic generated path
      setLearningPath({
        focusAreas: [{ subject: selectedSubject, priority: 'high', currentLevel: 'Developing', targetLevel: 'Proficient', recommendation: `Complete 3 practice sessions per week focusing on core ${selectedSubject} concepts.` }],
        weeklyPlan: [
          { week: 1, theme: 'Foundation Review', activities: ['Identify key weak areas', 'Complete diagnostic quiz', 'Review core concepts'], hoursRequired: 4 },
          { week: 2, theme: 'Core Skill Building', activities: ['AI Tutor sessions × 3', 'Practice worksheets', 'Group study'], hoursRequired: 5 },
          { week: 3, theme: 'Applied Practice', activities: ['Mock assessment', 'Review and correct errors', 'Peer teaching'], hoursRequired: 5 },
          { week: 4, theme: 'Assessment & Reflection', activities: ['Mini assessment', 'Progress review', 'Update goals'], hoursRequired: 3 },
        ],
        resources: [
          { title: `AI Tutor — ${selectedSubject}`, type: 'tutoring', subject: selectedSubject, priority: 'high', estimatedTime: '30 min/session' },
          { title: 'Video Explainer Series', type: 'video', subject: selectedSubject, priority: 'high', estimatedTime: '10–15 min each' },
          { title: 'Practice Problem Sets', type: 'practice', subject: selectedSubject, priority: 'medium', estimatedTime: '20 min' },
          { title: 'Concept Reading Guide', type: 'reading', subject: selectedSubject, priority: 'medium', estimatedTime: '15 min/day' },
          { title: 'Past Exam Papers', type: 'practice', subject: 'All', priority: 'high', estimatedTime: '45 min each' },
        ],
        milestones: [
          { title: 'Complete Foundation Assessment', targetWeek: 1, metric: 'Score ≥ 60% on diagnostic', subject: selectedSubject },
          { title: 'Finish 3 AI Tutor Sessions', targetWeek: 2, metric: '3 sessions completed', subject: selectedSubject },
          { title: 'Practice Portfolio', targetWeek: 3, metric: '3 completed worksheets', subject: selectedSubject },
          { title: 'Achieve Target Grade', targetWeek: 4, metric: 'Score ≥ 75% on mini assessment', subject: selectedSubject },
        ],
        overallStrategy: `Focus on reinforcing foundational concepts in ${selectedSubject} before advancing to complex topics. Regular short sessions with the AI Tutor plus structured practice sets will build confidence and close knowledge gaps.`,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function requestCourse() {
    if (!student || !selectedSubject) return
    const path = learningPath ?? {
      focusAreas: [{ subject: selectedSubject, priority: 'high', currentLevel: 'Developing', targetLevel: 'Proficient', recommendation: `Complete 3 practice sessions per week focusing on core ${selectedSubject} concepts.` }],
      weeklyPlan: [
        { week: 1, theme: 'Foundation Review', activities: ['Identify key weak areas', 'Complete diagnostic quiz', 'Review core concepts'], hoursRequired: 4 },
        { week: 2, theme: 'Core Skill Building', activities: ['AI Tutor sessions × 3', 'Practice worksheets', 'Group study'], hoursRequired: 5 },
        { week: 3, theme: 'Applied Practice', activities: ['Mock assessment', 'Review and correct errors', 'Peer teaching'], hoursRequired: 5 },
        { week: 4, theme: 'Assessment & Reflection', activities: ['Mini assessment', 'Progress review', 'Update goals'], hoursRequired: 3 },
      ],
      resources: [
        { title: `AI Tutor — ${selectedSubject}`, type: 'tutoring', subject: selectedSubject, priority: 'high', estimatedTime: '30 min/session' },
        { title: 'Video Explainer Series', type: 'video', subject: selectedSubject, priority: 'high', estimatedTime: '10–15 min each' },
        { title: 'Practice Problem Sets', type: 'practice', subject: selectedSubject, priority: 'medium', estimatedTime: '20 min' },
        { title: 'Concept Reading Guide', type: 'reading', subject: selectedSubject, priority: 'medium', estimatedTime: '15 min/day' },
        { title: 'Past Exam Papers', type: 'practice', subject: 'All', priority: 'high', estimatedTime: '45 min each' },
      ],
      milestones: [
        { title: 'Complete Foundation Assessment', targetWeek: 1, metric: 'Score ≥ 60% on diagnostic', subject: selectedSubject },
        { title: 'Finish 3 AI Tutor Sessions', targetWeek: 2, metric: '3 sessions completed', subject: selectedSubject },
        { title: 'Practice Portfolio', targetWeek: 3, metric: '3 completed worksheets', subject: selectedSubject },
        { title: 'Achieve Target Grade', targetWeek: 4, metric: 'Score ≥ 75% on mini assessment', subject: selectedSubject },
      ],
      overallStrategy: `Focus on reinforcing foundational concepts in ${selectedSubject} before advancing to complex topics. Regular short sessions with the AI Tutor plus structured practice sets will build confidence and close knowledge gaps.`,
    }
    const id = createCourse(student.id, selectedSubject, path)
    setCreatedCourseId(id)
    setCourseRequested(true)
  }

  function resetLearningPath() {
    setSelectedSubject('')
    setDescription('')
    setLearningPath(null)
    setCourseRequested(false)
    setCreatedCourseId(null)
  }

  if (!student) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No student found.</p></div>
  }

  const allGoals = [
    ...myGoals,
    ...privateGoals.map(g => ({ ...g, student: student.name, initials: student.initials, nextReflection: '—', studentId: student.id })),
  ]

  const riskCfg = riskLevelConfig[derivedRiskLevel]

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
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Academic Risk Analysis ── */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  Academic Risk Analysis
                </CardTitle>
                <Badge variant="outline" className={`text-[10px] h-5 ${riskCfg.color} ${riskCfg.border}`}>
                  {riskCfg.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">Current GPA</p>
                  <p className="text-lg font-bold text-primary">{student.gpa.toFixed(1)}</p>
                  <p className="text-[9px] text-muted-foreground">out of 4.0</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">Attendance</p>
                  <p className={`text-lg font-bold ${student.attendanceRate >= 90 ? 'text-emerald-400' : student.attendanceRate >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                    {student.attendanceRate}%
                  </p>
                  <p className="text-[9px] text-muted-foreground">this semester</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
                  <p className="text-[10px] text-muted-foreground mb-1">Need Attention</p>
                  <p className={`text-lg font-bold ${atRiskSubjects.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {atRiskSubjects.length}
                  </p>
                  <p className="text-[9px] text-muted-foreground">subject{atRiskSubjects.length !== 1 ? 's' : ''} &lt;75%</p>
                </div>
              </div>

              {/* Subject cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedSubjects.map(cls => {
                  const isStruggling = cls.average < 75
                  const TrendIcon = cls.trend === 'up' ? TrendingUp : cls.trend === 'down' ? TrendingDown : Minus
                  const trendColor = cls.trend === 'up' ? 'text-emerald-400' : cls.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                  const statusLabel = cls.average >= 90 ? 'Excellent' : cls.average >= 75 ? 'On Track' : cls.average >= 60 ? 'Needs Attention' : 'At Risk'
                  const statusColor = cls.average >= 90 ? 'text-emerald-400 border-emerald-500/30' : cls.average >= 75 ? 'text-amber-400 border-amber-500/30' : 'text-red-400 border-red-500/30'

                  return (
                    <div
                      key={cls.classId}
                      className={`p-3 rounded-xl bg-muted/20 border ${gradeBorderColor(cls.average)} ${isStruggling ? 'border-2' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground">{cls.subject}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{cls.teacher}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                          <p className={`text-xl font-bold leading-none ${gradeColor(cls.average)}`}>{cls.average}%</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[9px] h-4 ${statusColor}`}>{statusLabel}</Badge>
                        <Badge variant="outline" className="text-[9px] h-4 border-border text-muted-foreground">
                          {letterGrade(cls.average)}
                        </Badge>
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
                    Request a personalized course below to get back on track.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Teacher-Published Learning Path ── */}
          {teacherPublished && (
            <Card className="rounded-2xl border-primary/30 bg-primary/5">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Learning Path from Your Teacher
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                    {new Date(teacherPublished.publishedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Published by {teacherPublished.teacherName}
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                {/* Strategy */}
                <div className="p-3 rounded-xl bg-card border border-border">
                  <p className="text-xs text-foreground leading-relaxed">{teacherPublished.path.overallStrategy}</p>
                </div>

                {/* Focus Areas */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> Focus Areas
                  </p>
                  {teacherPublished.path.focusAreas.map((fa, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card border border-border space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-foreground">{fa.subject}</p>
                        <Badge variant="outline" className={`text-[9px] h-4 ${fa.priority === 'high' ? 'border-red-500/30 text-red-400' : fa.priority === 'medium' ? 'border-amber-500/30 text-amber-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                          {fa.priority} priority
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{fa.currentLevel} → {fa.targetLevel}</p>
                      <p className="text-[11px] text-foreground">{fa.recommendation}</p>
                    </div>
                  ))}
                </div>

                {/* Weekly Plan */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
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
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{week.hoursRequired}h
                          </span>
                        </div>
                        <ul className="space-y-0.5">
                          {week.activities.map((act, j) => (
                            <li key={j} className="text-[10px] text-muted-foreground flex gap-1.5">
                              <span className="text-primary shrink-0">·</span>{act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Milestones
                  </p>
                  {teacherPublished.path.milestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border">
                      <p className="text-[11px] font-medium text-foreground">{m.title}</p>
                      <Badge variant="outline" className="text-[9px] h-4 border-primary/30 text-primary shrink-0 ml-2">Wk {m.targetWeek}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── AI Personalized Learning Path ── */}
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Personalized Learning Path
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Request a custom course — AI will tailor it to your specific learning gaps.
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">

              {/* Success state */}
              {courseRequested ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-400">Personalized Course Created!</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Your personalized <span className="text-foreground font-medium">{selectedSubject}</span> course has been added to My Courses.
                      </p>
                    </div>
                  </div>
                  {learningPath && <LearningPathDisplay path={learningPath} expandedWeeklyPlan={expandedWeeklyPlan} setExpandedWeeklyPlan={setExpandedWeeklyPlan} expandedResources={expandedResources} setExpandedResources={setExpandedResources} />}
                  <div className="flex gap-2">
                    {createdCourseId && (
                      <Button size="sm" className="h-8 text-xs flex-1" onClick={() => router.push(`/student/my-courses/${createdCourseId}`)}>
                        <BookOpen className="w-3 h-3 mr-1.5" />
                        View Course
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={resetLearningPath}>
                      Request Another Course
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Recommended chips */}
                  {belowTargetSubjects.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Recommended for you</p>
                      <div className="flex flex-wrap gap-2">
                        {belowTargetSubjects.map(s => (
                          <button
                            key={s.classId}
                            onClick={() => selectRecommendedSubject(s.subject, s.average)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${
                              selectedSubject === s.subject
                                ? 'bg-primary text-primary-foreground border-primary'
                                : `${gradeBorderColor(s.average)} bg-muted/20 hover:bg-muted/40 ${gradeColor(s.average)}`
                            }`}
                          >
                            <AlertCircle className="w-2.5 h-2.5" />
                            {s.subject} — {s.average}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Subject</label>
                      <Select value={selectedSubject} onValueChange={v => { setSelectedSubject(v ?? ''); setLearningPath(null) }}>
                        <SelectTrigger className="h-9 text-xs bg-muted/30 border-border">
                          <SelectValue placeholder="Select a subject…" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradesByClass.map(s => (
                            <SelectItem key={s.classId} value={s.subject} className="text-xs">
                              {s.subject} — {s.average}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">What do you want to learn?</label>
                      <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe what you'd like to improve or learn… (AI can suggest this for you)"
                        className="bg-muted/30 border-border text-xs resize-none min-h-[72px]"
                        disabled={isGenerating}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex-1"
                        onClick={generateWithAI}
                        disabled={!selectedSubject || isGenerating}
                      >
                        {isGenerating ? (
                          <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Generating…</>
                        ) : (
                          <><Sparkles className="w-3 h-3 mr-1.5" />Suggest with AI</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs flex-1"
                        onClick={requestCourse}
                        disabled={!selectedSubject || isGenerating}
                      >
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Request Personalized Course
                      </Button>
                    </div>
                  </div>

                  {/* Generated path preview */}
                  {learningPath && (
                    <div className="space-y-3 pt-1">
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1.5">
                          <BarChart2 className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs font-semibold text-foreground">AI-Generated Learning Path</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{learningPath.overallStrategy}</p>
                      </div>
                      <LearningPathDisplay path={learningPath} expandedWeeklyPlan={expandedWeeklyPlan} setExpandedWeeklyPlan={setExpandedWeeklyPlan} expandedResources={expandedResources} setExpandedResources={setExpandedResources} />
                      <Button size="sm" className="h-8 text-xs w-full" onClick={requestCourse}>
                        <Send className="w-3 h-3 mr-1.5" />
                        Request This Course
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* ── My Goals ── */}
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
                          <Badge variant="outline" className="text-[9px] h-4 border-muted-foreground/30 text-muted-foreground">Private</Badge>
                        )}
                        <Badge variant="outline" className={`text-[10px] h-5 ${status.color} ${status.border}`}>{status.label}</Badge>
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

        {/* ── Right sidebar ── */}
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
                  <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">{assessment.style}</Badge>
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

          {/* Risk Summary */}
          <Card className={`rounded-2xl ${riskCfg.border} border ${riskCfg.bg}`}>
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
                  <p className="text-[10px] text-muted-foreground">Risk Score / 100</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline" className={`text-[10px] h-5 ${riskCfg.color} ${riskCfg.border}`}>
                    {riskCfg.label}
                  </Badge>
                  {riskData && (
                    <div className="flex items-center gap-1 justify-end">
                      {riskData.trend === 'up'   && <TrendingUp   className="w-3 h-3 text-red-400" />}
                      {riskData.trend === 'down'  && <TrendingDown className="w-3 h-3 text-emerald-400" />}
                      {riskData.trend === 'flat'  && <Minus        className="w-3 h-3 text-muted-foreground" />}
                      <p className="text-[10px] text-muted-foreground capitalize">{riskData.trend}</p>
                    </div>
                  )}
                </div>
              </div>

              {riskData && riskData.factors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Risk Factors</p>
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
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Subject Alerts</p>
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

              <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
                Based on grades, attendance &amp; engagement
              </p>
            </CardContent>
          </Card>

          {/* Study path info */}
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
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
    </div>
  )
}

// ─── Learning Path Display Subcomponent ───────────────────────────────────────

function LearningPathDisplay({
  path,
  expandedWeeklyPlan,
  setExpandedWeeklyPlan,
  expandedResources,
  setExpandedResources,
}: {
  path: LearningPathResult
  expandedWeeklyPlan: boolean
  setExpandedWeeklyPlan: (v: boolean) => void
  expandedResources: boolean
  setExpandedResources: (v: boolean) => void
}) {
  return (
    <div className="space-y-3">
      {/* Focus Areas */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Focus Areas</p>
        {path.focusAreas.map((fa, i) => (
          <div key={i} className="p-3 rounded-xl bg-muted/20 border border-border space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">{fa.subject}</p>
              <Badge variant="outline" className={`text-[9px] h-4 ${priorityColor[fa.priority] ?? 'text-muted-foreground border-border'}`}>
                {fa.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{fa.currentLevel}</span>
              <span>→</span>
              <span className="text-primary">{fa.targetLevel}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{fa.recommendation}</p>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Milestones</p>
        {path.milestones.map((m, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/20 border border-border">
            <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] font-bold text-primary">W{m.targetWeek}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground">{m.title}</p>
              <p className="text-[10px] text-muted-foreground">{m.metric}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Plan (collapsible) */}
      <button
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
        onClick={() => setExpandedWeeklyPlan(!expandedWeeklyPlan)}
      >
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Weekly Plan</p>
        {expandedWeeklyPlan ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {expandedWeeklyPlan && (
        <div className="space-y-2">
          {path.weeklyPlan.map((w) => (
            <div key={w.week} className="p-3 rounded-xl bg-muted/20 border border-border">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-foreground">Week {w.week} — {w.theme}</p>
                <Badge variant="outline" className="text-[9px] h-4 border-border text-muted-foreground">{w.hoursRequired}h</Badge>
              </div>
              <div className="space-y-0.5">
                {w.activities.map((a, j) => (
                  <p key={j} className="text-[11px] text-muted-foreground">· {a}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources (collapsible) */}
      <button
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
        onClick={() => setExpandedResources(!expandedResources)}
      >
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Resources</p>
        {expandedResources ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {expandedResources && (
        <div className="space-y-2">
          {path.resources.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-foreground">{r.title}</p>
                <p className="text-[10px] text-muted-foreground">{r.subject} · {r.estimatedTime}</p>
              </div>
              <Badge variant="outline" className={`text-[9px] h-4 shrink-0 ${resourceTypeColor[r.type] ?? 'text-muted-foreground border-border'}`}>
                {r.type}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
