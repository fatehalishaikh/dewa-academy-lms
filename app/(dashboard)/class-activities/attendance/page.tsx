'use client'
import { useState } from 'react'
import { Sparkles, Wand2, CheckCircle2, XCircle, Clock, Users, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { academyClasses as mockClasses, getClassById } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { StudentNameLink } from '@/components/ui/student-name-link'
import { useAttendanceStore, type AttendanceStatus } from '@/stores/attendance-store'

const TODAY = new Date().toISOString().split('T')[0]

const statusConfig: Record<AttendanceStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  present: { label: 'Present', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  late:    { label: 'Late',    color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30',   icon: Clock        },
  absent:  { label: 'Absent',  color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/30',       icon: XCircle      },
}

export default function ClassActivitiesAttendance() {
  const [selectedClassId, setSelectedClassId] = useState(mockClasses[0]?.id ?? '')
  const [date, setDate] = useState(TODAY)
  const [localMap, setLocalMap] = useState<Record<string, AttendanceStatus>>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [saved, setSaved] = useState(false)

  const { saveAttendance, getAttendanceMap } = useAttendanceStore()
  const cls = getClassById(selectedClassId)
  const students = cls?.studentIds.map(id => getStudentById(id)).filter(Boolean) ?? []

  // Merge saved + local
  const savedMap = getAttendanceMap(date, selectedClassId)
  const effectiveMap: Record<string, AttendanceStatus> = {}
  students.forEach(s => {
    if (s) effectiveMap[s.id] = localMap[s.id] ?? savedMap[s.id] ?? 'present'
  })

  function setStatus(studentId: string, status: AttendanceStatus) {
    setLocalMap(prev => ({ ...prev, [studentId]: status }))
    setSaved(false)
  }

  function markAll(status: AttendanceStatus) {
    const all: Record<string, AttendanceStatus> = {}
    students.forEach(s => { if (s) all[s.id] = status })
    setLocalMap(all)
    setSaved(false)
  }

  function handleAiVerify() {
    setIsVerifying(true)
    setTimeout(() => {
      // AI "detects" 1-2 students as late instead of present (mock)
      const updates: Record<string, AttendanceStatus> = { ...effectiveMap }
      students.slice(0, 2).forEach(s => {
        if (s && updates[s.id] === 'present') updates[s.id] = 'late'
      })
      setLocalMap(updates)
      setIsVerifying(false)
    }, 1800)
  }

  function handleSave() {
    saveAttendance(date, selectedClassId, effectiveMap)
    setLocalMap({})
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const presentCount = Object.values(effectiveMap).filter(s => s === 'present').length
  const lateCount = Object.values(effectiveMap).filter(s => s === 'late').length
  const absentCount = Object.values(effectiveMap).filter(s => s === 'absent').length
  const total = students.length

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Class</label>
          <select
            value={selectedClassId}
            onChange={e => { setSelectedClassId(e.target.value); setLocalMap({}); setSaved(false) }}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
          >
            {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setLocalMap({}); setSaved(false) }}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button size="sm" variant="outline" onClick={() => markAll('present')} className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <CheckCircle2 className="w-3 h-3" /> All Present
          </Button>
          <Button size="sm" variant="outline" onClick={() => markAll('absent')} className="h-7 text-xs gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
            <XCircle className="w-3 h-3" /> All Absent
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAiVerify}
            disabled={isVerifying}
            className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
          >
            {isVerifying ? (
              <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Verifying…</>
            ) : (
              <><Wand2 className="w-3 h-3" /> AI Verify</>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Present', count: presentCount, color: '#10B981', icon: CheckCircle2 },
          { label: 'Late',    count: lateCount,    color: '#F59E0B', icon: Clock        },
          { label: 'Absent',  count: absentCount,  color: '#EF4444', icon: XCircle      },
        ].map(({ label, count, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{count}<span className="text-xs text-muted-foreground font-normal">/{total}</span></p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student list */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {cls?.name ?? 'Select a class'} — {students.length} students
            </CardTitle>
            {isVerifying && (
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <Sparkles className="w-3 h-3" />
                AI scanning facial recognition…
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {students.map(stu => {
              if (!stu) return null
              const status = effectiveMap[stu.id] ?? 'present'
              return (
                <div key={stu.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs font-bold text-white" style={{ background: stu.avatarColor }}>
                      {stu.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <StudentNameLink studentId={stu.id} name={stu.name} className="text-sm font-medium text-foreground" />
                    <p className="text-[10px] text-muted-foreground">Grade {stu.gradeLevel}{stu.section}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(Object.keys(statusConfig) as AttendanceStatus[]).map(s => {
                      const cfg = statusConfig[s]
                      const Icon = cfg.icon
                      const isSelected = status === s
                      return (
                        <button
                          key={s}
                          onClick={() => setStatus(stu.id, s)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-all ${
                            isSelected
                              ? `${cfg.bg} ${cfg.color}`
                              : 'border-border text-muted-foreground hover:border-border/70'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <Button onClick={handleSave} disabled={saved} className="gap-1.5">
        {saved ? (
          <><CheckCircle2 className="w-4 h-4" /> Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> Save Attendance</>
        )}
      </Button>
    </div>
  )
}
