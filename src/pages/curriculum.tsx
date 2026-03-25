import { Sparkles } from 'lucide-react'
import { LessonGeneratorWidget } from '@/components/dashboard/lesson-generator-widget'
import { StandardsCoverageWidget } from '@/components/dashboard/standards-coverage-widget'
import { PacingAdaptationWidget } from '@/components/dashboard/pacing-adaptation-widget'
import { ResourceRecommendationsWidget } from '@/components/dashboard/resource-recommendations-widget'
import { CurriculumAnalyticsWidget } from '@/components/dashboard/curriculum-analytics-widget'

export function CurriculumDashboard() {
  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Curriculum &amp; Lesson Planner</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Driven Lesson Planning Intelligence
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-sm font-semibold text-foreground">March 25, 2026</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Lesson Plans',       value: '156',  sub: 'AI-generated this term' },
          { label: 'Standards Covered',  value: '87%',  sub: 'KHDA/MOE aligned' },
          { label: 'Pacing Score',       value: '92',   sub: 'on-track index' },
          { label: 'Resource Match',     value: '94%',  sub: 'AI relevance score' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <LessonGeneratorWidget />
        <StandardsCoverageWidget />
        <PacingAdaptationWidget />
        <ResourceRecommendationsWidget />
        <CurriculumAnalyticsWidget />
      </div>
    </div>
  )
}
