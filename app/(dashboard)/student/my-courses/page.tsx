'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { BookOpen, Sparkles, ChevronRight, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">My Learning</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">Your AI-generated personalized courses</p>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No courses yet</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Go to <span className="text-primary font-medium">My Plan</span>, generate an AI learning path, and request a course to get started.
              </p>
              <Link 
                href="/student/my-plan" 
                className={cn(buttonVariants({ variant: 'default' }), 'mt-6 gap-2')}
              >
                <ArrowRight className="w-4 h-4" />
                Go to My Plan
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course grid */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => {
            const completedSections = course.sections.filter(s => s.completed).length
            const totalSections = course.sections.length
            const isCompleted = course.status === 'completed'
            
            return (
              <Card 
                key={course.id} 
                className="group border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header gradient */}
                  <div className={cn(
                    "px-6 py-4 border-b border-border",
                    isCompleted ? "bg-success/5" : "bg-primary/5"
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            {course.subject}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              isCompleted
                                ? 'border-success/30 text-success'
                                : 'border-warning/30 text-warning'
                            )}
                          >
                            {isCompleted ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                      </div>
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        isCompleted ? "bg-success/10" : "bg-primary/10"
                      )}>
                        {isCompleted 
                          ? <CheckCircle2 className="w-6 h-6 text-success" />
                          : <BookOpen className="w-6 h-6 text-primary" />
                        }
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {completedSections}/{totalSections} weeks completed
                        </span>
                        <span className="font-semibold text-foreground">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        Created {format(new Date(course.createdAt), 'MMM d, yyyy')}
                      </div>
                      <Link
                        href={`/student/my-courses/${course.id}`}
                        className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'gap-1.5')}
                      >
                        {isCompleted ? 'Review' : 'Continue'}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
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
