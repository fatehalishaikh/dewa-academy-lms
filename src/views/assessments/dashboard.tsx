import { QuestionGenerationWidget } from '@/components/dashboard/question-generation-widget'
import { AdaptiveTestingWidget } from '@/components/dashboard/adaptive-testing-widget'
import { AutomatedGradingWidget } from '@/components/dashboard/automated-grading-widget'
import { BTECInsightsWidget } from '@/components/dashboard/btec-insights-widget'
import { PredictiveAnalyticsWidget } from '@/components/dashboard/predictive-analytics-widget'

export function AssessmentsDashboardTab() {
  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Assessments', value: '18', sub: 'this term' },
          { label: 'Questions Generated', value: '1,240', sub: 'AI-powered' },
          { label: 'Auto-Graded', value: '89%', sub: 'of submissions' },
          { label: 'At-Risk Students', value: '7', sub: 'require attention' },
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
        <QuestionGenerationWidget />
        <AdaptiveTestingWidget />
        <AutomatedGradingWidget />
        <BTECInsightsWidget />
        <div className="col-span-1 lg:col-span-2">
          <PredictiveAnalyticsWidget />
        </div>
      </div>
    </div>
  )
}
