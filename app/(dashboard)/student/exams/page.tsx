'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Clock, Calendar, ChevronRight, FileCheck2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentStudent } from '@/stores/role-store'
import { useAcademyStore } from '@/stores/academy-store'
import { academyClasses } from '@/data/mock-classes'
import { exams } from '@/data/mock-assessments'
import { getStudentDifficultyProfile } from '@/lib/adaptive-exam'

const levelConfig: Record<string, { color: string; bg: string; border: string }> = {
  Hard:   { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  Easy:   { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Assessments</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Exams</h1>
        <p className="text-sm text-muted-foreground mt-1">Questions are personalized to your performance level</p>
      </div>

      {/* Adaptive Profile Banner */}
      {profile && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground">Adaptive Learning Profile</h3>
                  <Badge className={`${levelConfig[profile.level]?.bg} ${levelConfig[profile.level]?.color} ${levelConfig[profile.level]?.border} border`}>
                    {profile.level} Level
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{profile.rationale}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Based on: {profile.source.replace('-', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exam List */}
      {myExams.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <FileCheck2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">No exams available</p>
            <p className="text-sm text-muted-foreground mt-1">Published exams for your classes will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myExams.map(exam => {
            const isAdaptive = exam.adaptive?.enabled === true
            const examDate = new Date(exam.date)
            const isPast = examDate < new Date()
            const levelCfg = profile ? levelConfig[profile.level] : null

            return (
              <Card key={exam.id} className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPast ? 'bg-muted/50' : 'bg-primary/10'}`}>
                      <FileCheck2 className={`w-6 h-6 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-semibold text-foreground">{exam.title}</p>
                        {isAdaptive && levelCfg && (
                          <Badge variant="outline" className={`text-xs gap-1 ${levelCfg.color} ${levelCfg.border}`}>
                            <Brain className="w-3 h-3" /> {profile?.level}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {examDate.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {exam.duration} min
                        </span>
                        {isAdaptive && (
                          <span className="flex items-center gap-1.5 text-sm text-primary">
                            <Sparkles className="w-4 h-4" />
                            {exam.adaptive!.totalQuestions} personalized questions
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant={isPast ? 'outline' : 'default'}
                      className="shrink-0 gap-2"
                      onClick={() => router.push(`/student/exams/${exam.id}`)}
                    >
                      {isPast ? 'View Results' : 'Start Exam'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
