'use client'
import { LessonGeneratorWidget } from '@/components/dashboard/lesson-generator-widget'
import { StandardsCoverageWidget } from '@/components/dashboard/standards-coverage-widget'
import { PacingAdaptationWidget } from '@/components/dashboard/pacing-adaptation-widget'
import { ResourceRecommendationsWidget } from '@/components/dashboard/resource-recommendations-widget'
import { CurriculumAnalyticsWidget } from '@/components/dashboard/curriculum-analytics-widget'

export default function CurriculumDashboardTab() {
  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Lesson Plans',      value: '156', sub: 'AI-generated this term' },
          { label: 'Standards Covered', value: '87%', sub: 'KHDA/MOE aligned' },
          { label: 'Pacing Score',      value: '92',  sub: 'on-track index' },
          { label: 'Resource Match',    value: '94%', sub: 'AI relevance score' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
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
