'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { BookOpen, Sparkles, ChevronRight, ArrowRight } from 'lucide-react'
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">My Learning</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">My Courses</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your AI-generated personalized courses</p>
      </div>

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
              <Card key={course.id} className="rounded-[10px] border-border bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary shrink-0">
                          {course.subject}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-5 shrink-0 ${
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
                    <p className="text-[10px] text-muted-foreground">
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
