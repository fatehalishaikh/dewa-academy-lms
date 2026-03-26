import { TimetableWidget } from '@/components/dashboard/timetable-widget'
import { AttendanceWidget } from '@/components/dashboard/attendance-widget'
import { LessonPlansWidget } from '@/components/dashboard/lesson-plans-widget'
import { EngagementWidget } from '@/components/dashboard/engagement-widget'

export function ClassActivitiesDashboardTab() {
  return (
    <div className="space-y-5">
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
            <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
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
