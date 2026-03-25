import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Lightbulb, BookOpen, FlaskConical, Languages } from 'lucide-react'
import { lessonRecommendations } from '@/data/mock-class-activities'

const subjectIcons: Record<string, React.ElementType> = {
  Mathematics: BookOpen,
  Physics: FlaskConical,
  English: Languages,
}

function progressColor(value: number) {
  if (value < 70) return '#FFC107'
  if (value < 85) return '#3DD9C8'
  return '#00B8A9'
}

function LessonCard({ subject, classGroup, recommendation, progress }: {
  subject: string; classGroup: string; recommendation: string; progress: number
}) {
  const Icon = subjectIcons[subject] ?? BookOpen
  const color = progressColor(progress)

  return (
    <div className="p-3 rounded-xl bg-muted/40 space-y-2">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-foreground">{subject}</p>
            <span className="text-[10px] text-muted-foreground shrink-0">{classGroup}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{recommendation}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={progress} className="h-1.5 flex-1" style={{ '--progress-color': color } as React.CSSProperties} />
        <span className="text-[10px] font-medium" style={{ color }}>{progress}%</span>
      </div>
    </div>
  )
}

export function LessonPlansWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">Lesson Recommendations</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI-personalized plans based on class performance</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="w-full mb-4 bg-muted/40 rounded-xl h-8">
            <TabsTrigger value="today" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Today</TabsTrigger>
            <TabsTrigger value="week" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-2 mt-0">
            {lessonRecommendations.map(r => (
              <LessonCard
                key={r.subject}
                subject={r.subject}
                classGroup={r.class}
                recommendation={r.recommendation}
                progress={r.progress}
              />
            ))}
          </TabsContent>

          <TabsContent value="week" className="mt-0">
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Weekly planning view coming soon
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
