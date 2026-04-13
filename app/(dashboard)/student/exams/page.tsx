'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Clock, Calendar, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentStudent } from '@/stores/role-store'
import { useAcademyStore } from '@/stores/academy-store'
import { academyClasses } from '@/data/mock-classes'
import { exams } from '@/data/mock-assessments'
import { getStudentDifficultyProfile } from '@/lib/adaptive-exam'

const levelColor: Record<string, string> = {
  Hard:   'border-red-500/30 text-red-400 bg-red-500/5',
  Medium: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  Easy:   'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
}

export default function StudentExams() {
  const router = useRouter()
  const student = useCurrentStudent()
  const customExams = useAcademyStore(s => s.customExams)

  const myExams = useMemo(() => {
    if (!student) return []
    const myClassIds = academyClasses
      .filter(c => c.studentIds.includes(student.id))
      .map(c => c.id)
    const all = [...exams, ...customExams]
    return all.filter(e => myClassIds.includes(e.classId) && e.status === 'published')
  }, [student, customExams])

  const profile = student ? getStudentDifficultyProfile(student.id) : null

  if (!student) return null

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">My Exams</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Questions are personalized to your performance level
        </p>
      </div>

      {/* Profile banner */}
      {profile && (
        <div className="flex items-start gap-3 p-4 rounded-[10px] border border-primary/20 bg-primary/5">
          <div className="w-8 h-8 rounded-[10px] bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Adaptive Level: <span className={`px-1.5 py-0.5 rounded text-xs ${levelColor[profile.level]}`}>{profile.level}</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{profile.rationale}</p>
            <p className="text-[10px] text-muted-foreground mt-1 opacity-70">Source: {profile.source.replace('-', ' ')}</p>
          </div>
        </div>
      )}

      {/* Exam list */}
      {myExams.length === 0 ? (
        <Card className="rounded-[10px] border-border">
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No published exams for your classes right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {myExams.map(exam => {
            const isAdaptive = exam.adaptive?.enabled === true
            const examDate = new Date(exam.date)
            const isPast = examDate < new Date()

            return (
              <Card key={exam.id} className="rounded-[10px] border-border overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{exam.title}</p>
                      {isAdaptive && profile && (
                        <Badge variant="outline" className={`text-[9px] h-4 gap-0.5 ${levelColor[profile.level]}`}>
                          <Brain className="w-2.5 h-2.5" /> {profile.level}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {examDate.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {exam.duration} min
                      </span>
                      {isAdaptive && (
                        <span className="text-[10px] text-primary">
                          {exam.adaptive!.totalQuestions} personalized questions
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isPast ? 'outline' : 'default'}
                    className="shrink-0 gap-1 text-xs"
                    onClick={() => router.push(`/student/exams/${exam.id}`)}
                  >
                    {isPast ? 'View' : 'Start'} <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
