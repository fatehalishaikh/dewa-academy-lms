'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Clock, Calendar, ChevronRight, CheckCircle2, FileText } from 'lucide-react'
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

const levelDotColor: Record<string, string> = {
  Hard:   '#EF4444',
  Medium: '#F59E0B',
  Easy:   '#10B981',
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

  const today = new Date()
  const upcoming = myExams.filter(e => new Date(e.date) >= today)
  const past     = myExams.filter(e => new Date(e.date) < today)
  const adaptive = myExams.filter(e => e.adaptive?.enabled)

  if (!student) return null

  const levelRingColor = profile ? (levelDotColor[profile.level] ?? 'var(--accent-student)') : 'var(--accent-student)'

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 px-7 py-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent-student) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-student) 30%, transparent)' }}
            >
              <FileText className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Student Portal</p>
              <h1 className="text-xl font-bold text-white mt-0.5">Exams</h1>
              <p className="text-white/40 text-sm mt-0.5">Questions personalized to your performance level</p>
            </div>
          </div>

          {/* Right — adaptive level + total exams */}
          <div className="lg:col-span-2 px-7 py-6 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{
                  background: profile ? `${levelRingColor}1a` : 'rgba(0,184,169,0.12)',
                  border: `5px solid ${profile ? `${levelRingColor}59` : 'rgba(0,184,169,0.35)'}`,
                }}
              >
                <span className="text-sm font-bold text-white">{profile?.level ?? '—'}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Adaptive Level</p>
                <p className="text-[11px] text-white/35">personalized</p>
              </div>
            </div>
            <div className="w-px h-14 bg-white/[0.08]" />
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.12)', border: '5px solid rgba(14,165,233,0.35)' }}>
                <span className="text-xl font-bold text-white">{myExams.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Total Exams</p>
                <p className="text-[11px] text-white/35">published</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Exams',    value: myExams.length,   color: 'var(--accent-student)', icon: FileText,      trend: 'Published' },
          { label: 'Upcoming',       value: upcoming.length,  color: '#F59E0B',               icon: Clock,         trend: upcoming.length > 0 ? 'Scheduled' : 'None pending' },
          { label: 'Completed',      value: past.length,      color: '#10B981',               icon: CheckCircle2,  trend: past.length > 0 ? 'Reviewed' : 'None yet' },
          { label: 'Adaptive Exams', value: adaptive.length,  color: '#0EA5E9',               icon: Brain,         trend: profile ? `Level: ${profile.level}` : 'Not set' },
        ].map(({ label, value, color, icon: Icon, trend }) => (
          <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0">
            <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
            <CardContent className="p-4 pt-3">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] font-semibold mt-1" style={{ color }}>{trend}</p>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile banner */}
      {profile && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Adaptive Level: <span className={`px-1.5 py-0.5 rounded text-xs ${levelColor[profile.level]}`}>{profile.level}</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{profile.rationale}</p>
            <p className="text-[11px] text-muted-foreground mt-1 opacity-70">Source: {profile.source.replace('-', ' ')}</p>
          </div>
        </div>
      )}

      {/* Exam list */}
      {myExams.length === 0 ? (
        <Card className="rounded-xl border-border">
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
              <Card key={exam.id} className="rounded-xl border-border overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{exam.title}</p>
                      {isAdaptive && profile && (
                        <Badge variant="outline" className={`text-[11px] h-4 gap-0.5 ${levelColor[profile.level]}`}>
                          <Brain className="w-2.5 h-2.5" /> {profile.level}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {examDate.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {exam.duration} min
                      </span>
                      {isAdaptive && (
                        <span className="text-[11px] text-primary">
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
