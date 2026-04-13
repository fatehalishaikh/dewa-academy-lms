'use client'
import { Bell, CheckCircle2, ChevronRight, AlertTriangle, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRoleStore } from '@/stores/role-store'
import { getDashboardInbox, type InboxItem } from '@/lib/academy-selectors'

const TYPE_LABEL: Record<string, string> = {
  homework: 'Homework',
  attendance: 'Attendance',
  grade: 'Grading',
  message: 'Messages',
  registration: 'Registration',
  ilp: 'Learning Plan',
  curriculum: 'Curriculum',
  leave: 'Leave',
}

export default function ActionCenterPage() {
  const { role, personId } = useRoleStore()

  if (!role || !personId) return null

  const items = getDashboardInbox(role, personId)
  const highItems = items.filter(i => i.urgency === 'high')
  const normalItems = items.filter(i => i.urgency !== 'high')

  const dashboardHref = `/${role}/dashboard`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Action Center</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Your priorities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Everything that needs your attention, in one place.
          </p>
        </div>
        <Link
          href={dashboardHref}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground">Total</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/20">
                <Bell className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{items.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">open item{items.length === 1 ? '' : 's'}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground">Urgent</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{highItems.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">need quick action</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-muted-foreground">Follow-up</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{normalItems.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">when you have time</p>
          </CardContent>
        </Card>
      </div>

      {items.length === 0 && (
        <Card className="rounded-2xl border-border">
          <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-foreground">You&apos;re all caught up.</p>
            <p className="text-xs text-muted-foreground">Nothing currently needs your attention. Nice work.</p>
          </CardContent>
        </Card>
      )}

      {highItems.length > 0 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1.5">
            {highItems.map(item => <InboxRow key={item.id} item={item} />)}
          </CardContent>
        </Card>
      )}

      {normalItems.length > 0 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-1.5">
            {normalItems.map(item => <InboxRow key={item.id} item={item} />)}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InboxRow({ item }: { item: InboxItem }) {
  const isHigh = item.urgency === 'high'
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group ${
        isHigh
          ? 'bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20'
          : 'bg-muted/40 hover:bg-muted/70 border border-transparent'
      }`}
    >
      <div
        className="w-1 h-10 rounded-full shrink-0"
        style={{ background: isHigh ? '#F59E0B' : '#00B8A9' }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-border text-muted-foreground">
            {TYPE_LABEL[item.type] ?? item.type}
          </Badge>
        </div>
        <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
        {item.count !== undefined && (
          <p className="text-[10px] text-muted-foreground">{item.count} item{item.count !== 1 ? 's' : ''}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
    </Link>
  )
}
