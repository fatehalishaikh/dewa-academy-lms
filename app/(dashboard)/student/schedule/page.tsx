'use client'
import { Sparkles, Clock } from 'lucide-react'
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

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Weekly Timetable</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">My Schedule</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Current semester class timetable</p>
      </div>

      {sortedSlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">No classes scheduled.</p>
      ) : (
        <div className="rounded-[10px] border border-border overflow-hidden">
          <table className="w-full table-fixed">
            {/* Column widths: day label col + one col per time slot */}
            <colgroup>
              <col className="w-[90px]" />
              {sortedSlots.map(s => <col key={s} />)}
            </colgroup>

            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-3 py-3 text-left">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
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
                            className="px-2.5 py-2 rounded-[10px] border h-full"
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
                            <p className="text-[9px] text-muted-foreground mt-0.5 tabular-nums">
                              {entry.time}
                            </p>
                            <p className="text-[9px] text-muted-foreground">{entry.room}</p>
                          </div>
                        ) : (
                          <div className="rounded-[10px] bg-muted/10 h-[58px]" />
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
