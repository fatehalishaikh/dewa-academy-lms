import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Plus, Wand2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { lessonTemplates, type LessonTemplate, type LessonTemplateSections } from '@/data/mock-curriculum'

const subjectColor: Record<string, string> = {
  Science:     'border-emerald-500/30 text-emerald-400',
  English:     'border-blue-500/30 text-blue-400',
  Mathematics: 'border-purple-500/30 text-purple-400',
  Arabic:      'border-amber-500/30 text-amber-400',
  Physics:     'border-cyan-500/30 text-cyan-400',
}

const SECTION_LABELS: (keyof LessonTemplateSections)[] = [
  'objectives', 'warmUp', 'mainActivity', 'assessment', 'differentiation', 'resources',
]
const SECTION_DISPLAY: Record<keyof LessonTemplateSections, string> = {
  objectives:    'Learning Objectives',
  warmUp:        'Warm-Up',
  mainActivity:  'Main Activity',
  assessment:    'Assessment',
  differentiation: 'Differentiation',
  resources:     'Resources',
}

const AI_DIFFERENTIATION = [
  'Advanced learners: Provide open-ended extension tasks requiring synthesis and evaluation.',
  'Struggling learners: Offer worked examples and partially-completed scaffolds.',
  'ELL students: Supply bilingual glossary and sentence-frame cards.',
  'Kinaesthetic learners: Include a hands-on manipulative or physical activity option.',
]

type CreateForm = {
  title: string
  subject: string
  sections: LessonTemplateSections
}

const emptyForm = (): CreateForm => ({
  title: '',
  subject: 'Mathematics',
  sections: { objectives: '', warmUp: '', mainActivity: '', assessment: '', differentiation: '', resources: '' },
})

export function CurriculumTemplates() {
  const [templates, setTemplates] = useState<LessonTemplate[]>(lessonTemplates)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateForm>(emptyForm())
  const [aiEnhancingId, setAiEnhancingId] = useState<string | null>(null)

  function handleAiEnhance(id: string) {
    setAiEnhancingId(id)
    setTimeout(() => {
      const suggestion = AI_DIFFERENTIATION.join(' ')
      setTemplates(prev => prev.map(t =>
        t.id === id ? { ...t, sections: { ...t.sections, differentiation: suggestion } } : t
      ))
      setAiEnhancingId(null)
    }, 2000)
  }

  function handleClone(template: LessonTemplate) {
    const clone: LessonTemplate = {
      ...template,
      id: `clone-${Date.now()}`,
      title: `${template.title} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
    }
    setTemplates(prev => [...prev, clone])
  }

  function handleCreate() {
    if (!form.title) return
    const newTemplate: LessonTemplate = {
      id: `tmpl-${Date.now()}`,
      title: form.title,
      subject: form.subject,
      createdDate: new Date().toISOString().split('T')[0],
      sections: form.sections,
    }
    setTemplates(prev => [...prev, newTemplate])
    setForm(emptyForm())
    setShowCreate(false)
    setExpandedId(newTemplate.id)
  }

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{templates.length} templates</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCreate(v => !v)}
          className="h-7 text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Create Template
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="rounded-2xl border-border border-primary/20">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm">New Lesson Template</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Template title…"
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
                >
                  {['Mathematics', 'Science', 'English', 'Arabic', 'Physics', 'Social Studies'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            {SECTION_LABELS.map(key => (
              <div key={key}>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  {SECTION_DISPLAY[key]}
                </label>
                <textarea
                  value={form.sections[key]}
                  onChange={e => setForm(prev => ({ ...prev, sections: { ...prev.sections, [key]: e.target.value } }))}
                  rows={2}
                  placeholder={`${SECTION_DISPLAY[key]}…`}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary/50"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} disabled={!form.title} className="text-xs gap-1">Create</Button>
              <Button size="sm" variant="outline" onClick={() => setShowCreate(false)} className="text-xs">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template cards */}
      <div className="space-y-3">
        {templates.map(template => {
          const isExpanded = expandedId === template.id
          const isEnhancing = aiEnhancingId === template.id
          return (
            <Card key={template.id} className="rounded-2xl border-border overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/10 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : template.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{template.title}</p>
                    <Badge variant="outline" className={`text-[9px] h-4 shrink-0 ${subjectColor[template.subject] ?? 'border-border text-muted-foreground'}`}>
                      {template.subject}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Created {new Date(template.createdDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    · {SECTION_LABELS.length} sections
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => { e.stopPropagation(); handleAiEnhance(template.id) }}
                    disabled={isEnhancing}
                    className="h-6 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {isEnhancing
                      ? <span className="w-2.5 h-2.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      : <Wand2 className="w-2.5 h-2.5" />
                    }
                    {isEnhancing ? 'Enhancing…' : 'AI Enhance'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => { e.stopPropagation(); handleClone(template) }}
                    className="h-6 text-[10px] gap-1"
                  >
                    <Copy className="w-2.5 h-2.5" /> Clone
                  </Button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border px-5 py-4 space-y-3">
                  {SECTION_LABELS.map(key => (
                    <div key={key}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        {SECTION_DISPLAY[key]}
                      </p>
                      <p className="text-xs text-foreground">{template.sections[key] || '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
