'use client'
import { useState } from 'react'
import { Sparkles, BarChart3, Calendar, MessageSquare, AlertTriangle, CheckCircle2, ArrowRight, Bot, RefreshCw, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'

const recentActivity = [
  { type: 'grade', icon: BarChart3, text: 'Chapter 4 Quiz graded — 92%', time: '2 hours ago', color: '#10B981' },
  { type: 'attendance', icon: CheckCircle2, text: 'Present — all classes today', time: 'Today', color: '#00B8A9' },
  { type: 'assignment', icon: AlertTriangle, text: 'Assignment due tomorrow: Quadratic Equations', time: 'Reminder', color: '#F59E0B' },
  { type: 'message', icon: MessageSquare, text: 'New message from Dr. Sarah Ahmed', time: '1 day ago', color: '#8B5CF6' },
  { type: 'grade', icon: BarChart3, text: 'Physics Midterm graded — 78%', time: '3 days ago', color: '#0EA5E9' },
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
  on_track: { label: 'On Track',  color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  monitor:  { label: 'Monitor',   color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/5'   },
  at_risk:  { label: 'At Risk',   color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/5'     },
}

export default function ParentDashboard() {
  const router = useRouter()
  const parent = useCurrentParent()
  const primaryChild = parent ? getStudentById(parent.childIds[0]) : null

  const [insights, setInsights] = useState<InsightData | null>(null)
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
            { subject: 'English', grade: Math.round(primaryChild.gpa * 26) },
          ],
        }),
      })
      if (res.ok) setInsights(await res.json())
    } catch { /* silent */ }
    finally { setLoadingInsights(false) }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Parent Portal</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Welcome, {parent?.name.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Child selector (if multiple children) */}
      {parent && parent.childIds.length > 0 && (
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your {parent.childIds.length > 1 ? 'Children' : 'Child'}</p>
            <div className="flex gap-3 flex-wrap">
              {parent.childIds.map(cid => {
                const child = getStudentById(cid)
                if (!child) return null
                return (
                  <div key={cid} className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-xs font-bold text-white" style={{ background: child.avatarColor }}>
                        {child.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{child.name}</p>
                      <p className="text-[11px] text-muted-foreground">{child.gradeLevel} — Section {child.section}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-5 ml-2 ${child.status === 'at-risk' ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}`}
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current GPA', value: primaryChild?.gpa.toFixed(1) ?? '—', sub: 'out of 4.0', icon: BarChart3, color: '#00B8A9', action: () => router.push('/parent/grades') },
          { label: 'Attendance', value: `${primaryChild?.attendanceRate ?? 0}%`, sub: 'this semester', icon: Calendar, color: '#10B981', action: () => router.push('/parent/attendance') },
          { label: 'Pending Work', value: '3', sub: 'assignments due soon', icon: AlertTriangle, color: '#F59E0B', action: () => {} },
          { label: 'Messages', value: '1', sub: 'unread message', icon: MessageSquare, color: '#8B5CF6', action: () => router.push('/parent/messages') },
        ].map(({ label, value, sub, icon: Icon, color, action }) => (
          <Card key={label} className="rounded-2xl border-border cursor-pointer hover:border-primary/30 transition-colors" onClick={action}>
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

      {/* AI Insights */}
      {primaryChild && (
        <Card className={`rounded-2xl border transition-colors ${insights ? riskLevelConfig[insights.riskLevel].border : 'border-primary/20'} bg-primary/5`}>
          <CardHeader className="pb-3 pt-5 px-5">
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
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={loadInsights}
                  disabled={loadingInsights}
                >
                  {loadingInsights
                    ? <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Loading</>
                    : <><Sparkles className="w-3 h-3 mr-1" />{insights ? 'Refresh' : 'Get Insights'}</>}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {!insights && !loadingInsights && (
              <p className="text-xs text-muted-foreground">
                Click &ldquo;Get Insights&rdquo; to receive AI-powered recommendations and risk assessment for {primaryChild.name.split(' ')[0]}.
              </p>
            )}
            {loadingInsights && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-muted/40 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
                ))}
              </div>
            )}
            {insights && (
              <div className="space-y-3">
                <p className="text-xs text-foreground">{insights.summary}</p>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Recommendations for You</p>
                  <div className="space-y-1.5">
                    {insights.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 text-primary p-0"
                  onClick={() => router.push('/parent/reports')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Generate Full Report
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}20` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'View All Grades', sub: 'See detailed grade breakdown', to: '/parent/grades', color: '#00B8A9', icon: BarChart3 },
              { label: 'Attendance Records', sub: 'Monthly attendance calendar', to: '/parent/attendance', color: '#10B981', icon: Calendar },
              { label: 'Messages', sub: '1 unread from Dr. Sarah Ahmed', to: '/parent/messages', color: '#8B5CF6', icon: MessageSquare },
              { label: 'Leave Request', sub: 'Apply for absence or leave', to: '/parent/leave-request', color: '#F59E0B', icon: AlertTriangle },
              { label: 'AI Progress Reports', sub: 'Generate personalized insights', to: '/parent/reports', color: '#00B8A9', icon: FileText },
            ].map(({ label, sub, to, color, icon: Icon }) => (
              <button
                key={label}
                onClick={() => router.push(to)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
