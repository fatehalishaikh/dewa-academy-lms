import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send } from 'lucide-react'
import { chatMessages } from '@/data/mock-class-activities'
import { cn } from '@/lib/utils'

export function ChatbotWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-chart-4 inline-block" />
            Online
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Automates queries, notifications & scheduling</p>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-3">
        <ScrollArea className="h-[220px] pr-2">
          <div className="space-y-3">
            {chatMessages.map((msg, i) => {
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
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex items-center gap-2 mt-auto">
          <input
            type="text"
            placeholder="Ask about attendance, schedules, or student updates..."
            disabled
            className="flex-1 h-9 px-3 text-xs rounded-full bg-muted border border-border text-muted-foreground placeholder:text-muted-foreground/60 cursor-not-allowed outline-none"
          />
          <Button
            size="icon"
            disabled
            className="w-9 h-9 rounded-full shrink-0"
            style={{ background: '#00B8A9', opacity: 0.5 }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
