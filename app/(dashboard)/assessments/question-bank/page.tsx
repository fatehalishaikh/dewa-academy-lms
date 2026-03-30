'use client'
import { useState } from 'react'
import { Plus, Wand2, Search, Database, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { examQuestions, type ExamQuestion, type QuestionType, type DifficultyLevel } from '@/data/mock-assessments'

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'English Language', 'Chemistry', 'Arabic']
const DIFFICULTIES: (DifficultyLevel | 'All')[] = ['All', 'Easy', 'Medium', 'Hard']
const QTYPES: (QuestionType | 'All')[] = ['All', 'MCQ', 'Essay', 'Matching', 'True-False']

const diffColor: Record<DifficultyLevel, string> = {
  Easy: 'border-emerald-500/30 text-emerald-400',
  Medium: 'border-amber-500/30 text-amber-400',
  Hard: 'border-red-500/30 text-red-400',
}

type CreateForm = {
  text: string; questionType: QuestionType; subject: string; topic: string
  difficulty: DifficultyLevel; options: string; correctAnswer: string; points: string
}

const BLANK: CreateForm = {
  text: '', questionType: 'MCQ', subject: 'Mathematics', topic: '',
  difficulty: 'Medium', options: '', correctAnswer: '', points: '4',
}

export default function AssessmentsQuestionBank() {
  const [questions, setQuestions] = useState<ExamQuestion[]>(examQuestions)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState<DifficultyLevel | 'All'>('All')
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'All'>('All')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateForm>(BLANK)
  const [isGenerating, setIsGenerating] = useState(false)

  const filtered = questions.filter(q => {
    if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false
    if (diffFilter !== 'All' && q.difficulty !== diffFilter) return false
    if (typeFilter !== 'All' && q.questionType !== typeFilter) return false
    if (search && !q.text.toLowerCase().includes(search.toLowerCase()) && !q.topic.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPoints = questions.reduce((s, q) => s + q.points, 0)
  const easyCount = questions.filter(q => q.difficulty === 'Easy').length
  const medCount = questions.filter(q => q.difficulty === 'Medium').length
  const hardCount = questions.filter(q => q.difficulty === 'Hard').length

  function setF<K extends keyof CreateForm>(k: K, v: CreateForm[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function handleCreate() {
    if (!form.text || !form.topic) return
    const newQ: ExamQuestion = {
      id: `q-${Date.now()}`,
      text: form.text,
      questionType: form.questionType,
      subject: form.subject,
      topic: form.topic,
      difficulty: form.difficulty,
      options: form.questionType === 'MCQ' ? form.options.split('\n').filter(Boolean) : undefined,
      correctAnswer: form.correctAnswer,
      points: Number(form.points) || 4,
    }
    setQuestions(prev => [newQ, ...prev])
    setForm(BLANK)
    setShowCreate(false)
  }

  async function handleAiGenerate() {
    setIsGenerating(true)
    const subject = subjectFilter !== 'All' ? subjectFilter : 'Mathematics'
    try {
      const res = await fetch('/api/ai/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          difficulty: diffFilter !== 'All' ? diffFilter : undefined,
          questionType: typeFilter !== 'All' ? typeFilter : undefined,
          count: 5,
        }),
      })
      const generated = await res.json() as ExamQuestion[]
      setQuestions(prev => [...generated, ...prev])
    } catch {
      // Fallback to placeholder questions
      const fallback: ExamQuestion[] = Array.from({ length: 5 }, (_, i) => ({
        id: `q-gen-${Date.now()}-${i}`,
        text: `[AI] ${subject} question ${i + 1}: Evaluate the concept of ${['continuity', 'symmetry', 'convergence', 'periodicity', 'proportionality'][i]} in context.`,
        questionType: (['MCQ', 'Essay', 'MCQ', 'True-False', 'MCQ'] as QuestionType[])[i],
        subject,
        topic: `AI Generated — ${subject}`,
        difficulty: (['Easy', 'Medium', 'Hard', 'Medium', 'Easy'] as DifficultyLevel[])[i],
        options: i !== 1 && i !== 3 ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
        correctAnswer: 'Option A',
        points: [2, 8, 4, 3, 2][i],
      }))
      setQuestions(prev => [...fallback, ...prev])
    } finally {
      setIsGenerating(false)
    }
  }

  function handleDelete(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Questions', value: questions.length, color: '#00B8A9' },
          { label: 'Easy', value: easyCount, color: '#10B981' },
          { label: 'Medium', value: medCount, color: '#F59E0B' },
          { label: 'Hard', value: hardCount, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xl font-bold mt-0.5" style={{ color }}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{totalPoints} total pts</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={diffFilter} onChange={e => setDiffFilter(e.target.value as typeof diffFilter)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
          {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50">
          {QTYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <Button size="sm" variant="outline" onClick={() => setShowCreate(v => !v)} className="gap-1 h-8 text-xs">
          <Plus className="w-3.5 h-3.5" /> Create
        </Button>
        <Button size="sm" variant="outline" onClick={handleAiGenerate} disabled={isGenerating}
          className="gap-1 h-8 text-xs border-primary/30 text-primary hover:bg-primary/10">
          {isGenerating
            ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Generating…</>
            : <><Wand2 className="w-3.5 h-3.5" /> AI Generate</>}
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="rounded-2xl border-primary/20 bg-primary/5">
          <CardHeader className="pb-2 border-b border-border">
            <CardTitle className="text-sm flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> New Question</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Subject</label>
                <select value={form.subject} onChange={e => setF('subject', e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50">
                  {SUBJECTS.slice(1).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Type</label>
                <select value={form.questionType} onChange={e => setF('questionType', e.target.value as QuestionType)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50">
                  {QTYPES.slice(1).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Difficulty</label>
                <select value={form.difficulty} onChange={e => setF('difficulty', e.target.value as DifficultyLevel)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50">
                  {DIFFICULTIES.slice(1).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Topic *</label>
                <input type="text" value={form.topic} onChange={e => setF('topic', e.target.value)} placeholder="e.g. Quadratic Equations"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Points</label>
                <input type="number" value={form.points} onChange={e => setF('points', e.target.value)} min={1}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Question Text *</label>
              <textarea value={form.text} onChange={e => setF('text', e.target.value)} rows={2} placeholder="Enter the question…"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary/50" />
            </div>
            {form.questionType === 'MCQ' && (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Options (one per line)</label>
                <textarea value={form.options} onChange={e => setF('options', e.target.value)} rows={4} placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs resize-none font-mono focus:outline-none focus:border-primary/50" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Correct Answer</label>
              <input type="text" value={form.correctAnswer} onChange={e => setF('correctAnswer', e.target.value)} placeholder="e.g. Option A or essay key points"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} disabled={!form.text || !form.topic} className="text-xs">Save Question</Button>
              <Button size="sm" variant="outline" onClick={() => { setShowCreate(false); setForm(BLANK) }} className="text-xs">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions table */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              Questions
            </CardTitle>
            <span className="text-xs text-muted-foreground">{filtered.length} of {questions.length}</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Question</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-28">Subject</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-32">Topic</th>
                <th className="text-center px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20">Difficulty</th>
                <th className="text-center px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-24">Type</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-36">Answer</th>
                <th className="text-center px-3 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-16">Pts</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-xs text-foreground line-clamp-2 max-w-xs">{q.text}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] text-muted-foreground">{q.subject}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] text-muted-foreground truncate block max-w-[120px]">{q.topic}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="outline" className={`text-[9px] h-4 ${diffColor[q.difficulty]}`}>{q.difficulty}</Badge>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant="outline" className="text-[9px] h-4">{q.questionType}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] text-emerald-400 block max-w-[130px] truncate" title={q.correctAnswer}>
                      {q.correctAnswer || <span className="text-muted-foreground/50">—</span>}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-xs font-semibold text-foreground">{q.points}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button onClick={() => handleDelete(q.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-muted-foreground">No questions match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
