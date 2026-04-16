'use client'
import { useState, useMemo } from 'react'
import {
  Calendar, CheckCircle2, XCircle, Clock,
  AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

const ACCENT = '#8B5CF6'

type AttStatus = 'present' | 'absent' | 'late' | 'excused'

const statusConfig: Record<AttStatus, { label: string; color: string; bg: string; dot: string; icon: React.ElementType }> = {
  present: { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', icon: CheckCircle2 },
  absent:  { label: 'Absent',  color: 'text-red-400',    bg: 'bg-red-500/10',     dot: 'bg-red-500',     icon: XCircle     },
  late:    { label: 'Late',    color: 'text-amber-400',  bg: 'bg-amber-500/10',   dot: 'bg-amber-500',   icon: Clock       },
  excused: { label: 'Excused', color: 'text-blue-400',   bg: 'bg-blue-500/10',    dot: 'bg-blue-500',    icon: AlertCircle },
}

type AttRecord = { date: Date; status: AttStatus; dateKey: string; note?: string }
type CalCell   = { date: Date; record: AttRecord | null; isWeekend: boolean; isCurrentMonth: boolean }

function generateAttendance(studentId: string): AttRecord[] {
  let seed = 0
  for (const c of studentId) seed = (seed * 1013904223 + c.charCodeAt(0) * 1664525) & 0x7fffffff
  seed ^= seed >>> 16
  const qualityBias = seed % 3

  const records: AttRecord[] = []
  const today = new Date()

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff
    const r = seed % 20

    let status: AttStatus
    if (qualityBias === 0) {
      status = r < 11 ? 'present' : r < 14 ? 'late' : r < 18 ? 'absent' : 'excused'
    } else if (qualityBias === 1) {
      status = r < 14 ? 'present' : r < 16 ? 'late' : r < 19 ? 'absent' : 'excused'
    } else {
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

function buildCalendarGrid(records: AttRecord[], year: number, month: number): CalCell[][] {
  const recordMap = new Map(records.map(r => [r.dateKey, r]))
  const firstOfMonth = new Date(year, month, 1)
  const dow = firstOfMonth.getDay()
  const startOffset = dow === 0 ? 6 : dow - 1
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - startOffset)
  const lastOfMonth = new Date(year, month + 1, 0)
  const ldow = lastOfMonth.getDay()
  const endOffset = ldow === 0 ? 0 : 7 - ldow
  const end = new Date(lastOfMonth)
  end.setDate(end.getDate() + endOffset)

  const weeks: CalCell[][] = []
  const cur = new Date(start)
  while (cur <= end) {
    const week: CalCell[] = []
    for (let d = 0; d < 7; d++) {
      const dateKey = cur.toISOString().split('T')[0]
      const isWeekend = cur.getDay() === 6 || cur.getDay() === 0
      const isCurrentMonth = cur.getMonth() === month
      week.push({ date: new Date(cur), record: recordMap.get(dateKey) ?? null, isWeekend, isCurrentMonth })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function RingProgress({ value, max, color, size = 80 }: { value: number; max: number; color: string; size?: number }) {
  const sw = 5
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - Math.min(value / max, 1) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  )
}

export default function ParentAttendance() {
  const parent   = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)
  const [selectedIdx, setSelectedIdx] = useState(0)

  const attByChild = useMemo(() => {
    const map: Record<string, AttRecord[]> = {}
    for (const child of children) {
      if (child) map[child.id] = generateAttendance(child.id)
    }
    return map
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedChild = children[selectedIdx]
  const selectedAtt   = selectedChild ? (attByChild[selectedChild.id] ?? []) : []

  const totalDays   = selectedAtt.length
  const presentDays = selectedAtt.filter(a => a.status === 'present' || a.status === 'late').length
  const absentDays  = selectedAtt.filter(a => a.status === 'absent').length
  const lateDays    = selectedAtt.filter(a => a.status === 'late').length
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

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
  const multiChild   = children.length > 1

  if (!parent || children.length === 0) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No children found.</p></div>
  }

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0d0920 0%, #150d2e 55%, #070d1f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 p-7 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`, border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }}
              >
                <Calendar className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Parent Portal</p>
                <h1 className="text-xl font-bold text-white mt-0.5">
                  {multiChild ? "Children's Attendance" : `${children[0]?.name.split(' ')[0]}'s Attendance`}
                </h1>
                <p className="text-white/40 text-sm mt-0.5">Last 60 school days — Mon to Fri</p>
              </div>
            </div>

            {/* Child selector */}
            {multiChild && (
              <div className="flex gap-2 flex-wrap">
                {children.map((child, i) => child && (
                  <button
                    key={child.id}
                    onClick={() => handleChildSwitch(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    style={i === selectedIdx
                      ? { background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`, borderColor: `color-mix(in srgb, ${ACCENT} 40%, transparent)`, color: '#fff' }
                      : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }
                    }
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: child.avatarColor }}>
                      {child.initials[0]}
                    </div>
                    {child.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="text-[11px] text-white/40">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — ring metrics */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* Rate ring */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={attendanceRate} max={100} color={ACCENT} size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{attendanceRate}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Rate</p>
                <p className="text-[11px] text-white/35">attendance</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Present */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={presentDays} max={totalDays} color="#10B981" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{presentDays}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Present</p>
                <p className="text-[11px] text-white/35">days</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Absent/Late */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)', border: '5px solid rgba(239,68,68,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{absentDays}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Absent</p>
                <p className="text-[11px] text-white/35">{lateDays} late</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Attendance Rate', value: `${attendanceRate}%`, color: ACCENT,    icon: Calendar,     trend: 'This semester' },
          { label: 'Present',         value: presentDays,          color: '#10B981', icon: CheckCircle2, trend: `of ${totalDays} days`   },
          { label: 'Absent',          value: absentDays,           color: '#EF4444', icon: XCircle,      trend: 'school days'   },
          { label: 'Late',            value: lateDays,             color: '#F59E0B', icon: Clock,        trend: 'arrivals'      },
        ].map(({ label, value, color, icon: Icon, trend }) => (
          <Card key={label} className="border-border overflow-hidden pt-0 gap-0">
            <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
            <CardContent className="p-4 pt-3">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] font-semibold mt-1" style={{ color }}>{trend}</p>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── CALENDAR ── */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Attendance Calendar
              {multiChild && selectedChild && (
                <span className="text-[11px] text-muted-foreground font-normal">— {selectedChild.name.split(' ')[0]}</span>
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
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <p key={d} className={`text-[11px] font-semibold text-center ${d === 'Sat' || d === 'Sun' ? 'text-muted-foreground/30' : 'text-muted-foreground'}`}>
                {d}
              </p>
            ))}
          </div>
          <div className="space-y-1.5">
            {calendarGrid.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1.5">
                {week.map((cell, di) => {
                  if (!cell.isCurrentMonth) return <div key={di} />
                  if (cell.isWeekend) {
                    return (
                      <div key={di} className="aspect-square rounded-xl flex flex-col items-center justify-center border border-border/20 bg-muted/10">
                        <p className="text-[11px] font-semibold text-muted-foreground/30 leading-none">{cell.date.getDate()}</p>
                      </div>
                    )
                  }
                  if (!cell.record) {
                    return (
                      <div key={di} className="aspect-square rounded-xl border border-border/20 flex flex-col items-center justify-center">
                        <p className="text-[11px] font-semibold text-muted-foreground/30 leading-none">{cell.date.getDate()}</p>
                      </div>
                    )
                  }
                  const cfg = statusConfig[cell.record.status]
                  return (
                    <div
                      key={di}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border ${
                        cell.record.status === 'present' ? 'border-emerald-500/20 bg-emerald-500/5' :
                        cell.record.status === 'absent'  ? 'border-red-500/20 bg-red-500/5' :
                        cell.record.status === 'late'    ? 'border-amber-500/20 bg-amber-500/5' :
                                                           'border-blue-500/20 bg-blue-500/5'
                      }`}
                      title={`${cell.date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} — ${cfg.label}`}
                    >
                      <p className="text-[11px] font-semibold text-muted-foreground leading-none">{cell.date.getDate()}</p>
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── NOTABLE EVENTS ── */}
      {notable.length > 0 && (
        <Card className="border-border">
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
                <div key={i} className="flex items-stretch rounded-xl border border-border overflow-hidden hover:border-primary/20 transition-colors">
                  <div className="w-1 shrink-0" style={{
                    background: rec.status === 'absent'  ? '#EF4444' :
                                rec.status === 'late'    ? '#F59E0B' :
                                rec.status === 'excused' ? '#3B82F6' : '#10B981'
                  }} />
                  <div className="flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {rec.date.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{rec.note ?? cfg.label}</p>
                    </div>
                    <Badge variant="outline" className={`text-[11px] h-5 shrink-0 ${cfg.color}`}>{cfg.label}</Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
