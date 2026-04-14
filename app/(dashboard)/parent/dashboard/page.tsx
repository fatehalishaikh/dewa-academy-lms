'use client'
import { useState } from 'react'
import { Sparkles, BarChart3, Calendar, MessageSquare, AlertTriangle, CheckCircle2, ArrowRight, Bot, RefreshCw, FileText, LayoutDashboard, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'
import Link from 'next/link'
import { getDashboardInbox } from '@/lib/academy-selectors'

const recentActivity = [
  { type: 'grade',      icon: BarChart3,    text: 'Chapter 4 Quiz graded — 92%',                    time: '2 hours ago', color: '#10B981' },
  { type: 'attendance', icon: CheckCircle2, text: 'Present — all classes today',                     time: 'Today',       color: '#00B8A9' },
  { type: 'assignment', icon: AlertTriangle, text: 'Assignment due tomorrow: Quadratic Equations',   time: 'Reminder',    color: '#F59E0B' },
  { type: 'message',    icon: MessageSquare, text: 'New message from Dr. Sarah Ahmed',               time: '1 day ago',   color: '#8B5CF6' },
  { type: 'grade',      icon: BarChart3,    text: 'Physics Midterm graded — 78%',                    time: '3 days ago',  color: '#0EA5E9' },
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

export default function ParentDashboard() {
  const router = useRouter()
  const parent = useCurrentParent()
  const primaryChild = parent ? getStudentById(parent.childIds[0]) : null
  const inboxItems = getDashboardInbox('parent', parent?.id ?? '')

  const [insights, setInsights]           = useState<InsightData | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  async function loadInsights() {
    if (!primaryChild) return
    setLoadingInsights(true)
    try {
      const res = await fetch('/api/ai/parent-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: primaryChild.name,
          gpa: primaryChild.gpa,
          attendanceRate: primaryChild.attendanceRate,
          status: primaryChild.status,
          recentGrades: [
            { subject: 'Mathematics', grade: Math.round(primaryChild.gpa * 25) },
            { subject: 'English',     grade: Math.round(primaryChild.gpa * 26) },
          ],
        }),
      })
      if (res.ok) setInsights(await res.json())
    } catch { /* silent */ }
    finally { setLoadingInsights(false) }
  }

  return (
    <div className="p-4 space-y-6">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Card className="rounded-[10px] border-border overflow-hidden py-0 gap-0">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2 px-4 py-4 lg:border-r border-border">
            <div className="flex items-center gap-2 mb-0.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Parent Portal</span>
            </div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Welcome, {parent?.name.split(' ')[0]} 👋</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <Button size="sm" variant="outline" onClick={() => router.push('/parent/messages')} className="mt-2 gap-1.5 h-7 text-xs">
              <MessageSquare className="w-3 h-3" />
              Messages
            </Button>
          </div>
          <div className="lg:col-span-3 px-4 py-4 flex flex-col justify-center">
            {inboxItems.length === 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">All caught up</p>
                  <p className="text-xs text-muted-foreground">Nothing needs your attention right now.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[10px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-amber-400">{inboxItems.length}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {inboxItems.length === 1 ? '1 thing needs' : `${inboxItems.length} things need`} your attention
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inboxItems.filter(i => i.urgency === 'high').length > 0 && (
                      <span className="text-amber-400 font-medium">{inboxItems.filter(i => i.urgency === 'high').length} urgent</span>
                    )}
                    {inboxItems.filter(i => i.urgency === 'high').length > 0 && inboxItems.filter(i => i.urgency !== 'high').length > 0 && ' · '}
                    {inboxItems.filter(i => i.urgency !== 'high').length > 0 && (
                      <span>{inboxItems.filter(i => i.urgency !== 'high').length} follow-up</span>
                    )}
                  </p>
                  <Link href="/action-center" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                    Open Action Center <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── Children ──────────────────────────────────────────────────── */}
      {parent && parent.childIds.length > 0 && (
        <Card className="rounded-[10px] border-border py-0 gap-0">
          <CardContent className="px-4 py-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your {parent.childIds.length > 1 ? 'Children' : 'Child'}
            </p>
            <div className="flex gap-2 flex-wrap">
              {parent.childIds.map(cid => {
                const child = getStudentById(cid)
                if (!child) return null
                return (
                  <div key={cid} className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] border border-primary/30 bg-primary/5">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-[10px] font-bold text-white" style={{ background: child.avatarColor }}>
                        {child.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-foreground leading-tight">{child.name}</p>
                      <p className="text-[10px] text-muted-foreground">{child.gradeLevel} — Section {child.section}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-5 ml-1 ${child.status === 'at-risk' ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}`}
                    >
                      {child.status === 'at-risk' ? 'At Risk' : 'On Track'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Current GPA',  value: primaryChild?.gpa.toFixed(1) ?? '—',         sub: 'out of 4.0',           icon: BarChart3,     color: '#00B8A9', action: () => router.push('/parent/grades')     },
          { label: 'Attendance',   value: `${primaryChild?.attendanceRate ?? 0}%`,      sub: 'this semester',        icon: Calendar,      color: '#10B981', action: () => router.push('/parent/attendance') },
          { label: 'Pending Work', value: '3',                                          sub: 'assignments due soon', icon: AlertTriangle,  color: '#F59E0B', action: () => {}                               },
          { label: 'Messages',     value: '1',                                          sub: 'unread message',       icon: MessageSquare, color: '#8B5CF6', action: () => router.push('/parent/messages')   },
        ].map(({ label, value, sub, icon: Icon, color, action }) => (
          <Card key={label} className="rounded-[10px] border-border cursor-pointer hover:border-primary/30 transition-colors py-0 gap-0" onClick={action}>
            <CardContent className="px-3 py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-3 h-3" style={{ color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── AI Insights ───────────────────────────────────────────────── */}
      {primaryChild && (
        <Card className={`rounded-[10px] border transition-colors py-0 gap-0 ${insights ? riskLevelConfig[insights.riskLevel].border : 'border-primary/20'} bg-primary/5`}>
          <CardHeader className="pt-4 pb-2 px-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                AI Insights — {primaryChild.name.split(' ')[0]}
              </CardTitle>
              <div className="flex items-center gap-2">
                {insights && (
                  <Badge variant="outline" className={`text-[10px] h-5 ${riskLevelConfig[insights.riskLevel].color} ${riskLevelConfig[insights.riskLevel].border}`}>
                    {riskLevelConfig[insights.riskLevel].label}
                  </Badge>
                )}
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={loadInsights} disabled={loadingInsights}>
                  {loadingInsights
                    ? <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Loading</>
                    : <><Sparkles className="w-3 h-3 mr-1" />{insights ? 'Refresh' : 'Get Insights'}</>}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {!insights && !loadingInsights && (
              <p className="text-xs text-muted-foreground">
                Click &ldquo;Get Insights&rdquo; to receive AI-powered recommendations and risk assessment for {primaryChild.name.split(' ')[0]}.
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
              <div className="space-y-2">
                <p className="text-xs text-foreground">{insights.summary}</p>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Recommendations</p>
                  <div className="space-y-1">
                    {insights.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-6 text-primary p-0" onClick={() => router.push('/parent/reports')}>
                  <FileText className="w-3 h-3 mr-1" />
                  Generate Full Report
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Bottom grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Recent Activity */}
        <Card className="rounded-[10px] border-border py-0 gap-0">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {recentActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}20` }}>
                    <Icon className="w-3 h-3" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-foreground truncate">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="rounded-[10px] border-border py-0 gap-0">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1.5">
            {[
              { label: 'View All Grades',      sub: 'See detailed grade breakdown',       to: '/parent/grades',     color: '#00B8A9', icon: BarChart3     },
              { label: 'Attendance Records',   sub: 'Monthly attendance calendar',        to: '/parent/attendance', color: '#10B981', icon: Calendar      },
              { label: 'Messages',             sub: '1 unread from Dr. Sarah Ahmed',      to: '/parent/messages',   color: '#8B5CF6', icon: MessageSquare },
              { label: 'Requests',             sub: 'Leave, meeting & document requests', to: '/parent/requests',   color: '#F59E0B', icon: AlertTriangle  },
              { label: 'AI Progress Reports',  sub: 'Generate personalized insights',     to: '/parent/reports',    color: '#00B8A9', icon: FileText       },
            ].map(({ label, sub, to, color, icon: Icon }) => (
              <button
                key={label}
                onClick={() => router.push(to)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] border border-border hover:border-primary/30 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
