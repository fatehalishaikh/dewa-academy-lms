'use client'
import { Sparkles, TableProperties, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { StudentNameLink } from '@/components/ui/student-name-link'
import { useState } from 'react'
import { useSubjectStore } from '@/stores/subject-store'
import { useHomeworkStore } from '@/stores/homework-store'
import { subjectColor } from '@/lib/subject-colors'

function gradeCell(pct: number | null) {
  if (pct === null) return { label: '—', bg: 'bg-muted/30', text: 'text-muted-foreground' }
  if (pct >= 90) return { label: `${pct}%`, bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
  if (pct >= 75) return { label: `${pct}%`, bg: 'bg-amber-500/10', text: 'text-amber-400' }
  return { label: `${pct}%`, bg: 'bg-red-500/10', text: 'text-red-400' }
}

export default function TeacherGradebook() {
  const teacher = useCurrentTeacher()
  const { activeSubject } = useSubjectStore()
  const { homework, getSubmissionsForHomework, getSubmissionForStudent } = useHomeworkStore()

  const allClasses = teacher ? getClassesByTeacher(teacher.id) : []
  const classes = activeSubject === 'all' ? allClasses : allClasses.filter(c => c.subject === activeSubject)
  const [selectedClass, setSelectedClass] = useState('')

  const effectiveClass = selectedClass && classes.find(c => c.id === selectedClass)
    ? selectedClass
    : classes[0]?.id ?? ''

  const cls = classes.find(c => c.id === effectiveClass)
  const classStudents = cls ? cls.studentIds.map(id => getStudentById(id)).filter(Boolean) : []

  // Dynamic homework for selected class
  const classHomework = cls
    ? homework.filter(h => h.classId === cls.id && h.status !== 'draft')
    : []

  const clsColor = cls ? subjectColor(cls.subject) : 'var(--accent-teacher)'

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Grade Management</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Gradebook</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeSubject === 'all' ? 'All subjects' : activeSubject} · {classes.length} class{classes.length !== 1 ? 'es' : ''}
          </p>
        </div>
        {/* Class selector */}
        <div className="relative">
          <select
            value={effectiveClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="appearance-none bg-card border border-border rounded-xl px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      <Card className="rounded-2xl border-border overflow-hidden">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <TableProperties className="w-4 h-4 text-primary" />
            {cls ? (
              <span className="flex items-center gap-2">
                {cls.name}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold" style={{ background: `${clsColor}18`, color: clsColor }}>
                  {cls.subject}
                </span>
              </span>
            ) : 'Select a class'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-48">Student</th>
                  {classHomework.map(hw => (
                    <th key={hw.id} className="px-3 py-3 text-center">
                      <p className="text-[11px] font-semibold text-foreground truncate max-w-[100px]">{hw.title.split(' ').slice(0, 3).join(' ')}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(hw.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} · {hw.totalPoints}pts
                      </p>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Average</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((stu) => {
                  if (!stu) return null
                  const gradePcts = classHomework.map(hw => {
                    const sub = getSubmissionForStudent(hw.id, stu.id)
                    const g = sub?.grade
                    return g != null ? Math.round((g / hw.totalPoints) * 100) : null
                  })
                  const validPcts = gradePcts.filter(p => p != null) as number[]
                  const avg = validPcts.length ? Math.round(validPcts.reduce((s, g) => s + g, 0) / validPcts.length) : null
                  return (
                    <tr key={stu.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: stu.avatarColor }}>
                            {stu.initials}
                          </div>
                          <StudentNameLink studentId={stu.id} name={stu.name} className="text-xs font-medium text-foreground truncate" />
                        </div>
                      </td>
                      {classHomework.map((hw, i) => {
                        const sub = getSubmissionForStudent(hw.id, stu.id)
                        const cell = gradeCell(gradePcts[i])
                        const isPending = sub?.status === 'submitted' || sub?.status === 'late'
                        return (
                          <td key={hw.id} className="px-3 py-3 text-center">
                            {gradePcts[i] != null ? (
                              <span className={`inline-flex items-center justify-center w-12 h-7 rounded-lg text-xs font-bold ${cell.bg} ${cell.text}`}>
                                {cell.label}
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center justify-center w-12 h-7 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400">
                                Pend.
                              </span>
                            ) : (
                              <span className={`inline-flex items-center justify-center w-12 h-7 rounded-lg text-xs font-bold ${cell.bg} ${cell.text}`}>
                                {cell.label}
                              </span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-3 py-3 text-center">
                        {avg != null ? (
                          <span className={`text-sm font-bold ${avg >= 90 ? 'text-emerald-400' : avg >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                            {avg}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* Class Average row */}
              <tfoot>
                <tr className="bg-muted/30 border-t border-border">
                  <td className="px-4 py-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Class Average</p>
                  </td>
                  {classHomework.map(hw => {
                    const subs = getSubmissionsForHomework(hw.id)
                    const gradedPcts = subs
                      .filter(s => s.grade != null)
                      .map(s => Math.round((s.grade! / hw.totalPoints) * 100))
                    const avg = gradedPcts.length ? Math.round(gradedPcts.reduce((s, v) => s + v, 0) / gradedPcts.length) : null
                    return (
                      <td key={hw.id} className="px-3 py-2 text-center">
                        {avg != null ? (
                          <span className={`text-sm font-bold ${avg >= 90 ? 'text-emerald-400' : avg >= 75 ? 'text-amber-400' : 'text-red-400'}`}>{avg}%</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    )
                  })}
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          {classHomework.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No published assignments for this class yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20" />90–100% (A)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20" />75–89% (B/C)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/20" />Below 75% (D/F)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/20 text-blue-400" />Pending grading</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted/50" />Not submitted</div>
      </div>
    </div>
  )
}
