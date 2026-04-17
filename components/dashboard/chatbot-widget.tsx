import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, X, LayoutGrid, Trash2, Maximize2, Minimize2, Info } from 'lucide-react'
import { chatMessages, type ChatMessage } from '@/data/mock-class-activities'
import { useChatContext } from '@/stores/chat-context-store'
import { usePageAutoContext } from '@/hooks/use-page-auto-context'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/ui/markdown'

const PAGE_NAMES: Record<string, string> = {
  // Class Activities
  '/class-activities/dashboard':    'Class Activities Dashboard',
  '/class-activities/timetable':    'Class Activities — Timetable',
  '/class-activities/attendance':   'Class Activities — Attendance',
  '/class-activities/lessons':      'Class Activities — Lesson Plans',
  '/class-activities/engagement':   'Class Activities — Engagement',
  '/class-activities/communications': 'Class Activities — Communications',
  // Assessments
  '/assessments/dashboard':         'Assessments Dashboard',
  '/assessments/question-bank':     'Assessments — Question Bank',
  '/assessments/create-exam':       'Assessments — Create Exam',
  '/assessments/schedule':          'Assessments — Schedule',
  '/assessments/grading':           'Assessments — Grading',
  '/assessments/results':           'Assessments — Results',
  // ILP
  '/ilp/dashboard':                 'ILP Dashboard',
  '/ilp/profile-assessment':        'ILP — Profile Assessment',
  '/ilp/pathway-builder':           'ILP — Pathway Builder',
  '/ilp/curation-rules':            'ILP — Curation Rules',
  '/ilp/risk-intervention':         'ILP — Risk & Intervention',
  '/ilp/notifications':             'ILP — Notifications',
  '/ilp/goal-setting':              'ILP — Goal Setting',
  '/ilp/content-management':        'ILP — Content Management',
  '/ilp/data-connection':           'ILP — Data Connection',
  // Curriculum
  '/curriculum/dashboard':          'Curriculum Dashboard',
  '/curriculum/builder':            'Curriculum — Builder',
  '/curriculum/standards':          'Curriculum — Standards',
  '/curriculum/templates':          'Curriculum — Templates',
  '/curriculum/resources':          'Curriculum — Resources',
  '/curriculum/review':             'Curriculum — Review',
  // Registration
  '/registration/dashboard':        'Registration Dashboard',
  '/registration/applications':     'Registration — Applications',
  '/registration/new-application':  'Registration — New Application',
  '/registration/document-verification': 'Registration — Document Verification',
  '/registration/ai-scoring':       'Registration — AI Scoring',
  '/registration/communications':   'Registration — Communications',
  '/registration/integrations':     'Registration — Integrations',
  // Teacher
  '/teacher/classes':               'Teacher — My Classes',
  '/teacher/homework':              'Teacher — Homework',
  '/teacher/homework/create':       'Teacher — Create Homework',
  '/teacher/gradebook':             'Teacher — Gradebook',
  '/teacher/students':              'Teacher — Students',
  // Admin
  '/admin/students':                'Admin — All Students',
  // Parent
  '/parent/dashboard':              'Parent Portal — Overview',
  '/parent/grades':                 'Parent Portal — Child\'s Grades',
  '/parent/attendance':             'Parent Portal — Attendance',
  '/parent/communication':               'Parent Portal — Communication',
  '/parent/leave-request':          'Parent Portal — Leave Request',
  '/parent/reports':                'Parent Portal — Progress Reports',
  // Reports
  '/reports/dashboard':             'Reports Dashboard',
  '/reports/academic':              'Reports — Academic',
  '/reports/attendance':            'Reports — Attendance',
  '/reports/engagement':            'Reports — Engagement',
  '/reports/exams':                 'Reports — Exams',
  '/reports/builder':               'Reports — Report Builder',
}

function getPageName(pathname: string | null): string {
  if (!pathname) return 'Dashboard'
  if (PAGE_NAMES[pathname]) return PAGE_NAMES[pathname]
  if (pathname.startsWith('/teacher/students/')) return 'Teacher — Student Analysis'
  if (pathname.startsWith('/teacher/homework/')) return 'Teacher — Homework Detail'
  if (pathname.startsWith('/teacher/classes/')) return 'Teacher — Class Detail'
  if (pathname.startsWith('/admin/students/')) return 'Admin — Student Analysis'
  return 'Dashboard'
}

export function ChatbotWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { contexts, removeContext, clearContexts } = useChatContext()
  const autoContext = usePageAutoContext(pathname ?? '')
  const prevContextKeys = useRef<Set<string>>(new Set(Object.keys(contexts)))
  const prevPathname = useRef<string>(pathname)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  // Inject a system message and clear contexts when the page changes
  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname
    clearContexts()
    prevContextKeys.current = new Set()
    const pageName = getPageName(pathname)
    setMessages(prev => [
      ...prev,
      { role: 'system', content: `Switched to ${pageName}. Previous context cleared.` },
    ])
  }, [pathname, clearContexts])

  // Inject a system message when a new context is added
  useEffect(() => {
    const current = new Set(Object.keys(contexts))
    current.forEach(key => {
      if (!prevContextKeys.current.has(key)) {
        const entry = contexts[key]
        setMessages(prev => [
          ...prev,
          { role: 'system', content: `Context added — ${entry.label}: ${entry.summary}` },
        ])
      }
    })
    prevContextKeys.current = current
  }, [contexts])

  function handleClear() {
    setMessages([])
    clearContexts()
    prevContextKeys.current = new Set()
  }

  async function handleSend() {
    const text = input.trim()
    if (!text) return
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    const history = messages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => ({ role: m.role === 'bot' ? 'assistant' as const : 'user' as const, content: m.content }))
    history.push({ role: 'user', content: text })

    const assistantMsg: ChatMessage = { role: 'bot', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, pageContext: getPageName(pathname), contexts, autoContext }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          const chunk = decoder.decode(value)
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'bot' as const, content: updated[updated.length - 1].content + chunk }
            return updated
          })
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'bot' as const, content: 'Sorry, I could not reach the AI service. Please try again.' }
        return updated
      })
    }
  }

  const contextEntries = Object.entries(contexts)

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className={cn('fixed bottom-20 right-6 z-50 transition-all duration-200', expanded ? 'w-[560px]' : 'w-[360px]')}>
          <Card className="rounded-2xl border-border bg-card shadow-2xl pb-0 gap-2">
            <CardHeader className="pb-0 shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-4 inline-block" />
                    Online
                  </Badge>
                  <button onClick={() => setExpanded(e => !e)} title={expanded ? 'Collapse' : 'Expand'} className="text-muted-foreground hover:text-foreground transition-colors">
                    {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={handleClear} title="Clear chat" className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Page context indicator */}
              <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded-lg bg-muted/40 border border-border">
                <LayoutGrid className="w-3 h-3 text-primary shrink-0" />
                <span className="text-[11px] text-muted-foreground">Page context: <span className="text-foreground font-medium">{getPageName(pathname)}</span></span>
              </div>

              {/* Auto page entity context */}
              {autoContext && (
                <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                  <Info className="w-3 h-3 text-primary/50 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{autoContext}</span>
                </div>
              )}

              {/* Active context chips */}
              {contextEntries.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {contextEntries.map(([id, entry]) => (
                    <div key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary font-medium">
                      {entry.label}
                      <button onClick={() => removeContext(id)} className="hover:text-destructive transition-colors ml-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex flex-col gap-3 px-4 pt-2 pb-4">
              <ScrollArea className={cn('transition-all duration-200', expanded ? 'h-[460px]' : 'h-[260px]')}>
                <div className="space-y-3 pr-3">
                  {messages.map((msg, i) => {
                    if (msg.role === 'system') {
                      return (
                        <div key={i} className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/15">
                          <p className="text-[11px] text-primary leading-relaxed">{msg.content}</p>
                        </div>
                      )
                    }
                    const isUser = msg.role === 'user'
                    return (
                      <div key={i} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[85%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed',
                            isUser
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-muted text-foreground rounded-bl-sm'
                          )}
                        >
                          {isUser ? msg.content : <MarkdownRenderer content={msg.content} size="xs" />}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about attendance, schedules..."
                  className="flex-1 h-9 px-3 text-xs rounded-full bg-muted border border-border text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="w-9 h-9 rounded-full shrink-0"
                  style={{ background: '#00B8A9' }}
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: '#00B8A9' }}
        aria-label={open ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  )
}
