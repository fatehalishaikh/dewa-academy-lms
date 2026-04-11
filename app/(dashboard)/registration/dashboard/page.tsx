'use client'
import { mockApplications } from '@/data/mock-registration'
import { RegPipelineWidget } from '@/components/dashboard/reg-pipeline-widget'
import { RegEmiratesIdWidget } from '@/components/dashboard/reg-emirates-id-widget'
import { RegDocumentVerificationWidget } from '@/components/dashboard/reg-document-verification-widget'
import { RegAiScoringWidget } from '@/components/dashboard/reg-ai-scoring-widget'
import { RegFlaggedWidget } from '@/components/dashboard/reg-flagged-widget'
import { RegIntegrationWidget } from '@/components/dashboard/reg-integration-widget'

const stats = [
  { label: 'Total Applications', value: '342', sub: 'This academic cycle' },
  { label: 'Approved', value: '186', sub: '54% approval rate' },
  { label: 'Pending Review', value: '89', sub: '26% in pipeline' },
  { label: 'Flagged', value: String(mockApplications.filter(a => a.flagged).length), sub: 'Need manual review' },
]

export default function RegistrationDashboard() {
  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <RegPipelineWidget />
        <RegEmiratesIdWidget />
        <RegDocumentVerificationWidget />
        <RegAiScoringWidget />
        <RegFlaggedWidget />
        <RegIntegrationWidget />
      </div>
    </div>
  )
}
