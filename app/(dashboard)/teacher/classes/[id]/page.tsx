'use client'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles, Users, BarChart3, Calendar, ArrowRight, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getClassById } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { useHomeworkStore } from '@/stores/homework-store'


export default function ClassDetail() {
  const _params = useParams()
  const id = (_params?.id ?? '') as string
  const router = useRouter()
  const cls = getClassById(id ?? '')
  const { homework, getSubmissionForStudent } = useHomeworkStore()

  if (!cls) {
    return <div className="p-6 text-sm text-muted-foreground">Class not found</div>
  }

  const students = cls.studentIds.map(sid => getStudentById(sid)).filter(Boolean)
  const classHomework = homework.filter(h => h.classId === cls.id && h.status === 'published')

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/teacher/classes')} className="gap-1.5 -ml-2">
          <ChevronLeft className="w-4 h-4" />
          My Classes
        </Button>
      </div>

      {/* Class info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">{cls.subject}</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">{cls.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Room {cls.room} · {cls.studentIds.length} students · {cls.schedule.length} sessions/week
          </p>
        </div>
        <Button size="sm" onClick={() => router.push('/teacher/homework/create')} className="gap-1.5">
          + New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Students', value: cls.studentIds.length, color: '#00B8A9', icon: Users },
          { label: 'Class Average', value: `${cls.averageGrade}%`, color: '#10B981', icon: BarChart3 },
          { label: 'Attendance', value: `${cls.attendanceRate}%`, color: '#0EA5E9', icon: Calendar },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {cls.schedule.map((slot) => (
              <div key={slot.day + slot.time} className="px-3 py-2 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-xs font-semibold text-primary">{slot.day}</p>
                <p className="text-[11px] text-muted-foreground">{slot.time}</p>
                <p className="text-[11px] text-muted-foreground">{slot.room}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students + Grades matrix */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Students — Grade Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-52">Student</th>
                  <th className="text-center px-3 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
                  <th className="text-center px-3 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Attend.</th>
                  {classHomework.map(hw => (
                    <th key={hw.id} className="text-center px-3 py-3 min-w-[90px]">
                      <p className="text-[11px] font-semibold text-foreground truncate">{hw.title.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-[11px] text-muted-foreground">{hw.totalPoints} pts</p>
                    </th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => {
                  if (!stu) return null
                  return (
                    <tr
                      key={stu.id}
                      className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(`/teacher/students/${stu.id}`)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarFallback className="text-[11px] font-bold text-white" style={{ background: stu.avatarColor }}>
                              {stu.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground">{stu.name}</p>
                            {stu.status === 'at-risk' && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                                <span className="text-[11px] text-red-400">At risk</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`text-sm font-bold ${stu.gpa >= 3.5 ? 'text-emerald-400' : stu.gpa >= 2.5 ? 'text-amber-400' : 'text-red-400'}`}>
                          {stu.gpa.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`text-xs font-semibold ${stu.attendanceRate >= 90 ? 'text-emerald-400' : stu.attendanceRate >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                          {stu.attendanceRate}%
                        </span>
                      </td>
                      {classHomework.map(hw => {
                        const sub = getSubmissionForStudent(hw.id, stu.id)
                        const g = sub?.grade
                        const pct = g != null ? Math.round((g / hw.totalPoints) * 100) : null
                        return (
                          <td key={hw.id} className="px-3 py-3.5 text-center">
                            {pct != null ? (
                              <span className={`text-xs font-bold ${pct >= 90 ? 'text-emerald-400' : pct >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                                {pct}%
                              </span>
                            ) : sub?.status === 'submitted' || sub?.status === 'late' ? (
                              <Badge variant="outline" className="text-[11px] h-4 border-blue-500/30 text-blue-400">Pending</Badge>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">—</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-3 py-3.5 text-center">
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
