'use client'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Bot, User, CheckCircle2, Zap, ChevronRight, BookOpen, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MarkdownRenderer } from '@/components/ui/markdown'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'assistant'; content: string; timestamp: Date }

const subjects = [
  { id: 'math', label: 'Mathematics', color: 'bg-info', lightBg: 'bg-info/10', textColor: 'text-info', topics: ['Algebra', 'Quadratic Equations', 'Statistics', 'Trigonometry'] },
  { id: 'physics', label: 'Physics', color: 'bg-primary-variant', lightBg: 'bg-primary-variant/10', textColor: 'text-primary-variant', topics: ["Newton's Laws", 'Waves & Optics', 'Thermodynamics', 'Electricity'] },
  { id: 'english', label: 'English', color: 'bg-primary', lightBg: 'bg-primary/10', textColor: 'text-primary', topics: ['Essay Writing', 'Reading Comprehension', 'Grammar', 'Literature'] },
]

const aiResponses: Record<string, string[]> = {
  Algebra: [
    "Great choice! Algebra is the foundation of mathematics. Let's start with key concepts:\n\n**Variables and Expressions**\nA variable is a symbol (like x or y) that represents an unknown value.\n\n**Example:** If 3x + 6 = 15, what is x?\n\nStep 1: Subtract 6 from both sides → 3x = 9\nStep 2: Divide by 3 → x = 3 ✓\n\nWould you like to try a practice problem?",
  ],
  'Quadratic Equations': [
    "Quadratic equations have the form **ax² + bx + c = 0**.\n\n**The Quadratic Formula:**\nx = (-b ± √(b² - 4ac)) / 2a\n\n**Example:** Solve x² - 5x + 6 = 0\n- a=1, b=-5, c=6\n- x = (5 ± √(25-24)) / 2 = (5 ± 1) / 2\n- x = 3 or x = 2 ✓\n\nThe discriminant (b²-4ac) tells us the number of solutions. Ready to practice?",
  ],
  "Newton's Laws": [
    "Newton's Three Laws of Motion are fundamental to physics:\n\n**1st Law (Inertia):** An object at rest stays at rest; an object in motion stays in motion unless acted upon by a net force.\n\n**2nd Law:** F = ma (Force = mass × acceleration)\n\n**3rd Law:** For every action, there is an equal and opposite reaction.\n\n**Example:** A 5kg box accelerates at 2 m/s². What force acts on it?\nF = 5 × 2 = **10 Newtons** ✓",
  ],
  'Essay Writing': [
    "A strong essay follows the **PEEL structure**:\n\n**P**oint — State your main argument clearly\n**E**vidence — Support with facts or examples\n**E**xplain — Analyze how the evidence supports your point\n**L**ink — Connect back to the question\n\n**Tips for a great introduction:**\n• Start with a hook (statistic, question, or bold statement)\n• Provide brief context\n• End with a clear thesis statement\n\nWould you like me to review your thesis statement?",
  ],
}

const practiceQuestions: Record<string, { question: string; answer: string; hint: string }> = {
  Algebra: {
    question: 'Solve for x: 2x + 8 = 20',
    answer: 'x = 6',
    hint: 'First subtract 8 from both sides, then divide by 2',
  },
  'Quadratic Equations': {
    question: 'Solve: x² - 7x + 12 = 0',
    answer: 'x = 3 or x = 4',
    hint: 'Factor the equation: (x - 3)(x - 4) = 0',
  },
  "Newton's Laws": {
    question: 'A 10kg object accelerates at 3 m/s². What is the net force?',
    answer: 'F = 30 Newtons',
    hint: 'Use F = ma',
  },
  'Essay Writing': {
    question: 'Write a thesis statement for: "Should social media be banned in schools?"',
    answer: 'Example: "While social media poses distractions, banning it outright in schools is counterproductive; instead, guided digital literacy programs equip students to use it responsibly."',
    hint: 'A good thesis takes a clear position and gives a reason',
  },
}

export default function StudentAiTutor() {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'chat' | 'practice'>('chat')
  const [practiceState, setPracticeState] = useState<'question' | 'answered'>('question')
  const [masteredTopics, setMasteredTopics] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function selectTopic(topic: string) {
    setSelectedTopic(topic)
    setMode('chat')
    setPracticeState('question')
    const response = aiResponses[topic]?.[0] ?? `Let's explore **${topic}** together! Ask me anything about this topic.`
    setMessages([{
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }])
  }

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const history = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const assistantMsg: Message = { role: 'assistant', content: '', timestamp: new Date() }
    setIsTyping(false)
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, subject: selectedSubject.label, topic: selectedTopic, mode }),
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
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: updated[updated.length - 1].content + chunk }
            return updated
          })
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: 'Sorry, I could not reach the AI service. Please try again.' }
        return updated
      })
    }
  }

  function startPractice() {
    setMode('practice')
    setPracticeState('question')
    const q = practiceQuestions[selectedTopic ?? '']
    if (!q) return
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `**Practice Time!**\n\n${q.question}\n\n_Hint: ${q.hint}_\n\nType your answer below!`,
      timestamp: new Date(),
    }])
  }

  async function submitAnswer() {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setPracticeState('answered')
    setMode('chat')

    const history = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const assistantMsg: Message = { role: 'assistant', content: '', timestamp: new Date() }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, subject: selectedSubject.label, topic: selectedTopic, mode: 'practice' }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let fullResponse = ''
      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          const chunk = decoder.decode(value)
          fullResponse += chunk
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullResponse }
            return updated
          })
        }
      }
      if (selectedTopic && fullResponse.toLowerCase().includes('correct') && !masteredTopics.includes(selectedTopic)) {
        setMasteredTopics(prev => [...prev, selectedTopic])
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: 'Sorry, I could not reach the AI service. Please try again.' }
        return updated
      })
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col p-4 md:p-6 lg:p-8 gap-6">
      {/* Header */}
      <div className="shrink-0">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">AI-Powered Learning</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Tutor</h1>
        <p className="text-sm text-muted-foreground mt-1">Get personalized help with any subject</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_220px] gap-4 min-h-0">
        {/* Left: Subject & Topic selector */}
        <Card className="border-border/50 overflow-hidden flex flex-col">
          <CardHeader className="pb-3 bg-accent/30 border-b border-border shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Select Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {subjects.map((sub) => (
                <div key={sub.id}>
                  <button
                    onClick={() => { setSelectedSubject(sub); setSelectedTopic(null); setMessages([]) }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      selectedSubject.id === sub.id
                        ? `${sub.lightBg} ${sub.textColor}`
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <div className={cn('w-2.5 h-2.5 rounded-full', sub.color)} />
                    {sub.label}
                  </button>
                  {selectedSubject.id === sub.id && (
                    <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-border pl-3">
                      {sub.topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => selectTopic(topic)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                            selectedTopic === topic
                              ? `${sub.lightBg} ${sub.textColor} font-medium`
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          )}
                        >
                          {masteredTopics.includes(topic) && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                          )}
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Center: Chat */}
        <Card className="border-border/50 flex flex-col min-h-0 overflow-hidden">
          {!selectedTopic ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">Select a topic to get started</p>
                <p className="text-sm text-muted-foreground mt-1">Choose a subject and topic from the left panel</p>
              </div>
            </div>
          ) : (
            <>
              <CardHeader className="pb-3 border-b border-border shrink-0 bg-accent/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', selectedSubject.lightBg)}>
                      <Bot className={cn('w-4 h-4', selectedSubject.textColor)} />
                    </div>
                    <div>
                      <span className="text-foreground">{selectedTopic}</span>
                      <p className="text-xs font-normal text-muted-foreground">{selectedSubject.label}</p>
                    </div>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5"
                    onClick={startPractice}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Practice Mode
                  </Button>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                      <div className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                        msg.role === 'assistant' ? 'bg-primary/10' : 'bg-accent'
                      )}>
                        {msg.role === 'assistant'
                          ? <Bot className="w-4 h-4 text-primary" />
                          : <User className="w-4 h-4 text-muted-foreground" />
                        }
                      </div>
                      <div className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        msg.role === 'assistant'
                          ? 'bg-card border border-border text-foreground'
                          : 'bg-primary text-primary-foreground'
                      )}>
                        {msg.role === 'assistant' ? <MarkdownRenderer content={msg.content} size="sm" /> : msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-card border border-border rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5 items-center h-5">
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border shrink-0 bg-card">
                <div className="flex gap-3">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); mode === 'practice' && practiceState === 'question' ? submitAnswer() : sendMessage() } }}
                    placeholder={mode === 'practice' ? 'Type your answer...' : 'Ask a question...'}
                    className="flex-1 bg-accent border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  />
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl shrink-0"
                    onClick={mode === 'practice' && practiceState === 'question' ? submitAnswer : sendMessage}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Right: Progress */}
        <div className="space-y-4 hidden lg:block">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Mastered Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {masteredTopics.length === 0 ? (
                <p className="text-xs text-muted-foreground">Complete practice to earn mastery badges</p>
              ) : (
                <div className="space-y-2">
                  {masteredTopics.map(t => (
                    <div key={t} className="flex items-center gap-2 text-sm text-success">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Ask specific questions for better answers', 'Use Practice Mode to test yourself', 'Revisit topics you find challenging'].map(tip => (
                <div key={tip} className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
