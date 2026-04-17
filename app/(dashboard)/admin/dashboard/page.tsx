'use client'
import {
  Sparkles, Users, GraduationCap, CalendarCheck, ClipboardList,
  AlertTriangle, ArrowRight, BarChart3, BookOpen, FileText,
  Briefcase, LayoutDashboard, TrendingUp, TrendingDown, Minus,
  ChevronRight, CheckCircle2, AlertCircle,
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
  { label: 'Registration', icon: ClipboardList, href: '/registration', color: 'var(--accent-student)' },
  { label: 'All Students', icon: Users, href: '/admin/students', color: 'var(--accent-student)' },
  { label: 'All Teachers', icon: GraduationCap, href: '/admin/teachers', color: 'var(--accent-teacher)' },
  { label: 'Reports', icon: FileText, href: '/reports', color: 'var(--accent-admin)' },
  { label: 'Learning Plans', icon: BookOpen, href: '/ilp', color: '#10B981' },
  { label: 'All Staff', icon: Briefcase, href: '/admin/staff', color: 'var(--accent-parent)' },
]

const totalStudents = students.length
const totalTeachers = teachers.length
const pendingReg = pipelineData.find(p => p.stageName === 'Submitted')?.count ?? 0
const pipelineMax = Math.max(...pipelineData.map(p => p.count))

function RingProgress({ value, max, color, size = 80 }: { value: number; max: number; color: string; size?: number }) {
  const sw = 5
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - Math.min(value / max, 1) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  )
}

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
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #271500 55%, #0f1420 100%)' }}
      >
        {/* Dot-grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left — identity + inbox + actions */}
          <div className="lg:col-span-3 p-7 flex flex-col gap-5">
            {/* Identity row */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ring-2 ring-white/20"
                style={{ background: 'color-mix(in srgb, #F59E0B 25%, #271500)' }}
              >
                <LayoutDashboard className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Admin Dashboard</p>
                <h1 className="text-2xl font-bold text-white mt-0.5">{greeting}, {firstName} 👋</h1>
                <p className="text-white/40 text-sm mt-0.5">{today}</p>
              </div>
            </div>

            {/* Inbox strip */}
            <div className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 border transition-all ${
              inboxItems.length === 0
                ? 'bg-white/[0.05] border-white/10'
                : 'bg-amber-500/15 border-amber-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  inboxItems.length === 0 ? 'bg-white/10' : 'bg-amber-500/25'
                }`}>
                  {inboxItems.length === 0
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <AlertCircle className="w-4 h-4 text-amber-300" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {inboxItems.length === 0 ? 'All caught up' : `${inboxItems.length} ${inboxItems.length === 1 ? 'item needs' : 'items need'} attention`}
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">
                    {inboxItems.length === 0
                      ? 'Nothing needs your attention right now.'
                      : `${inboxItems.filter(i => i.urgency === 'high').length} urgent · ${inboxItems.filter(i => i.urgency !== 'high').length} follow-up`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push('/reports')}
                className="gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/18 text-xs"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                View Reports
              </Button>
              {inboxItems.length > 0 && (
                <Link
                  href="/action-center"
                  className="flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Open Action Center
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Right — ring metrics */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* Total Students */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.12)', border: '5px solid rgba(245,158,11,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{totalStudents}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Students</p>
                <p className="text-[11px] text-white/35">enrolled</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* School Attendance */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={91} max={100} color="#10B981" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">91%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Attendance</p>
                <p className="text-[11px] text-white/35">this week</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Total Teachers */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.12)', border: '5px solid rgba(14,165,233,0.35)' }}
              >
                <span className="text-xl font-bold text-white">{totalTeachers}</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Teachers</p>
                <p className="text-[11px] text-white/35">active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: totalStudents.toString(), sub: 'enrolled this term', icon: Users, color: 'var(--accent-student)', trend: 'School-wide' },
          { label: 'Total Teachers', value: totalTeachers.toString(), sub: 'active staff', icon: GraduationCap, color: 'var(--accent-teacher)', trend: 'All departments' },
          { label: 'School Attendance', value: '91%', sub: 'average this week', icon: CalendarCheck, color: '#10B981', trend: 'Above target' },
          { label: 'Pending Registration', value: pendingReg.toString(), sub: 'applications awaiting', icon: ClipboardList, color: 'var(--accent-admin)', trend: 'Needs review' },
        ].map(({ label, value, sub, icon: Icon, color, trend }) => (
          <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow pt-0 gap-0">
            <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 30%, transparent))` }} />
            <CardContent className="p-4 pt-3">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] font-semibold mt-1" style={{ color }}>{trend}</p>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Registration Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 pt-5 px-5">
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
          <CardContent className="px-5 pb-5 space-y-3">
            {pipelineData.map(stage => (
              <div key={stage.stageName} className="flex items-center gap-4">
                <p className="text-xs text-muted-foreground w-24 shrink-0">{stage.stageName}</p>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(stage.count / pipelineMax) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-8 text-right tabular-nums">{stage.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Student Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground gap-1" onClick={() => router.push('/ilp')}>
                View ILP <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2">
            {highRisk.map(student => {
              const TrendIcon = student.trend === 'up' ? TrendingUp : student.trend === 'down' ? TrendingDown : Minus
              const trendColor = student.trend === 'up' ? '#10B981' : student.trend === 'down' ? '#EF4444' : '#94A3B8'
              const riskColor = student.riskLevel === 'high' ? '#EF4444' : '#F59E0B'
              return (
                <div key={student.studentId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: riskColor }}
                  >
                    {student.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{student.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{student.factors[0] ?? 'At risk'}</p>
                  </div>
                  <TrendIcon className="w-3.5 h-3.5 shrink-0" style={{ color: trendColor }} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Attendance by Grade */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 pt-5 px-5">
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
          <CardContent className="px-5 pb-5 space-y-4">
            {attendanceByGrade.map(g => {
              const color = g.rate >= 92 ? '#10B981' : g.rate >= 85 ? '#F59E0B' : '#EF4444'
              return (
                <div key={g.grade} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">{g.grade}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{g.students} students</span>
                      <span className="text-xs font-bold tabular-nums" style={{ color }}>{g.rate}%</span>
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
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-foreground">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-2.5">
              {quickLinks.map(({ label, icon: Icon, href, color }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
