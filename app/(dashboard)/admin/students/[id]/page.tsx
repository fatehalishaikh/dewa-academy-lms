'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles, BarChart3, Calendar, BookOpen, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getStudentById } from '@/data/mock-students'
import { getClassesByStudent } from '@/data/mock-classes'
import { useHomeworkStore } from '@/stores/homework-store'
import { useAcademyStore } from '@/stores/academy-store'

// Mock attendance data for 30 days
type AttDay = { date: string; status: 'present' | 'absent' | 'late' }
function mockAttendance(studentId: string): AttDay[] {
  const records: AttDay[] = []
  const today = new Date()
  // Use studentId to vary the pattern
  const seed = studentId.charCodeAt(studentId.length - 1)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    if (dow === 5 || dow === 6) continue
    const rng = (i * seed + 7) % 20
    const status: AttDay['status'] = rng === 3 ? 'absent' : rng === 7 ? 'late' : 'present'
    records.push({ date: d.toISOString().split('T')[0], status })
  }
  return records
}

const gradeHistory = [
  { month: 'Oct', score: 72 }, { month: 'Nov', score: 75 }, { month: 'Dec', score: 78 },
  { month: 'Jan', score: 80 }, { month: 'Feb', score: 82 }, { month: 'Mar', score: 85 },
]

const teacherNotes = [
  { date: 'Mar 20, 2026', author: 'Dr. Sarah Ahmed', type: 'positive', note: 'Excellent participation in class today. Asked insightful questions about quadratic formula applications.' },
  { date: 'Mar 10, 2026', author: 'Mr. James Wilson', type: 'concern', note: 'Missed two physics lab sessions without explanation. Recommend follow-up with parents.' },
  { date: 'Feb 28, 2026', author: 'Dr. Sarah Ahmed', type: 'positive', note: 'Submitted outstanding mid-unit test. Shows strong algebraic reasoning.' },
]

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' },
  labelStyle: { color: '#e2e8f0', fontWeight: 600 },
  itemStyle: { color: '#cbd5e1' },
  cursor: { stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 },
}

const ATT_COLORS = { present: '#10B981', absent: '#EF4444', late: '#F59E0B' }

export default function StudentAnalysis() {
  const _params = useParams()
  const studentId = (_params?.id ?? '') as string
  const router = useRouter()
  const student = getStudentById(studentId ?? '')
  const classes = student ? getClassesByStudent(student.id) : []
  const { homework, getSubmissionForStudent } = useHomeworkStore()
  const { addNotification, addStudentNote } = useAcademyStore()
  const [addingNote, setAddingNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState(teacherNotes)

  if (!student) {
    return <div className="p-6 text-sm text-muted-foreground">Student not found</div>
  }

  const attendance = mockAttendance(student.id)
  const presentCount = attendance.filter(a => a.status === 'present').length
  const absentCount = attendance.filter(a => a.status === 'absent').length
  const lateCount = attendance.filter(a => a.status === 'late').length

  // Grades per class
  const classGrades = classes.map(cls => {
    const classHw = homework.filter(h => h.classId === cls.id)
    const graded = classHw
      .map(hw => ({ hw, sub: getSubmissionForStudent(hw.id, student.id) }))
      .filter(({ sub }) => sub?.grade != null)
    const avg = graded.length
      ? Math.round(graded.reduce((s, { hw, sub }) => s + (sub!.grade! / hw.totalPoints) * 100, 0) / graded.length)
      : null
    return { cls, graded, avg }
  })

  function addNote() {
    if (!noteText.trim() || !student) return
    setNotes(prev => [{ date: 'Mar 26, 2026', author: 'Dr. Sarah Ahmed', type: 'neutral', note: noteText }, ...prev])
    addStudentNote(student.id, noteText, 'admin', 'admin')
    setNoteText('')
    setAddingNote(false)
  }

  return (
    <div className="p-6 space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        All Students
      </button>

      {/* Student identity — dark hero */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #271500 55%, #0f1420 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative p-6 flex items-center gap-5 flex-wrap">
          <Avatar className="w-16 h-16 shrink-0 ring-2 ring-white/20">
            <AvatarFallback className="text-xl font-bold text-white" style={{ background: student.avatarColor }}>
              {student.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-white">{student.name}</h1>
              <span className="text-sm text-white/40">{student.nameAr}</span>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  student.status === 'at-risk'
                    ? 'border-red-500/40 text-red-300 bg-red-500/15'
                    : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/15'
                }`}
              >
                {student.status === 'at-risk' ? 'At Risk' : 'On Track'}
              </span>
            </div>
            <p className="text-sm text-white/40 mt-1">
              {student.gradeLevel} · Section {student.section} · Emirates ID: {student.emiratesId}
            </p>
            <div className="flex items-center gap-4 mt-2.5">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-xs font-semibold text-white">GPA {student.gpa.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-white">{student.attendanceRate}% Attendance</span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-xs shrink-0 bg-white/10 border border-white/15 text-white hover:bg-white/20"
            onClick={() => addNotification({
              type: 'message',
              title: 'Message from teacher',
              body: `Message sent regarding student ${student.name}`,
              recipientRole: 'parent',
              recipientId: student.parentId ?? undefined,
            })}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message Parent
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-card border border-border">
          {['overview', 'grades', 'attendance', 'ilp', 'notes'].map(tab => (
            <TabsTrigger key={tab} value={tab} className="text-xs capitalize">{tab}</TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'GPA', value: student.gpa.toFixed(1), sub: 'out of 4.0', color: '#00B8A9', trend: 'Academic score' },
              { label: 'Attendance', value: `${student.attendanceRate}%`, sub: `${absentCount} absent days`, color: student.attendanceRate >= 90 ? '#10B981' : '#F59E0B', trend: student.attendanceRate >= 90 ? 'On target' : 'Monitor' },
              { label: 'Classes', value: classes.length, sub: 'enrolled this term', color: '#0EA5E9', trend: 'This semester' },
              { label: 'Risk Level', value: student.status === 'at-risk' ? 'High' : 'Low', sub: student.status === 'at-risk' ? 'Needs attention' : 'Performing well', color: student.status === 'at-risk' ? '#EF4444' : '#10B981', trend: student.status === 'at-risk' ? 'Needs support' : 'On track' },
            ].map(({ label, value, sub, color, trend }) => (
              <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0">
                <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
                <CardContent className="p-4 pt-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="text-[11px] font-semibold" style={{ color }}>{trend}</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Grade Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={100} minWidth={0} initialDimension={{ width: 320, height: 200 }}>
                <LineChart data={gradeHistory}>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="score" stroke="#00B8A9" strokeWidth={2} dot={{ r: 2, fill: '#00B8A9' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades */}
        <TabsContent value="grades" className="space-y-4 mt-4">
          {classGrades.map(({ cls, graded, avg }) => (
            <Card key={cls.id} className="rounded-2xl border-border">
              <CardHeader className="pb-2 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">{cls.subject}</CardTitle>
                    <p className="text-[11px] text-muted-foreground">{cls.name}</p>
                  </div>
                  {avg != null ? (
                    <div className="text-right">
                      <p className={`text-xl font-bold ${avg >= 80 ? 'text-emerald-400' : avg >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{avg}%</p>
                      <p className="text-[11px] text-muted-foreground">average</p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No grades yet</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-3 space-y-1.5">
                {graded.map(({ hw, sub }) => {
                  const pct = Math.round((sub!.grade! / hw.totalPoints) * 100)
                  return (
                    <div key={hw.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{hw.title}</p>
                        <p className="text-[11px] text-muted-foreground">Due {hw.dueDate} · {hw.totalPoints} pts</p>
                      </div>
                      <p className={`text-sm font-bold ${pct >= 90 ? 'text-emerald-400' : pct >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                        {sub!.grade!}/{hw.totalPoints} ({pct}%)
                      </p>
                    </div>
                  )
                })}
                {graded.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">No graded assignments yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Present', value: presentCount, color: '#10B981' },
              { label: 'Absent', value: absentCount, color: '#EF4444' },
              { label: 'Late', value: lateCount, color: '#F59E0B' },
            ].map(({ label, value, color }) => (
              <Card key={label} className="rounded-2xl border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Calendar heatmap */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Last 30 School Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 flex-wrap">
                {attendance.map(({ date, status }) => (
                  <div
                    key={date}
                    title={`${date}: ${status}`}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold text-white"
                    style={{ background: ATT_COLORS[status] }}
                  >
                    {new Date(date).getDate()}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3">
                {Object.entries(ATT_COLORS).map(([k, c]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ background: c }} />
                    <span className="text-[11px] text-muted-foreground capitalize">{k}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ILP */}
        <TabsContent value="ilp" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Learning Style', value: 'Visual / Logical', icon: BookOpen, color: '#00B8A9' },
              { label: 'Pathway Stage', value: 'Developing', icon: TrendingUp, color: '#0EA5E9' },
              { label: 'Goals Set', value: '3 active goals', icon: CheckCircle2, color: '#10B981' },
              { label: 'ILP Status', value: 'On Track', icon: Sparkles, color: '#F59E0B' },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="rounded-2xl border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { goal: 'Improve Mathematics grade to A by end of term', progress: 70 },
                { goal: 'Complete 10 AI tutor sessions on Quadratic Equations', progress: 40 },
                { goal: 'Maintain 90%+ attendance for the semester', progress: student.attendanceRate },
              ].map(({ goal, progress }) => (
                <div key={goal} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-foreground">{goal}</p>
                    <p className="text-[11px] text-muted-foreground shrink-0 ml-2">{progress}%</p>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full">
                    <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes */}
        <TabsContent value="notes" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Teacher Notes & Observations</p>
            <Button size="sm" variant="outline" onClick={() => setAddingNote(!addingNote)} className="gap-1.5 text-xs">
              + Add Note
            </Button>
          </div>
          {addingNote && (
            <Card className="rounded-2xl border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write an observation or note about this student…"
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addNote} disabled={!noteText.trim()} className="text-xs">Save Note</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setAddingNote(false); setNoteText('') }} className="text-xs">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-3">
            {notes.map((note, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{note.author}</p>
                    {note.type === 'concern' && (
                      <Badge variant="outline" className="text-[11px] h-4 border-amber-500/30 text-amber-400">
                        <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                        Concern
                      </Badge>
                    )}
                    {note.type === 'positive' && (
                      <Badge variant="outline" className="text-[11px] h-4 border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                        Positive
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{note.date}</p>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{note.note}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
