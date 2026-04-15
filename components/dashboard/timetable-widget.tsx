import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CalendarDays, CheckCircle2, Clock, RefreshCw, AlertTriangle, Zap } from 'lucide-react'
import { academyClasses } from '@/data/mock-classes'
import { AddContextButton } from './add-context-button'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Sun']
const BUSY_THRESHOLD = 3

// Derive periods from unique time slots in schedule data
const uniqueTimes = [...new Set(academyClasses.flatMap(cls => cls.schedule.map(s => s.time)))].sort()
const TIME_TO_PERIOD: Record<string, number> = Object.fromEntries(uniqueTimes.map((t, i) => [t, i + 1]))
const PERIODS = uniqueTimes.map((_, i) => i + 1)

type HeatmapCell = { day: string; period: number; load: 'normal' | 'busy' | 'conflict' }
type TimetableConflict = { id: number; day: string; period: number; description: string; status: 'resolved' | 'pending' | 'reassigned' }

// Build schedule map: day → period → [{className, room}]
const scheduleMap: Record<string, Record<number, { className: string; room: string }[]>> = {}
DAYS.forEach(d => { scheduleMap[d] = {} })
academyClasses.forEach(cls => {
  cls.schedule.forEach(slot => {
    const period = TIME_TO_PERIOD[slot.time]
    if (!period || !scheduleMap[slot.day]) return
    if (!scheduleMap[slot.day][period]) scheduleMap[slot.day][period] = []
    scheduleMap[slot.day][period].push({ className: cls.name, room: slot.room })
  })
})

// Derive heatmap and conflicts from real data
const timetableHeatmap: HeatmapCell[] = []
const timetableConflicts: TimetableConflict[] = []
let conflictId = 1

DAYS.forEach(day => {
  PERIODS.forEach(period => {
    const entries = scheduleMap[day]?.[period] ?? []
    const roomGroups: Record<string, string[]> = {}
    entries.forEach(e => {
      if (!roomGroups[e.room]) roomGroups[e.room] = []
      roomGroups[e.room].push(e.className)
    })
    const roomConflicts = Object.entries(roomGroups).filter(([, classes]) => classes.length > 1)

    if (roomConflicts.length > 0) {
      timetableHeatmap.push({ day, period, load: 'conflict' })
      roomConflicts.forEach(([room, classes]) => {
        timetableConflicts.push({
          id: conflictId++,
          day,
          period,
          description: `${room}: ${classes.slice(0, 2).join(' & ')}${classes.length > 2 ? ` +${classes.length - 2}` : ''}`,
          status: 'pending',
        })
      })
    } else if (entries.length >= BUSY_THRESHOLD) {
      timetableHeatmap.push({ day, period, load: 'busy' })
    } else {
      timetableHeatmap.push({ day, period, load: 'normal' })
    }
  })
})

const cellColor = {
  normal: 'bg-primary/35',
  busy: 'bg-chart-5/65',
  conflict: 'bg-destructive/90',
}

const statusConfig = {
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'bg-chart-4/15 text-chart-4 border-chart-4/20' },
  pending: { label: 'Pending', icon: Clock, className: 'bg-chart-5/15 text-chart-5 border-chart-5/20' },
  reassigned: { label: 'Reassigned', icon: RefreshCw, className: 'bg-primary/15 text-primary border-primary/20' },
}

export function TimetableWidget() {
  const conflictCount = timetableConflicts.length
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
              {conflictCount} Conflict{conflictCount !== 1 ? 's' : ''} Detected
            </Badge>
            <AddContextButton
              id="timetable"
              entry={{ label: 'Timetable', summary: `${conflictCount} scheduling conflict${conflictCount !== 1 ? 's' : ''} detected this week. AI optimization available.` }}
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
              <div key={d} className="flex-1 text-center text-[11px] font-medium text-muted-foreground">{d}</div>
            ))}
          </div>
          {PERIODS.map(period => (
            <div key={period} className="flex gap-1 mb-1">
              <div className="w-8 text-[11px] text-muted-foreground flex items-center justify-center">P{period}</div>
              {DAYS.map(day => {
                const cell = timetableHeatmap.find(c => c.day === day && c.period === period)
                const load = cell?.load ?? 'normal'
                const entries = scheduleMap[day]?.[period] ?? []
                const conflict = timetableConflicts.find(c => c.day === day && c.period === period)

                if (load === 'normal') {
                  return (
                    <div key={day} className={`flex-1 h-5 rounded-sm ${cellColor.normal}`} />
                  )
                }

                return (
                  <Tooltip key={day}>
                    <TooltipTrigger className={`flex-1 h-5 rounded-sm cursor-pointer ${cellColor[load]}`} />
                    <TooltipContent side="top" className="max-w-[200px] text-center">
                      {load === 'conflict' && conflict ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-semibold">
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                            {day} Period {period}
                          </div>
                          <p>{conflict.description}</p>
                          <p className="capitalize opacity-70">{conflict.status}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-semibold">
                            <Zap className="w-3 h-3 text-chart-5" />
                            {day} Period {period} — Busy
                          </div>
                          <p>{entries.length} classes scheduled</p>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/35" />
              <span className="text-[11px] text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-chart-5/65" />
              <span className="text-[11px] text-muted-foreground">Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-destructive/90" />
              <span className="text-[11px] text-muted-foreground">Conflict</span>
            </div>
          </div>
        </div>

        {/* Conflict list */}
        <ScrollArea className="h-[100px]">
          <div className="space-y-2 pr-3">
            {timetableConflicts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No conflicts detected</p>
            ) : (
              timetableConflicts.map(c => {
                const cfg = statusConfig[c.status]
                const Icon = cfg.icon
                return (
                  <div key={c.id} className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-muted/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{c.day} P{c.period}</span>
                      <span className="text-xs text-foreground">{c.description}</span>
                    </div>
                    <Badge variant="outline" className={`text-[11px] gap-1 ${cfg.className}`}>
                      <Icon className="w-2.5 h-2.5" />
                      {cfg.label}
                    </Badge>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          {conflictCount} room conflict{conflictCount !== 1 ? 's' : ''} found across{' '}
          <span className="text-primary font-semibold">{academyClasses.length}</span> classes this week
        </p>
      </CardContent>
    </Card>
  )
}
