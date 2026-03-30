'use client'
import { useState } from 'react'
import { Plus, Wand2, ChevronDown, ChevronUp, CheckCircle2, Clock, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type LessonStatus = 'draft' | 'approved' | 'delivered'

type LessonPlan = {
  id: string
  title: string
  className: string
  subject: string
  date: string
  duration: number  // minutes
  status: LessonStatus
  objectives: string
  activities: string
  materials: string
  differentiation: string
}

const INITIAL_LESSONS: LessonPlan[] = [
  {
    id: 'lp-001',
    title: 'Introduction to Quadratic Equations',
    className: 'Math 10A',
    subject: 'Mathematics',
    date: '2026-03-25',
    duration: 50,
    status: 'delivered',
    objectives: 'Students will understand the standard form of a quadratic equation and be able to identify coefficients a, b, and c.',
    activities: '1. Warm-up: Review linear equations (5 min)\n2. Direct instruction: Introduce quadratic form ax² + bx + c = 0 (15 min)\n3. Worked examples on board (10 min)\n4. Pair practice: Identify coefficients in 5 equations (10 min)\n5. Exit ticket (10 min)',
    materials: 'Textbook Chapter 5, whiteboard, graphing calculators',
    differentiation: 'Extension: Students graph the parabola for each equation. Support: Provide formula card with definitions.',
  },
  {
    id: 'lp-002',
    title: 'Newton\'s Laws of Motion — Lab Session',
    className: 'Physics 9B',
    subject: 'Physics',
    date: '2026-03-26',
    duration: 80,
    status: 'approved',
    objectives: 'Apply Newton\'s 2nd law to calculate force, mass, and acceleration in practical experiments.',
    activities: '1. Safety briefing (5 min)\n2. Lab setup: trolleys and spring scales (10 min)\n3. Experiment A: constant mass, variable force (20 min)\n4. Experiment B: constant force, variable mass (20 min)\n5. Data recording and graph plotting (15 min)\n6. Group discussion and conclusions (10 min)',
    materials: 'Trolleys, spring scales, masses, measuring tape, graph paper',
    differentiation: 'Peer coaching pairs. Advanced students calculate friction coefficient.',
  },
  {
    id: 'lp-003',
    title: 'Persuasive Writing — Structure & Techniques',
    className: 'English 11A',
    subject: 'English',
    date: '2026-03-28',
    duration: 50,
    status: 'draft',
    objectives: 'Students will identify and apply PEEL paragraph structure in persuasive essays.',
    activities: '1. Analysis of model text (10 min)\n2. Deconstruct PEEL structure (10 min)\n3. Guided writing: one paragraph together (15 min)\n4. Independent writing: counter-argument paragraph (15 min)',
    materials: 'Sample persuasive essays, PEEL anchor chart, writing notebooks',
    differentiation: 'Sentence starters for EAL students. Peer evaluation checklist for advanced learners.',
  },
]

const statusConfig: Record<LessonStatus, { label: string; color: string; border: string; icon: React.ElementType }> = {
  draft:     { label: 'Draft',     color: 'text-amber-400',   border: 'border-amber-500/30',   icon: Clock        },
  approved:  { label: 'Approved',  color: 'text-blue-400',    border: 'border-blue-500/30',    icon: CheckCircle2 },
  delivered: { label: 'Delivered', color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
}

type CreateForm = {
  title: string; className: string; subject: string; date: string
  duration: string; objectives: string; activities: string
  materials: string; differentiation: string
}

const BLANK_FORM: CreateForm = {
  title: '', className: '', subject: '', date: '',
  duration: '50', objectives: '', activities: '', materials: '', differentiation: '',
}

export default function ClassActivitiesLessons() {
  const [lessons, setLessons] = useState<LessonPlan[]>(INITIAL_LESSONS)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateForm>(BLANK_FORM)
  const [isGenerating, setIsGenerating] = useState(false)

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  function setF<K extends keyof CreateForm>(k: K, v: CreateForm[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function handleAiSuggest() {
    if (!form.subject) return
    setIsGenerating(true)
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        title: prev.title || `${prev.subject} — Concept Review & Application`,
        objectives: 'Students will recall key concepts from the previous unit, apply them to new problem types, and evaluate their own understanding through self-assessment.',
        activities: '1. Retrieval practice: 5-question warm-up (10 min)\n2. Mini-lecture: Connect prior knowledge to new concept (15 min)\n3. Think-pair-share: worked examples (10 min)\n4. Independent practice (10 min)\n5. Self-assessment checklist (5 min)',
        materials: 'Textbook, mini whiteboards, printed practice sheets',
        differentiation: 'Tiered task cards: bronze/silver/gold difficulty levels. EAL vocabulary glossary provided.',
      }))
      setIsGenerating(false)
    }, 1800)
  }

  function handleCreate() {
    if (!form.title || !form.className || !form.date) return
    const newLesson: LessonPlan = {
      id: `lp-${Date.now()}`,
      title: form.title,
      className: form.className,
      subject: form.subject,
      date: form.date,
      duration: Number(form.duration) || 50,
      status: 'draft',
      objectives: form.objectives,
      activities: form.activities,
      materials: form.materials,
      differentiation: form.differentiation,
    }
    setLessons(prev => [newLesson, ...prev])
    setForm(BLANK_FORM)
    setShowCreate(false)
    setExpandedId(newLesson.id)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Lesson Plans</h2>
          <p className="text-xs text-muted-foreground">{lessons.length} plans · {lessons.filter(l => l.status === 'draft').length} drafts pending approval</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(v => !v)} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          New Lesson Plan
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">New Lesson Plan</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAiSuggest}
                disabled={isGenerating}
                className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                {isGenerating ? (
                  <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Generating…</>
                ) : (
                  <><Wand2 className="w-3 h-3" /> AI Suggest</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setF('title', e.target.value)} placeholder="e.g. Forces and Motion Lab"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Subject</label>
                <input type="text" value={form.subject} onChange={e => setF('subject', e.target.value)} placeholder="e.g. Physics"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Class *</label>
                <input type="text" value={form.className} onChange={e => setF('className', e.target.value)} placeholder="e.g. Physics 9B"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={e => setF('date', e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setF('duration', e.target.value)} min={10}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50" />
                </div>
              </div>
            </div>
            {[
              { key: 'objectives' as const,      label: 'Learning Objectives',      placeholder: 'What will students know/be able to do by end of lesson?' },
              { key: 'activities' as const,       label: 'Activities & Timing',      placeholder: '1. Warm-up (5 min)\n2. Direct instruction (15 min)…' },
              { key: 'materials' as const,        label: 'Materials & Resources',    placeholder: 'Textbook, worksheets, equipment…' },
              { key: 'differentiation' as const,  label: 'Differentiation',          placeholder: 'Extension tasks, support strategies, EAL accommodations…' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
                <textarea value={form[key]} onChange={e => setF(key, e.target.value)} placeholder={placeholder} rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleCreate} disabled={!form.title || !form.className || !form.date} className="text-xs">
                Save as Draft
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setShowCreate(false); setForm(BLANK_FORM) }} className="text-xs">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson list */}
      <div className="space-y-2">
        {lessons.map(lesson => {
          const cfg = statusConfig[lesson.status]
          const Icon = cfg.icon
          const isExpanded = expandedId === lesson.id
          return (
            <Card key={lesson.id} className="rounded-2xl border-border overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/10 transition-colors"
                onClick={() => toggleExpand(lesson.id)}
              >
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
                  <p className="text-[10px] text-muted-foreground">{lesson.className} · {new Date(lesson.date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })} · {lesson.duration} min</p>
                </div>
                <Badge variant="outline" className={`text-[10px] h-5 shrink-0 ${cfg.color} ${cfg.border} gap-1`}>
                  <Icon className="w-2.5 h-2.5" />{cfg.label}
                </Badge>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border space-y-4 pt-4">
                  {[
                    { label: 'Learning Objectives', content: lesson.objectives },
                    { label: 'Activities & Timing', content: lesson.activities },
                    { label: 'Materials & Resources', content: lesson.materials },
                    { label: 'Differentiation', content: lesson.differentiation },
                  ].map(({ label, content }) => (
                    content ? (
                      <div key={label}>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{content}</p>
                      </div>
                    ) : null
                  ))}
                  {lesson.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, status: 'approved' } : l))}
                      className="text-xs h-7 gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve Plan
                    </Button>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
