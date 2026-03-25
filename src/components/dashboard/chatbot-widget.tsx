import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, X, LayoutGrid } from 'lucide-react'
import { chatMessages, type ChatMessage } from '@/data/mock-class-activities'
import { useChatContext } from '@/stores/chat-context-store'
import { cn } from '@/lib/utils'

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { contexts, removeContext } = useChatContext()
  const prevContextKeys = useRef<Set<string>>(new Set(Object.keys(contexts)))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
  }

  const contextEntries = Object.entries(contexts)

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px]">
          <Card className="rounded-2xl border-border bg-card shadow-2xl pb-0">
            <CardHeader className="pb-3 shrink-0">
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
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Page context indicator */}
              <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded-lg bg-muted/40 border border-border">
                <LayoutGrid className="w-3 h-3 text-primary shrink-0" />
                <span className="text-[10px] text-muted-foreground">Page context: <span className="text-foreground font-medium">Class Activities Dashboard</span></span>
              </div>

              {/* Active context chips */}
              {contextEntries.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {contextEntries.map(([id, entry]) => (
                    <div key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-medium">
                      {entry.label}
                      <button onClick={() => removeContext(id)} className="hover:text-destructive transition-colors ml-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex flex-col gap-3 p-4">
              <ScrollArea className="h-[260px] pr-2">
                <div className="space-y-3">
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
                          {msg.content}
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
