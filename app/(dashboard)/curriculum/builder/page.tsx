'use client'
import { useState } from 'react'
import {
  ChevronRight, ChevronDown, Plus, Wand2, BookOpen, BookMarked, Layers, FileText,
  Share2, Clock, Users, ClipboardList, Activity, ArrowLeft, BookText, GraduationCap,
  FlaskConical, PenLine, NotebookPen, SendHorizonal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  versionHistory, assessmentLinks, collaborators, activityItems,
  type CurriculumNode, type NodeStatus, type NodeType, type LessonContent,
} from '@/data/mock-curriculum'
import { useAcademyStore } from '@/stores/academy-store'

const statusColor: Record<NodeStatus, string> = {
  draft:          'border-amber-500/30 text-amber-400',
  'under-review': 'border-blue-500/30 text-blue-400',
  approved:       'border-emerald-500/30 text-emerald-400',
  published:      'border-primary/30 text-primary',
}

const nodeIcon: Record<NodeType, React.ElementType> = {
  program: BookMarked,
  course:  BookOpen,
  unit:    Layers,
  lesson:  FileText,
}

type AddingForm = { parentId: string; nodeType: NodeType; title: string; description: string }

export default function CurriculumBuilder() {
  const nodes = useAcademyStore(s => s.curriculumNodes)
  const lessonContents = useAcademyStore(s => s.lessonContents)
  const {
    addCurriculumNode,
    updateCurriculumNode,
    setLessonContent,
    updateNodeStatus,
    addNotification,
  } = useAcademyStore()

  const [expanded, setExpanded] = useState<Set<string>>(new Set(['prog-001', 'crs-001', 'crs-002']))
  const [selected, setSelected] = useState<string | null>(null)
  const [contentView, setContentView] = useState<string | null>(null) // lesson id for full content view
  const [addingForm, setAddingForm] = useState<AddingForm | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [nodeGenerating, setNodeGenerating] = useState<string | null>(null)
  const [shareToast, setShareToast] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('keyConcepts')
  const [contentGenerating, setContentGenerating] = useState(false)

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function childTypeOf(parent: NodeType): NodeType | null {
    const map: Partial<Record<NodeType, NodeType>> = {
      program: 'course', course: 'unit', unit: 'lesson',
    }
    return map[parent] ?? null
  }

  function handleAddNode() {
    if (!addingForm) return
    const nodeData: Omit<CurriculumNode, 'id'> = {
      parentId: addingForm.parentId,
      nodeType: addingForm.nodeType,
      title: addingForm.title || `New ${addingForm.nodeType}`,
      description: addingForm.description,
      objectives: [],
      standardIds: [],
      status: 'draft',
      version: 1,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: 'You',
    }
    addCurriculumNode(addingForm.parentId, nodeData)
    setExpanded(prev => new Set([...prev, addingForm.parentId]))
    setAddingForm(null)
  }

  async function handleAiSuggest() {
    const targetCourse = nodes.find(n => n.nodeType === 'course')
    if (!targetCourse) return
    setAiGenerating(true)
    try {
      const existingUnits = nodes
        .filter(n => n.parentId === targetCourse.id && n.nodeType === 'unit')
        .map(n => n.title)
      const res = await fetch('/api/ai/curriculum/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseTitle: targetCourse.title, subject: targetCourse.title, existingUnits }),
      })
      if (res.ok) {
        const data = await res.json() as { units: { title: string; description: string; objectives: string[]; duration?: number; lessons: { title: string; description: string; objectives: string[]; duration?: number }[] }[] }
        const newUnitIds: string[] = []
        data.units.forEach(unit => {
          const unitId = addCurriculumNode(targetCourse.id, {
            parentId: targetCourse.id,
            nodeType: 'unit',
            title: unit.title,
            description: unit.description,
            objectives: unit.objectives ?? [],
            standardIds: [],
            status: 'draft',
            duration: unit.duration,
            version: 1,
          })
          newUnitIds.push(unitId)
          unit.lessons.forEach(lesson => {
            addCurriculumNode(unitId, {
              parentId: unitId,
              nodeType: 'lesson',
              title: lesson.title,
              description: lesson.description,
              objectives: lesson.objectives ?? [],
              standardIds: [],
              status: 'draft',
              duration: lesson.duration,
              version: 1,
            })
          })
        })
        setExpanded(prev => new Set([...prev, targetCourse.id, ...newUnitIds]))
      }
    } catch { /* silent */ }
    finally { setAiGenerating(false) }
  }

  async function handleNodeAiSuggest(node: CurriculumNode) {
    setNodeGenerating(node.id)
    try {
      if (node.nodeType === 'unit') {
        const res = await fetch('/api/ai/curriculum/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseTitle: node.title, existingUnits: nodes.filter(n => n.parentId === node.id && n.nodeType === 'lesson').map(n => n.title) }),
        })
        if (res.ok) {
          const data = await res.json() as { units: { lessons: { title: string; description: string; objectives: string[]; duration?: number }[] }[] }
          const lessons = data.units.flatMap(u => u.lessons)
          lessons.forEach(l => {
            addCurriculumNode(node.id, {
              parentId: node.id,
              nodeType: 'lesson' as NodeType,
              title: l.title,
              description: l.description,
              objectives: l.objectives ?? [],
              standardIds: [],
              status: 'draft' as NodeStatus,
              duration: l.duration,
              version: 1,
            })
          })
          setExpanded(prev => new Set([...prev, node.id]))
        }
      } else if (node.nodeType === 'lesson') {
        // Update metadata (description + objectives)
        const res = await fetch('/api/ai/curriculum/suggest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseTitle: node.title }) })
        if (res.ok) {
          const data = await res.json() as { units: { lessons: { description: string; objectives: string[] }[] }[] }
          const lesson = data.units[0]?.lessons[0]
          if (lesson) {
            updateCurriculumNode(node.id, {
              description: lesson.description,
              objectives: lesson.objectives ?? node.objectives,
            })
            setSelected(node.id)
            // Also generate rich content
            const updatedNode = { ...node, description: lesson.description, objectives: lesson.objectives ?? node.objectives }
            await generateLessonContent(updatedNode)
          }
        }
      }
    } catch { /* silent */ }
    finally { setNodeGenerating(null) }
  }

  async function generateLessonContent(node: CurriculumNode) {
    setContentGenerating(true)
    try {
      const res = await fetch('/api/ai/curriculum/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: node.title,
          description: node.description,
          objectives: node.objectives,
        }),
      })
      if (res.ok) {
        const data = await res.json() as Omit<LessonContent, 'lessonId'>
        setLessonContent(node.id, { ...data, lessonId: node.id })
      }
    } catch { /* silent */ }
    finally { setContentGenerating(false) }
  }

  function renderNode(node: CurriculumNode, depth = 0) {
    const children = nodes.filter(n => n.parentId === node.id)
    const isExpanded = expanded.has(node.id)
    const isSelected = selected === node.id
    const NodeIcon = nodeIcon[node.nodeType]
    const childType = childTypeOf(node.nodeType)

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors group ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/20'}`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={() => {
            setSelected(isSelected ? null : node.id)
            if (children.length > 0) toggleExpand(node.id)
          }}
        >
          {children.length > 0 ? (
            <button className="w-4 h-4 flex items-center justify-center text-muted-foreground shrink-0" onClick={e => { e.stopPropagation(); toggleExpand(node.id) }}>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : <span className="w-4 shrink-0" />}
          <NodeIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-xs font-medium text-foreground truncate">{node.title}</span>
          {node.version && <span className="text-[9px] text-muted-foreground/50 shrink-0">v{node.version}</span>}
          <Badge variant="outline" className={`text-[9px] h-4 shrink-0 ${statusColor[node.status]}`}>{node.status}</Badge>
          {node.duration && <span className="text-[10px] text-muted-foreground shrink-0">{node.duration}h</span>}
          {/* Submit for Review button */}
          {node.status === 'draft' && (
            <button
              className="opacity-0 group-hover:opacity-100 h-5 px-1.5 flex items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all shrink-0 text-[9px] font-medium gap-1"
              onClick={e => { e.stopPropagation(); updateNodeStatus(node.id, 'under-review', 'teacher') }}
              title="Submit for Review"
            >
              <SendHorizonal className="w-3 h-3" /> Review
            </button>
          )}
          {/* Open content button for lessons */}
          {node.nodeType === 'lesson' && (
            <button
              className="opacity-0 group-hover:opacity-100 h-5 px-1.5 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all shrink-0 text-[9px] font-medium gap-1"
              onClick={e => { e.stopPropagation(); setContentView(node.id); setOpenSection('keyConcepts') }}
              title="Open lesson content"
            >
              <BookText className="w-3 h-3" /> Open
            </button>
          )}
          {childType && (
            <button className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all shrink-0" onClick={e => { e.stopPropagation(); setAddingForm({ parentId: node.id, nodeType: childType, title: '', description: '' }) }} title={`Add ${childType}`}>
              <Plus className="w-3 h-3" />
            </button>
          )}
          {(node.nodeType === 'unit' || node.nodeType === 'lesson') && (
            <button className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all shrink-0" onClick={e => { e.stopPropagation(); handleNodeAiSuggest(node) }} title={node.nodeType === 'unit' ? 'AI Suggest Lessons' : 'AI Generate Content'} disabled={nodeGenerating === node.id}>
              {nodeGenerating === node.id ? <span className="w-2.5 h-2.5 rounded-full border border-primary border-t-transparent animate-spin" /> : <Wand2 className="w-3 h-3" />}
            </button>
          )}
        </div>

        {addingForm?.parentId === node.id && (
          <div className="mx-3 mb-2 p-3 bg-muted/10 border border-border rounded-xl space-y-2" style={{ marginLeft: `${12 + depth * 20 + 24}px` }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">New {addingForm.nodeType}</p>
            <input autoFocus value={addingForm.title} onChange={e => setAddingForm(prev => prev ? { ...prev, title: e.target.value } : prev)} placeholder="Title…" className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary/50" />
            <input value={addingForm.description} onChange={e => setAddingForm(prev => prev ? { ...prev, description: e.target.value } : prev)} placeholder="Description (optional)…" className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary/50" />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNode} className="h-6 text-[10px]">Add</Button>
              <Button size="sm" variant="outline" onClick={() => setAddingForm(null)} className="h-6 text-[10px]">Cancel</Button>
            </div>
          </div>
        )}

        {isExpanded && children.map(child => renderNode(child, depth + 1))}
      </div>
    )
  }

  const rootNodes = nodes.filter(n => n.parentId === null)
  const selectedNode = selected ? nodes.find(n => n.id === selected) : null
  const contentNode = contentView ? nodes.find(n => n.id === contentView) : null
  const lessonContent = contentView ? (lessonContents[contentView] ?? undefined) : undefined

  // Metadata panel derived data
  const nodeCollaborators = selectedNode ? collaborators.filter(c => c.nodeId === selectedNode.id) : []
  const nodeVersionHistory = selectedNode ? versionHistory.filter(v => v.nodeId === selectedNode.id) : []
  const nodeAssessments = selectedNode ? assessmentLinks.filter(a => a.lessonIds.includes(selectedNode.id)) : []
  const nodeActivities = selectedNode ? activityItems.filter(a => a.lessonId === selectedNode.id) : []

  // ── Full content view ─────────────────────────────────────────────────────────
  if (contentView && contentNode) {
    const content = lessonContent
    const SECTIONS = [
      { id: 'keyConcepts',      label: 'Key Concepts',        icon: BookText },
      { id: 'workedExamples',   label: 'Worked Examples',     icon: GraduationCap },
      { id: 'practice',         label: 'Practice Problems',   icon: PenLine },
      { id: 'vocabulary',       label: 'Vocabulary',          icon: NotebookPen },
      { id: 'activities',       label: 'Activities',          icon: FlaskConical },
      { id: 'teacherNotes',     label: 'Teacher Notes',       icon: Users },
      { id: 'readings',         label: 'Student Readings',    icon: BookOpen },
    ]

    const nodeActs = activityItems.filter(a => a.lessonId === contentView)
    const nodeAsmts = assessmentLinks.filter(a => a.lessonIds.includes(contentView))

    return (
      <div className="flex gap-4 h-full">
        {/* Section nav sidebar */}
        <div className="w-48 shrink-0 flex flex-col gap-1">
          <Button size="sm" variant="outline" onClick={() => setContentView(null)} className="h-7 text-xs gap-1.5 mb-3 w-full">
            <ArrowLeft className="w-3 h-3" /> Back to Tree
          </Button>
          {SECTIONS.map(s => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setOpenSection(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-colors ${openSection === s.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {s.label}
              </button>
            )
          })}

          {/* Meta */}
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
              <Badge variant="outline" className={`text-[9px] ${statusColor[contentNode.status]}`}>{contentNode.status}</Badge>
            </div>
            {contentNode.version && (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Version</p>
                <span className="text-xs text-muted-foreground">v{contentNode.version}</span>
              </div>
            )}
            {content && (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Duration</p>
                <span className="text-xs text-muted-foreground">{content.estimatedMinutes} min</span>
              </div>
            )}
            {nodeAsmts.length > 0 && (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Assessments</p>
                <div className="space-y-0.5">
                  {nodeAsmts.map(a => (
                    <Badge key={a.id} variant="outline" className={`text-[8px] block w-fit ${a.type === 'formative' ? 'border-blue-500/30 text-blue-400' : 'border-purple-500/30 text-purple-400'}`}>{a.type}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-[9px] h-4 ${statusColor[contentNode.status]}`}>{contentNode.nodeType} · {contentNode.status}</Badge>
                    {contentNode.version && <Badge variant="outline" className="text-[9px] h-4 border-muted-foreground/30 text-muted-foreground">v{contentNode.version}</Badge>}
                  </div>
                  <h2 className="text-base font-semibold text-foreground">{contentNode.title}</h2>
                  {contentNode.updatedAt && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">Updated {contentNode.updatedAt} · {contentNode.updatedBy}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => contentNode && generateLessonContent(contentNode)}
                    disabled={contentGenerating}
                    className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {contentGenerating
                      ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Generating…</>
                      : <><Wand2 className="w-3 h-3" /> {lessonContent ? 'Regenerate' : 'Generate'}</>
                    }
                  </Button>
                  <button
                    onClick={() => {
                      setShareToast(true)
                      setTimeout(() => setShareToast(false), 2000)
                      addNotification({ type: 'curriculum', title: 'Curriculum shared', body: `"${contentNode.title}" shared with admin.`, recipientRole: 'admin' })
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-xl border border-border hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Objectives */}
              {contentNode.objectives.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Learning Objectives</p>
                  <ul className="space-y-1">
                    {contentNode.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-foreground flex gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-8">

              {/* Introduction */}
              {content && (
                <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">Introduction</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{content.introduction}</p>
                </div>
              )}

              {/* Key Concepts */}
              {(!openSection || openSection === 'keyConcepts') && content && content.keyConcepts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookText className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Key Concepts</h3>
                  </div>
                  <div className="space-y-6">
                    {content.keyConcepts.map((concept, i) => (
                      <div key={i}>
                        <h4 className="text-xs font-semibold text-foreground mb-2 pb-1.5 border-b border-border">{concept.heading}</h4>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{concept.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Worked Examples */}
              {openSection === 'workedExamples' && content && content.workedExamples.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-foreground">Worked Examples</h3>
                  </div>
                  <div className="space-y-6">
                    {content.workedExamples.map((ex, i) => (
                      <div key={i} className="border border-border rounded-xl overflow-hidden">
                        <div className="px-4 py-2.5 bg-emerald-500/5 border-b border-border flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[9px] font-bold flex items-center justify-center shrink-0">E{i + 1}</span>
                          <p className="text-xs font-semibold text-foreground">{ex.title}</p>
                        </div>
                        <div className="p-4">
                          <div className="mb-3 p-3 bg-muted/10 rounded-xl border border-border">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Problem</p>
                            <p className="text-xs text-foreground">{ex.problem}</p>
                          </div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Solution</p>
                          <ol className="space-y-1.5">
                            {ex.solution.map((step, j) => (
                              <li key={j} className="flex gap-2 text-xs text-foreground">
                                <span className="text-primary font-mono shrink-0">{j + 1}.</span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Problems */}
              {openSection === 'practice' && content && content.practiceProblems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <PenLine className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-foreground">Practice Problems</h3>
                    <span className="text-[10px] text-muted-foreground">({content.practiceProblems.length} problems)</span>
                  </div>
                  <div className="space-y-4">
                    {content.practiceProblems.map((p, i) => (
                      <div key={i} className="border border-border rounded-xl p-4">
                        <div className="flex gap-2 mb-2">
                          <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <p className="text-xs text-foreground">{p.question}</p>
                        </div>
                        {p.hint && (
                          <p className="text-[10px] text-blue-400 mt-1 ml-7 italic">Hint: {p.hint}</p>
                        )}
                        <details className="mt-2 ml-7">
                          <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">Show answer</summary>
                          <p className="text-xs text-emerald-400 mt-1 font-mono">{p.answer}</p>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary */}
              {openSection === 'vocabulary' && content && content.vocabulary.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <NotebookPen className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-foreground">Vocabulary</h3>
                  </div>
                  <div className="space-y-2">
                    {content.vocabulary.map((v, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-muted/10 rounded-xl border border-border">
                        <span className="text-xs font-semibold text-primary shrink-0 min-w-[140px]">{v.term}</span>
                        <span className="text-xs text-muted-foreground">{v.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {openSection === 'activities' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FlaskConical className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-foreground">In-Class Activities</h3>
                  </div>
                  {nodeActs.length > 0 ? (
                    <div className="space-y-3">
                      {nodeActs.map((act, i) => (
                        <div key={act.id} className="flex items-center gap-3 p-3 bg-muted/10 border border-border rounded-xl">
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <span className="text-xs text-foreground flex-1">{act.title}</span>
                          <Badge variant="outline" className="text-[8px] h-4 border-cyan-500/30 text-cyan-400 shrink-0 capitalize">{act.activityType}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No activities linked to this lesson yet.</p>
                  )}
                </div>
              )}

              {/* Teacher Notes */}
              {openSection === 'teacherNotes' && content && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-foreground">Teacher Notes</h3>
                    <Badge variant="outline" className="text-[9px] border-orange-500/30 text-orange-400">Internal</Badge>
                  </div>
                  <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl">
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{content.teacherNotes}</p>
                  </div>
                </div>
              )}

              {/* Student Readings */}
              {openSection === 'readings' && content && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-foreground">Student Readings & Resources</h3>
                  </div>
                  <div className="space-y-2">
                    {content.studentReadings.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-muted/10 rounded-xl border border-border">
                        <span className="text-primary mt-0.5 text-xs shrink-0">📄</span>
                        <p className="text-xs text-foreground">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate content CTA for lessons without rich content */}
              {!content && (
                <div className="text-center py-16">
                  {contentGenerating ? (
                    <>
                      <span className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block mb-4" />
                      <p className="text-sm text-foreground font-medium">Generating lesson content…</p>
                      <p className="text-xs text-muted-foreground mt-1">Writing key concepts, worked examples, practice problems and more</p>
                    </>
                  ) : (
                    <>
                      <BookText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-foreground font-medium mb-1">No content yet for this lesson</p>
                      <p className="text-xs text-muted-foreground mb-4">AI will write the full instructional content — key concepts, worked examples, practice problems, vocabulary, and teacher notes.</p>
                      <Button
                        onClick={() => contentNode && generateLessonContent(contentNode)}
                        className="gap-2"
                      >
                        <Wand2 className="w-4 h-4" /> Generate Full Content with AI
                      </Button>
                    </>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Tree + metadata panel ─────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-[1fr_420px] gap-4 min-h-screen">
      {/* Tree */}
      <Card className="rounded-2xl border-border overflow-hidden flex flex-col">
        <CardHeader className="pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Curriculum Structure</CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">Hover a lesson and click "Open" to view its full content</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleAiSuggest} disabled={aiGenerating} className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10 shrink-0">
              {aiGenerating ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Generating…</> : <><Wand2 className="w-3 h-3" /> AI Suggest Structure</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 overflow-y-auto flex-1">
          {rootNodes.map(node => renderNode(node))}
        </CardContent>
      </Card>

      {/* Metadata panel */}
      <Card className="rounded-2xl border-border overflow-hidden flex flex-col">
        <CardHeader className="pb-3 border-b border-border shrink-0">
          <CardTitle className="text-sm">
            {selectedNode?.nodeType === 'lesson' ? 'Lesson Overview' : 'Node Info'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto flex-1">
          {selectedNode ? (
            <div className="space-y-4">

              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <Badge variant="outline" className={`text-[9px] h-4 shrink-0 ${statusColor[selectedNode.status]}`}>{selectedNode.nodeType} · {selectedNode.status}</Badge>
                  <div className="flex items-center gap-1.5">
                    {selectedNode.version && <Badge variant="outline" className="text-[9px] h-4 border-muted-foreground/30 text-muted-foreground">v{selectedNode.version}</Badge>}
                    <button
                      onClick={() => {
                        setShareToast(true)
                        setTimeout(() => setShareToast(false), 2000)
                        addNotification({ type: 'curriculum', title: 'Curriculum shared', body: `"${selectedNode.title}" shared with admin.`, recipientRole: 'admin' })
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{selectedNode.title}</h3>
                {selectedNode.duration && <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedNode.duration}h duration</p>}
                {selectedNode.updatedAt && <p className="text-[10px] text-muted-foreground mt-0.5">Updated {selectedNode.updatedAt} by {selectedNode.updatedBy}</p>}
              </div>

              {/* Submit for Review */}
              {selectedNode.status === 'draft' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateNodeStatus(selectedNode.id, 'under-review', 'teacher')}
                  className="w-full h-7 text-xs gap-1.5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <SendHorizonal className="w-3.5 h-3.5" /> Submit for Review
                </Button>
              )}

              {/* Open content button for lessons */}
              {selectedNode.nodeType === 'lesson' && (
                <Button size="sm" onClick={() => { setContentView(selectedNode.id); setOpenSection('keyConcepts') }} className="w-full h-8 text-xs gap-1.5">
                  <BookText className="w-3.5 h-3.5" /> Open Full Lesson Content
                </Button>
              )}

              {/* Collaborators */}
              {nodeCollaborators.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1"><Users className="w-3 h-3" /> Collaborators</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {nodeCollaborators.map(c => (
                      <div key={c.name} className="flex items-center gap-1">
                        <Avatar className="w-5 h-5"><AvatarFallback style={{ background: c.color + '33', color: c.color }} className="text-[8px] font-bold">{c.initials}</AvatarFallback></Avatar>
                        <span className="text-[10px] text-muted-foreground">{c.name.split(' ')[0]}</span>
                        <Badge variant="outline" className="text-[8px] h-3.5 border-muted/40 text-muted-foreground px-1">{c.role}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedNode.description && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                  <p className="text-xs text-muted-foreground">{selectedNode.description}</p>
                </div>
              )}

              {/* Objectives */}
              {selectedNode.objectives.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Objectives</p>
                  <ul className="space-y-0.5">
                    {selectedNode.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5"><span className="text-primary mt-0.5 shrink-0">•</span>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Linked Standards */}
              {selectedNode.standardIds.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Linked Standards</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.standardIds.map(sid => <Badge key={sid} variant="outline" className="text-[9px] border-primary/30 text-primary">{sid}</Badge>)}
                  </div>
                </div>
              )}

              {/* Competencies */}
              {(selectedNode.competencies ?? []).length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Competencies</p>
                  <div className="flex flex-wrap gap-1">
                    {(selectedNode.competencies ?? []).map(comp => {
                      const isLM = comp.startsWith('UAE Labor Market')
                      return <Badge key={comp} variant="outline" className={`text-[9px] ${isLM ? 'border-amber-500/30 text-amber-400' : 'border-muted-foreground/30 text-muted-foreground'}`}>{comp.replace('UAE Labor Market: ', '')}</Badge>
                    })}
                  </div>
                </div>
              )}

              {/* Assessments */}
              {nodeAssessments.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1"><ClipboardList className="w-3 h-3" /> Assessments</p>
                  <div className="space-y-1">
                    {nodeAssessments.map(a => (
                      <div key={a.id} className="flex items-center justify-between bg-muted/10 rounded-lg px-2 py-1.5">
                        <span className="text-xs text-foreground">{a.title}</span>
                        <Badge variant="outline" className={`text-[8px] h-4 shrink-0 ${a.type === 'formative' ? 'border-blue-500/30 text-blue-400' : 'border-purple-500/30 text-purple-400'}`}>{a.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {nodeActivities.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1"><Activity className="w-3 h-3" /> Activities</p>
                  <div className="space-y-1">
                    {nodeActivities.map(act => (
                      <div key={act.id} className="flex items-center justify-between bg-muted/10 rounded-lg px-2 py-1.5">
                        <span className="text-xs text-foreground">{act.title}</span>
                        <Badge variant="outline" className="text-[8px] h-4 shrink-0 border-muted/40 text-muted-foreground capitalize">{act.activityType}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Version history */}
              {nodeVersionHistory.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Version History</p>
                  <div className="space-y-1">
                    {nodeVersionHistory.map(v => (
                      <div key={v.version} className="flex items-center justify-between bg-muted/10 rounded-lg px-2 py-1.5">
                        <div>
                          <span className="text-[10px] font-mono text-foreground">v{v.version}</span>
                          <span className="text-[10px] text-muted-foreground ml-2">{v.changedBy}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground">{v.changedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-16">
              <BookOpen className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">Select a node in the tree to see its details</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share toast */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-card border border-border rounded-xl shadow-xl text-xs text-foreground flex items-center gap-2">
          <Share2 className="w-3.5 h-3.5 text-primary" /> Link copied to clipboard
        </div>
      )}
    </div>
  )
}
