import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarDays, CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import { timetableHeatmap, timetableConflicts } from '@/data/mock-class-activities'
import { AddContextButton } from './add-context-button'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Sun']
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]

const cellColor = {
  normal: 'bg-primary/20',
  busy: 'bg-chart-5/40',
  conflict: 'bg-destructive/70',
}

const statusConfig = {
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'bg-chart-4/15 text-chart-4 border-chart-4/20' },
  pending: { label: 'Pending', icon: Clock, className: 'bg-chart-5/15 text-chart-5 border-chart-5/20' },
  reassigned: { label: 'Reassigned', icon: RefreshCw, className: 'bg-primary/15 text-primary border-primary/20' },
}

export function TimetableWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Timetable Optimization</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
              3 Conflicts Resolved
            </Badge>
            <AddContextButton
              id="timetable"
              entry={{ label: 'Timetable', summary: '3 conflicts this week (2 resolved, 1 pending). AI reduced scheduling conflicts by 73% this semester.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI-optimized weekly schedule — Spring 2026</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Heatmap grid */}
        <div>
          <div className="flex gap-1 mb-1">
            <div className="w-8" />
            {DAYS.map(d => (
              <div key={d} className="flex-1 text-center text-[10px] font-medium text-muted-foreground">{d}</div>
            ))}
          </div>
          {PERIODS.map(period => (
            <div key={period} className="flex gap-1 mb-1">
              <div className="w-8 text-[10px] text-muted-foreground flex items-center justify-center">P{period}</div>
              {DAYS.map(day => {
                const cell = timetableHeatmap.find(c => c.day === day && c.period === period)
                return (
                  <div
                    key={day}
                    className={`flex-1 h-5 rounded-sm ${cellColor[cell?.load ?? 'normal']}`}
                    title={`${day} P${period}: ${cell?.load}`}
                  />
                )
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <span className="text-[10px] text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-chart-5/40" />
              <span className="text-[10px] text-muted-foreground">Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-destructive/70" />
              <span className="text-[10px] text-muted-foreground">Conflict</span>
            </div>
          </div>
        </div>

        {/* Conflict list */}
        <ScrollArea className="h-[100px]">
          <div className="space-y-2">
            {timetableConflicts.map(c => {
              const cfg = statusConfig[c.status]
              const Icon = cfg.icon
              return (
                <div key={c.id} className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-muted/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">{c.day} P{c.period}</span>
                    <span className="text-xs text-foreground">{c.description}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] gap-1 ${cfg.className}`}>
                    <Icon className="w-2.5 h-2.5" />
                    {cfg.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          AI reduced scheduling conflicts by <span className="text-primary font-semibold">73%</span> this semester
        </p>
      </CardContent>
    </Card>
  )
}
