'use client'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Mathematics:        { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  Physics:            { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  Chemistry:          { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
  'English Language': { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/30' },
  Arabic:             { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  'Social Studies':   { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/30' },
  Biology:            { bg: 'bg-lime-500/10', text: 'text-lime-600 dark:text-lime-400', border: 'border-lime-500/30' },
}

const DEFAULT_COLOR = { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30' }

type GridEntry = { subject: string; time: string; room: string }

export default function StudentSchedule() {
  const student = useCurrentStudent()
  const classes = student ? getClassesByStudent(student.id) : []

  const grid: Partial<Record<Day, Record<string, GridEntry>>> = {}
  const timeSlotSet = new Set<string>()

  for (const cls of classes) {
    for (const slot of cls.schedule) {
      const startTime = slot.time.split('–')[0].trim()
      timeSlotSet.add(startTime)
      if (!grid[slot.day]) grid[slot.day] = {}
      grid[slot.day]![startTime] = {
        subject: cls.subject,
        time: slot.time,
        room: slot.room,
      }
    }
  }

  const sortedSlots = Array.from(timeSlotSet).sort()
  const mySubjects = [...new Set(classes.map(c => c.subject))]
  const todayIndex = new Date().getDay()
  const currentDay = DAYS[todayIndex] ?? 'Sun'

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Weekly Timetable</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">Current semester class timetable</p>
      </div>

      {sortedSlots.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">No classes scheduled</p>
            <p className="text-sm text-muted-foreground mt-1">Your schedule will appear here once classes are assigned</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Subject Legend */}
          <Card className="border-border/50">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subjects:</span>
                {mySubjects.map(subject => {
                  const colors = SUBJECT_COLORS[subject] ?? DEFAULT_COLOR
                  return (
                    <div key={subject} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors.bg} border ${colors.border}`} />
                      <span className="text-sm text-foreground">{subject}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Grid */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="bg-accent/30 border-b border-border pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border bg-accent/20">
                      <th className="px-4 py-3 text-left w-24">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Day
                        </div>
                      </th>
                      {sortedSlots.map(slot => (
                        <th key={slot} className="px-3 py-3 text-center">
                          <span className="text-xs font-semibold text-muted-foreground tabular-nums">{slot}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day, rowIdx) => {
                      const isToday = day === currentDay
                      return (
                        <tr
                          key={day}
                          className={`border-b border-border last:border-0 ${isToday ? 'bg-primary/5' : rowIdx % 2 === 1 ? 'bg-accent/10' : ''}`}
                        >
                          <td className="px-4 py-3 border-r border-border">
                            <div className="flex items-center gap-2">
                              {isToday && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                              <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                                {DAY_LABELS[day]}
                              </span>
                            </div>
                          </td>
                          {sortedSlots.map(slot => {
                            const entry = grid[day]?.[slot]
                            const colors = entry ? (SUBJECT_COLORS[entry.subject] ?? DEFAULT_COLOR) : DEFAULT_COLOR
                            return (
                              <td key={slot} className="p-2">
                                {entry ? (
                                  <div className={`px-3 py-2.5 rounded-lg border ${colors.bg} ${colors.border} transition-all hover:shadow-sm`}>
                                    <p className={`text-sm font-medium ${colors.text} leading-snug`}>
                                      {entry.subject}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span className="tabular-nums">{entry.time}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                      <MapPin className="w-3 h-3" />
                                      <span>{entry.room}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-16 rounded-lg bg-muted/20 border border-transparent" />
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
