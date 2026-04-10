'use client'
import { Bell, Mail, MessageSquare, Monitor, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { notificationChannels, automationTriggers } from '@/data/mock-ilp'
import { useAcademyStore } from '@/stores/academy-store'

const channelIcons: Record<string, React.ElementType> = {
  Mail, MessageSquare, Bell, Monitor,
}

const channelColors: Record<string, string> = {
  Email: '#3B82F6',
  SMS: '#4CAF50',
  'In-App': '#00B8A9',
  Dashboard: '#8B9BB4',
}

export default function Notifications() {
  const { ilpSettings, setNotificationsEnabled } = useAcademyStore()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Notification &amp; Automation Rules</h2>
          <p className="text-xs text-muted-foreground">Configure notification channels and automation triggers</p>
        </div>
        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ILP 2.4</Badge>
      </div>

      {/* Channels */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Notification Channels</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Enable channels for student, parent, and educator notifications</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {notificationChannels.map(ch => {
              const Icon = channelIcons[ch.icon] ?? Bell
              const color = channelColors[ch.name] ?? '#00B8A9'
              return (
                <div key={ch.name} className={`rounded-xl border p-4 space-y-3 transition-colors ${
                  ch.enabled ? 'border-border bg-card' : 'border-border/50 bg-muted/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}15` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <Switch
                      checked={ch.enabled}
                      onCheckedChange={(v) => setNotificationsEnabled(v)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{ch.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {ch.enabled ? `${ch.recipientCount} recipients` : 'Disabled'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automation triggers */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Automation Triggers</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Events that automatically trigger notifications or actions</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full text-xs gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Trigger
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] h-8">Trigger Event</TableHead>
                  <TableHead className="text-[11px] h-8">Condition</TableHead>
                  <TableHead className="text-[11px] h-8">Action</TableHead>
                  <TableHead className="text-[11px] h-8">Recipients</TableHead>
                  <TableHead className="text-[11px] h-8 text-center w-20">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationTriggers.map(trigger => (
                  <TableRow key={trigger.id} className={`hover:bg-muted/20 ${!trigger.enabled ? 'opacity-50' : ''}`}>
                    <TableCell className="text-xs font-medium py-2.5">{trigger.event}</TableCell>
                    <TableCell className="text-xs text-muted-foreground py-2.5">{trigger.condition}</TableCell>
                    <TableCell className="text-xs py-2.5">{trigger.action}</TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {trigger.recipients.split(', ').map(r => (
                          <Badge key={r} variant="outline" className="text-[10px] bg-muted/40">{r}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-2.5">
                      <Switch defaultChecked={trigger.enabled} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
