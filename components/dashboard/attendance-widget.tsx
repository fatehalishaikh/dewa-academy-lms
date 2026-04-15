import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Eye, ScanFace } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { attendanceSummary, flaggedStudents } from '@/data/mock-class-activities'
import { AddContextButton } from './add-context-button'

const COLORS = ['#00B8A9', '#FFC107', '#EF4444']

const badgeStyles: Record<string, string> = {
  warning: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  secondary: 'bg-primary/10 text-primary border-primary/20',
}

const badgeLabels: Record<string, string> = {
  warning: 'Warning',
  destructive: 'Absent',
  secondary: 'Alert',
}

export function AttendanceWidget() {
  const data = [
    { name: 'Present', value: attendanceSummary.present },
    { name: 'Late', value: attendanceSummary.late },
    { name: 'Absent', value: attendanceSummary.absent },
  ]

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Attendance Analytics</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              AI Verified
            </Badge>
            <AddContextButton
              id="attendance"
              entry={{ label: 'Attendance', summary: '94% present, 4% late, 2% absent today (312 students). 3 flagged: Ahmed Al-Rashid (late 3×), Fatima Hassan (absent, no notification), Omar Khalil (behavioral alert).' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Today — March 25, 2026 · {attendanceSummary.total} students</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donut chart */}
        <div className="relative h-[120px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={54}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{attendanceSummary.present}%</span>
            <span className="text-[11px] text-muted-foreground">Present</span>
          </div>
        </div>

        {/* Legend row */}
        <div className="flex justify-center gap-4">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-[11px] text-muted-foreground">{d.value}% {d.name}</span>
            </div>
          ))}
        </div>

        {/* Flagged students */}
        <div className="space-y-2">
          {flaggedStudents.map(s => (
            <div key={s.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
              <div className="flex items-center gap-2.5">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[11px] font-semibold text-white bg-muted-foreground">{s.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.issue}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-[11px] ${badgeStyles[s.severity]}`}>
                {badgeLabels[s.severity]}
              </Badge>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-3 flex items-center gap-1.5">
          <ScanFace className="w-3.5 h-3.5 text-primary" />
          Facial recognition confidence: <span className="text-primary font-semibold">99.2%</span>
        </p>
      </CardContent>
    </Card>
  )
}
