'use client'
import { useState } from 'react'
import {
  Sparkles, Calendar, CheckCircle2, XCircle, Clock,
  AlertCircle, LogIn, LogOut, Fingerprint,
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
    if (d.getDay() === 5 || d.getDay() === 6) continue
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

function buildWeeks(records: AttRecord[]) {
  const weeks: (AttRecord | null)[][] = []
  let week: (AttRecord | null)[] = []
  for (const rec of records) {
    if (rec.date.getDay() === 0 && week.length > 0) { weeks.push(week); week = [] }
    week.push(rec)
  }
  if (week.length > 0) weeks.push(week)
  return weeks
}

export default function StudentAttendancePage() {
  const student = useCurrentStudent()
  const records = student ? generateAttendance(student.id) : []
  const weeks = buildWeeks(records)

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

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">My Attendance</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your attendance record — last 30 school days</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Attendance Rate', value: `${rate}%`,    color: '#00B8A9', icon: Calendar     },
              { label: 'Present',         value: presentDays,   color: '#10B981', icon: CheckCircle2 },
              { label: 'Absent',          value: absentDays,    color: '#EF4444', icon: XCircle      },
              { label: 'Late',            value: lateDays,      color: '#F59E0B', icon: Clock        },
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
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Attendance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map(d => (
                  <p key={d} className="text-[10px] font-semibold text-muted-foreground text-center">{d}</p>
                ))}
              </div>
              <div className="space-y-1.5">
                {weeks.map((wk, wi) => {
                  const dayOfFirst = wk[0]!.date.getDay()
                  const padded = (Array(dayOfFirst).fill(null) as (AttRecord | null)[]).concat(wk)
                  return (
                    <div key={wi} className="grid grid-cols-5 gap-1.5">
                      {padded.slice(0, 5).map((rec, di) => {
                        if (!rec) return <div key={di} />
                        const cfg = statusConfig[rec.status]
                        return (
                          <div
                            key={di}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border ${
                              rec.status === 'present' ? 'border-emerald-500/20 bg-emerald-500/5' :
                              rec.status === 'absent'  ? 'border-red-500/20 bg-red-500/5' :
                              rec.status === 'late'    ? 'border-amber-500/20 bg-amber-500/5' :
                                                         'border-blue-500/20 bg-blue-500/5'
                            }`}
                            title={`${rec.date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} — ${cfg.label}`}
                          >
                            <p className="text-[10px] font-semibold text-muted-foreground leading-none">
                              {rec.date.getDate()}
                            </p>
                            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notable events */}
          {notable.length > 0 && (
            <Card className="rounded-2xl border-border">
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
                        {rec.note && <p className="text-[10px] text-muted-foreground">{rec.note}</p>}
                      </div>
                      <Badge variant="outline" className={`text-[10px] h-5 ${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Clock in/out */}
        <div className="space-y-4">
          <Card className={`rounded-2xl border-2 transition-colors ${clockedIn ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-card'}`}>
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
                {clockTime && <p className="text-[10px] text-muted-foreground ml-auto">{clockTime}</p>}
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
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Today</p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary card */}
          <Card className="rounded-2xl border-border bg-card">
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
