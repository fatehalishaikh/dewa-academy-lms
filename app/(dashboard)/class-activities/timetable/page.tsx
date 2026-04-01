'use client'
import { useState } from 'react'
import { Sparkles, Wand2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { academyClasses as mockClasses } from '@/data/mock-classes'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const TIME_SLOTS = [...new Set(mockClasses.flatMap(cls => cls.schedule.map(s => s.time)))].sort()

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': '#00B8A9',
  'Physics': '#0EA5E9',
  'English': '#8B5CF6',
  'Chemistry': '#F59E0B',
  'Biology': '#10B981',
  'History': '#EC4899',
  'Arabic': '#EF4444',
}

type ConflictInfo = { slot: string; day: string; room: string; classes: string[] }

export default function ClassActivitiesTimetable() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimized, setOptimized] = useState(false)

  // Build a lookup: day → time → class info
  const timetableMap: Record<string, Record<string, { name: string; subject: string; room: string; teacher: string }[]>> = {}
  DAYS.forEach(d => { timetableMap[d] = {} })

  mockClasses.forEach(cls => {
    cls.schedule.forEach(slot => {
      if (!timetableMap[slot.day]) return
      if (!timetableMap[slot.day][slot.time]) timetableMap[slot.day][slot.time] = []
      timetableMap[slot.day][slot.time].push({
        name: cls.name,
        subject: cls.subject,
        room: slot.room,
        teacher: cls.teacherId,
      })
    })
  })

  // Find conflicts (same room, same time, same day, multiple classes)
  const conflicts: ConflictInfo[] = []
  DAYS.forEach(day => {
    TIME_SLOTS.forEach(time => {
      const entries = timetableMap[day]?.[time] ?? []
      const roomGroups: Record<string, string[]> = {}
      entries.forEach(e => {
        if (!roomGroups[e.room]) roomGroups[e.room] = []
        roomGroups[e.room].push(e.name)
      })
      Object.entries(roomGroups).forEach(([room, classes]) => {
        if (classes.length > 1) conflicts.push({ slot: time, day, room, classes })
      })
    })
  })

  const [optimizeSummary, setOptimizeSummary] = useState<string | null>(null)

  async function handleOptimize() {
    setIsOptimizing(true)
    try {
      const res = await fetch('/api/ai/timetable/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflicts,
          totalClasses: mockClasses.length,
          totalSessions: mockClasses.reduce((s, c) => s + c.schedule.length, 0),
        }),
      })
      if (res.ok) {
        const data = await res.json() as { summary?: string }
        setOptimizeSummary(data.summary ?? null)
        setOptimized(true)
      }
    } catch { /* silent */ }
    finally { setIsOptimizing(false) }
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Weekly Timetable — Spring 2026</h2>
          <p className="text-xs text-muted-foreground">{mockClasses.length} classes · {mockClasses.reduce((s, c) => s + c.schedule.length, 0)} sessions/week</p>
        </div>
        <div className="flex items-center gap-2">
          {conflicts.length > 0 && !optimized && (
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />
              {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''}
            </Badge>
          )}
          {optimized && (
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              AI Optimized
            </Badge>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleOptimize}
            disabled={isOptimizing || optimized}
            className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            {isOptimizing ? (
              <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Optimizing…</>
            ) : (
              <><Wand2 className="w-3 h-3" /> Auto-optimize</>
            )}
          </Button>
        </div>
      </div>

      {/* Timetable grid */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20">Time</th>
                {DAYS.map(d => (
                  <th key={d} className="text-center px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time, i) => (
                <tr key={time} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/5'}`}>
                  <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{time}</td>
                  {DAYS.map(day => {
                    const entries = timetableMap[day]?.[time] ?? []
                    return (
                      <td key={day} className="px-2 py-1.5 align-top">
                        <div className="space-y-1">
                          {entries.map((entry, j) => {
                            const color = SUBJECT_COLORS[entry.subject] ?? '#6B7280'
                            return (
                              <div
                                key={j}
                                className="px-2 py-1.5 rounded-lg text-[10px] leading-tight cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ background: `${color}20`, borderLeft: `2px solid ${color}` }}
                              >
                                <p className="font-semibold truncate" style={{ color }}>{entry.name}</p>
                                <p className="text-muted-foreground truncate">Room {entry.room}</p>
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

      {/* Subject legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
          <div key={subject} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {subject}
          </div>
        ))}
      </div>

      {/* AI optimization summary */}
      {optimized && optimizeSummary && (
        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-xs text-foreground">{optimizeSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Conflicts panel */}
      {conflicts.length > 0 && !optimized && (
        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Room Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 shrink-0">{c.day} {c.slot}</Badge>
                <span className="text-muted-foreground">Room {c.room}:</span>
                <span className="text-foreground">{c.classes.join(' & ')}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
