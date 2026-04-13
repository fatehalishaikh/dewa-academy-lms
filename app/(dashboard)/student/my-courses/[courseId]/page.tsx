'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, ChevronLeft, CheckCircle2, Circle, Clock, Target,
  Sparkles, BookMarked, Trophy, TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStudentCourseStore } from '@/stores/student-course-store'

const resourceTypeColor: Record<string, string> = {
  video:     'text-purple-400 border-purple-500/30',
  practice:  'text-blue-400 border-blue-500/30',
  reading:   'text-amber-400 border-amber-500/30',
  tutoring:  'text-emerald-400 border-emerald-500/30',
  project:   'text-rose-400 border-rose-500/30',
}

const priorityColor: Record<string, string> = {
  high:   'text-red-400 border-red-500/30',
  medium: 'text-amber-400 border-amber-500/30',
  low:    'text-emerald-400 border-emerald-500/30',
}

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const router = useRouter()
  const { getCourseById, toggleSectionComplete, toggleMilestoneAchieved } = useStudentCourseStore()
  const course = getCourseById(courseId)

  if (!course) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 space-y-3">
        <p className="text-sm text-muted-foreground">Course not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.push('/student/my-courses')}>
          Back to My Courses
        </Button>
      </div>
    )
  }

  const completedSections = course.sections.filter(s => s.completed).length
  const achievedMilestones = course.milestones.filter(m => m.achieved).length

  return (
    <div className="p-6 space-y-6">
      {/* Back + header */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/student/my-courses')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          My Courses
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                {course.subject}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] h-5 ${
                  course.status === 'completed'
                    ? 'border-emerald-500/30 text-emerald-400'
                    : 'border-amber-500/30 text-amber-400'
                }`}
              >
                {course.status === 'completed' ? 'Completed' : 'Active'}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-foreground">{course.title}</h1>
            <p className="text-sm text-muted-foreground max-w-xl">{course.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-primary">{course.progress}%</p>
            <p className="text-[11px] text-muted-foreground">Overall Progress</p>
          </div>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-[10px] border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{completedSections}/{course.sections.length}</p>
              <p className="text-[10px] text-muted-foreground">Weeks Done</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{achievedMilestones}/{course.milestones.length}</p>
              <p className="text-[10px] text-muted-foreground">Milestones</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-blue-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{course.progress}%</p>
              <p className="text-[10px] text-muted-foreground">Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sections">
        <TabsList className="bg-muted/30 border border-border h-9">
          <TabsTrigger value="sections" className="text-xs">Sections</TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs">Milestones</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
          <TabsTrigger value="focus" className="text-xs">Focus Areas</TabsTrigger>
        </TabsList>

        {/* Sections */}
        <TabsContent value="sections" className="space-y-3 mt-4">
          {course.sections.map(section => (
            <Card
              key={section.id}
              className={`rounded-[10px] border transition-colors ${
                section.completed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-card'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSectionComplete(course.id, section.id)}
                    className="mt-0.5 shrink-0 transition-colors"
                  >
                    {section.completed
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />}
                  </button>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${section.completed ? 'text-emerald-400 line-through' : 'text-foreground'}`}>
                        {section.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] h-5 border-blue-500/30 text-blue-400">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          {section.hoursRequired}h
                        </Badge>
                        {section.completed && (
                          <Badge variant="outline" className="text-[10px] h-5 border-emerald-500/30 text-emerald-400">
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {section.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                          <span className="text-primary mt-0.5 shrink-0">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Milestones */}
        <TabsContent value="milestones" className="space-y-3 mt-4">
          {course.milestones.map((milestone, i) => (
            <Card
              key={i}
              className={`rounded-[10px] border transition-colors ${
                milestone.achieved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-card'
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <button onClick={() => toggleMilestoneAchieved(course.id, i)} className="mt-0.5 shrink-0">
                  {milestone.achieved
                    ? <Trophy className="w-5 h-5 text-emerald-400" />
                    : <Target className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />}
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${milestone.achieved ? 'text-emerald-400' : 'text-foreground'}`}>
                      {milestone.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] h-5 border-border text-muted-foreground">
                        Week {milestone.targetWeek}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] h-5 border-border text-muted-foreground">
                        {milestone.subject}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{milestone.metric}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.resources.map((res, i) => (
              <Card key={i} className="rounded-[10px] border-border bg-card">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-tight">{res.title}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className={`text-[10px] h-5 ${resourceTypeColor[res.type] ?? 'text-muted-foreground border-border'}`}>
                        {res.type}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] h-5 ${priorityColor[res.priority] ?? 'text-muted-foreground border-border'}`}>
                        {res.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {res.estimatedTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Focus Areas */}
        <TabsContent value="focus" className="space-y-3 mt-4">
          {course.focusAreas.map((area, i) => (
            <Card key={i} className="rounded-[10px] border-border bg-card">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    {area.subject}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] h-5 ${priorityColor[area.priority] ?? 'text-muted-foreground border-border'}`}
                  >
                    {area.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-3">
                <div className="flex items-center gap-4 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <BookMarked className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Current:</span>
                    <span className="text-amber-400 font-medium">{area.currentLevel}</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Target:</span>
                    <span className="text-emerald-400 font-medium">{area.targetLevel}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{area.recommendation}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
