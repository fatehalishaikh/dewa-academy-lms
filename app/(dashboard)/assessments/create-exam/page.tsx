'use client'
import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Wand2, Sparkles, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { academyClasses } from '@/data/mock-classes'
import { examQuestions, type ExamQuestion, type DifficultyLevel } from '@/data/mock-assessments'

const BLOOMS_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'] as const
type BloomsLevel = typeof BLOOMS_LEVELS[number]

const STEP_LABELS = ['Details', 'Questions', 'Rules', 'Review']

type ExamDetails = {
  title: string; classId: string; date: string
  duration: string; examType: string; passingScore: string
}

type Rules = {
  timeLimit: boolean; attempts: number
  randomizeQuestions: boolean; randomizeAnswers: boolean; showResultsAfter: boolean
}

const diffColor: Record<DifficultyLevel, string> = {
  Easy: 'border-emerald-500/30 text-emerald-400',
  Medium: 'border-amber-500/30 text-amber-400',
  Hard: 'border-red-500/30 text-red-400',
}

export default function AssessmentsCreateExam() {
  const [step, setStep] = useState(0)
  const [details, setDetails] = useState<ExamDetails>({
    title: '', classId: academyClasses[0]?.id ?? '',
    date: '', duration: '60', examType: 'formative', passingScore: '60',
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [rules, setRules] = useState<Rules>({
    timeLimit: true, attempts: 1,
    randomizeQuestions: false, randomizeAnswers: true, showResultsAfter: true,
  })
  const [qSearch, setQSearch] = useState('')
  const [isAutoGenerating, setIsAutoGenerating] = useState(false)
  const [bloomsLevel, setBloomsLevel] = useState<BloomsLevel | ''>('')
  const [aiGeneratedQs, setAiGeneratedQs] = useState<ExamQuestion[]>([])
  const [published, setPublished] = useState(false)

  const selectedClass = academyClasses.find(c => c.id === details.classId)
  // Merge AI-generated questions with exam question bank (deduplicate by id)
  const allQuestions = [
    ...aiGeneratedQs,
    ...examQuestions.filter(q => !aiGeneratedQs.some(ai => ai.id === q.id)),
  ]
  const filteredQuestions = allQuestions.filter(q =>
    !qSearch || q.text.toLowerCase().includes(qSearch.toLowerCase()) || q.topic.toLowerCase().includes(qSearch.toLowerCase())
  )
  const selectedQuestions = allQuestions.filter(q => selectedIds.has(q.id))
  const totalPoints = selectedQuestions.reduce((s, q) => s + q.points, 0)

  function setD<K extends keyof ExamDetails>(k: K, v: ExamDetails[K]) {
    setDetails(prev => ({ ...prev, [k]: v }))
  }

  function toggleQuestion(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleAutoGenerate() {
    setIsAutoGenerating(true)
    const classSubject = selectedClass?.subject ?? 'Mathematics'
    try {
      const res = await fetch('/api/ai/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: classSubject,
          count: 8,
          examType: details.examType,
          bloomsLevel: bloomsLevel || undefined,
        }),
      })
      if (res.ok) {
        const generated: ExamQuestion[] = await res.json()
        // Prefix IDs to avoid collision
        const withIds = generated.map((q, i) => ({ ...q, id: `ai-${Date.now()}-${i}` }))
        setAiGeneratedQs(withIds)
        setSelectedIds(new Set(withIds.map(q => q.id)))
      } else {
        throw new Error('API failed')
      }
    } catch {
      // Fallback: select from existing bank with balanced difficulty
      const easy = examQuestions.filter(q => q.difficulty === 'Easy').slice(0, 3).map(q => q.id)
      const medium = examQuestions.filter(q => q.difficulty === 'Medium').slice(0, 3).map(q => q.id)
      const hard = examQuestions.filter(q => q.difficulty === 'Hard').slice(0, 2).map(q => q.id)
      setSelectedIds(new Set([...easy, ...medium, ...hard]))
    } finally {
      setIsAutoGenerating(false)
    }
  }

  function canProceed() {
    if (step === 0) return details.title.trim() !== '' && details.classId !== '' && details.date !== ''
    if (step === 1) return selectedIds.size > 0
    return true
  }

  function handlePublish(asDraft: boolean) {
    if (!asDraft) {
      setPublished(true)
      setTimeout(() => {
        setStep(0)
        setDetails({ title: '', classId: academyClasses[0]?.id ?? '', date: '', duration: '60', examType: 'formative', passingScore: '60' })
        setSelectedIds(new Set())
        setPublished(false)
      }, 2500)
    }
  }

  if (published) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Exam published!</p>
          <p className="text-xs text-muted-foreground">Redirecting…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-primary/20 text-primary' : i === step ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[10px] whitespace-nowrap ${i === step ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 ${i < step ? 'bg-primary/40' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Details */}
      {step === 0 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Title *</label>
              <input type="text" value={details.title} onChange={e => setD('title', e.target.value)}
                placeholder="e.g. Mathematics Mid-Term Exam"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Class *</label>
                <select value={details.classId} onChange={e => setD('classId', e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50">
                  {academyClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Exam Type</label>
                <select value={details.examType} onChange={e => setD('examType', e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50">
                  <option value="formative">Formative</option>
                  <option value="summative">Summative</option>
                  <option value="diagnostic">Diagnostic</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Date *</label>
                <input type="date" value={details.date} onChange={e => setD('date', e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Duration (minutes)</label>
                <input type="number" value={details.duration} onChange={e => setD('duration', e.target.value)} min={10}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Passing Score (%)</label>
                <input type="number" value={details.passingScore} onChange={e => setD('passingScore', e.target.value)} min={0} max={100}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            {/* Bloom's taxonomy */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <p className="text-[11px] font-semibold text-primary">Bloom&apos;s Taxonomy Level <span className="text-muted-foreground font-normal">(for AI generation)</span></p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setBloomsLevel('')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors border ${
                    bloomsLevel === '' ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Any
                </button>
                {BLOOMS_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setBloomsLevel(level)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors border ${
                      bloomsLevel === level ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Questions */}
      {step === 1 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Select Questions</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{selectedIds.size} selected · {totalPoints} pts</span>
                <Button size="sm" variant="outline" onClick={handleAutoGenerate} disabled={isAutoGenerating}
                  className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10">
                  {isAutoGenerating
                    ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Auto-generating…</>
                    : <><Wand2 className="w-3 h-3" /> Auto-Generate</>}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            <input type="text" value={qSearch} onChange={e => setQSearch(e.target.value)} placeholder="Search questions…"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50" />
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {filteredQuestions.map(q => (
                <label key={q.id} className="flex items-start gap-3 px-2 py-2.5 hover:bg-muted/10 cursor-pointer">
                  <input type="checkbox" checked={selectedIds.has(q.id)} onChange={() => toggleQuestion(q.id)}
                    className="mt-0.5 accent-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground line-clamp-1">{q.text}</p>
                    <p className="text-[10px] text-muted-foreground">{q.subject} · {q.topic}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className={`text-[9px] h-4 ${diffColor[q.difficulty]}`}>{q.difficulty}</Badge>
                    <span className="text-[10px] text-muted-foreground">{q.points}pt</span>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Rules */}
      {step === 2 && (
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm">Exam Rules</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {[
              { key: 'timeLimit' as const,            label: 'Time Limit',                      desc: 'Enforce the duration set in Details' },
              { key: 'randomizeQuestions' as const,   label: 'Randomize Question Order',        desc: 'Each student sees questions in a different order' },
              { key: 'randomizeAnswers' as const,     label: 'Randomize Answer Options',        desc: 'Shuffle MCQ options for each student' },
              { key: 'showResultsAfter' as const,     label: 'Show Results After Submission',   desc: 'Students see their score immediately' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{desc}</p>
                </div>
                <button
                  onClick={() => setRules(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${rules[key] ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${rules[key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Number of Attempts</p>
                <p className="text-[11px] text-muted-foreground">How many times a student can take this exam</p>
              </div>
              <select value={rules.attempts} onChange={e => setRules(prev => ({ ...prev, attempts: Number(e.target.value) }))}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50">
                <option value={1}>1 (once)</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={99}>Unlimited</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2 border-b border-border">
              <CardTitle className="text-sm">Exam Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { label: 'Title', value: details.title },
                  { label: 'Class', value: selectedClass?.name ?? '—' },
                  { label: 'Date', value: details.date || '—' },
                  { label: 'Duration', value: `${details.duration} min` },
                  { label: 'Type', value: details.examType.charAt(0).toUpperCase() + details.examType.slice(1) },
                  { label: 'Passing Score', value: `${details.passingScore}%` },
                  { label: 'Total Questions', value: `${selectedIds.size}` },
                  { label: 'Total Points', value: `${totalPoints} pts` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-2 border-b border-border">
              <CardTitle className="text-sm">Selected Questions ({selectedIds.size})</CardTitle>
            </CardHeader>
            <div className="divide-y divide-border max-h-52 overflow-y-auto">
              {selectedQuestions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-3 px-5 py-2.5">
                  <span className="text-[10px] text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                  <p className="text-xs text-foreground flex-1 line-clamp-1">{q.text}</p>
                  <Badge variant="outline" className={`text-[9px] h-4 shrink-0 ${diffColor[q.difficulty]}`}>{q.difficulty}</Badge>
                  <span className="text-[10px] text-muted-foreground shrink-0">{q.points}pt</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handlePublish(true)} className="text-xs">Save as Draft</Button>
            <Button onClick={() => handlePublish(false)} className="gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Publish Exam
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Button variant="outline" size="sm" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        {step < 3 && (
          <Button size="sm" onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
