'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, ChevronLeft, CheckCircle2, Circle, Clock, Target,
  Sparkles, BookMarked, Trophy, TrendingUp, Play, Layers,
  Video, FileText, MessageSquare, Folder, Star, ArrowRight,
  GraduationCap, Flame, Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStudentCourseStore } from '@/stores/student-course-store'
import { cn } from '@/lib/utils'

const resourceTypeConfig: Record<string, { icon: typeof Video; color: string; bg: string; border: string }> = {
  video:     { icon: Video,        color: 'text-purple-500',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30' },
  practice:  { icon: FileText,     color: 'text-info',        bg: 'bg-info/10',        border: 'border-info/30' },
  reading:   { icon: BookOpen,     color: 'text-warning',     bg: 'bg-warning/10',     border: 'border-warning/30' },
  tutoring:  { icon: MessageSquare,color: 'text-success',     bg: 'bg-success/10',     border: 'border-success/30' },
  project:   { icon: Folder,       color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
}

const priorityConfig: Record<string, { color: string; bg: string; border: string }> = {
  high:   { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
  medium: { color: 'text-warning',     bg: 'bg-warning/10',     border: 'border-warning/30' },
  low:    { color: 'text-success',     bg: 'bg-success/10',     border: 'border-success/30' },
}

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const router = useRouter()
  const { getCourseById, toggleSectionComplete, toggleMilestoneAchieved } = useStudentCourseStore()
  const course = getCourseById(courseId)

  if (!course) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Course not found.</p>
        <Button variant="outline" onClick={() => router.push('/student/my-courses')}>
          Back to My Courses
        </Button>
      </div>
    )
  }

  const completedSections = course.sections.filter(s => s.completed).length
  const achievedMilestones = course.milestones.filter(m => m.achieved).length
  const isCompleted = course.status === 'completed'

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/student/my-courses')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to My Courses
      </button>

      {/* Hero Header */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 md:p-8",
        isCompleted 
          ? "bg-gradient-to-br from-success via-success to-primary"
          : "bg-gradient-to-br from-primary via-primary to-primary-variant"
      )}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-warning/20 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                  {course.subject}
                </Badge>
                {isCompleted ? (
                  <Badge className="bg-white text-success border-0 gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </Badge>
                ) : (
                  <Badge className="bg-white/20 text-white border-0 gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    In Progress
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {course.title}
              </h1>
              <p className="text-white/80 max-w-2xl leading-relaxed">
                {course.description}
              </p>
              
              {/* Progress bar in hero */}
              <div className="max-w-md space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Overall Progress</span>
                  <span className="text-white font-bold">{course.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-white transition-all duration-1000"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{completedSections}/{course.sections.length}</p>
                <p className="text-xs text-white/70">Weeks</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-5 h-5 text-warning" />
                </div>
                <p className="text-2xl font-bold text-warning">{achievedMilestones}/{course.milestones.length}</p>
                <p className="text-xs text-white/70">Milestones</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{course.progress}%</p>
                <p className="text-xs text-white/70">Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sections">
        <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
          <TabsTrigger value="sections" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Layers className="w-4 h-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="milestones" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Trophy className="w-4 h-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="w-4 h-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="focus" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Target className="w-4 h-4" />
            Focus Areas
          </TabsTrigger>
        </TabsList>

        {/* Sections Tab */}
        <TabsContent value="sections" className="mt-6">
          <div className="space-y-4">
            {course.sections.map((section, index) => (
              <Card
                key={section.id}
                className={cn(
                  "overflow-hidden border-0 shadow-md transition-all hover:shadow-lg",
                  section.completed 
                    ? "ring-1 ring-success/30 bg-gradient-to-r from-success/5 to-transparent" 
                    : "ring-1 ring-border"
                )}
              >
                {/* Top accent */}
                <div className={cn(
                  "h-1",
                  section.completed 
                    ? "bg-gradient-to-r from-success to-primary"
                    : "bg-gradient-to-r from-primary to-info"
                )} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Week number / checkbox */}
                    <button
                      onClick={() => toggleSectionComplete(course.id, section.id)}
                      className={cn(
                        "w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all",
                        section.completed 
                          ? "bg-gradient-to-br from-success to-primary text-white"
                          : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
                      )}
                    >
                      {section.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <>
                          <span className="text-xs font-medium">Week</span>
                          <span className="text-lg font-bold">{index + 1}</span>
                        </>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className={cn(
                            "text-lg font-semibold transition-colors",
                            section.completed ? "text-success" : "text-foreground"
                          )}>
                            {section.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {section.hoursRequired} hours
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {section.activities.length} activities
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {section.completed ? (
                            <Badge className="bg-success/10 text-success border-success/30 gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1.5">
                              <Play className="w-3.5 h-3.5" />
                              Start
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Activities */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {section.activities.map((activity, i) => (
                          <div 
                            key={i} 
                            className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 text-sm"
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                              section.completed ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
                            )}>
                              {section.completed ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <span className="text-xs font-medium">{i + 1}</span>
                              )}
                            </div>
                            <span className={cn(
                              "leading-relaxed",
                              section.completed ? "text-muted-foreground" : "text-foreground"
                            )}>
                              {activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.milestones.map((milestone, i) => (
              <Card
                key={i}
                className={cn(
                  "overflow-hidden border-0 shadow-md transition-all hover:shadow-lg cursor-pointer",
                  milestone.achieved 
                    ? "ring-1 ring-warning/30 bg-gradient-to-br from-warning/10 to-transparent" 
                    : "ring-1 ring-border"
                )}
                onClick={() => toggleMilestoneAchieved(course.id, i)}
              >
                <div className={cn(
                  "h-1",
                  milestone.achieved 
                    ? "bg-gradient-to-r from-warning via-warning to-success"
                    : "bg-gradient-to-r from-muted to-muted"
                )} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      milestone.achieved 
                        ? "bg-gradient-to-br from-warning to-warning/80 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {milestone.achieved ? (
                        <Trophy className="w-6 h-6" />
                      ) : (
                        <Target className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className={cn(
                          "text-base font-semibold",
                          milestone.achieved ? "text-warning" : "text-foreground"
                        )}>
                          {milestone.title}
                        </h3>
                        {milestone.achieved && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <Star className="w-4 h-4 text-warning fill-warning" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.metric}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          Week {milestone.targetWeek}
                        </Badge>
                        <Badge variant="outline" className="text-muted-foreground">
                          {milestone.subject}
                        </Badge>
                        {milestone.achieved && (
                          <Badge className="bg-success/10 text-success border-success/30">
                            Achieved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.resources.map((res, i) => {
              const typeConfig = resourceTypeConfig[res.type] ?? { icon: BookOpen, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' }
              const prioConfig = priorityConfig[res.priority] ?? { color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' }
              const TypeIcon = typeConfig.icon
              
              return (
                <Card key={i} className="overflow-hidden border-0 shadow-md ring-1 ring-border hover:shadow-lg hover:ring-primary/30 transition-all cursor-pointer group">
                  <div className={cn("h-1 bg-gradient-to-r", typeConfig.bg.replace('bg-', 'from-'), 'to-transparent')} style={{
                    background: `linear-gradient(to right, ${typeConfig.color.includes('purple') ? '#a855f7' : typeConfig.color.includes('info') ? 'var(--info)' : typeConfig.color.includes('warning') ? 'var(--warning)' : typeConfig.color.includes('success') ? 'var(--success)' : 'var(--destructive)'}, transparent)`
                  }} />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", typeConfig.bg)}>
                        <TypeIcon className={cn("w-5 h-5", typeConfig.color)} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className={cn("font-medium capitalize", typeConfig.bg, typeConfig.color, typeConfig.border)}>
                          {res.type}
                        </Badge>
                        <Badge className={cn("font-medium capitalize", prioConfig.bg, prioConfig.color, prioConfig.border)}>
                          {res.priority}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {res.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {res.estimatedTime}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Focus Areas Tab */}
        <TabsContent value="focus" className="mt-6">
          <div className="space-y-4">
            {course.focusAreas.map((area, i) => {
              const prioConfig = priorityConfig[area.priority] ?? { color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' }
              
              return (
                <Card key={i} className="overflow-hidden border-0 shadow-md ring-1 ring-border">
                  <div className="h-1" style={{
                    background: `linear-gradient(to right, ${area.priority === 'high' ? 'var(--destructive)' : area.priority === 'medium' ? 'var(--warning)' : 'var(--success)'}, var(--primary))`
                  }} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <CardTitle className="text-base font-semibold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        {area.subject}
                      </CardTitle>
                      <Badge className={cn("font-medium capitalize", prioConfig.bg, prioConfig.color, prioConfig.border)}>
                        {area.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Level transition */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Current Level</p>
                        <div className="flex items-center justify-center gap-2">
                          <BookMarked className="w-4 h-4 text-warning" />
                          <span className="text-lg font-bold text-warning">{area.currentLevel}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Target Level</p>
                        <div className="flex items-center justify-center gap-2">
                          <Target className="w-4 h-4 text-success" />
                          <span className="text-lg font-bold text-success">{area.targetLevel}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-primary/5 ring-1 ring-primary/10">
                      <p className="text-sm text-muted-foreground leading-relaxed">{area.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
