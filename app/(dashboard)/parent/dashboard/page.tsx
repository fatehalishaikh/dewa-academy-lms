'use client'
import { useState } from 'react'
import {
  Sparkles, BarChart3, Calendar, MessageSquare, AlertTriangle, CheckCircle2,
  ArrowRight, Bot, RefreshCw, FileText, ChevronRight, AlertCircle, TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const ACCENT = '#8B5CF6'

const recentActivity = [
  { type: 'grade',      icon: BarChart3,     text: 'Chapter 4 Quiz graded — 92%',                  time: '2 hours ago', color: '#10B981' },
  { type: 'attendance', icon: CheckCircle2,  text: 'Present — all classes today',                   time: 'Today',       color: '#00B8A9' },
  { type: 'assignment', icon: AlertTriangle, text: 'Assignment due tomorrow: Quadratic Equations',  time: 'Reminder',    color: '#F59E0B' },
  { type: 'message',    icon: MessageSquare, text: 'New message from Dr. Sarah Ahmed',              time: '1 day ago',   color: '#8B5CF6' },
  { type: 'grade',      icon: BarChart3,     text: 'Physics Midterm graded — 78%',                  time: '3 days ago',  color: '#0EA5E9' },
]

type InsightData = {
  riskLevel: 'on_track' | 'monitor' | 'at_risk'
  riskScore: number
  summary: string
  recommendations: string[]
  strengths: string[]
  concerns: string[]
}

const riskLevelConfig = {
  on_track: { label: 'On Track', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  monitor:  { label: 'Monitor',  color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/5'   },
  at_risk:  { label: 'At Risk',  color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/5'     },
}

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

export default function ParentDashboard() {
  const router = useRouter()
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)
  const inboxItems = getDashboardInbox('parent', parent?.id ?? '')

  const [selectedChildIdx, setSelectedChildIdx] = useState(0)
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  const selectedChild = children[selectedChildIdx] ?? null

  function switchChild(idx: number) {
    if (idx === selectedChildIdx) return
    setSelectedChildIdx(idx)
    setInsights(null)
  }

  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const today = new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })

  const gpa = selectedChild?.gpa ?? 0
  const attendance = selectedChild?.attendanceRate ?? 0

  async function loadInsights() {
    if (!selectedChild) return
    setLoadingInsights(true)
    try {
      const res = await fetch('/api/ai/parent-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedChild.name,
          gpa: selectedChild.gpa,
          attendanceRate: selectedChild.attendanceRate,
          status: selectedChild.status,
          recentGrades: [
            { subject: 'Mathematics', grade: Math.round(selectedChild.gpa * 25) },
            { subject: 'English',     grade: Math.round(selectedChild.gpa * 26) },
          ],
        }),
      })
      if (res.ok) setInsights(await res.json())
    } catch { /* silent */ }
    finally { setLoadingInsights(false) }
  }

  return (
    <div className="p-6 space-y-5">

      {/* ── HERO ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0d0920 0%, #150d2e 55%, #070d1f 100%)' }}
      >
        {/* Dot-grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative grid grid-cols-1 lg:grid-cols-5">
          {/* Left — identity + child + actions */}
          <div className="lg:col-span-3 p-7 flex flex-col gap-5">

            {/* Identity row */}
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 shrink-0 ring-2 ring-white/20 ring-offset-0">
                <AvatarFallback
                  className="text-base font-bold text-white"
                  style={{ background: parent?.avatarColor ?? ACCENT }}
                >
                  {parent?.initials ?? 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Good {timeOfDay}</p>
                <h1 className="text-2xl font-bold text-white mt-0.5">
                  {parent?.name.split(' ')[0] ?? 'Parent'} 👋
                </h1>
                <p className="text-white/40 text-sm mt-0.5">{today}</p>
              </div>
            </div>

            {/* Child strip */}
            {parent && children.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-white/35 text-[11px] font-semibold uppercase tracking-widest">
                  {children.length > 1 ? 'Select Child' : 'Your Child'}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {children.map((child, idx) => {
                    if (!child) return null
                    const isSelected = idx === selectedChildIdx
                    const isAtRisk = child.status === 'at-risk'
                    return (
                      <button
                        key={child.id}
                        onClick={() => switchChild(idx)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left"
                        style={isSelected
                          ? { background: 'rgba(139,92,246,0.22)', borderColor: 'rgba(139,92,246,0.55)', boxShadow: '0 0 0 1px rgba(139,92,246,0.3)' }
                          : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }
                        }
                      >
                        <Avatar className="w-7 h-7 shrink-0">
                          <AvatarFallback className="text-[11px] font-bold text-white" style={{ background: child.avatarColor }}>
                            {child.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-white/60'}`}>{child.name}</p>
                          <p className="text-[11px] text-white/35">{child.gradeLevel} · Section {child.section}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${isAtRisk ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
                          <span className={`text-[11px] font-semibold ${isAtRisk ? 'text-red-300' : 'text-emerald-300'}`}>
                            {isAtRisk ? 'At Risk' : 'On Track'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CTA row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push('/parent/communication')}
                className="gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/18 text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                Communication
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={loadInsights}
                disabled={loadingInsights}
                className="gap-1.5 bg-white/10 border border-white/15 text-white hover:bg-white/18 text-xs"
              >
                {loadingInsights
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />Loading</>
                  : <><Sparkles className="w-3.5 h-3.5 text-amber-300" />{insights ? `Refresh — ${selectedChild?.name.split(' ')[0]}` : 'AI Insights'}</>}
              </Button>
              {inboxItems.length > 0 && (
                <Link
                  href="/action-center"
                  className="flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {inboxItems.length} {inboxItems.length === 1 ? 'item needs' : 'items need'} your attention
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Right — ring metrics */}
          <div className="lg:col-span-2 p-7 flex items-center justify-around border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            {/* GPA */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={gpa} max={4} color={ACCENT} size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{gpa.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">GPA</p>
                <p className="text-[11px] text-white/35">out of 4.0</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Attendance */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[80px] h-[80px]">
                <RingProgress value={attendance} max={100} color="#10B981" size={80} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">{attendance}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Attendance</p>
                <p className="text-[11px] text-white/35">this semester</p>
              </div>
            </div>

            <div className="w-px h-14 bg-white/[0.08]" />

            {/* Pending assignments */}
            <div className="flex flex-col items-center gap-2.5">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.12)', border: '5px solid rgba(245,158,11,0.35)' }}
              >
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white/80">Due Soon</p>
                <p className="text-[11px] text-white/35">assignments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Current GPA',  value: gpa.toFixed(1),   sub: 'out of 4.0',      icon: TrendingUp,    color: ACCENT,    trend: gpa >= 3.5 ? 'Excellent' : gpa >= 3.0 ? 'Good standing' : 'Needs attention', action: () => router.push('/parent/grades')     },
          { label: 'Attendance',   value: `${attendance}%`, sub: 'this semester',   icon: Calendar,      color: '#10B981', trend: attendance >= 90 ? 'Above target' : attendance >= 75 ? 'Acceptable' : 'Below target',        action: () => router.push('/parent/attendance') },
          { label: 'Pending Work', value: '3',              sub: 'due soon',        icon: AlertTriangle, color: '#F59E0B', trend: '1 due tomorrow',   action: () => {}                               },
          { label: 'Communication',     value: '1',              sub: 'unread message',  icon: MessageSquare, color: '#8B5CF6', trend: 'Dr. Sarah Ahmed',  action: () => router.push('/parent/communication')   },
        ].map(({ label, value, sub, icon: Icon, color, trend, action }) => (
          <Card key={label} className="border-border overflow-hidden hover:shadow-elevated transition-shadow cursor-pointer pt-0 gap-0" onClick={action}>
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

      {/* ── AI INSIGHTS ── */}
      {selectedChild && (
        <Card className={`border transition-colors overflow-hidden pt-0 gap-0 ${insights ? riskLevelConfig[insights.riskLevel].border : 'border-primary/20'}`}
          style={{ background: 'color-mix(in srgb, #8B5CF6 4%, var(--card))' }}>
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, color-mix(in srgb, ${ACCENT} 20%, transparent))` }} />
          <CardHeader className="pt-4 pb-2 px-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4" style={{ color: ACCENT }} />
                AI Insights — {selectedChild.name.split(' ')[0]}
                {children.length > 1 && (
                  <span className="text-[11px] font-normal text-muted-foreground ml-1">
                    · {selectedChild.gradeLevel}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {insights && (
                  <Badge variant="outline" className={`text-[11px] h-5 ${riskLevelConfig[insights.riskLevel].color} ${riskLevelConfig[insights.riskLevel].border}`}>
                    {riskLevelConfig[insights.riskLevel].label}
                  </Badge>
                )}
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={loadInsights} disabled={loadingInsights}>
                  {loadingInsights
                    ? <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Loading</>
                    : <><Sparkles className="w-3 h-3 mr-1 text-amber-400" />{insights ? 'Refresh' : 'Get Insights'}</>}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {!insights && !loadingInsights && (
              <p className="text-xs text-muted-foreground">
                Click &ldquo;Get Insights&rdquo; to receive AI-powered recommendations and risk assessment for {selectedChild.name.split(' ')[0]}.
              </p>
            )}
            {loadingInsights && (
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-muted/40 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
                ))}
              </div>
            )}
            {insights && (
              <div className="space-y-3">
                <p className="text-xs text-foreground">{insights.summary}</p>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Recommendations</p>
                  <div className="space-y-1">
                    {insights.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACCENT }} />
                        <p className="text-xs text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-6 p-0" style={{ color: ACCENT }} onClick={() => router.push('/parent/reports')}>
                  <FileText className="w-3 h-3 mr-1" />
                  Generate Full Report
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── ACTIVITY + QUICK ACCESS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity — timeline */}
        <Card className="border-border">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Recent Activity</span>
            </div>
            <Badge variant="outline" className="text-[11px] h-5">{recentActivity.length} events</Badge>
          </div>
          <CardContent className="px-5 pb-5">
            <div className="relative space-y-1">
              <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />
              {recentActivity.map((item, i) => {
                const Icon = item.icon
                const isFirst = i === 0
                return (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div
                      className="w-[18px] h-[18px] rounded-full shrink-0 mt-2 z-10 border-2 border-card flex items-center justify-center"
                      style={{ background: isFirst ? item.color : `color-mix(in srgb, ${item.color} 35%, var(--muted))` }}
                    >
                      <Icon className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className={`flex-1 rounded-xl p-3 mb-1 border transition-colors ${
                      isFirst ? 'border-border bg-card shadow-xs' : 'border-border/50 bg-muted/20'
                    }`}>
                      <p className="text-xs font-medium text-foreground leading-snug">{item.text}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="border-border lg:col-span-2">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Quick Access</span>
            </div>
          </div>
          <CardContent className="px-5 pb-5 space-y-2">
            {[
              { label: 'View All Grades',      sub: 'See detailed grade breakdown',       to: '/parent/grades',     color: ACCENT,    icon: BarChart3     },
              { label: 'Attendance Records',   sub: 'Monthly attendance calendar',        to: '/parent/attendance', color: '#10B981', icon: Calendar      },
              { label: 'Communication',             sub: '1 unread from Dr. Sarah Ahmed',      to: '/parent/communication',   color: '#8B5CF6', icon: MessageSquare },
              { label: 'Requests',             sub: 'Leave, meeting & document requests', to: '/parent/requests',   color: '#F59E0B', icon: AlertTriangle  },
              { label: 'AI Progress Reports',  sub: 'Generate personalized insights',     to: '/parent/reports',    color: ACCENT,    icon: FileText       },
            ].map(({ label, sub, to, color, icon: Icon }) => (
              <div
                key={label}
                className="flex items-stretch rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xs transition-all cursor-pointer"
                onClick={() => router.push(to)}
              >
                {/* Accent color strip */}
                <div className="w-1 shrink-0" style={{ background: color }} />
                <div className="flex items-center gap-3 px-3 py-3 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                </div>
                <div className="pr-4 flex items-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
