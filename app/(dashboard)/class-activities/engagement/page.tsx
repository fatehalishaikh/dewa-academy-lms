'use client'
import { useState } from 'react'
import { Zap, AlertTriangle, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { academyClasses as mockClasses, getClassById } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { StudentNameLink } from '@/components/ui/student-name-link'

type ParticipationNote = { type: 'positive' | 'neutral' | 'concern'; text: string }

type StudentEngagement = {
  score: number  // 0–100
  flagged: boolean
  notes: ParticipationNote[]
}

function randomScore(studentId: string) {
  // deterministic mock score
  let h = 0
  for (let i = 0; i < studentId.length; i++) h = (h * 31 + studentId.charCodeAt(i)) & 0xFFFF
  return 40 + (h % 55)
}

export default function ClassActivitiesEngagement() {
  const [selectedClassId, setSelectedClassId] = useState(mockClasses[0]?.id ?? '')
  const [engagementMap, setEngagementMap] = useState<Record<string, StudentEngagement>>({})
  const [addingNote, setAddingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState<'positive' | 'neutral' | 'concern'>('positive')

  const cls = getClassById(selectedClassId)
  const students = cls?.studentIds.map(id => getStudentById(id)).filter(Boolean) ?? []

  function getEngagement(studentId: string): StudentEngagement {
    return engagementMap[studentId] ?? {
      score: randomScore(studentId),
      flagged: false,
      notes: [],
    }
  }

  function toggleFlag(studentId: string) {
    const prev = getEngagement(studentId)
    setEngagementMap(m => ({ ...m, [studentId]: { ...prev, flagged: !prev.flagged } }))
  }

  function addNote(studentId: string) {
    if (!noteText.trim()) return
    const prev = getEngagement(studentId)
    const newNote: ParticipationNote = { type: noteType, text: noteText.trim() }
    setEngagementMap(m => ({ ...m, [studentId]: { ...prev, notes: [...prev.notes, newNote] } }))
    setNoteText('')
    setAddingNote(null)
  }

  const classAvg = students.length
    ? Math.round(students.reduce((s, st) => s + (st ? getEngagement(st.id).score : 0), 0) / students.length)
    : 0

  const flaggedCount = students.filter(st => st && getEngagement(st.id).flagged).length

  return (
    <div className="space-y-4">
      {/* Controls + summary */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Class</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
          >
            {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Class Avg</p>
            <p className={`text-lg font-bold ${classAvg >= 75 ? 'text-emerald-400' : classAvg >= 55 ? 'text-amber-400' : 'text-red-400'}`}>{classAvg}%</p>
          </div>
          {flaggedCount > 0 && (
            <Badge variant="outline" className="text-[11px] border-red-500/30 text-red-400 gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />
              {flaggedCount} flagged
            </Badge>
          )}
        </div>
      </div>

      {/* Student list */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Engagement Log — {cls?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {students.map(stu => {
              if (!stu) return null
              const eng = getEngagement(stu.id)
              const isAdding = addingNote === stu.id
              return (
                <div key={stu.id} className="px-5 py-3.5 space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="text-xs font-bold text-white" style={{ background: stu.avatarColor }}>
                        {stu.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <StudentNameLink studentId={stu.id} name={stu.name} className="text-sm font-medium text-foreground" />
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${eng.score >= 75 ? 'bg-emerald-500' : eng.score >= 55 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${eng.score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${eng.score >= 75 ? 'text-emerald-400' : eng.score >= 55 ? 'text-amber-400' : 'text-red-400'}`}>
                          {eng.score}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setAddingNote(isAdding ? null : stu.id); setNoteText(''); setNoteType('positive') }}
                        className="h-7 text-[11px] gap-1"
                      >
                        <Plus className="w-3 h-3" /> Note
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFlag(stu.id)}
                        className={`h-7 text-[11px] gap-1 ${eng.flagged ? 'border-red-500/30 text-red-400 bg-red-500/10' : ''}`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {eng.flagged ? 'Flagged' : 'Flag'}
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  {eng.notes.length > 0 && (
                    <div className="pl-11 flex flex-wrap gap-1.5">
                      {eng.notes.map((note, i) => (
                        <span key={i} className={`text-[11px] px-2 py-0.5 rounded-full ${
                          note.type === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                          note.type === 'concern'  ? 'bg-red-500/10 text-red-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {note.text}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add note form */}
                  {isAdding && (
                    <div className="pl-11 flex items-center gap-2">
                      <select
                        value={noteType}
                        onChange={e => setNoteType(e.target.value as typeof noteType)}
                        className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                      >
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="concern">Concern</option>
                      </select>
                      <input
                        type="text"
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="e.g. Answered 3 questions correctly"
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                        onKeyDown={e => e.key === 'Enter' && addNote(stu.id)}
                      />
                      <Button size="sm" onClick={() => addNote(stu.id)} disabled={!noteText.trim()} className="h-7 text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Add
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
