'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, Bell, CheckCircle2, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { exams } from '@/data/mock-assessments'
import { getClassById } from '@/data/mock-classes'
import { useAcademyStore } from '@/stores/academy-store'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']

// Exam type color coding
const examTypeConfig = {
  formative:  { label: 'Formative',  bg: '#0EA5E920', border: '#0EA5E9', color: '#0EA5E9' },
  summative:  { label: 'Summative',  bg: '#8B5CF620', border: '#8B5CF6', color: '#8B5CF6' },
  diagnostic: { label: 'Diagnostic', bg: '#F59E0B20', border: '#F59E0B', color: '#F59E0B' },
}

// Hard-code exam times for mock display (week of Apr 1)
const EXAM_SCHEDULE: Record<string, { day: string; time: string }> = {
  'exam-001': { day: 'Tue', time: '09:00' },
  'exam-002': { day: 'Mon', time: '10:00' },
  'exam-003': { day: 'Thu', time: '08:00' },
  'exam-004': { day: 'Wed', time: '11:00' },
}

const WEEK_LABELS = ['Mar 22–26', 'Mar 29–Apr 2', 'Apr 6–10']

export default function AssessmentsSchedule() {
  const [weekOffset, setWeekOffset] = useState(1)
  const [published, setPublished] = useState(false)
  const customExams = useAcademyStore(s => s.customExams)

  function handlePublish() {
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  // Build grid: day → time → exam
  const grid: Record<string, Record<string, typeof exams[0][]>> = {}
  DAYS.forEach(d => { grid[d] = {}; TIME_SLOTS.forEach(t => { grid[d][t] = [] }) })

  exams.forEach(exam => {
    const slot = EXAM_SCHEDULE[exam.id]
    if (slot && grid[slot.day]?.[slot.time]) {
      grid[slot.day][slot.time].push(exam)
    }
  })

  // Detect conflicts: same room, same slot
  type Conflict = { day: string; time: string; room: string; exams: string[] }
  const conflicts: Conflict[] = [
    { day: 'Mon', time: '10:00', room: 'B201', exams: ['Physics Quiz', 'Math Review'] },
  ]

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(o => Math.max(0, o - 1))} disabled={weekOffset === 0} className="w-8 h-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-foreground w-28 text-center">{WEEK_LABELS[weekOffset] ?? 'Apr 13–17'}</span>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(o => o + 1)} disabled={weekOffset >= 2} className="w-8 h-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {published && (
            <Badge variant="outline" className="text-[11px] border-emerald-500/30 text-emerald-400 gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Schedule published!
            </Badge>
          )}
          <Button size="sm" onClick={handlePublish} disabled={published} className="gap-1.5 text-xs">
            <Bell className="w-3.5 h-3.5" /> Publish Schedule
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-16">Time</th>
                {DAYS.map(d => (
                  <th key={d} className="text-center px-3 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time, i) => (
                <tr key={time} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/5'}`}>
                  <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{time}</td>
                  {DAYS.map(day => {
                    const slotExams = weekOffset === 1 ? (grid[day]?.[time] ?? []) : []
                    return (
                      <td key={day} className="px-2 py-1.5 align-top">
                        <div className="space-y-1">
                          {slotExams.map(exam => {
                            const cfg = examTypeConfig[exam.examType]
                            const cls = getClassById(exam.classId)
                            return (
                              <div
                                key={exam.id}
                                className="px-2 py-1.5 rounded-lg text-[11px] leading-tight"
                                style={{ background: cfg.bg, borderLeft: `2px solid ${cfg.border}` }}
                              >
                                <p className="font-semibold truncate" style={{ color: cfg.color }}>{exam.title.split('—')[0].trim()}</p>
                                <p className="text-muted-foreground">{cls?.name ?? '—'} · {exam.duration}min</p>
                                <p className="text-muted-foreground">Room {exam.room}</p>
                              </div>
                            )
                          })}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Newly published exams (from store) */}
      {customExams.length > 0 && (
        <Card className="rounded-2xl border-primary/20">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Newly Published ({customExams.length})
            </CardTitle>
          </CardHeader>
          <div className="divide-y divide-border">
            {customExams.map(exam => {
              const cls = getClassById(exam.classId)
              const cfg = examTypeConfig[exam.examType]
              return (
                <div key={exam.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{exam.title}</p>
                      {exam.adaptive?.enabled && (
                        <Badge variant="outline" className="text-[11px] h-4 border-primary/30 text-primary gap-0.5">
                          <Brain className="w-2.5 h-2.5" /> Adaptive
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {cls?.name ?? '—'} · {exam.date} · {exam.duration} min · Room {exam.room}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px] shrink-0" style={{ borderColor: `${cfg.color}50`, color: cfg.color }}>
                    {cfg.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(examTypeConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && weekOffset === 1 && (
        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Scheduling Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <Badge variant="outline" className="text-[11px] border-amber-500/30 text-amber-400 shrink-0">{c.day} {c.time}</Badge>
                <span className="text-muted-foreground">Room {c.room}:</span>
                <span className="text-foreground">{c.exams.join(' & ')} both scheduled</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
