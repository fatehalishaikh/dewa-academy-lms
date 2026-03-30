'use client'
import { useState } from 'react'
import { Sparkles, Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
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

// Deterministic attendance — seeded by studentId so it's stable across renders
function generateAttendance(studentId: string): AttRecord[] {
  let seed = 0
  for (const c of studentId) seed = (seed * 31 + c.charCodeAt(0)) & 0xffff

  const records: AttRecord[] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    if (d.getDay() === 5 || d.getDay() === 6) continue // skip Fri/Sat (UAE weekend)
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    const r = seed % 10
    const status: AttStatus = r < 7 ? 'present' : r < 8 ? 'late' : r < 9 ? 'absent' : 'excused'
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

export default function ParentAttendance() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)

  const [selectedIdx, setSelectedIdx] = useState(0)
  const selectedChild = children[selectedIdx]

  // Pre-generate attendance for every child
  const attByChild: Record<string, AttRecord[]> = {}
  const lookupByChild: Record<string, Record<string, AttRecord>> = {}
  for (const child of children) {
    if (!child) continue
    const records = generateAttendance(child.id)
    attByChild[child.id] = records
    lookupByChild[child.id] = Object.fromEntries(records.map(r => [r.dateKey, r]))
  }

  const selectedAtt = selectedChild ? (attByChild[selectedChild.id] ?? []) : []
  const totalDays   = selectedAtt.length
  const presentDays = selectedAtt.filter(a => a.status === 'present' || a.status === 'late').length
  const absentDays  = selectedAtt.filter(a => a.status === 'absent').length
  const lateDays    = selectedAtt.filter(a => a.status === 'late').length

  // Build calendar weeks from the first child's records (all share the same school days)
  const baseRecords = children[0] ? (attByChild[children[0].id] ?? []) : []
  const weeks: (AttRecord | null)[][] = []
  let week: (AttRecord | null)[] = []
  for (const rec of baseRecords) {
    if (rec.date.getDay() === 0 && week.length > 0) { weeks.push(week); week = [] }
    week.push(rec)
  }
  if (week.length > 0) weeks.push(week)

  if (!parent || children.length === 0) return (
    <div className="p-6"><p className="text-sm text-muted-foreground">No children found.</p></div>
  )

  const multiChild = children.length > 1

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Attendance Records</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">
          {multiChild ? "Children's Attendance" : `${children[0]?.name}'s Attendance`}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Last 30 school days</p>
      </div>

      {/* Child selector — only shown when multiple children */}
      {multiChild && (
        <div className="flex items-center gap-2 flex-wrap">
          {children.map((child, i) => child && (
            <button
              key={child.id}
              onClick={() => setSelectedIdx(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
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
          <span className="text-[11px] text-muted-foreground ml-1">Stats &amp; events shown for selected child</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Attendance Rate', value: `${Math.round((presentDays / totalDays) * 100)}%`, color: '#00B8A9', icon: Calendar     },
          { label: 'Present',         value: presentDays,                                         color: '#10B981', icon: CheckCircle2 },
          { label: 'Absent',          value: absentDays,                                          color: '#EF4444', icon: XCircle      },
          { label: 'Late',            value: lateDays,                                            color: '#F59E0B', icon: Clock        },
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
              {multiChild && selectedChild && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{selectedChild.name.split(' ')[0]}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
        {multiChild && (
          <>
            <div className="w-px h-3 bg-border mx-1" />
            {children.map((child, i) => child && (
              <div key={child.id} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: child.avatarColor }}
                />
                <span className="text-[11px] text-muted-foreground">
                  dot {i + 1} = {child.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </>
        )}
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
                    return (
                      <div
                        key={di}
                        className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border border-border bg-card"
                      >
                        <p className="text-[10px] font-semibold text-muted-foreground leading-none">
                          {rec.date.getDate()}
                        </p>
                        {/* One dot per child */}
                        <div className="flex gap-0.5">
                          {children.map(child => {
                            if (!child) return null
                            const childRec = lookupByChild[child.id]?.[rec.dateKey]
                            const cfg = childRec ? statusConfig[childRec.status] : null
                            return (
                              <div
                                key={child.id}
                                className={`w-2 h-2 rounded-full ${cfg?.dot ?? 'bg-muted/30'}`}
                                title={`${child.name.split(' ')[0]}: ${cfg?.label ?? '—'}`}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notable events for selected child */}
      {selectedAtt.filter(a => a.status !== 'present').length > 0 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Notable Events{multiChild && selectedChild ? ` — ${selectedChild.name.split(' ')[0]}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedAtt.filter(a => a.status !== 'present').map((rec, i) => {
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
