import { Bell, Mail, MessageSquare, Globe, CheckCircle2, XCircle, Clock, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { notifications, notificationTemplates } from '@/data/mock-registration'

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === 'Email') return <Mail className="w-3.5 h-3.5 text-blue-400" />
  if (channel === 'SMS') return <MessageSquare className="w-3.5 h-3.5 text-green-400" />
  return <Globe className="w-3.5 h-3.5 text-purple-400" />
}

function DeliveryIcon({ status }: { status: string }) {
  if (status === 'Read') return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
  if (status === 'Delivered') return <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
  if (status === 'Bounced') return <XCircle className="w-3.5 h-3.5 text-red-400" />
  return <Clock className="w-3.5 h-3.5 text-amber-400" />
}

function deliveryBadgeClass(status: string) {
  if (status === 'Read') return 'bg-green-500/10 text-green-400 border-green-500/20'
  if (status === 'Delivered') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  if (status === 'Bounced') return 'bg-red-500/10 text-red-400 border-red-500/20'
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
}

export function Communications() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Notification timeline */}
      <div className="xl:col-span-2 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Notification Timeline</h3>
          <Badge variant="outline" className="text-[10px]">{notifications.length} sent</Badge>
        </div>
        <Card className="border-border">
          <ScrollArea className="h-[420px]">
            <div className="p-4 space-y-0">
              {notifications.map((n, i) => (
                <div key={n.id} className="flex gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <ChannelIcon channel={n.channel} />
                    </div>
                    {i < notifications.length - 1 && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
                  </div>
                  {/* Content */}
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{n.subject}</p>
                        <p className="text-[10px] text-muted-foreground">To: {n.recipientName} · {n.channel}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={`text-[9px] ${deliveryBadgeClass(n.deliveryStatus)}`}>{n.deliveryStatus}</Badge>
                        <DeliveryIcon status={n.deliveryStatus} />
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground/60 mt-1">{n.sentDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Right column: templates + composer */}
      <div className="space-y-4">
        {/* Templates */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Notification Templates</h3>
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="space-y-2">
                {notificationTemplates.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-start gap-2 bg-muted/20 rounded-lg px-2.5 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{t.name}</p>
                      <p className="text-[9px] text-muted-foreground">{t.channel} · {t.trigger}</p>
                    </div>
                    <button className="text-[9px] text-primary hover:underline shrink-0">Edit</button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-7">View All Templates</Button>
            </CardContent>
          </Card>
        </div>

        {/* Composer */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Send Message</h3>
          <Card className="border-border">
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Recipient</Label>
                <Input placeholder="Search applicant…" className="text-xs h-8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Channel</Label>
                <Select defaultValue="email">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="portal">Portal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Template</Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select template…" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Message</Label>
                <Textarea
                  placeholder="Type your message…"
                  className="text-xs resize-none h-24"
                />
              </div>
              <Button className="w-full gap-1.5 text-xs bg-primary hover:bg-primary/90">
                <Send className="w-3.5 h-3.5" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
