'use client'
import { LearningAssessmentWidget } from '@/components/dashboard/learning-assessment-widget'
import { PathwayRecommendationsWidget } from '@/components/dashboard/pathway-recommendations-widget'
import { RiskInterventionWidget } from '@/components/dashboard/risk-intervention-widget'
import { ProgressTrackingWidget } from '@/components/dashboard/progress-tracking-widget'
import { GoalReflectionWidget } from '@/components/dashboard/goal-reflection-widget'

const stats = [
  { label: 'Active ILPs', value: '287', sub: 'this semester' },
  { label: 'On Track', value: '78%', sub: 'of all students' },
  { label: 'At-Risk Students', value: '34', sub: 'need intervention' },
  { label: 'Goals Completed', value: '142', sub: 'this term' },
]

export default function IlpDashboard() {
  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <LearningAssessmentWidget />
        <PathwayRecommendationsWidget />
        <RiskInterventionWidget />
        <ProgressTrackingWidget />
        <GoalReflectionWidget />
      </div>
    </div>
  )
}
