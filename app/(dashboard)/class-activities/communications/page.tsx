'use client'
import { useState } from 'react'
import { Bell, Send, Users, User, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { academyClasses as mockClasses } from '@/data/mock-classes'
import { useAcademyStore } from '@/stores/academy-store'

type Audience = 'class' | 'all' | 'individual'
type MessageStatus = 'sent' | 'scheduled'

type SentMessage = {
  id: string
  title: string
  body: string
  audience: Audience
  audienceLabel: string
  sentAt: string
  status: MessageStatus
  recipients: number
}

const TEMPLATES = [
  { label: 'Assignment Reminder',   body: 'This is a reminder that [Assignment Name] is due on [Date]. Please ensure your work is submitted on time.' },
  { label: 'Parent Meeting Notice', body: 'Dear Parents/Guardians, we would like to invite you to a parent-teacher meeting on [Date] at [Time] in [Room].' },
  { label: 'Exam Schedule',         body: 'Please be advised that the upcoming [Subject] exam is scheduled for [Date] from [Time]. Ensure you have reviewed all relevant chapters.' },
  { label: 'Achievement Notice',    body: 'We are pleased to inform you that [Student/Class] has demonstrated excellent performance this term. Keep up the great work!' },
]

const INITIAL_MESSAGES: SentMessage[] = [
  {
    id: 'msg-001',
    title: 'Midterm Exam Schedule',
    body: 'Please be advised that midterm exams begin on 1st April. Timetables have been posted on the notice board.',
    audience: 'all',
    audienceLabel: 'All Students & Parents',
    sentAt: '2026-03-24T09:00:00',
    status: 'sent',
    recipients: 312,
  },
  {
    id: 'msg-002',
    title: 'Math 10A — Assignment Due Friday',
    body: 'Reminder: Chapter 5 problem set is due this Friday. Late submissions will receive a 10% penalty.',
    audience: 'class',
    audienceLabel: 'Math 10A',
    sentAt: '2026-03-25T11:30:00',
    status: 'sent',
    recipients: 28,
  },
  {
    id: 'msg-003',
    title: 'Physics Lab Safety Briefing',
    body: 'All Physics 9B students must bring signed safety consent forms to Thursday\'s lab session. Students without forms will not be permitted to participate.',
    audience: 'class',
    audienceLabel: 'Physics 9B',
    sentAt: '2026-03-26T08:00:00',
    status: 'scheduled',
    recipients: 24,
  },
]

export default function ClassActivitiesCommunications() {
  const { addNotification } = useAcademyStore()
  const [messages, setMessages] = useState<SentMessage[]>(INITIAL_MESSAGES)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<Audience>('class')
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]?.id ?? '')
  const [isSending, setIsSending] = useState(false)

  function applyTemplate(templateBody: string, templateLabel: string) {
    setTitle(templateLabel)
    setBody(templateBody)
  }

  function getAudienceLabel() {
    if (audience === 'all') return 'All Students & Parents'
    if (audience === 'individual') return 'Individual Student'
    return mockClasses.find(c => c.id === selectedClass)?.name ?? 'Selected Class'
  }

  function getRecipientCount() {
    if (audience === 'all') return 312
    if (audience === 'individual') return 1
    return mockClasses.find(c => c.id === selectedClass)?.studentIds.length ?? 0
  }

  function handleSend() {
    if (!title || !body) return
    setIsSending(true)
    setTimeout(() => {
      const newMsg: SentMessage = {
        id: `msg-${Date.now()}`,
        title,
        body,
        audience,
        audienceLabel: getAudienceLabel(),
        sentAt: new Date().toISOString(),
        status: 'sent',
        recipients: getRecipientCount(),
      }
      setMessages(prev => [newMsg, ...prev])
      addNotification({
        type: 'message',
        title: title,
        body: body,
        recipientRole: audience === 'all' ? 'all' : audience === 'individual' ? 'student' : 'student',
      })
      setTitle('')
      setBody('')
      setIsSending(false)
    }, 1000)
  }

  return (
    <div className="space-y-5">
      {/* Compose */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Compose Announcement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Templates */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Templates</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => applyTemplate(t.body, t.label)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Send to</p>
            <div className="flex items-center gap-2 flex-wrap">
              {([
                { value: 'class' as const,      label: 'Specific Class', icon: Users  },
                { value: 'all' as const,         label: 'Everyone',       icon: Users  },
                { value: 'individual' as const,  label: 'Individual',     icon: User   },
              ]).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setAudience(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    audience === value
                      ? 'border-primary/30 text-primary bg-primary/10'
                      : 'border-border text-muted-foreground hover:border-border/70'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
              {audience === 'class' && (
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                >
                  {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Subject *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Important: Exam Schedule Update"
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Message *</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your announcement here…"
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSend}
              disabled={!title || !body || isSending}
              className="gap-1.5"
            >
              {isSending ? (
                <><span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /> Sending…</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Send Now</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              → {getAudienceLabel()} · {getRecipientCount()} recipient{getRecipientCount() !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Message history */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-sm">Announcement History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {messages.map(msg => (
              <div key={msg.id} className="px-5 py-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.status === 'sent' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                  {msg.status === 'sent'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <Clock className="w-4 h-4 text-amber-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground truncate">{msg.title}</p>
                    <Badge variant="outline" className={`text-[11px] h-4 shrink-0 ${msg.status === 'sent' ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'}`}>
                      {msg.status === 'sent' ? 'Sent' : 'Scheduled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{msg.body}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Avatar className="w-3 h-3 inline-block">
                        <AvatarFallback className="text-[6px] bg-primary/20 text-primary">→</AvatarFallback>
                      </Avatar>
                      {msg.audienceLabel}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{msg.recipients} recipients</span>
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      {new Date(msg.sentAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} at {new Date(msg.sentAt).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
