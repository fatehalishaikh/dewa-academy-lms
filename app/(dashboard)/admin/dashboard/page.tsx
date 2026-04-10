'use client'
import {
  Sparkles, Users, GraduationCap, CalendarCheck, ClipboardList,
  AlertTriangle, ArrowRight, BarChart3, BookOpen, FileText,
  Briefcase, LayoutDashboard, TrendingUp, TrendingDown, Minus, ChevronRight, CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRoleStore } from '@/stores/role-store'
import { students } from '@/data/mock-students'
import { teachers } from '@/data/mock-teachers'
import { ilpRiskStudents } from '@/data/mock-ilp'
import { pipelineData } from '@/data/mock-registration'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const ADMIN_NAMES: Record<string, string> = {
  'adm-001': 'Hassan',
  'adm-002': 'Rania',
}

const attendanceByGrade = [
  { grade: 'Grade 9', rate: 94, students: 87 },
  { grade: 'Grade 10', rate: 91, students: 103 },
  { grade: 'Grade 11', rate: 89, students: 76 },
]

const quickLinks = [
  { label: 'Registration', icon: ClipboardList, href: '/registration', color: '#00B8A9' },
  { label: 'All Students', icon: Users, href: '/admin/students', color: '#0EA5E9' },
  { label: 'All Teachers', icon: GraduationCap, href: '/admin/teachers', color: '#8B5CF6' },
  { label: 'Reports', icon: FileText, href: '/reports', color: '#F59E0B' },
  { label: 'Learning Plans', icon: BookOpen, href: '/ilp', color: '#10B981' },
  { label: 'All Staff', icon: Briefcase, href: '/admin/staff', color: '#EF4444' },
]

const totalStudents = students.length
const totalTeachers = teachers.length
const pendingReg = pipelineData.find(p => p.stageName === 'Submitted')?.count ?? 0
const pipelineMax = Math.max(...pipelineData.map(p => p.count))

export default function AdminDashboard() {
  const { personId } = useRoleStore()
  const router = useRouter()
  const firstName = ADMIN_NAMES[personId ?? ''] ?? 'Admin'

  const today = new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const highRisk = ilpRiskStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'moderate')
  const inboxItems = getDashboardInbox('admin', personId ?? 'admin')

  return (
    <div className="p-6 space-y-6">
      {/* Hero: greeting + inbox */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2 p-4 lg:border-r border-border">
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Admin Dashboard</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{greeting}, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
            <Button size="sm" variant="outline" onClick={() => router.push('/reports')} className="mt-3 gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              View Reports
            </Button>
          </div>
          <div className="lg:col-span-3 p-4 flex flex-col justify-center">
            {inboxItems.length === 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">All caught up</p>
                  <p className="text-xs text-muted-foreground">Nothing needs your attention right now.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-amber-400">{inboxItems.length}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {inboxItems.length === 1 ? '1 thing needs' : `${inboxItems.length} things need`} your attention
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {inboxItems.filter(i => i.urgency === 'high').length > 0 && (
                      <span className="text-amber-400 font-medium">{inboxItems.filter(i => i.urgency === 'high').length} urgent</span>
                    )}
                    {inboxItems.filter(i => i.urgency === 'high').length > 0 && inboxItems.filter(i => i.urgency !== 'high').length > 0 && ' · '}
                    {inboxItems.filter(i => i.urgency !== 'high').length > 0 && (
                      <span>{inboxItems.filter(i => i.urgency !== 'high').length} follow-up</span>
                    )}
                  </p>
                  <Link
                    href="/action-center"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    Open Action Center <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents.toString(), sub: 'enrolled this term', icon: Users, color: '#00B8A9' },
          { label: 'Total Teachers', value: totalTeachers.toString(), sub: 'active staff', icon: GraduationCap, color: '#0EA5E9' },
          { label: 'School Attendance', value: '91%', sub: 'average this week', icon: CalendarCheck, color: '#10B981' },
          { label: 'Pending Registration', value: pendingReg.toString(), sub: 'applications awaiting', icon: ClipboardList, color: '#F59E0B' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Registration Pipeline */}
        <Card className="rounded-2xl border-border lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                Registration Pipeline
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/registration')}>
                Manage <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2.5">
            {pipelineData.map(stage => (
              <div key={stage.stageName} className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground w-24 shrink-0">{stage.stageName}</p>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(stage.count / pipelineMax) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-8 text-right">{stage.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Alerts */}
        <Card className="rounded-2xl border-border lg:col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Student Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/ilp')}>
                View ILP <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {highRisk.map(student => {
              const TrendIcon = student.trend === 'up' ? TrendingUp : student.trend === 'down' ? TrendingDown : Minus
              const trendColor = student.trend === 'up' ? '#10B981' : student.trend === 'down' ? '#EF4444' : '#94A3B8'
              const riskColor = student.riskLevel === 'high' ? '#EF4444' : '#F59E0B'
              return (
                <div key={student.studentId} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: riskColor }}
                  >
                    {student.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{student.factors[0] ?? 'At risk'}</p>
                  </div>
                  <TrendIcon className="w-3.5 h-3.5 shrink-0" style={{ color: trendColor }} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Attendance by Grade */}
        <Card className="rounded-2xl border-border lg:col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" />
                Attendance by Grade
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/class-activities')}>
                Details <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {attendanceByGrade.map(g => {
              const color = g.rate >= 92 ? '#10B981' : g.rate >= 85 ? '#F59E0B' : '#EF4444'
              return (
                <div key={g.grade} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground">{g.grade}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{g.students} students</span>
                      <span className="text-xs font-semibold" style={{ color }}>{g.rate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.rate}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="rounded-2xl border-border lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-foreground">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map(({ label, icon: Icon, href, color }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
