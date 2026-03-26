import { Sparkles } from 'lucide-react'
import { useCurrentStudent } from '@/stores/role-store'
import { getClassesByStudent } from '@/data/mock-classes'



const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const

const subjectColors: Record<string, string> = {
  Mathematics: '#00B8A9',
  Physics: '#0EA5E9',
  Chemistry: '#10B981',
  'English Language': '#8B5CF6',
  Biology: '#F59E0B',
}

export function StudentSchedule() {
  const student = useCurrentStudent()
  const classes = student ? getClassesByStudent(student.id) : []

  const schedule: Record<string, { subject: string; time: string; room: string; color: string }[]> = {}
  for (const day of DAYS) schedule[day] = []
  for (const cls of classes) {
    for (const slot of cls.schedule) {
      schedule[slot.day]?.push({
        subject: cls.subject,
        time: slot.time,
        room: slot.room,
        color: subjectColors[cls.subject] ?? '#64748B',
      })
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Weekly Timetable</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">My Schedule</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Current semester class timetable</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {DAYS.map((day) => (
          <div key={day}>
            <p className="text-[11px] font-semibold text-muted-foreground text-center mb-2 uppercase tracking-wider">{day}</p>
            <div className="space-y-2">
              {schedule[day].length === 0 ? (
                <div className="h-16 rounded-xl border border-dashed border-border flex items-center justify-center">
                  <p className="text-[10px] text-muted-foreground">Free</p>
                </div>
              ) : (
                schedule[day].map((s) => (
                  <div
                    key={s.time}
                    className="p-2.5 rounded-xl border"
                    style={{ borderColor: `${s.color}40`, background: `${s.color}10` }}
                  >
                    <p className="text-[10px] font-semibold" style={{ color: s.color }}>{s.subject}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{s.time}</p>
                    <p className="text-[9px] text-muted-foreground">{s.room}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
