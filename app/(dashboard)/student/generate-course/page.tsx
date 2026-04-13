'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, BookOpen, CheckCircle2, AlertCircle,
  Loader2, Send, ExternalLink, BarChart2,
  ChevronDown, ChevronUp, ChevronLeft, Target,
  Clock, BookMarked,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentStudent } from '@/stores/role-store'
import { useStudentCourseStore } from '@/stores/student-course-store'
import { recentAssessments, studentGoals } from '@/data/mock-ilp'
import { gradesByClass, gradeColor, gradeBorderColor } from '@/data/mock-grades'

type LearningPathResult = {
  focusAreas: { subject: string; priority: string; currentLevel: string; targetLevel: string; recommendation: string }[]
  weeklyPlan: { week: number; theme: string; activities: string[]; hoursRequired: number }[]
  resources: { title: string; type: string; subject: string; priority: string; estimatedTime: string }[]
  milestones: { title: string; targetWeek: number; metric: string; subject: string }[]
  overallStrategy: string
}

const resourceTypeColor: Record<string, string> = {
  video:    'text-purple-400 border-purple-500/30',
  practice: 'text-blue-400 border-blue-500/30',
  reading:  'text-amber-400 border-amber-500/30',
  tutoring: 'text-emerald-400 border-emerald-500/30',
  project:  'text-rose-400 border-rose-500/30',
}

const priorityColor: Record<string, string> = {
  high:   'text-red-400 border-red-500/30',
  medium: 'text-amber-400 border-amber-500/30',
  low:    'text-emerald-400 border-emerald-500/30',
}

function buildFallbackPath(subject: string): LearningPathResult {
  return {
    focusAreas: [{ subject, priority: 'high', currentLevel: 'Developing', targetLevel: 'Proficient', recommendation: `Complete 3 practice sessions per week focusing on core ${subject} concepts.` }],
    weeklyPlan: [
      { week: 1, theme: 'Foundation Review',     activities: ['Identify key weak areas', 'Complete diagnostic quiz', 'Review core concepts'], hoursRequired: 4 },
      { week: 2, theme: 'Core Skill Building',   activities: ['AI Tutor sessions × 3', 'Practice worksheets', 'Group study'],             hoursRequired: 5 },
      { week: 3, theme: 'Applied Practice',       activities: ['Mock assessment', 'Review and correct errors', 'Peer teaching'],           hoursRequired: 5 },
      { week: 4, theme: 'Assessment & Reflection',activities: ['Mini assessment', 'Progress review', 'Update goals'],                     hoursRequired: 3 },
    ],
    resources: [
      { title: `AI Tutor — ${subject}`,   type: 'tutoring', subject, priority: 'high',   estimatedTime: '30 min/session' },
      { title: 'Video Explainer Series',  type: 'video',    subject, priority: 'high',   estimatedTime: '10–15 min each' },
      { title: 'Practice Problem Sets',   type: 'practice', subject, priority: 'medium', estimatedTime: '20 min'         },
      { title: 'Concept Reading Guide',   type: 'reading',  subject, priority: 'medium', estimatedTime: '15 min/day'     },
      { title: 'Past Exam Papers',        type: 'practice', subject: 'All', priority: 'high', estimatedTime: '45 min each' },
    ],
    milestones: [
      { title: 'Complete Foundation Assessment', targetWeek: 1, metric: 'Score ≥ 60% on diagnostic',      subject },
      { title: 'Finish 3 AI Tutor Sessions',     targetWeek: 2, metric: '3 sessions completed',           subject },
      { title: 'Practice Portfolio',             targetWeek: 3, metric: '3 completed worksheets',         subject },
      { title: 'Achieve Target Grade',           targetWeek: 4, metric: 'Score ≥ 75% on mini assessment', subject },
    ],
    overallStrategy: `Focus on reinforcing foundational concepts in ${subject} before advancing to complex topics. Regular short sessions with the AI Tutor plus structured practice sets will build confidence and close knowledge gaps.`,
  }
}

export default function GenerateCoursePage() {
  const router = useRouter()
  const student = useCurrentStudent()
  const { createCourse } = useStudentCourseStore()

  const assessment = student ? recentAssessments.find(a => a.studentId === student.id) : null
  const myGoals = student ? studentGoals.filter(g => g.studentId === student.id) : []
  const belowTargetSubjects = gradesByClass.filter(s => s.average < 80)

  const [selectedSubject, setSelectedSubject] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [learningPath, setLearningPath] = useState<LearningPathResult | null>(null)
  const [courseRequested, setCourseRequested] = useState(false)
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)
  const [expandedWeeklyPlan, setExpandedWeeklyPlan] = useState(false)
  const [expandedResources, setExpandedResources] = useState(false)

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
          description,
          currentGrade: gradesByClass.find(g => g.subject === selectedSubject)?.average,
        }),
      })
      const data = await res.json() as LearningPathResult
      setLearningPath(data)
    } catch {
      setLearningPath(buildFallbackPath(selectedSubject))
    } finally {
      setIsGenerating(false)
    }
  }

  function requestCourse() {
    if (!student || !selectedSubject) return
    const path = learningPath ?? buildFallbackPath(selectedSubject)
    const id = createCourse(student.id, selectedSubject, path)
    setCreatedCourseId(id)
    setCourseRequested(true)
  }

  function reset() {
    setSelectedSubject('')
    setDescription('')
    setLearningPath(null)
    setCourseRequested(false)
    setCreatedCourseId(null)
    setExpandedWeeklyPlan(false)
    setExpandedResources(false)
  }

  if (!student) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No student found.</p></div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push('/student/my-plan')}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        My Plan
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Course Builder</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Generate a Personalized Course</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Select a subject, describe what you need, and let AI build a tailored learning path for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main form / result ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Success state */}
          {courseRequested ? (
            <Card className="rounded-[10px] border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Personalized Course Created!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your <span className="text-foreground font-medium">{selectedSubject}</span> course has been added to My Courses with 5 weekly sections.
                    </p>
                  </div>
                </div>
                {learningPath && (
                  <LearningPathDisplay
                    path={learningPath}
                    expandedWeeklyPlan={expandedWeeklyPlan}
                    setExpandedWeeklyPlan={setExpandedWeeklyPlan}
                    expandedResources={expandedResources}
                    setExpandedResources={setExpandedResources}
                  />
                )}
                <div className="flex gap-2">
                  {createdCourseId && (
                    <Button size="sm" className="h-8 text-xs flex-1" onClick={() => router.push(`/student/my-courses/${createdCourseId}`)}>
                      <BookOpen className="w-3 h-3 mr-1.5" />
                      View Course
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={reset}>
                    Generate Another Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Form card */}
              <Card className="rounded-[10px] border-border bg-card">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Build Your Course
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
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

                  {/* Subject select */}
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

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">What do you want to learn?</label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe what you'd like to improve or learn… (AI can suggest this for you)"
                      className="bg-muted/30 border-border text-xs resize-none min-h-[88px]"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Actions */}
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
                </CardContent>
              </Card>

              {/* Generated path preview */}
              {learningPath && (
                <Card className="rounded-[10px] border-primary/20 bg-card">
                  <CardHeader className="pb-2 pt-5 px-5">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      <CardTitle className="text-sm font-semibold">AI-Generated Learning Path</CardTitle>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{learningPath.overallStrategy}</p>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-4">
                    <LearningPathDisplay
                      path={learningPath}
                      expandedWeeklyPlan={expandedWeeklyPlan}
                      setExpandedWeeklyPlan={setExpandedWeeklyPlan}
                      expandedResources={expandedResources}
                      setExpandedResources={setExpandedResources}
                    />
                    <Button size="sm" className="h-8 text-xs w-full" onClick={requestCourse}>
                      <Send className="w-3 h-3 mr-1.5" />
                      Request This Course
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* ── Sidebar info ── */}
        <div className="space-y-4">
          <Card className="rounded-[10px] border-primary/20 bg-primary/5">
            <CardContent className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-foreground">How it works</p>
              </div>
              <ol className="space-y-2">
                {[
                  'Pick a subject or choose a recommended one',
                  'Describe your goal (or use AI to suggest)',
                  'Click "Suggest with AI" to generate a full learning path',
                  'Review the path, then request it as a course',
                  'Track your progress week by week in My Courses',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {student.status === 'at-risk' && (
            <Card className="rounded-[10px] border-amber-500/30 bg-amber-500/5">
              <CardContent className="px-5 py-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-400">Priority Access</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">At-risk students get priority processing for personalized courses.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Learning Path Display ────────────────────────────────────────────────────

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
          <div key={i} className="p-3 rounded-[10px] bg-muted/20 border border-border space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">{fa.subject}</p>
              <Badge variant="outline" className={`text-[9px] h-4 ${priorityColor[fa.priority] ?? 'text-muted-foreground border-border'}`}>
                {fa.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{fa.currentLevel}</span><span>→</span>
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
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-[10px] bg-muted/20 border border-border">
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
        className="w-full flex items-center justify-between p-2.5 rounded-[10px] bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
        onClick={() => setExpandedWeeklyPlan(!expandedWeeklyPlan)}
      >
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Weekly Plan</p>
        {expandedWeeklyPlan ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {expandedWeeklyPlan && (
        <div className="space-y-2">
          {path.weeklyPlan.map(w => (
            <div key={w.week} className="p-3 rounded-[10px] bg-muted/20 border border-border">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-foreground">Week {w.week} — {w.theme}</p>
                <Badge variant="outline" className="text-[9px] h-4 border-border text-muted-foreground flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />{w.hoursRequired}h
                </Badge>
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
        className="w-full flex items-center justify-between p-2.5 rounded-[10px] bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
        onClick={() => setExpandedResources(!expandedResources)}
      >
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Resources</p>
        {expandedResources ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {expandedResources && (
        <div className="space-y-2">
          {path.resources.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-[10px] bg-muted/20 border border-border">
              <div className="w-7 h-7 rounded-[10px] bg-muted/40 flex items-center justify-center shrink-0">
                <BookMarked className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
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
