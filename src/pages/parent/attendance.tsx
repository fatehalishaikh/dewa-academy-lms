import { Sparkles, Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

type AttStatus = 'present' | 'absent' | 'late' | 'excused'

const statusConfig: Record<AttStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  present: { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500', icon: CheckCircle2 },
  absent: { label: 'Absent', color: 'text-red-400', bg: 'bg-red-500', icon: XCircle },
  late: { label: 'Late', color: 'text-amber-400', bg: 'bg-amber-500', icon: Clock },
  excused: { label: 'Excused', color: 'text-blue-400', bg: 'bg-blue-500', icon: AlertCircle },
}

// Generate 30 days of mock attendance
function generateAttendance(): { date: Date; status: AttStatus; note?: string }[] {
  const records = []
  const statuses: AttStatus[] = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'late', 'present', 'absent']
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    if (dow === 5 || dow === 6) continue // skip Fri/Sat (weekend in UAE)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    records.push({
      date: d,
      status,
      note: status === 'absent' ? 'No notification received' : status === 'late' ? 'Arrived 15 min late' : undefined,
    })
  }
  return records
}

const attendance = generateAttendance()
const totalDays = attendance.length
const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length
const absentDays = attendance.filter(a => a.status === 'absent').length
const lateDays = attendance.filter(a => a.status === 'late').length

export function ParentAttendance() {
  const parent = useCurrentParent()
  const child = parent ? getStudentById(parent.childIds[0]) : null

  // Group by week
  const weeks: (typeof attendance[0] | null)[][] = []
  let week: (typeof attendance[0] | null)[] = []
  for (const rec of attendance) {
    const dow = rec.date.getDay() // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu
    if (dow === 0 && week.length > 0) { weeks.push(week); week = [] }
    week.push(rec)
  }
  if (week.length > 0) weeks.push(week)

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Attendance Records</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">{child?.name ?? 'Child'}'s Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Last 30 school days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Attendance Rate', value: `${Math.round((presentDays / totalDays) * 100)}%`, color: '#00B8A9', icon: Calendar },
          { label: 'Present', value: presentDays, color: '#10B981', icon: CheckCircle2 },
          { label: 'Absent', value: absentDays, color: '#EF4444', icon: XCircle },
          { label: 'Late', value: lateDays, color: '#F59E0B', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3 h-3" style={{ color }} />
                </div>
              </div>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
            <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Attendance Calendar
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map(d => (
              <p key={d} className="text-[10px] font-semibold text-muted-foreground text-center">{d}</p>
            ))}
          </div>
          <div className="space-y-1.5">
            {weeks.map((week, wi) => {
              // Pad the week to align with days
              const dayOfFirst = week[0]!.date.getDay()
              const padded: (typeof attendance[0] | null)[] = Array(dayOfFirst).fill(null).concat(week)
              return (
                <div key={wi} className="grid grid-cols-5 gap-1.5">
                  {padded.slice(0, 5).map((rec, di) => {
                    if (!rec) return <div key={di} />
                    const cfg = statusConfig[rec.status]
                    return (
                      <div
                        key={di}
                        className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 border"
                        style={{ borderColor: `${cfg.bg.replace('bg-', '')}40`, background: `${cfg.bg.replace('bg-', '')}15` }}
                        title={rec.note}
                      >
                        <p className="text-[10px] font-semibold text-muted-foreground">{rec.date.getDate()}</p>
                        <div className={`w-2 h-2 rounded-full ${cfg.bg}`} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notable absences */}
      {attendance.filter(a => a.status === 'absent' || a.status === 'late').length > 0 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Notable Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {attendance.filter(a => a.status !== 'present').map((rec, i) => {
              const cfg = statusConfig[rec.status]
              const Icon = cfg.icon
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                  <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">
                      {rec.date.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{rec.note ?? cfg.label}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] h-5 ${cfg.color}`}>{cfg.label}</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
