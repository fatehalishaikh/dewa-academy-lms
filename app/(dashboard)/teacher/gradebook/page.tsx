'use client'
import { Sparkles, TableProperties, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { StudentNameLink } from '@/components/ui/student-name-link'
import { useState } from 'react'

// Mock grade data for the gradebook
const gradeData: Record<string, Record<string, number | null>> = {
  'stu-001': { 'hw-001': 92, 'hw-002': 85, 'hw-003': null },
  'stu-004': { 'hw-001': 78, 'hw-002': null, 'hw-003': null },
  'stu-012': { 'hw-001': 88, 'hw-002': 91, 'hw-003': null },
}

const assignments = [
  { id: 'hw-001', title: 'Quadratic Equations', dueDate: 'Mar 27', points: 20 },
  { id: 'hw-002', title: 'Statistics Ex.', dueDate: 'Mar 29', points: 15 },
  { id: 'hw-003', title: 'Algebra Review', dueDate: 'Apr 3', points: 25 },
]

function gradeCell(grade: number | null) {
  if (grade === null) return { label: '—', bg: 'bg-muted/30', text: 'text-muted-foreground' }
  if (grade >= 90) return { label: `${grade}`, bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
  if (grade >= 75) return { label: `${grade}`, bg: 'bg-amber-500/10', text: 'text-amber-400' }
  return { label: `${grade}`, bg: 'bg-red-500/10', text: 'text-red-400' }
}

export default function TeacherGradebook() {
  const teacher = useCurrentTeacher()
  const classes = teacher ? getClassesByTeacher(teacher.id) : []
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id ?? '')

  const cls = classes.find(c => c.id === selectedClass)
  const classStudents = cls ? cls.studentIds.map(id => getStudentById(id)).filter(Boolean) : []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Grade Management</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Gradebook</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View and manage student grades</p>
        </div>
        {/* Class selector */}
        <div className="relative">
          <select
            value={selectedClass}
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
            {cls?.name ?? 'Select a class'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-48">Student</th>
                  {assignments.map(a => (
                    <th key={a.id} className="px-3 py-3 text-center">
                      <p className="text-[10px] font-semibold text-foreground truncate max-w-[100px]">{a.title}</p>
                      <p className="text-[9px] text-muted-foreground">Due {a.dueDate} · {a.points}pts</p>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Average</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((stu) => {
                  if (!stu) return null
                  const grades = gradeData[stu.id] ?? {}
                  const validGrades = assignments.map(a => grades[a.id]).filter(g => g != null) as number[]
                  const avg = validGrades.length ? Math.round(validGrades.reduce((s, g) => s + g, 0) / validGrades.length) : null
                  return (
                    <tr key={stu.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: stu.avatarColor }}>
                            {stu.initials}
                          </div>
                          <StudentNameLink studentId={stu.id} name={stu.name} className="text-xs font-medium text-foreground truncate" />
                        </div>
                      </td>
                      {assignments.map(a => {
                        const cell = gradeCell(grades[a.id] ?? null)
                        return (
                          <td key={a.id} className="px-3 py-3 text-center">
                            <span className={`inline-flex items-center justify-center w-10 h-7 rounded-lg text-xs font-bold ${cell.bg} ${cell.text}`}>
                              {cell.label}
                            </span>
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
              {/* Summary row */}
              <tfoot>
                <tr className="bg-muted/30 border-t border-border">
                  <td className="px-4 py-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Class Average</p>
                  </td>
                  {assignments.map(a => {
                    const vals = classStudents.map(s => s && gradeData[s.id]?.[a.id]).filter(v => v != null) as number[]
                    const avg = vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null
                    return (
                      <td key={a.id} className="px-3 py-2 text-center">
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
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20" />90–100 (A)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20" />75–89 (B/C)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/20" />Below 75 (D/F)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted/50" />Not submitted</div>
      </div>
    </div>
  )
}
