import { Activity, CheckCircle2, AlertTriangle, ArrowUpDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { progressTimeline, recentNotifications } from '@/data/mock-ilp'

const notifConfig = {
  milestone: { icon: CheckCircle2, color: '#4CAF50', badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20', label: 'Milestone' },
  alert: { icon: AlertTriangle, color: '#EF4444', badge: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Alert' },
  status_change: { icon: ArrowUpDown, color: '#FFC107', badge: 'bg-chart-5/10 text-chart-5 border-chart-5/20', label: 'Status' },
}

export function ProgressTrackingWidget() {
  const latestCompletion = progressTimeline[progressTimeline.length - 1].completion
  const latestEngagement = progressTimeline[progressTimeline.length - 1].engagement

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Automated Progress Tracking</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
              Live
            </Badge>
            <AddContextButton
              id="ilp-progress-tracking"
              entry={{
                label: 'Automated Progress Tracking',
                summary: `Class-wide completion rate at ${latestCompletion}% (up from 42% at term start). Engagement at ${latestEngagement}%. 4 automated notifications sent today: Ahmed Al-Rashid completed Mathematics Core, Omar Khalil flagged for inactivity (4 days), Reem Al-Zaabi status changed to At-Risk, Sara Al-Mansoori earned English Mastery badge.`
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">12-week completion &amp; engagement trends</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress area chart */}
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={progressTimeline} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="ilpCompletionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00B8A9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ilpEngagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="" />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} domain={[30, 100]} />
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
                formatter={(val: any, name: any) => [`${val}%`, name === 'completion' ? 'Completion' : 'Engagement']}
              />
              <Area type="monotone" dataKey="completion" stroke="#00B8A9" strokeWidth={2}
                fill="url(#ilpCompletionGrad)" name="completion" dot={false} />
              <Area type="monotone" dataKey="engagement" stroke="#4CAF50" strokeWidth={2}
                fill="url(#ilpEngagementGrad)" name="engagement" strokeDasharray="4 2" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-primary rounded" />
            <span className="text-[11px] text-muted-foreground">Completion {latestCompletion}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ borderTop: '2px dashed #4CAF50' }} />
            <span className="text-[11px] text-muted-foreground">Engagement {latestEngagement}%</span>
          </div>
        </div>

        {/* Recent notifications */}
        <div className="space-y-1.5">
          {recentNotifications.map((n, i) => {
            const cfg = notifConfig[n.type]
            const Icon = cfg.icon
            return (
              <div key={i} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-muted/40">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground truncate">{n.text}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{n.student}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="outline" className={`text-[10px] ${cfg.badge}`}>{cfg.label}</Badge>
                  <span className="text-[10px] text-muted-foreground">{n.timeAgo}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
