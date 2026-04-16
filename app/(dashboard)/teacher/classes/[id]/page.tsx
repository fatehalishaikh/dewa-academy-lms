'use client'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Users, BarChart3, Calendar, ArrowRight, AlertTriangle, Plus, GraduationCap, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getClassById } from '@/data/mock-classes'
import { getStudentById } from '@/data/mock-students'
import { useHomeworkStore } from '@/stores/homework-store'

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':     '#007560',
  'Physics':         '#2878C1',
  'English Language':'#004937',
  'Chemistry':       '#D4AF37',
  'Biology':         '#007560',
  'Arabic':          '#B00020',
  'Social Studies':  '#7FC9BB',
}

export default function ClassDetail() {
  const _params = useParams()
  const id = (_params?.id ?? '') as string
  const router = useRouter()
  const cls = getClassById(id ?? '')
  const { homework, getSubmissionForStudent } = useHomeworkStore()

  if (!cls) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground mb-2">Class not found</p>
        <Button variant="outline" onClick={() => router.push('/teacher/classes')}>Back to Classes</Button>
      </div>
    )
  }

  const students = cls.studentIds.map(sid => getStudentById(sid)).filter(Boolean)
  const classHomework = homework.filter(h => h.classId === cls.id && h.status === 'published')
  const subjectColor = SUBJECT_COLORS[cls.subject] ?? '#007560'
  const atRiskCount = students.filter(s => s?.status === 'at-risk').length

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.push('/teacher/classes')} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4" />
        My Classes
      </Button>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}cc, ${subjectColor}99)` }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70 uppercase tracking-wider">{cls.subject}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{cls.name}</h1>
            <p className="text-white/70">
              Room {cls.room} · {cls.studentIds.length} students · {cls.schedule.length} sessions/week
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/teacher/homework/create')} 
            className="bg-white hover:bg-white/90 gap-2 self-start md:self-auto shadow-lg"
            style={{ color: subjectColor }}
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>
        
        {/* Stats inside hero */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Students', value: cls.studentIds.length, icon: Users },
            { label: 'Class Average', value: `${cls.averageGrade}%`, icon: BarChart3 },
            { label: 'Attendance', value: `${cls.attendanceRate}%`, icon: TrendingUp },
            { label: 'At Risk', value: atRiskCount, icon: AlertTriangle },
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

      {/* Schedule */}
      <Card className="border-border/50 hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-info" />
            </div>
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {cls.schedule.map((slot) => (
              <div 
                key={slot.day + slot.time} 
                className="px-5 py-4 rounded-xl border-2 transition-all hover:shadow-md"
                style={{ borderColor: `${subjectColor}40`, background: `${subjectColor}08` }}
              >
                <p className="text-base font-bold" style={{ color: subjectColor }}>{slot.day}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{slot.time}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{slot.room}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students + Grades matrix */}
      <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all">
        <CardHeader className="pb-3 border-b border-border/50 bg-accent/20">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            Students — Grade Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-accent/30">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-56">Student</th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance</th>
                  {classHomework.map(hw => (
                    <th key={hw.id} className="px-4 py-4 text-center min-w-[100px]">
                      <p className="text-xs font-semibold text-foreground truncate">{hw.title.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-[10px] text-muted-foreground">{hw.totalPoints} pts</p>
                    </th>
                  ))}
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {students.map((stu, idx) => {
                  if (!stu) return null
                  const gpaColor = stu.gpa >= 3.5 ? '#007560' : stu.gpa >= 2.5 ? '#D4AF37' : '#B00020'
                  const attColor = stu.attendanceRate >= 90 ? '#007560' : stu.attendanceRate >= 80 ? '#D4AF37' : '#B00020'
                  
                  return (
                    <tr
                      key={stu.id}
                      className={`border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer ${idx % 2 === 0 ? '' : 'bg-accent/10'}`}
                      onClick={() => router.push(`/teacher/students/${stu.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 shrink-0 shadow-md">
                            <AvatarFallback 
                              className="text-xs font-bold text-white" 
                              style={{ background: `linear-gradient(135deg, ${stu.avatarColor}, ${stu.avatarColor}cc)` }}
                            >
                              {stu.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{stu.name}</p>
                            {stu.status === 'at-risk' && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-destructive" />
                                <span className="text-[10px] text-destructive font-medium">At risk</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-base font-bold" style={{ color: gpaColor }}>
                          {stu.gpa.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-bold" style={{ color: attColor }}>
                            {stu.attendanceRate}%
                          </span>
                          <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${stu.attendanceRate}%`, background: attColor }} />
                          </div>
                        </div>
                      </td>
                      {classHomework.map(hw => {
                        const sub = getSubmissionForStudent(hw.id, stu.id)
                        const g = sub?.grade
                        const pct = g != null ? Math.round((g / hw.totalPoints) * 100) : null
                        const cellColor = pct != null ? (pct >= 90 ? '#007560' : pct >= 75 ? '#D4AF37' : '#B00020') : null
                        
                        return (
                          <td key={hw.id} className="px-4 py-4 text-center">
                            {pct != null ? (
                              <span 
                                className="inline-flex items-center justify-center w-12 h-8 rounded-lg text-sm font-bold"
                                style={{ background: `${cellColor}15`, color: cellColor, border: `1px solid ${cellColor}30` }}
                              >
                                {pct}%
                              </span>
                            ) : sub?.status === 'submitted' || sub?.status === 'late' ? (
                              <Badge variant="outline" className="text-[10px] h-6 border-info/30 text-info bg-info/5">Pending</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-4 py-4 text-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
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
