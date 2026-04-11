'use client'
import { useState } from 'react'
import { Sparkles, Download, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StudentNameLink } from '@/components/ui/student-name-link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { exams, examSubmissions, gradeDistribution } from '@/data/mock-assessments'
import { getStudentById } from '@/data/mock-students'

function gradeLetter(pct: number): string {
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B'
  if (pct >= 70) return 'C'
  if (pct >= 60) return 'D'
  return 'F'
}

const gradeColor: Record<string, string> = {
  A: '#10B981', B: '#0EA5E9', C: '#F59E0B', D: '#F97316', F: '#EF4444',
}

const BAR_FILL = '#00B8A9'

export default function AssessmentsResults() {
  const completedExams = exams.filter(e => e.status === 'completed')
  const [selectedExamId, setSelectedExamId] = useState(completedExams[0]?.id ?? '')
  const [feedbackGenerating, setFeedbackGenerating] = useState<string | null>(null)
  const [generatedFeedback, setGeneratedFeedback] = useState<Record<string, string>>({})
  const [exported, setExported] = useState(false)
  const localSubs = examSubmissions

  const exam = exams.find(e => e.id === selectedExamId)
  const subs = localSubs.filter(s => s.examId === selectedExamId && s.submissionStatus === 'graded' && s.score != null)

  const scores = subs.map(s => s.score as number)
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const highScore = scores.length ? Math.max(...scores) : 0
  const lowScore = scores.length ? Math.min(...scores) : 0
  const passCount = exam ? scores.filter(s => (s / exam.totalPoints) * 100 >= exam.passingScore).length : 0
  const passRate = scores.length ? Math.round((passCount / scores.length) * 100) : 0

  const avgPct = exam && exam.totalPoints > 0 ? Math.round((avgScore / exam.totalPoints) * 100) : 0

  function handleGenerateFeedback(studentId: string) {
    setFeedbackGenerating(studentId)
    setTimeout(() => {
      const feedbacks = [
        'Strong performance overall. Focus on time management in future exams.',
        'Good understanding of core concepts. Review the literary device section for improvement.',
        'Excellent critical thinking demonstrated. Continue developing vocabulary range.',
        'Solid effort. Persuasive writing structure could be strengthened with more evidence.',
      ]
      const fb = feedbacks[Math.floor(Math.abs(studentId.charCodeAt(4) ?? 0) % feedbacks.length)]
      setGeneratedFeedback(prev => ({ ...prev, [studentId]: fb }))
      setFeedbackGenerating(null)
    }, 2000)
  }

  function handleExport() {
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Exam</label>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            {completedExams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {exported && (
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Exported!
            </Badge>
          )}
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> Export Results
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Class Average', value: `${avgPct}%`, sub: `${avgScore}/${exam?.totalPoints ?? 0} pts` },
          { label: 'Highest Score', value: `${exam ? Math.round((highScore / exam.totalPoints) * 100) : 0}%`, sub: `${highScore} pts` },
          { label: 'Lowest Score',  value: `${exam ? Math.round((lowScore  / exam.totalPoints) * 100) : 0}%`, sub: `${lowScore} pts`  },
          { label: 'Pass Rate',     value: `${passRate}%`, sub: `${passCount} of ${scores.length} passed` },
        ].map(({ label, value, sub }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grade distribution chart + student table */}
      <div className="grid grid-cols-[280px_1fr] gap-4">
        {/* Chart */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
              <BarChart data={gradeDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="assessGradeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#00B8A9" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="grade" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" fill={`url(#assessGradeGrad)`} radius={[4, 4, 0, 0]}>
                  {gradeDistribution.map(entry => (
                    <Cell key={entry.grade} fill={gradeColor[entry.grade] ?? BAR_FILL} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student results */}
        <Card className="rounded-2xl border-border overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm">Student Results</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">%</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Feedback</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => {
                  const student = getStudentById(sub.studentId)
                  if (!student || sub.score == null || !exam) return null
                  const pct = Math.round((sub.score / exam.totalPoints) * 100)
                  const letter = gradeLetter(pct)
                  const passed = pct >= exam.passingScore
                  const hasFeedback = sub.feedback || generatedFeedback[sub.studentId]
                  const isGenerating = feedbackGenerating === sub.studentId

                  return (
                    <tr key={sub.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 shrink-0">
                            <AvatarFallback className="text-[9px] font-bold text-white" style={{ background: student.avatarColor }}>
                              {student.initials}
                            </AvatarFallback>
                          </Avatar>
                          <StudentNameLink studentId={student.id} name={student.name} className="text-xs font-medium text-foreground" />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-semibold text-foreground">{sub.score}/{exam.totalPoints}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-bold" style={{ color: gradeColor[letter] }}>{letter}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge variant="outline" className={`text-[9px] h-4 ${passed ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}`}>
                          {passed ? 'Pass' : 'Fail'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        {hasFeedback
                          ? <p className="text-[10px] text-muted-foreground line-clamp-2">{generatedFeedback[sub.studentId] ?? sub.feedback}</p>
                          : <span className="text-[10px] text-muted-foreground">—</span>
                        }
                      </td>
                      <td className="px-3 py-3 text-center">
                        {!hasFeedback && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateFeedback(sub.studentId)}
                            disabled={isGenerating}
                            className="h-6 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
                          >
                            {isGenerating
                              ? <span className="w-2.5 h-2.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                              : <Sparkles className="w-2.5 h-2.5" />
                            }
                            {isGenerating ? '' : 'AI'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {subs.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">No graded submissions for this exam.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
