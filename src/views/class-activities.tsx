import { Sparkles } from 'lucide-react'
import { TimetableWidget } from '@/components/dashboard/timetable-widget'
import { AttendanceWidget } from '@/components/dashboard/attendance-widget'
import { LessonPlansWidget } from '@/components/dashboard/lesson-plans-widget'
import { EngagementWidget } from '@/components/dashboard/engagement-widget'

export function ClassActivitiesDashboard() {
  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Class Activities</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Classroom Intelligence
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
          { label: 'Active Classes', value: '24', sub: 'this semester' },
          { label: 'Students', value: '312', sub: 'enrolled' },
          { label: 'Attendance Rate', value: '94%', sub: 'today' },
          { label: 'AI Alerts', value: '5', sub: 'require attention' },
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
        <TimetableWidget />
        <AttendanceWidget />
        <LessonPlansWidget />
        <EngagementWidget />
      </div>
    </div>
  )
}
