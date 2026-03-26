import { useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Wand2, BookOpen, BookMarked, Layers, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { curriculumNodes, type CurriculumNode, type NodeStatus, type NodeType } from '@/data/mock-curriculum'

const statusColor: Record<NodeStatus, string> = {
  draft:        'border-amber-500/30 text-amber-400',
  'under-review': 'border-blue-500/30 text-blue-400',
  approved:     'border-emerald-500/30 text-emerald-400',
  published:    'border-primary/30 text-primary',
}

const nodeIcon: Record<NodeType, React.ElementType> = {
  program: BookMarked,
  course:  BookOpen,
  unit:    Layers,
  lesson:  FileText,
}

type AddingForm = { parentId: string; nodeType: NodeType; title: string; description: string }

export function CurriculumBuilder() {
  const [nodes, setNodes] = useState<CurriculumNode[]>(curriculumNodes)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['prog-001', 'crs-001', 'crs-002']))
  const [selected, setSelected] = useState<string | null>(null)
  const [addingForm, setAddingForm] = useState<AddingForm | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)

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
    const newNode: CurriculumNode = {
      id: `new-${Date.now()}`,
      parentId: addingForm.parentId,
      nodeType: addingForm.nodeType,
      title: addingForm.title || `New ${addingForm.nodeType}`,
      description: addingForm.description,
      objectives: [],
      standardIds: [],
      status: 'draft',
    }
    setNodes(prev => [...prev, newNode])
    setExpanded(prev => new Set([...prev, addingForm.parentId]))
    setAddingForm(null)
  }

  function handleAiSuggest() {
    const targetCourse = nodes.find(n => n.nodeType === 'course')
    if (!targetCourse) return
    setAiGenerating(true)
    setTimeout(() => {
      const unitId1 = `ai-unt-${Date.now()}`
      const unitId2 = `ai-unt-${Date.now() + 1}`
      const newNodes: CurriculumNode[] = [
        {
          id: unitId1, parentId: targetCourse.id, nodeType: 'unit',
          title: 'Unit: Statistics & Probability',
          description: 'AI-generated unit covering descriptive statistics, probability distributions, and data interpretation.',
          objectives: ['Calculate mean, median, mode', 'Apply probability rules', 'Interpret statistical graphs'],
          standardIds: [], status: 'draft',
        },
        {
          id: `ai-les-${Date.now()}`, parentId: unitId1, nodeType: 'lesson',
          title: 'Introduction to Descriptive Statistics',
          description: 'Collect, organise, and summarise data using central tendency and spread measures.',
          objectives: ['Calculate measures of central tendency', 'Interpret box plots'],
          standardIds: [], status: 'draft',
        },
        {
          id: unitId2, parentId: targetCourse.id, nodeType: 'unit',
          title: 'Unit: Trigonometry Foundations',
          description: 'AI-generated unit introducing trigonometric ratios, identities, and real-world applications.',
          objectives: ['Define sine, cosine, tangent', 'Apply trig ratios in right triangles', 'Solve real-world trig problems'],
          standardIds: [], status: 'draft',
        },
        {
          id: `ai-les-${Date.now() + 2}`, parentId: unitId2, nodeType: 'lesson',
          title: 'Sine and Cosine Ratios',
          description: 'Understand and apply sine and cosine in right-angled triangles.',
          objectives: ['Define sine and cosine', 'Calculate sides using ratios'],
          standardIds: [], status: 'draft',
        },
      ]
      setNodes(prev => [...prev, ...newNodes])
      setExpanded(prev => new Set([...prev, targetCourse.id, unitId1, unitId2]))
      setAiGenerating(false)
    }, 2000)
  }

  const selectedNode = selected ? nodes.find(n => n.id === selected) : null

  function renderNode(node: CurriculumNode, depth = 0) {
    const children = nodes.filter(n => n.parentId === node.id)
    const isExpanded = expanded.has(node.id)
    const isSelected = selected === node.id
    const NodeIcon = nodeIcon[node.nodeType]
    const childType = childTypeOf(node.nodeType)


    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors group ${
            isSelected ? 'bg-primary/10' : 'hover:bg-muted/20'
          }`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={() => setSelected(isSelected ? null : node.id)}
        >
          {children.length > 0 ? (
            <button
              className="w-4 h-4 flex items-center justify-center text-muted-foreground shrink-0"
              onClick={e => { e.stopPropagation(); toggleExpand(node.id) }}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}
          <NodeIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-xs font-medium text-foreground truncate">{node.title}</span>
          <Badge variant="outline" className={`text-[9px] h-4 shrink-0 ${statusColor[node.status]}`}>
            {node.status}
          </Badge>
          {node.duration && (
            <span className="text-[10px] text-muted-foreground shrink-0">{node.duration}h</span>
          )}
          {childType && (
            <button
              className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all shrink-0"
              onClick={e => {
                e.stopPropagation()
                setAddingForm({ parentId: node.id, nodeType: childType, title: '', description: '' })
              }}
              title={`Add ${childType}`}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Add form */}
        {addingForm?.parentId === node.id && (
          <div
            className="mx-3 mb-2 p-3 bg-muted/10 border border-border rounded-xl space-y-2"
            style={{ marginLeft: `${12 + depth * 20 + 24}px` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">New {addingForm.nodeType}</p>
            <input
              autoFocus
              value={addingForm.title}
              onChange={e => setAddingForm(prev => prev ? { ...prev, title: e.target.value } : prev)}
              placeholder="Title…"
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary/50"
            />
            <input
              value={addingForm.description}
              onChange={e => setAddingForm(prev => prev ? { ...prev, description: e.target.value } : prev)}
              placeholder="Description (optional)…"
              className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary/50"
            />
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

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4 h-full">
      {/* Tree */}
      <Card className="rounded-2xl border-border overflow-hidden flex flex-col">
        <CardHeader className="pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Curriculum Tree</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAiSuggest}
              disabled={aiGenerating}
              className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              {aiGenerating
                ? <><span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Generating…</>
                : <><Wand2 className="w-3 h-3" /> AI Suggest Structure</>
              }
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 overflow-y-auto flex-1">
          {rootNodes.map(node => renderNode(node))}
        </CardContent>
      </Card>

      {/* Detail panel */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm">Node Detail</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {selectedNode ? (
            <div className="space-y-3">
              <div>
                <Badge variant="outline" className={`text-[9px] h-4 mb-2 ${statusColor[selectedNode.status]}`}>
                  {selectedNode.nodeType} · {selectedNode.status}
                </Badge>
                <h3 className="text-sm font-semibold text-foreground">{selectedNode.title}</h3>
                {selectedNode.duration && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{selectedNode.duration}h duration</p>
                )}
              </div>
              {selectedNode.description && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                  <p className="text-xs text-muted-foreground">{selectedNode.description}</p>
                </div>
              )}
              {selectedNode.objectives.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Objectives</p>
                  <ul className="space-y-0.5">
                    {selectedNode.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedNode.standardIds.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Linked Standards</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.standardIds.map(sid => (
                      <Badge key={sid} variant="outline" className="text-[9px] border-primary/30 text-primary">{sid}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Select a node to view details</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
