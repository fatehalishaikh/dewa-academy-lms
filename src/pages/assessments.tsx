import { Sparkles } from 'lucide-react'
import { QuestionGenerationWidget } from '@/components/dashboard/question-generation-widget'
import { AdaptiveTestingWidget } from '@/components/dashboard/adaptive-testing-widget'
import { AutomatedGradingWidget } from '@/components/dashboard/automated-grading-widget'
import { BTECInsightsWidget } from '@/components/dashboard/btec-insights-widget'
import { PredictiveAnalyticsWidget } from '@/components/dashboard/predictive-analytics-widget'

export function AssessmentsDashboard() {
  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Assessments &amp; Exams</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Assessment Intelligence
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
          { label: 'Active Assessments', value: '18', sub: 'this semester' },
          { label: 'Questions Generated', value: '1,240', sub: 'AI-assisted' },
          { label: 'Auto-Graded', value: '89%', sub: 'of submissions' },
          { label: 'At-Risk Students', value: '7', sub: 'need intervention' },
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
        <QuestionGenerationWidget />
        <AdaptiveTestingWidget />
        <AutomatedGradingWidget />
        <BTECInsightsWidget />
        <PredictiveAnalyticsWidget />
      </div>
    </div>
  )
}
