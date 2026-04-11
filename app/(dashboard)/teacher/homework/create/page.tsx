'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronLeft, Wand2, Plus, X, Eye, Send, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassesByTeacher } from '@/data/mock-classes'
import { useHomeworkStore } from '@/stores/homework-store'
import { aiHomeworkTemplates, type RubricItem, type ExamQuestion } from '@/data/mock-homework'

type DifficultyMix = { easy: number; medium: number; hard: number }

type FormState = {
  title: string
  description: string
  instructions: string
  classId: string
  dueDate: string
  totalPoints: number
  rubric: RubricItem[]
  questions: ExamQuestion[]
}

const diffColor: Record<string, string> = {
  Easy: 'text-emerald-400 border-emerald-500/30',
  Medium: 'text-amber-400 border-amber-500/30',
  Hard: 'text-red-400 border-red-500/30',
}

export default function HomeworkCreate() {
  const router = useRouter()
  const teacher = useCurrentTeacher()
  const classes = teacher ? getClassesByTeacher(teacher.id) : []
  const { createHomework } = useHomeworkStore()

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    instructions: '',
    classId: classes[0]?.id ?? '',
    dueDate: '',
    totalPoints: 20,
    rubric: [
      { id: 'r1', label: 'Content accuracy', maxPoints: 10 },
      { id: 'r2', label: 'Presentation', maxPoints: 10 },
    ],
    questions: [],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [preview, setPreview] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Question generation controls
  const [questionTopic, setQuestionTopic] = useState('')
  const [questionTypePref, setQuestionTypePref] = useState('MCQ')
  const [difficultyMix, setDifficultyMix] = useState<DifficultyMix>({ easy: 3, medium: 0, hard: 2 })

  const selectedClass = classes.find(c => c.id === form.classId)

  function set_<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function generateWithAI() {
    if (!selectedClass) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/homework/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: selectedClass.subject, className: selectedClass.name }),
      })
      const data = await res.json() as { title: string; description: string; instructions: string }
      setForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        instructions: data.instructions || prev.instructions,
      }))
      if (data.title) setQuestionTopic(data.title)
    } catch {
      const templates = aiHomeworkTemplates[selectedClass.subject] ?? aiHomeworkTemplates['Mathematics']
      const template = templates[Math.floor(Math.random() * templates.length)]
      setForm(prev => ({ ...prev, title: template.title, description: template.description, instructions: template.instructions }))
      setQuestionTopic(template.title)
    } finally {
      setIsGenerating(false)
    }
  }

  async function generateQuestions() {
    if (!selectedClass) return
    const { easy, medium, hard } = difficultyMix
    if (easy + medium + hard === 0) return

    setIsGeneratingQuestions(true)
    try {
      const calls: Promise<Response>[] = []
      const difficulties: Array<{ difficulty: string; count: number }> = []

      if (easy > 0) { calls.push(fetch('/api/ai/questions/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: selectedClass.subject, topic: questionTopic || undefined, count: easy, difficulty: 'Easy', questionType: questionTypePref === 'Mix' ? undefined : questionTypePref }) })); difficulties.push({ difficulty: 'Easy', count: easy }) }
      if (medium > 0) { calls.push(fetch('/api/ai/questions/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: selectedClass.subject, topic: questionTopic || undefined, count: medium, difficulty: 'Medium', questionType: questionTypePref === 'Mix' ? undefined : questionTypePref }) })); difficulties.push({ difficulty: 'Medium', count: medium }) }
      if (hard > 0) { calls.push(fetch('/api/ai/questions/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: selectedClass.subject, topic: questionTopic || undefined, count: hard, difficulty: 'Hard', questionType: questionTypePref === 'Mix' ? undefined : questionTypePref }) })); difficulties.push({ difficulty: 'Hard', count: hard }) }

      const responses = await Promise.all(calls)
      const arrays = await Promise.all(responses.map(r => r.json())) as ExamQuestion[][]
      const merged = arrays.flat()

      const totalPts = merged.reduce((sum, q) => sum + (q.points ?? 0), 0)
      setForm(prev => ({
        ...prev,
        questions: merged,
        totalPoints: totalPts || prev.totalPoints,
      }))
    } catch {
      // silently fail — user can retry
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  function removeQuestion(id: string) {
    setForm(prev => {
      const updated = prev.questions.filter(q => q.id !== id)
      return { ...prev, questions: updated, totalPoints: updated.reduce((s, q) => s + (q.points ?? 0), 0) || prev.totalPoints }
    })
  }

  function addRubricItem() {
    const id = `r${Date.now()}`
    setForm(prev => ({
      ...prev,
      rubric: [...prev.rubric, { id, label: '', maxPoints: 10 }],
    }))
  }

  function updateRubricItem(id: string, field: 'label' | 'maxPoints', value: string | number) {
    setForm(prev => ({
      ...prev,
      rubric: prev.rubric.map(r => r.id === id ? { ...r, [field]: value } : r),
    }))
  }

  function removeRubricItem(id: string) {
    setForm(prev => ({ ...prev, rubric: prev.rubric.filter(r => r.id !== id) }))
  }

  const rubricTotal = form.rubric.reduce((sum, r) => sum + Number(r.maxPoints), 0)
  const totalDiffCount = difficultyMix.easy + difficultyMix.medium + difficultyMix.hard

  function handleSubmit(status: 'draft' | 'published') {
    if (!form.title || !form.classId || !form.dueDate) return
    createHomework({
      title: form.title,
      description: form.description,
      instructions: form.instructions,
      classId: form.classId,
      teacherId: teacher?.id ?? '',
      subject: selectedClass?.subject ?? '',
      dueDate: form.dueDate,
      status,
      totalPoints: form.totalPoints,
      aiGenerated: form.questions.length > 0,
      rubric: form.rubric,
      questions: form.questions,
    })
    setSubmitted(true)
    setTimeout(() => router.push('/teacher/homework'), 600)
  }

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Assignment created!</p>
          <p className="text-xs text-muted-foreground">Redirecting to homework list…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/teacher/homework')} className="gap-1.5 -ml-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">New Assignment</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Create Homework</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreview(!preview)}
          className="gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          {preview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {preview ? (
        /* Preview mode */
        <Card className="rounded-2xl border-border">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{form.title || 'Untitled Assignment'}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedClass?.name} · Due {form.dueDate || 'TBD'} · {form.totalPoints} pts
                </p>
              </div>
              <Badge variant="outline" className="text-[10px]">Preview</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {form.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{form.description}</p>
              </div>
            )}
            {form.instructions && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Instructions</p>
                <p className="text-sm text-foreground leading-relaxed">{form.instructions}</p>
              </div>
            )}
            {form.questions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Questions ({form.questions.length}) · {form.totalPoints} pts
                </p>
                <div className="space-y-2">
                  {form.questions.map((q, i) => (
                    <div key={q.id} className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">{i + 1}.</span>
                        <p className="text-sm text-foreground flex-1 leading-snug">{q.text}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          <Badge variant="outline" className={`text-[9px] h-4 ${diffColor[q.difficulty] ?? ''}`}>{q.difficulty}</Badge>
                          <Badge variant="outline" className="text-[9px] h-4">{q.questionType}</Badge>
                          <Badge variant="outline" className="text-[9px] h-4 text-primary border-primary/30">{q.points}pt</Badge>
                        </div>
                      </div>
                      {q.questionType === 'MCQ' && q.options && (
                        <div className="pl-5 grid grid-cols-2 gap-1">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${opt === q.correctAnswer ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-muted-foreground'}`}>
                              {opt === q.correctAnswer && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {q.questionType !== 'MCQ' && (
                        <p className="pl-5 text-[10px] text-emerald-400">Answer: {q.correctAnswer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {form.rubric.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grading Rubric</p>
                <div className="space-y-1.5">
                  {form.rubric.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border">
                      <p className="text-xs text-foreground">{r.label || '(unlabelled)'}</p>
                      <Badge variant="outline" className="text-[10px]">{r.maxPoints} pts</Badge>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs font-semibold text-primary">Total</p>
                    <Badge className="text-[10px] bg-primary">{rubricTotal} pts</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Edit mode */
        <div className="space-y-4">
          {/* Class + Due date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Class *</label>
              <select
                value={form.classId}
                onChange={e => set_('classId', e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set_('dueDate', e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Title + AI Generate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title *</label>
              <Button
                variant="outline"
                size="sm"
                onClick={generateWithAI}
                disabled={isGenerating || !form.classId}
                className="gap-1.5 text-xs h-7 border-primary/30 text-primary hover:bg-primary/10"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3" />
                    AI Generate
                  </>
                )}
              </Button>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={e => set_('title', e.target.value)}
              placeholder="e.g. Quadratic Equations Problem Set"
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => set_('description', e.target.value)}
              placeholder="Brief overview of what students will be doing…"
              rows={3}
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Instructions</label>
            <textarea
              value={form.instructions}
              onChange={e => set_('instructions', e.target.value)}
              placeholder="Specific instructions for students — what to do, how to submit, any special requirements…"
              rows={4}
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* AI Question Generation */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  AI Question Generator
                </CardTitle>
                {form.questions.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {form.questions.length} questions · {form.totalPoints} pts
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Topic + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Topic</label>
                  <input
                    type="text"
                    value={questionTopic}
                    onChange={e => setQuestionTopic(e.target.value)}
                    placeholder="e.g. Trigonometry, Quadratic Equations…"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Question Type</label>
                  <select
                    value={questionTypePref}
                    onChange={e => setQuestionTypePref(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="True-False">True / False</option>
                    <option value="Essay">Essay / Open</option>
                    <option value="Mix">Mix of Types</option>
                  </select>
                </div>
              </div>

              {/* Difficulty mix */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Difficulty Mix</label>
                  <span className="text-[10px] text-muted-foreground">{totalDiffCount} total question{totalDiffCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map(level => (
                    <div key={level} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
                      <span className={`text-[10px] font-semibold capitalize flex-1 ${level === 'easy' ? 'text-emerald-400' : level === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>{level}</span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={difficultyMix[level]}
                        onChange={e => setDifficultyMix(prev => ({ ...prev, [level]: Math.max(0, Number(e.target.value)) }))}
                        className="w-10 bg-card border border-border rounded px-1.5 py-1 text-xs text-foreground text-center focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <Button
                onClick={generateQuestions}
                disabled={isGeneratingQuestions || !form.classId || totalDiffCount === 0}
                className="w-full gap-2 text-sm"
                variant="outline"
              >
                {isGeneratingQuestions ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    Generating {totalDiffCount} questions…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    Generate {totalDiffCount > 0 ? `${totalDiffCount} ` : ''}Questions with AI
                  </>
                )}
              </Button>

              {/* Generated questions list */}
              {form.questions.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Generated Questions</p>
                    <button
                      onClick={() => setForm(prev => ({ ...prev, questions: [], totalPoints: rubricTotal || 20 }))}
                      className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {form.questions.map((q, i) => (
                    <div key={q.id} className="p-3 rounded-xl bg-background border border-border space-y-1.5 group">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">{i + 1}.</span>
                        <p className="text-xs text-foreground flex-1 leading-snug">{q.text}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          <Badge variant="outline" className={`text-[9px] h-4 ${diffColor[q.difficulty] ?? ''}`}>{q.difficulty}</Badge>
                          <Badge variant="outline" className="text-[9px] h-4">{q.questionType}</Badge>
                          <Badge variant="outline" className="text-[9px] h-4 text-primary border-primary/30">{q.points}pt</Badge>
                          <button
                            onClick={() => removeQuestion(q.id)}
                            className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {q.questionType === 'MCQ' && q.options && (
                        <div className="pl-5 grid grid-cols-2 gap-1">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg ${opt === q.correctAnswer ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-muted-foreground'}`}>
                              {opt === q.correctAnswer && <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />}
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {q.questionType !== 'MCQ' && (
                        <p className="pl-5 text-[10px] text-emerald-400">Answer: {q.correctAnswer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Points + Rubric */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Grading Rubric</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Total: {rubricTotal} pts</span>
                  <Button variant="outline" size="sm" onClick={addRubricItem} className="gap-1 h-7 text-xs">
                    <Plus className="w-3 h-3" />
                    Add criterion
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {form.rubric.map(r => (
                <div key={r.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={r.label}
                    onChange={e => updateRubricItem(r.id, 'label', e.target.value)}
                    placeholder="Criterion label"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <input
                    type="number"
                    value={r.maxPoints}
                    onChange={e => updateRubricItem(r.id, 'maxPoints', Number(e.target.value))}
                    min={1}
                    className="w-16 bg-background border border-border rounded-lg px-2 py-2 text-xs text-foreground text-center focus:outline-none focus:border-primary/50"
                  />
                  <span className="text-xs text-muted-foreground">pts</span>
                  <button
                    onClick={() => removeRubricItem(r.id)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => handleSubmit('draft')}
          disabled={!form.title || !form.classId || !form.dueDate}
        >
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSubmit('published')}
          disabled={!form.title || !form.classId || !form.dueDate}
          className="gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          Publish to Class
        </Button>
        <p className="text-[10px] text-muted-foreground ml-auto">
          * Required fields
        </p>
      </div>
    </div>
  )
}
