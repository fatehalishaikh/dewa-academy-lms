'use client'
import { useState } from 'react'
import {
  Calendar, CheckCircle2, XCircle, Clock,
  AlertCircle, LogIn, LogOut, Fingerprint, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentStudent } from '@/stores/role-store'

type AttStatus = 'present' | 'absent' | 'late' | 'excused'

const statusConfig: Record<AttStatus, { label: string; color: string; bg: string; dot: string; icon: React.ElementType }> = {
  present: { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', icon: CheckCircle2 },
  absent:  { label: 'Absent',  color: 'text-red-400',    bg: 'bg-red-500/10',     dot: 'bg-red-500',     icon: XCircle     },
  late:    { label: 'Late',    color: 'text-amber-400',  bg: 'bg-amber-500/10',   dot: 'bg-amber-500',   icon: Clock       },
  excused: { label: 'Excused', color: 'text-blue-400',   bg: 'bg-blue-500/10',    dot: 'bg-blue-500',    icon: AlertCircle },
}

type AttRecord = { date: Date; status: AttStatus; dateKey: string; note?: string }

function generateAttendance(studentId: string): AttRecord[] {
  let seed = 0
  for (const c of studentId) seed = (seed * 31 + c.charCodeAt(0)) & 0xffff

  const records: AttRecord[] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    if (d.getDay() === 0 || d.getDay() === 6) continue
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    const r = seed % 10
    const status: AttStatus = r < 7 ? 'present' : r < 8 ? 'late' : r < 9 ? 'absent' : 'excused'
    records.push({
      date: d,
      status,
      dateKey: d.toISOString().split('T')[0],
      note: status === 'absent'  ? 'Unexcused absence'
          : status === 'late'    ? 'Arrived after first period'
          : status === 'excused' ? 'Medical leave approved'
          : undefined,
    })
  }
  return records
}

type CalCell = { date: Date; record: AttRecord | null; isWeekend: boolean; isCurrentMonth: boolean }

function buildCalendarGrid(records: AttRecord[], year: number, month: number): CalCell[][] {
  const recordMap = new Map(records.map(r => [r.dateKey, r]))

  // First day of the month, adjusted to Monday of that week
  const firstOfMonth = new Date(year, month, 1)
  const dow = firstOfMonth.getDay()
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1))

  // Last day of the month, adjusted to Sunday of that week
  const lastOfMonth = new Date(year, month + 1, 0)
  const ldow = lastOfMonth.getDay()
  const end = new Date(lastOfMonth)
  end.setDate(end.getDate() + (ldow === 0 ? 0 : 7 - ldow))

  const weeks: CalCell[][] = []
  const cur = new Date(start)
  while (cur <= end) {
    const week: CalCell[] = []
    for (let d = 0; d < 7; d++) {
      const dateKey = cur.toISOString().split('T')[0]
      const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
      const isCurrentMonth = cur.getMonth() === month
      week.push({ date: new Date(cur), record: recordMap.get(dateKey) ?? null, isWeekend, isCurrentMonth })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export default function StudentAttendancePage() {
  const student = useCurrentStudent()
  const records = student ? generateAttendance(student.id) : []

  // Derive available months from records
  const availableMonths = Array.from(
    new Set(records.map(r => `${r.date.getFullYear()}-${r.date.getMonth()}`))
  ).map(key => {
    const [y, m] = key.split('-').map(Number)
    return { year: y, month: m }
  })
  const latestMonth = availableMonths[availableMonths.length - 1] ?? { year: new Date().getFullYear(), month: new Date().getMonth() }
  const [selectedMonth, setSelectedMonth] = useState(latestMonth)

  const calendarGrid = buildCalendarGrid(records, selectedMonth.year, selectedMonth.month)
  const monthIndex = availableMonths.findIndex(m => m.year === selectedMonth.year && m.month === selectedMonth.month)

  const totalDays   = records.length
  const presentDays = records.filter(r => r.status === 'present').length
  const lateDays    = records.filter(r => r.status === 'late').length
  const absentDays  = records.filter(r => r.status === 'absent').length
  const rate        = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0

  const [clockedIn, setClockedIn] = useState(false)
  const [clockTime, setClockTime] = useState<string | null>(null)

  function handleClock() {
    const now = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })
    if (!clockedIn) {
      setClockedIn(true)
      setClockTime(now)
    } else {
      setClockedIn(false)
      setClockTime(null)
    }
  }

  const notable = records.filter(r => r.status !== 'present')

  if (!student) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No student found.</p></div>
  }

  const excusedDays = records.filter(r => r.status === 'excused').length

  return (
    <div className="p-6 space-y-6">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #091810 0%, #0c2318 55%, #071420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 px-7 py-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, #10B981 20%, transparent)', border: '1px solid color-mix(in srgb, #10B981 30%, transparent)' }}
            >
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Student Portal</p>
              <h1 className="text-xl font-bold text-white mt-0.5">Attendance</h1>
              <p className="text-white/40 text-sm mt-0.5">Your attendance record — last 30 school days</p>
            </div>
          </div>

          {/* Right — attendance rate + school days */}
          <div className="lg:col-span-2 px-7 py-6 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{
                  background: rate >= 90 ? 'rgba(16,185,129,0.12)' : rate >= 75 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `5px solid ${rate >= 90 ? 'rgba(16,185,129,0.35)' : rate >= 75 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)'}`,
                }}
              >
                <span className="text-xl font-bold text-white">{rate}%</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Attendance Rate</p>
                <p className="text-[11px] text-white/35">this semester</p>
              </div>
            </div>
            <div className="w-px h-14 bg-white/[0.08]" />
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.12)', border: '5px solid rgba(14,165,233,0.35)' }}>
                <span className="text-xl font-bold text-white">{totalDays}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">School Days</p>
                <p className="text-[11px] text-white/35">tracked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Attendance Rate', value: `${rate}%`,   color: rate >= 90 ? '#10B981' : rate >= 75 ? '#F59E0B' : '#EF4444', icon: Calendar,     trend: rate >= 90 ? 'Excellent' : rate >= 75 ? 'Needs effort' : 'At risk' },
          { label: 'Present',         value: presentDays,  color: '#10B981',                                                    icon: CheckCircle2, trend: `of ${totalDays} days` },
          { label: 'Absent',          value: absentDays,   color: '#EF4444',                                                    icon: XCircle,      trend: absentDays === 0 ? 'All clear' : 'Unexcused' },
          { label: 'Late / Excused',  value: lateDays + excusedDays, color: '#F59E0B',                                          icon: Clock,        trend: `${lateDays} late, ${excusedDays} excused` },
        ].map(({ label, value, color, icon: Icon, trend }) => (
          <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Calendar legend */}
          <div className="flex items-center gap-4 flex-wrap">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <Card className="rounded-xl border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Attendance Calendar
                </CardTitle>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedMonth(availableMonths[monthIndex - 1])}
                    disabled={monthIndex <= 0}
                    className="w-7 h-7 flex items-center justify-center rounded-[8px] border border-border text-muted-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-foreground min-w-[100px] text-center">
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
                  <p key={d} className={`text-[11px] font-semibold text-center ${d === 'Sat' || d === 'Sun' ? 'text-muted-foreground/30' : 'text-muted-foreground'}`}>{d}</p>
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
                      if (!cell.record) return (
                        <div key={di} className="aspect-square rounded-xl border border-border/20 flex flex-col items-center justify-center">
                          <p className="text-[11px] font-semibold text-muted-foreground/30 leading-none">{cell.date.getDate()}</p>
                        </div>
                      )
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

          {/* Notable events */}
          {notable.length > 0 && (
            <Card className="rounded-xl border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Notable Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notable.map((rec, i) => {
                  const cfg = statusConfig[rec.status]
                  const Icon = cfg.icon
                  return (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                      <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">
                          {rec.date.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        {rec.note && <p className="text-[11px] text-muted-foreground">{rec.note}</p>}
                      </div>
                      <Badge variant="outline" className={`text-[11px] h-5 ${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Clock in/out */}
        <div className="space-y-4">
          <Card className={`rounded-xl border-2 transition-colors ${clockedIn ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-card'}`}>
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-primary" />
                Today&apos;s Check-In
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              {/* Status indicator */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${clockedIn ? 'bg-emerald-500/10' : 'bg-muted/30'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${clockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground/40'}`} />
                <p className={`text-xs font-medium ${clockedIn ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                  {clockedIn ? 'Checked In' : 'Not Checked In'}
                </p>
                {clockTime && <p className="text-[11px] text-muted-foreground ml-auto">{clockTime}</p>}
              </div>

              <div className="text-center space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  {clockedIn
                    ? 'You are currently checked in. Tap to check out when leaving.'
                    : 'Tap the button below to record your arrival.'}
                </p>
                <Button
                  onClick={handleClock}
                  className={`w-full ${clockedIn ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' : ''}`}
                  variant={clockedIn ? 'outline' : 'default'}
                  size="sm"
                >
                  {clockedIn
                    ? <><LogOut className="w-3.5 h-3.5 mr-2" />Clock Out</>
                    : <><LogIn className="w-3.5 h-3.5 mr-2" />Clock In</>}
                </Button>
              </div>

              <div className="space-y-2 pt-1 border-t border-border">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Today</p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary card */}
          <Card className="rounded-xl border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="space-y-2">
                {[
                  { label: 'Rate', value: `${rate}%`, color: rate >= 90 ? '#10B981' : rate >= 75 ? '#F59E0B' : '#EF4444' },
                  { label: 'Days Attended', value: `${presentDays + lateDays}/${totalDays}`, color: '#94A3B8' },
                  { label: 'Punctual', value: `${presentDays}/${totalDays}`, color: '#94A3B8' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xs font-semibold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
              <div className={`px-3 py-2 rounded-xl text-[11px] font-medium text-center ${
                rate >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                rate >= 75 ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {rate >= 90 ? 'Excellent attendance!' : rate >= 75 ? 'Attendance needs improvement' : 'At-risk — contact your teacher'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
