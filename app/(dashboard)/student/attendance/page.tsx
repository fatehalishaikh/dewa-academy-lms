'use client'
import { useState } from 'react'
import {
  Calendar, CheckCircle2, XCircle, Clock,
  AlertCircle, LogIn, LogOut, Fingerprint, TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrentStudent } from '@/stores/role-store'

type AttStatus = 'present' | 'absent' | 'late' | 'excused'

const statusConfig: Record<AttStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  present: { label: 'Present', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle2 },
  absent:  { label: 'Absent',  color: 'text-red-500',    bg: 'bg-red-500',     icon: XCircle     },
  late:    { label: 'Late',    color: 'text-amber-500',  bg: 'bg-amber-500',   icon: Clock       },
  excused: { label: 'Excused', color: 'text-blue-500',   bg: 'bg-blue-500',    icon: AlertCircle },
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">My Attendance</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Your attendance record for the last 30 school days</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Attendance Rate', value: `${rate}%`, color: 'text-primary', bg: 'bg-primary/10', icon: TrendingUp },
              { label: 'Present', value: presentDays, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
              { label: 'Absent', value: absentDays, color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
              { label: 'Late', value: lateDays, color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
            ].map(({ label, value, color, bg, icon: Icon }) => (
              <Card key={label} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <Card className="border-border/50">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-6">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${cfg.bg}`} />
                    <span className="text-sm text-muted-foreground">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                Attendance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map(d => (
                    <p key={d} className="text-xs font-semibold text-muted-foreground text-center">{d}</p>
                  ))}
                </div>
                <div className="space-y-2">
                  {weeks.map((wk, wi) => {
                    const dayOfFirst = wk[0]!.date.getDay()
                    const padded = (Array(dayOfFirst).fill(null) as (AttRecord | null)[]).concat(wk)
                    return (
                      <div key={wi} className="grid grid-cols-5 gap-2">
                        {padded.slice(0, 5).map((rec, di) => {
                          if (!rec) return <div key={di} />
                          const cfg = statusConfig[rec.status]
                          return (
                            <div
                              key={di}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all hover:scale-105 ${
                                rec.status === 'present' ? 'border-emerald-500/20 bg-emerald-500/5' :
                                rec.status === 'absent'  ? 'border-red-500/20 bg-red-500/5' :
                                rec.status === 'late'    ? 'border-amber-500/20 bg-amber-500/5' :
                                                           'border-blue-500/20 bg-blue-500/5'
                              }`}
                              title={`${rec.date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} - ${cfg.label}`}
                            >
                              <p className="text-xs font-semibold text-muted-foreground leading-none">
                                {rec.date.getDate()}
                              </p>
                              <div className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notable Events */}
          {notable.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Notable Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notable.slice(0, 5).map((rec, i) => {
                  const cfg = statusConfig[rec.status]
                  const Icon = cfg.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg}/10 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {rec.date.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        {rec.note && <p className="text-xs text-muted-foreground truncate">{rec.note}</p>}
                      </div>
                      <Badge variant="outline" className={`${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Clock In/Out Card */}
          <Card className={`border-2 transition-all duration-300 ${clockedIn ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${clockedIn ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                  <Fingerprint className={`w-4 h-4 ${clockedIn ? 'text-emerald-500' : 'text-primary'}`} />
                </div>
                Today&apos;s Check-In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${clockedIn ? 'bg-emerald-500/10' : 'bg-accent/50'}`}>
                <div className={`w-3 h-3 rounded-full ${clockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${clockedIn ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {clockedIn ? 'Checked In' : 'Not Checked In'}
                  </p>
                  {clockTime && <p className="text-xs text-muted-foreground">at {clockTime}</p>}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {clockedIn
                  ? 'You are currently checked in. Tap to check out when leaving.'
                  : 'Tap the button below to record your arrival.'}
              </p>

              <Button
                onClick={handleClock}
                className={`w-full gap-2 ${clockedIn ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30' : ''}`}
                variant={clockedIn ? 'outline' : 'default'}
              >
                {clockedIn
                  ? <><LogOut className="w-4 h-4" />Clock Out</>
                  : <><LogIn className="w-4 h-4" />Clock In</>}
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Today</p>
                <p className="text-sm text-foreground">
                  {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: 'Overall Rate', value: `${rate}%`, color: rate >= 90 ? 'text-emerald-500' : rate >= 75 ? 'text-amber-500' : 'text-red-500' },
                  { label: 'Days Attended', value: `${presentDays + lateDays}/${totalDays}`, color: 'text-foreground' },
                  { label: 'Punctual Days', value: `${presentDays}/${totalDays}`, color: 'text-foreground' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className={`text-sm font-semibold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
              
              <div className={`px-4 py-3 rounded-xl text-center ${
                rate >= 90 ? 'bg-emerald-500/10 text-emerald-500' :
                rate >= 75 ? 'bg-amber-500/10 text-amber-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                <p className="text-sm font-medium">
                  {rate >= 90 ? 'Excellent attendance!' : rate >= 75 ? 'Attendance needs improvement' : 'At-risk - contact your teacher'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
