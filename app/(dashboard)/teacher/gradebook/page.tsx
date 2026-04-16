'use client'
import { TableProperties, ChevronDown, GraduationCap, Users, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  if (grade === null) return { label: '—', bg: 'bg-muted/30', text: 'text-muted-foreground', color: '#6B7280' }
  if (grade >= 90) return { label: `${grade}`, bg: 'bg-[#007560]/10', text: 'text-[#007560]', color: '#007560' }
  if (grade >= 75) return { label: `${grade}`, bg: 'bg-[#D4AF37]/10', text: 'text-[#D4AF37]', color: '#D4AF37' }
  return { label: `${grade}`, bg: 'bg-[#B00020]/10', text: 'text-[#B00020]', color: '#B00020' }
}

export default function TeacherGradebook() {
  const teacher = useCurrentTeacher()
  const classes = teacher ? getClassesByTeacher(teacher.id) : []
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id ?? '')

  const cls = classes.find(c => c.id === selectedClass)
  const classStudents = cls ? cls.studentIds.map(id => getStudentById(id)).filter(Boolean) : []

  // Calculate class stats
  const allGrades: number[] = []
  classStudents.forEach(stu => {
    if (!stu) return
    const grades = gradeData[stu.id] ?? {}
    assignments.forEach(a => {
      if (grades[a.id] != null) allGrades.push(grades[a.id]!)
    })
  })
  const classAverage = allGrades.length ? Math.round(allGrades.reduce((s, g) => s + g, 0) / allGrades.length) : 0
  const highestGrade = allGrades.length ? Math.max(...allGrades) : 0
  const completionRate = classStudents.length && assignments.length 
    ? Math.round((allGrades.length / (classStudents.length * assignments.length)) * 100) 
    : 0

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#007560] via-[#005a48] to-[#003d30] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7FC9BB]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <TableProperties className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70 uppercase tracking-wider">Grade Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Gradebook</h1>
            <p className="text-white/70">View and manage student grades across all classes</p>
          </div>
          
          {/* Class selector */}
          <div className="relative self-start md:self-auto">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-white/40 min-w-[200px]"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id} className="bg-background text-foreground">{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-white/70 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>
        
        {/* Stats inside hero */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Students', value: classStudents.length, icon: Users },
            { label: 'Class Average', value: `${classAverage}%`, icon: TrendingUp },
            { label: 'Highest Grade', value: `${highestGrade}%`, icon: Award },
            { label: 'Completion', value: `${completionRate}%`, icon: GraduationCap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradebook Table */}
      <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3 border-b border-border/50 bg-accent/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TableProperties className="w-4 h-4 text-primary" />
            </div>
            {cls?.name ?? 'Select a class'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-accent/30">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-56">Student</th>
                  {assignments.map(a => (
                    <th key={a.id} className="px-4 py-4 text-center min-w-[120px]">
                      <p className="text-xs font-semibold text-foreground truncate">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Due {a.dueDate} · {a.points}pts</p>
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center min-w-[100px]">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((stu, idx) => {
                  if (!stu) return null
                  const grades = gradeData[stu.id] ?? {}
                  const validGrades = assignments.map(a => grades[a.id]).filter(g => g != null) as number[]
                  const avg = validGrades.length ? Math.round(validGrades.reduce((s, g) => s + g, 0) / validGrades.length) : null
                  const avgCell = gradeCell(avg)
                  
                  return (
                    <tr 
                      key={stu.id} 
                      className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-accent/10'}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md" 
                            style={{ background: `linear-gradient(135deg, ${stu.avatarColor}, ${stu.avatarColor}cc)` }}
                          >
                            {stu.initials}
                          </div>
                          <StudentNameLink studentId={stu.id} name={stu.name} className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors" />
                        </div>
                      </td>
                      {assignments.map(a => {
                        const cell = gradeCell(grades[a.id] ?? null)
                        return (
                          <td key={a.id} className="px-4 py-4 text-center">
                            <span 
                              className={`inline-flex items-center justify-center w-14 h-9 rounded-lg text-sm font-bold ${cell.bg} ${cell.text} border`}
                              style={{ borderColor: `${cell.color}30` }}
                            >
                              {cell.label}
                            </span>
                          </td>
                        )
                      })}
                      <td className="px-4 py-4 text-center">
                        {avg != null ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className={`text-lg font-bold ${avgCell.text}`}>{avg}%</span>
                            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all" 
                                style={{ width: `${avg}%`, background: avgCell.color }} 
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* Summary row */}
              <tfoot>
                <tr className="bg-accent/40 border-t-2 border-border">
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class Average</p>
                  </td>
                  {assignments.map(a => {
                    const vals = classStudents.map(s => s && gradeData[s.id]?.[a.id]).filter(v => v != null) as number[]
                    const avg = vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null
                    const cell = gradeCell(avg)
                    return (
                      <td key={a.id} className="px-4 py-4 text-center">
                        {avg != null ? (
                          <span className={`text-lg font-bold ${cell.text}`}>{avg}%</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
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
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#007560]/20 border border-[#007560]/30" />
          <span>90-100 (A)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30" />
          <span>75-89 (B/C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#B00020]/20 border border-[#B00020]/30" />
          <span>Below 75 (D/F)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-muted/50 border border-border" />
          <span>Not submitted</span>
        </div>
      </div>
    </div>
  )
}
