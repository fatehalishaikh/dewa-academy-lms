'use client'
import { useState, useMemo } from 'react'
import {
  Sparkles, Calendar, CheckCircle2, XCircle, Clock,
  AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

type AttStatus = 'present' | 'absent' | 'late' | 'excused'

const statusConfig: Record<AttStatus, { label: string; color: string; bg: string; dot: string; icon: React.ElementType }> = {
  present: { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', icon: CheckCircle2 },
  absent:  { label: 'Absent',  color: 'text-red-400',    bg: 'bg-red-500/10',     dot: 'bg-red-500',     icon: XCircle     },
  late:    { label: 'Late',    color: 'text-amber-400',  bg: 'bg-amber-500/10',   dot: 'bg-amber-500',   icon: Clock       },
  excused: { label: 'Excused', color: 'text-blue-400',   bg: 'bg-blue-500/10',    dot: 'bg-blue-500',    icon: AlertCircle },
}

type AttRecord = { date: Date; status: AttStatus; dateKey: string; note?: string }
type CalCell   = { date: Date; record: AttRecord | null; isWeekend: boolean; isCurrentMonth: boolean }

// Weekdays: Mon–Fri (Sat=6, Sun=0 are weekend)
function generateAttendance(studentId: string): AttRecord[] {
  // Two-pass hash for more entropy — ensures children with close IDs look different
  let seed = 0
  for (const c of studentId) seed = (seed * 1013904223 + c.charCodeAt(0) * 1664525) & 0x7fffffff
  seed ^= seed >>> 16

  // Bias attendance quality per-child from the seed so one child can have good/poor attendance
  const qualityBias = seed % 3   // 0 = poor (~70%), 1 = average (~85%), 2 = good (~95%)

  const records: AttRecord[] = []
  const today = new Date()

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue   // skip Sat & Sun
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff
    const r = seed % 20

    let status: AttStatus
    if (qualityBias === 0) {
      // Poor attendance: more absences
      status = r < 11 ? 'present' : r < 14 ? 'late' : r < 18 ? 'absent' : 'excused'
    } else if (qualityBias === 1) {
      // Average
      status = r < 14 ? 'present' : r < 16 ? 'late' : r < 19 ? 'absent' : 'excused'
    } else {
      // Good attendance: mostly present
      status = r < 17 ? 'present' : r < 18 ? 'late' : r < 19 ? 'absent' : 'excused'
    }

    records.push({
      date: d,
      status,
      dateKey: d.toISOString().split('T')[0],
      note: status === 'absent'  ? 'No notification received'
          : status === 'late'    ? 'Arrived 15 min late'
          : status === 'excused' ? 'Medical certificate provided'
          : undefined,
    })
  }
  return records
}

// Mon-first calendar grid (Sat=6 & Sun=0 are weekend)
function buildCalendarGrid(records: AttRecord[], year: number, month: number): CalCell[][] {
  const recordMap = new Map(records.map(r => [r.dateKey, r]))

  const firstOfMonth = new Date(year, month, 1)
  const dow = firstOfMonth.getDay()
  // Offset back to the Monday of the first week (Mon=1..Sun=0→6)
  const startOffset = dow === 0 ? 6 : dow - 1
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - startOffset)

  const lastOfMonth = new Date(year, month + 1, 0)
  const ldow = lastOfMonth.getDay()
  // Extend forward to Sunday of the last week
  const endOffset = ldow === 0 ? 0 : 7 - ldow
  const end = new Date(lastOfMonth)
  end.setDate(end.getDate() + endOffset)

  const weeks: CalCell[][] = []
  const cur = new Date(start)
  while (cur <= end) {
    const week: CalCell[] = []
    for (let d = 0; d < 7; d++) {
      const dateKey = cur.toISOString().split('T')[0]
      const isWeekend = cur.getDay() === 6 || cur.getDay() === 0   // Sat & Sun
      const isCurrentMonth = cur.getMonth() === month
      week.push({ date: new Date(cur), record: recordMap.get(dateKey) ?? null, isWeekend, isCurrentMonth })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export default function ParentAttendance() {
  const parent   = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)

  const [selectedIdx, setSelectedIdx] = useState(0)

  // Generate attendance for every child once
  const attByChild = useMemo(() => {
    const map: Record<string, AttRecord[]> = {}
    for (const child of children) {
      if (child) map[child.id] = generateAttendance(child.id)
    }
    return map
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const selectedChild = children[selectedIdx]
  const selectedAtt   = selectedChild ? (attByChild[selectedChild.id] ?? []) : []

  const totalDays   = selectedAtt.length
  const presentDays = selectedAtt.filter(a => a.status === 'present' || a.status === 'late').length
  const absentDays  = selectedAtt.filter(a => a.status === 'absent').length
  const lateDays    = selectedAtt.filter(a => a.status === 'late').length

  // Available months derived from selected child's records
  const availableMonths = useMemo(() => {
    return Array.from(
      new Set(selectedAtt.map(r => `${r.date.getFullYear()}-${r.date.getMonth()}`))
    ).map(key => {
      const [y, m] = key.split('-').map(Number)
      return { year: y, month: m }
    })
  }, [selectedAtt])

  const latestMonth = availableMonths[availableMonths.length - 1] ?? {
    year: new Date().getFullYear(), month: new Date().getMonth(),
  }
  const [selectedMonth, setSelectedMonth] = useState(latestMonth)

  // Reset to latest month when switching child
  function handleChildSwitch(i: number) {
    setSelectedIdx(i)
    const childAtt = children[i] ? (attByChild[children[i]!.id] ?? []) : []
    const months = Array.from(
      new Set(childAtt.map(r => `${r.date.getFullYear()}-${r.date.getMonth()}`))
    ).map(key => {
      const [y, m] = key.split('-').map(Number)
      return { year: y, month: m }
    })
    const latest = months[months.length - 1]
    if (latest) setSelectedMonth(latest)
  }

  const monthIndex   = availableMonths.findIndex(m => m.year === selectedMonth.year && m.month === selectedMonth.month)
  const calendarGrid = buildCalendarGrid(selectedAtt, selectedMonth.year, selectedMonth.month)
  const notable      = selectedAtt.filter(a => a.status !== 'present')

  if (!parent || children.length === 0) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No children found.</p></div>
  }

  const multiChild = children.length > 1

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Attendance Records</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">
          {multiChild ? "Children's Attendance" : `${children[0]?.name}'s Attendance`}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Last 60 school days</p>
      </div>

      {/* Child selector */}
      {multiChild && (
        <div className="flex items-center gap-2 flex-wrap">
          {children.map((child, i) => child && (
            <button
              key={child.id}
              onClick={() => handleChildSwitch(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-[10px] border text-xs font-medium transition-all ${
                selectedIdx === i
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: child.avatarColor }}
              >
                {child.initials}
              </div>
              {child.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Attendance Rate', value: `${totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}%`, color: '#00B8A9', icon: Calendar     },
          { label: 'Present',         value: presentDays,                                                             color: '#10B981', icon: CheckCircle2 },
          { label: 'Absent',          value: absentDays,                                                              color: '#EF4444', icon: XCircle      },
          { label: 'Late',            value: lateDays,                                                                color: '#F59E0B', icon: Clock        },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-[10px] border-border py-0 gap-0">
            <CardContent className="px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3 h-3" style={{ color }} />
                </div>
              </div>
              <p className="text-lg font-bold leading-tight" style={{ color }}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend — status colours only */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar — Mon-first, 7-column */}
      <Card className="rounded-[10px] border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Attendance Calendar
              {multiChild && selectedChild && (
                <span className="text-[11px] text-muted-foreground font-normal">
                  — {selectedChild.name.split(' ')[0]}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedMonth(availableMonths[monthIndex - 1])}
                disabled={monthIndex <= 0}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold text-foreground min-w-[110px] text-center">
                {new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setSelectedMonth(availableMonths[monthIndex + 1])}
                disabled={monthIndex >= availableMonths.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mon → Sun headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <p
                key={d}
                className={`text-[10px] font-semibold text-center ${
                  d === 'Sat' || d === 'Sun' ? 'text-muted-foreground/30' : 'text-muted-foreground'
                }`}
              >
                {d}
              </p>
            ))}
          </div>

          {/* Grid */}
          <div className="space-y-1.5">
            {calendarGrid.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1.5">
                {week.map((cell, di) => {
                  if (!cell.isCurrentMonth) return <div key={di} />

                  if (cell.isWeekend) {
                    return (
                      <div key={di} className="aspect-square rounded-[10px] flex flex-col items-center justify-center border border-border/20 bg-muted/10">
                        <p className="text-[10px] font-semibold text-muted-foreground/30 leading-none">{cell.date.getDate()}</p>
                      </div>
                    )
                  }

                  if (!cell.record) {
                    return (
                      <div key={di} className="aspect-square rounded-[10px] border border-border/20 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-semibold text-muted-foreground/30 leading-none">{cell.date.getDate()}</p>
                      </div>
                    )
                  }

                  const cfg = statusConfig[cell.record.status]
                  return (
                    <div
                      key={di}
                      className={`aspect-square rounded-[10px] flex flex-col items-center justify-center gap-1 border ${
                        cell.record.status === 'present' ? 'border-emerald-500/20 bg-emerald-500/5' :
                        cell.record.status === 'absent'  ? 'border-red-500/20 bg-red-500/5' :
                        cell.record.status === 'late'    ? 'border-amber-500/20 bg-amber-500/5' :
                                                           'border-blue-500/20 bg-blue-500/5'
                      }`}
                      title={`${cell.date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} — ${cfg.label}`}
                    >
                      <p className="text-[10px] font-semibold text-muted-foreground leading-none">{cell.date.getDate()}</p>
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notable events */}
      {notable.length > 0 && (
        <Card className="rounded-[10px] border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Notable Events{multiChild && selectedChild ? ` — ${selectedChild.name.split(' ')[0]}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notable.map((rec, i) => {
              const cfg  = statusConfig[rec.status]
              const Icon = cfg.icon
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-[10px] bg-card border border-border">
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
