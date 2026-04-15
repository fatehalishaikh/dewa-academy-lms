'use client'
import { useState } from 'react'
import { Download, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonGeneratorWidget } from '@/components/dashboard/lesson-generator-widget'
import { StandardsCoverageWidget } from '@/components/dashboard/standards-coverage-widget'
import { PacingAdaptationWidget } from '@/components/dashboard/pacing-adaptation-widget'
import { ResourceRecommendationsWidget } from '@/components/dashboard/resource-recommendations-widget'
import { CurriculumAnalyticsWidget } from '@/components/dashboard/curriculum-analytics-widget'

const STATS = [
  { label: 'Lesson Plans',      value: '156',       sub: 'AI-generated this term' },
  { label: 'Standards Covered', value: '87%',       sub: 'KHDA/MOE aligned' },
  { label: 'Pacing Score',      value: '92',        sub: 'on-track index' },
  { label: 'Resource Match',    value: '94%',       sub: 'AI relevance score' },
  { label: 'Lessons Delivered', value: '124 / 156', sub: '79% delivery rate' },
  { label: 'Teacher Adoption',  value: '94%',       sub: '32 of 34 teachers active' },
]

export default function CurriculumDashboardTab() {
  const [exportOpen, setExportOpen] = useState(false)
  const [exported, setExported] = useState<string | null>(null)

  function handleExport(fmt: string) {
    setExported(fmt)
    setExportOpen(false)
    setTimeout(() => setExported(null), 2500)
  }

  return (
    <div className="space-y-5">
      {/* Stats bar + export */}
      <div className="flex items-start gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Export dropdown */}
        <div className="relative shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExportOpen(v => !v)}
            className="h-8 text-xs gap-1.5"
          >
            <Download className="w-3 h-3" /> Export Report <ChevronDown className="w-3 h-3" />
          </Button>
          {exportOpen && (
            <div className="absolute right-0 top-9 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-36">
              {['PDF', 'Excel', 'CSV'].map(fmt => (
                <button
                  key={fmt}
                  className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-muted/20 transition-colors"
                  onClick={() => handleExport(fmt)}
                >
                  {fmt}
                </button>
              ))}
            </div>
          )}
          {exported && (
            <Badge variant="outline" className="absolute -bottom-7 right-0 text-[11px] border-emerald-500/30 text-emerald-400 whitespace-nowrap">
              {exported} downloaded
            </Badge>
          )}
        </div>
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
