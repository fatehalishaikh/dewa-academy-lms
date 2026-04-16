'use client'
import { Calendar, Clock, BookOpen, LayoutGrid } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrentStudent } from '@/stores/role-store'
import { getClassesByStudent } from '@/data/mock-classes'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const
type Day = typeof DAYS[number]

const DAY_LABELS: Record<Day, string> = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:       '#00B8A9',
  Physics:           '#0EA5E9',
  Chemistry:         '#10B981',
  'English Language':'#8B5CF6',
  Arabic:            '#F59E0B',
  'Social Studies':  '#EC4899',
  Biology:           '#84CC16',
}

type GridEntry = { subject: string; time: string; room: string; color: string }

export default function StudentSchedule() {
  const student = useCurrentStudent()
  const classes = student ? getClassesByStudent(student.id) : []

  // Build grid[day][startTime]
  const grid: Partial<Record<Day, Record<string, GridEntry>>> = {}
  const timeSlotSet = new Set<string>()

  for (const cls of classes) {
    for (const slot of cls.schedule) {
      const startTime = slot.time.split('–')[0].trim()   // "08:00"
      timeSlotSet.add(startTime)
      if (!grid[slot.day]) grid[slot.day] = {}
      grid[slot.day]![startTime] = {
        subject: cls.subject,
        time: slot.time,
        room: slot.room,
        color: SUBJECT_COLORS[cls.subject] ?? '#64748B',
      }
    }
  }

  const sortedSlots = Array.from(timeSlotSet).sort()

  // Subject legend: only subjects this student actually has
  const mySubjects = [...new Set(classes.map(c => c.subject))]

  const totalSlots = sortedSlots.length
  const classesPerDay = DAYS.map(day => Object.keys(grid[day] ?? {}).length)
  const busiest = DAYS[classesPerDay.indexOf(Math.max(...classesPerDay))]
  const todayDay = DAYS[new Date().getDay() === 0 || new Date().getDay() === 5 || new Date().getDay() === 6 ? 0 : new Date().getDay()]
  const todayCount = Object.keys(grid[todayDay as Day] ?? {}).length

  return (
    <div className="p-6 space-y-5">

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
              style={{ background: 'color-mix(in srgb, var(--accent-student) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-student) 30%, transparent)' }}
            >
              <Calendar className="w-5 h-5" style={{ color: 'var(--accent-student)' }} />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Student Portal</p>
              <h1 className="text-xl font-bold text-white mt-0.5">Schedule</h1>
              <p className="text-white/40 text-sm mt-0.5">Current semester weekly timetable</p>
            </div>
          </div>

          {/* Right — today's count + total subjects */}
          <div className="lg:col-span-2 px-7 py-6 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: 'rgba(0,184,169,0.12)', border: '5px solid rgba(0,184,169,0.35)' }}>
                <span className="text-xl font-bold text-white">{todayCount}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Today</p>
                <p className="text-[11px] text-white/35">classes</p>
              </div>
            </div>
            <div className="w-px h-14 bg-white/[0.08]" />
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.12)', border: '5px solid rgba(14,165,233,0.35)' }}>
                <span className="text-xl font-bold text-white">{mySubjects.length}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Subjects</p>
                <p className="text-[11px] text-white/35">this term</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Subjects',      value: mySubjects.length, color: 'var(--accent-student)', icon: BookOpen,   trend: 'This semester' },
          { label: "Today's Classes", value: todayCount,      color: '#0EA5E9',               icon: Calendar,   trend: todayDay },
          { label: 'Time Slots',    value: totalSlots,        color: '#F59E0B',               icon: Clock,      trend: 'Per day' },
          { label: 'Busiest Day',   value: busiest,           color: '#10B981',               icon: LayoutGrid, trend: `${Math.max(...classesPerDay)} classes` },
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

      {sortedSlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">No classes scheduled.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full table-fixed">
            {/* Column widths: day label col + one col per time slot */}
            <colgroup>
              <col className="w-[90px]" />
              {sortedSlots.map(s => <col key={s} />)}
            </colgroup>

            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-3 py-3 text-left">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    Day
                  </div>
                </th>
                {sortedSlots.map(slot => (
                  <th key={slot} className="px-2 py-3 text-center text-[11px] font-semibold text-muted-foreground tabular-nums">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {DAYS.map((day, rowIdx) => (
                <tr
                  key={day}
                  className={`border-b border-border last:border-0 ${rowIdx % 2 === 1 ? 'bg-muted/5' : ''}`}
                >
                  {/* Day label */}
                  <td className="px-3 py-2 align-middle border-r border-border">
                    <span className="text-[11px] font-semibold text-foreground">{DAY_LABELS[day]}</span>
                  </td>

                  {/* Time slot cells */}
                  {sortedSlots.map(slot => {
                    const entry = grid[day]?.[slot]
                    return (
                      <td key={slot} className="p-1.5 align-top">
                        {entry ? (
                          <div
                            className="px-2.5 py-2 rounded-xl border h-full"
                            style={{
                              borderColor: `${entry.color}50`,
                              background: `${entry.color}14`,
                            }}
                          >
                            <p
                              className="text-[11px] font-semibold leading-snug"
                              style={{ color: entry.color }}
                            >
                              {entry.subject}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                              {entry.time}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{entry.room}</p>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-muted/10 h-[58px]" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subject legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {mySubjects.map(subject => (
          <div key={subject} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: SUBJECT_COLORS[subject] ?? '#64748B' }}
            />
            <span className="text-[11px] text-muted-foreground">{subject}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
