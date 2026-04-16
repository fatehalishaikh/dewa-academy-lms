'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  BookOpen, Sparkles, ChevronRight, ArrowRight, Clock, CheckCircle2,
  Trophy, Flame, Target, Play, Layers, GraduationCap
} from 'lucide-react'
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
  
  const completedCourses = courses.filter(c => c.status === 'completed').length
  const inProgressCourses = courses.filter(c => c.status === 'active').length
  const totalProgress = courses.length > 0 
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-variant p-6 md:p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-warning/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                  AI-Powered Learning
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                My Courses
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                Your personalized AI-generated courses designed to fill knowledge gaps and accelerate your learning journey.
              </p>
            </div>
            
            {/* Stats */}
            {courses.length > 0 && (
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
                  <p className="text-3xl font-bold text-white">{courses.length}</p>
                  <p className="text-xs text-white/70 mt-1">Total Courses</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
                  <p className="text-3xl font-bold text-warning">{completedCourses}</p>
                  <p className="text-xs text-white/70 mt-1">Completed</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
                  <p className="text-3xl font-bold text-white">{totalProgress}%</p>
                  <p className="text-xs text-white/70 mt-1">Avg Progress</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center shadow-lg shadow-primary/25">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mt-6">Start Your Learning Journey</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Go to <span className="text-primary font-semibold">My Plan</span> to analyze your performance, generate an AI-powered learning path, and request personalized courses tailored to your needs.
              </p>
              <Link 
                href="/student/my-plan" 
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }), 
                  'mt-8 gap-2 bg-gradient-to-r from-primary to-primary-variant hover:opacity-90 shadow-lg shadow-primary/25'
                )}
              >
                <Sparkles className="w-4 h-4" />
                Generate My Learning Plan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course grid */}
      {courses.length > 0 && (
        <div className="space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-primary-variant" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Active Courses</h2>
                <p className="text-sm text-muted-foreground">{inProgressCourses} in progress, {completedCourses} completed</p>
              </div>
            </div>
            <Link 
              href="/student/my-plan" 
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}
            >
              <Sparkles className="w-4 h-4" />
              New Course
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, index) => {
              const completedSections = course.sections.filter(s => s.completed).length
              const totalSections = course.sections.length
              const isCompleted = course.status === 'completed'
              const achievedMilestones = course.milestones.filter(m => m.achieved).length
              
              return (
                <Card 
                  key={course.id} 
                  className={cn(
                    "group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500",
                    isCompleted 
                      ? "bg-gradient-to-br from-success/5 via-card to-card ring-1 ring-success/20" 
                      : "bg-card ring-1 ring-border hover:ring-primary/30"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Top accent bar */}
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    isCompleted 
                      ? "bg-gradient-to-r from-success via-success to-primary"
                      : "bg-gradient-to-r from-primary via-info to-warning"
                  )} />
                  
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              className={cn(
                                "font-medium",
                                isCompleted 
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-primary/10 text-primary border-primary/20"
                              )}
                            >
                              {course.subject}
                            </Badge>
                            {isCompleted ? (
                              <Badge className="bg-success text-success-foreground border-0 gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-warning border-warning/30 gap-1">
                                <Flame className="w-3 h-3" />
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                        </div>
                        
                        {/* Progress ring */}
                        <div className="relative w-16 h-16 shrink-0">
                          <svg className="w-16 h-16 -rotate-90">
                            <circle
                              cx="32" cy="32" r="28"
                              className="fill-none stroke-muted stroke-[4]"
                            />
                            <circle
                              cx="32" cy="32" r="28"
                              className={cn(
                                "fill-none stroke-[4] transition-all duration-1000",
                                isCompleted ? "stroke-success" : "stroke-primary"
                              )}
                              strokeDasharray={`${course.progress * 1.76} 176`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={cn(
                              "text-sm font-bold",
                              isCompleted ? "text-success" : "text-primary"
                            )}>
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="px-5 pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                    
                    {/* Stats row */}
                    <div className="px-5 pb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-info" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{completedSections}/{totalSections}</p>
                            <p className="text-xs text-muted-foreground">Weeks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-warning" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{achievedMilestones}/{course.milestones.length}</p>
                            <p className="text-xs text-muted-foreground">Milestones</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{format(new Date(course.createdAt), 'MMM d')}</p>
                            <p className="text-xs text-muted-foreground">Started</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="px-5 pb-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Course Progress</span>
                          <span className="font-semibold text-foreground">{course.progress}% complete</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              isCompleted 
                                ? "bg-gradient-to-r from-success to-primary"
                                : "bg-gradient-to-r from-primary via-info to-warning"
                            )}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Action footer */}
                    <div className="px-5 py-4 bg-muted/30 border-t border-border">
                      <Link
                        href={`/student/my-courses/${course.id}`}
                        className={cn(
                          buttonVariants({ variant: isCompleted ? 'outline' : 'default', size: 'default' }), 
                          'w-full gap-2 justify-center',
                          !isCompleted && 'bg-gradient-to-r from-primary to-primary-variant hover:opacity-90 shadow-md shadow-primary/20'
                        )}
                      >
                        {isCompleted ? (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Review Course
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Continue Learning
                          </>
                        )}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
