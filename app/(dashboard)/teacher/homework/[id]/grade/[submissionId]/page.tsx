'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Sparkles, Wand2, CheckCircle2, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useHomeworkStore } from '@/stores/homework-store'
import { getStudentById } from '@/data/mock-students'

export default function HomeworkGrade() {
  const _params = useParams()
  const homeworkId = (_params?.id ?? '') as string
  const submissionId = (_params?.submissionId ?? '') as string
  const router = useRouter()
  const { getHomeworkById, getSubmissionById, getSubmissionsForHomework, gradeSubmission } = useHomeworkStore()

  const hw = getHomeworkById(homeworkId ?? '')
  const sub = getSubmissionById(submissionId ?? '')
  const allSubs = hw ? getSubmissionsForHomework(hw.id).filter(s => s.status !== 'not-submitted') : []
  const currentIndex = allSubs.findIndex(s => s.id === submissionId)
  const student = sub ? getStudentById(sub.studentId) : undefined

  const [grade, setGrade] = useState<string>(sub?.grade?.toString() ?? sub?.aiScore?.toString() ?? '')
  const [feedback, setFeedback] = useState(sub?.feedback ?? '')
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    if (!hw) return {}
    const total = sub?.aiScore ?? 0
    return Object.fromEntries(hw.rubric.map((r, i) => [r.id, Math.round((i === 0 ? total * 0.5 : total / hw.rubric.length))]))
  })
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!hw || !sub || !student) {
    return <div className="p-6 text-sm text-muted-foreground">Submission not found</div>
  }

  const maxRubricTotal = hw.rubric.reduce((s, r) => s + r.maxPoints, 0)

  async function loadAiSuggestion() {
    if (!hw || !sub || !sub.content) return
    setIsAiLoading(true)
    try {
      const res = await fetch('/api/ai/grading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: `${hw.title}: ${hw.instructions}`,
          questionType: 'essay',
          correctAnswer: hw.instructions,
          studentAnswer: sub.content,
          maxPoints: hw.totalPoints,
          subject: hw.subject,
        }),
      })
      if (res.ok) {
        const result = await res.json()
        setGrade(String(result.score))
        setFeedback(result.feedback ?? '')
        const newScores: Record<string, number> = {}
        hw.rubric.forEach(r => {
          newScores[r.id] = Math.round(result.score * (r.maxPoints / maxRubricTotal))
        })
        setRubricScores(newScores)
      }
    } catch {
      // Fallback to pre-computed aiScore if API fails
      if (sub.aiScore != null) {
        setGrade(String(sub.aiScore))
        setFeedback(sub.aiFeedback ?? '')
        const newScores: Record<string, number> = {}
        hw.rubric.forEach(r => {
          newScores[r.id] = Math.round(sub.aiScore! * (r.maxPoints / maxRubricTotal))
        })
        setRubricScores(newScores)
      }
    } finally {
      setIsAiLoading(false)
    }
  }

  function handleSave() {
    const numGrade = Number(grade)
    if (isNaN(numGrade)) return
    gradeSubmission(sub!.id, numGrade, feedback)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      // Go to next ungraded submission or back to detail
      const nextPending = allSubs.find(
        (s, i) => i > currentIndex && (s.status === 'submitted' || s.status === 'late')
      )
      if (nextPending) {
        router.push(`/teacher/homework/${homeworkId}/grade/${nextPending.id}`)
      } else {
        router.push(`/teacher/homework/${homeworkId}`)
      }
    }, 800)
  }

  function goToSubmission(dir: 'prev' | 'next') {
    const targetIndex = dir === 'prev' ? currentIndex - 1 : currentIndex + 1
    const target = allSubs[targetIndex]
    if (target) router.push(`/teacher/homework/${homeworkId}/grade/${target.id}`)
  }

  const percentGrade = grade ? Math.round((Number(grade) / hw.totalPoints) * 100) : null

  return (
    <div className="h-screen flex flex-col p-6 gap-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/teacher/homework/${homeworkId}`)} className="gap-1.5 -ml-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{hw.title}</p>
          <h1 className="text-base font-bold text-foreground flex items-center gap-2">
            Grading: {student.name}
            <Badge variant="outline" className={`text-[10px] h-4 ${sub.status === 'late' ? 'border-amber-500/30 text-amber-400' : 'border-blue-500/30 text-blue-400'}`}>
              {sub.status}
            </Badge>
          </h1>
        </div>
        {/* Prev / Next */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-muted-foreground">{currentIndex + 1} / {allSubs.length}</span>
          <Button variant="outline" size="sm" onClick={() => goToSubmission('prev')} disabled={currentIndex === 0} className="w-8 h-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => goToSubmission('next')} disabled={currentIndex === allSubs.length - 1} className="w-8 h-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 grid grid-cols-[1fr_340px] gap-4 min-h-0">
        {/* Left: Student submission */}
        <Card className="rounded-2xl border-border flex flex-col min-h-0">
          <CardHeader className="pb-3 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs font-bold text-white" style={{ background: student.avatarColor }}>
                  {student.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">{student.name}'s Submission</CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Submitted {sub.submittedDate
                    ? new Date(sub.submittedDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </p>
              </div>
              {sub.aiScore != null && (
                <div className="ml-auto text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs font-semibold">AI Score: {sub.aiScore}/{hw.totalPoints}</span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-5">
              {sub.content ? (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono text-[12px]">
                  {sub.content}
                </p>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No submission content
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right: Grading form */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Rubric */}
          <Card className="rounded-2xl border-border flex-1 min-h-0 flex flex-col">
            <CardHeader className="pb-2 border-b border-border shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Rubric</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadAiSuggestion}
                  disabled={isAiLoading || !sub.content}
                  className="gap-1.5 text-xs h-7 border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isAiLoading ? (
                    <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Loading…</>
                  ) : (
                    <><Wand2 className="w-3 h-3" /> AI Suggest</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {hw.rubric.map(r => (
                  <div key={r.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground">{r.label}</p>
                      <p className="text-[10px] text-muted-foreground">max {r.maxPoints}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={r.maxPoints}
                        value={rubricScores[r.id] ?? 0}
                        onChange={e => {
                          const val = Number(e.target.value)
                          setRubricScores(prev => ({ ...prev, [r.id]: val }))
                          // Update total grade
                          const newTotal = Object.entries({ ...rubricScores, [r.id]: val }).reduce((s, [, v]) => s + v, 0)
                          setGrade(String(newTotal))
                        }}
                        className="flex-1 accent-primary"
                      />
                      <input
                        type="number"
                        min={0}
                        max={r.maxPoints}
                        value={rubricScores[r.id] ?? 0}
                        onChange={e => {
                          const val = Math.min(Number(e.target.value), r.maxPoints)
                          setRubricScores(prev => ({ ...prev, [r.id]: val }))
                          const newTotal = Object.entries({ ...rubricScores, [r.id]: val }).reduce((s, [, v]) => s + v, 0)
                          setGrade(String(newTotal))
                        }}
                        className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-xs text-center text-foreground focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">Total Score</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={hw.totalPoints}
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        className="w-16 bg-background border border-border rounded-lg px-2 py-1.5 text-sm font-bold text-center text-foreground focus:outline-none focus:border-primary/50"
                      />
                      <span className="text-sm text-muted-foreground">/ {hw.totalPoints}</span>
                      {percentGrade != null && (
                        <span className={`text-sm font-bold ${percentGrade >= 90 ? 'text-emerald-400' : percentGrade >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                          ({percentGrade}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>

          {/* Feedback */}
          <Card className="rounded-2xl border-border shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Written Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Write personalised feedback for this student…"
                rows={4}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              />
              {sub.aiFeedback && !feedback && (
                <button
                  onClick={() => setFeedback(sub.aiFeedback ?? '')}
                  className="mt-1.5 text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  <Wand2 className="w-2.5 h-2.5" />
                  Use AI feedback as starting point
                </button>
              )}
            </CardContent>
          </Card>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={!grade || saved}
            className="gap-1.5 w-full"
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Grade & Continue</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
