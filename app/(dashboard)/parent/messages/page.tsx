'use client'
import { useState } from 'react'
import { Sparkles, MessageSquare, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'


type Message = {
  id: string
  from: string
  fromInitials: string
  fromColor: string
  subject: string
  preview: string
  body: string
  date: string
  read: boolean
  type: 'automated' | 'manual'
}

const initialMessages: Message[] = [
  {
    id: 'msg-001',
    from: 'Dr. Sarah Ahmed',
    fromInitials: 'SA',
    fromColor: '#00B8A9',
    subject: 'Ahmed\'s progress in Mathematics',
    preview: 'I wanted to share some positive feedback about Ahmed\'s recent performance...',
    body: "Dear Mohammed,\n\nI wanted to share some positive feedback about Ahmed's recent performance in Mathematics. He has shown excellent improvement in his problem-solving skills and his Chapter 4 quiz score of 92% reflects this.\n\nI believe with continued effort, he can achieve an A grade for the semester. Please encourage him to review the quadratic equations material ahead of next week's assessment.\n\nBest regards,\nDr. Sarah Ahmed\nMathematics Teacher",
    date: 'Mar 24, 2026',
    read: false,
    type: 'manual',
  },
  {
    id: 'msg-002',
    from: 'DEWA Academy System',
    fromInitials: 'DA',
    fromColor: '#F59E0B',
    subject: 'Attendance Alert — Mar 20',
    preview: 'Ahmed Al-Rashid was marked late for today\'s morning session...',
    body: "Dear Parent/Guardian,\n\nThis is an automated notification to inform you that Ahmed Al-Rashid was marked late for the morning session on March 20, 2026. He arrived approximately 15 minutes after the session started.\n\nIf this absence/tardiness was due to a medical or family reason, please contact the school office to provide an excuse note.\n\nThank you for your cooperation.\n\nDEWA Academy Administration",
    date: 'Mar 20, 2026',
    read: true,
    type: 'automated',
  },
  {
    id: 'msg-003',
    from: 'Mr. James Wilson',
    fromInitials: 'JW',
    fromColor: '#0EA5E9',
    subject: 'Physics Midterm Results',
    preview: 'The midterm results are now available. Ahmed scored 78/100...',
    body: "Dear Mohammed,\n\nThe Physics midterm results have been finalized and are now visible in the parent portal.\n\nAhmed scored 78/100, which is a passing grade. However, I noticed he struggled with the optics section. I would recommend reviewing Chapter 7 on refraction and total internal reflection.\n\nPlease don't hesitate to reach out if you'd like to discuss this further.\n\nKind regards,\nMr. James Wilson\nPhysics Teacher",
    date: 'Mar 19, 2026',
    read: true,
    type: 'manual',
  },
  {
    id: 'msg-004',
    from: 'DEWA Academy System',
    fromInitials: 'DA',
    fromColor: '#F59E0B',
    subject: 'Assignment Reminder: Quadratic Equations due Mar 27',
    preview: 'A reminder that the Quadratic Equations Problem Set is due...',
    body: "Dear Parent/Guardian,\n\nThis is a reminder that the Quadratic Equations Problem Set for Mathematics is due on March 27, 2026.\n\nAs of today, Ahmed has not yet submitted this assignment. Please encourage him to complete and submit it on time to avoid a late penalty.\n\nThe assignment can be submitted through the Student Portal.\n\nThank you,\nDEWA Academy",
    date: 'Mar 25, 2026',
    read: true,
    type: 'automated',
  },
]

export default function ParentMessages() {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showCompose, setShowCompose] = useState(false)

  const selected = messages.find(m => m.id === selectedId)

  function openMessage(id: string) {
    setSelectedId(id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  function sendReply() {
    if (!replyText.trim()) return
    setReplyText('')
    // In real app, would send the reply
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Parent Communications</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowCompose(!showCompose)}>
          <MessageSquare className="w-3.5 h-3.5" />
          Compose
        </Button>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-4 h-[calc(100vh-240px)] min-h-[400px]">
        {/* Message list */}
        <Card className="rounded-2xl border-border flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg.id)}
                className={`w-full text-left p-4 border-b border-border hover:bg-accent transition-colors ${selectedId === msg.id ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-[10px] font-bold text-white" style={{ background: msg.fromColor }}>
                      {msg.fromInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs font-medium truncate ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.from}</p>
                      <p className="text-[10px] text-muted-foreground shrink-0 ml-2">{msg.date.split(',')[0]}</p>
                    </div>
                    <p className={`text-[11px] truncate ${!msg.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{msg.subject}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{msg.preview}</p>
                  </div>
                  {!msg.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Message detail */}
        <Card className="rounded-2xl border-border flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-2 text-center p-8">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Select a message to read</p>
            </div>
          ) : (
            <>
              <CardHeader className="pb-3 border-b border-border shrink-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="text-xs font-bold text-white" style={{ background: selected.fromColor }}>
                      {selected.fromInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm">{selected.subject}</CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">From {selected.from} · {selected.date}</p>
                  </div>
                  {selected.type === 'automated' && (
                    <Badge variant="outline" className="text-[10px] h-5 shrink-0">Automated</Badge>
                  )}
                </div>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.body}</p>
              </div>
              {selected.type === 'manual' && (
                <div className="p-4 border-t border-border shrink-0">
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                    <Button size="sm" className="h-auto self-stretch px-3" onClick={sendReply} disabled={!replyText.trim()}>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
