'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { BookOpen, Sparkles, ChevronRight, ArrowRight, CheckCircle2, TrendingUp, PlayCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useCurrentStudent } from '@/stores/role-store'
import { useStudentCourseStore } from '@/stores/student-course-store'
import { cn } from '@/lib/utils'

export default function MyCoursesPage() {
  const student = useCurrentStudent()
  const { getCoursesByStudent } = useStudentCourseStore()
  const courses = student ? getCoursesByStudent(student.id) : []

  const active    = courses.filter(c => c.status === 'active')
  const completed = courses.filter(c => c.status === 'completed')
  const avgProgress = courses.length
    ? Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length)
    : 0

  return (
    <div className="p-6 space-y-6">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative flex items-center justify-between gap-6 px-7 py-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--accent-student) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-student) 30%, transparent)' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Student Portal</p>
              <h1 className="text-xl font-bold text-white mt-0.5">My Courses</h1>
              <p className="text-white/40 text-sm mt-0.5">Your AI-generated personalized learning courses</p>
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Avg Progress</p>
              <p className="text-2xl font-bold text-white mt-0.5">{avgProgress}%</p>
              <p className="text-white/40 text-xs">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
            </div>
            <div className="relative w-16 h-16 shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent-student)" strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - avgProgress / 100)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      {courses.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Courses',  value: courses.length,   color: 'var(--accent-student)', icon: BookOpen,      trend: 'All time' },
            { label: 'Active',         value: active.length,    color: '#F59E0B',               icon: PlayCircle,    trend: active.length > 0 ? 'In progress' : 'None active' },
            { label: 'Completed',      value: completed.length, color: '#10B981',               icon: CheckCircle2,  trend: completed.length > 0 ? 'Finished' : 'Keep going' },
            { label: 'Avg Progress',   value: `${avgProgress}%`, color: '#0EA5E9',              icon: TrendingUp,    trend: 'Across all' },
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
      )}

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No courses yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Go to <span className="text-primary font-medium">My Plan</span>, generate an AI learning path, and request a course to get started.
            </p>
          </div>
          <Link href="/student/my-plan" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
            Go to My Plan
          </Link>
        </div>
      )}

      {/* Course grid */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => {
            const completedSections = course.sections.filter(s => s.completed).length
            const totalSections = course.sections.length
            return (
              <Card key={course.id} className="rounded-xl border-border bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary shrink-0">
                          {course.subject}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[11px] h-5 shrink-0 ${
                            course.status === 'completed'
                              ? 'border-emerald-500/30 text-emerald-400'
                              : 'border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {course.status === 'completed' ? 'Completed' : 'Active'}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{course.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{course.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{completedSections}/{totalSections} weeks completed</span>
                      <span className="font-semibold text-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      Created {format(new Date(course.createdAt), 'MMM d, yyyy')}
                    </p>
                    <Link
                      href={`/student/my-courses/${course.id}`}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-7 text-xs')}
                    >
                      Continue
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
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
