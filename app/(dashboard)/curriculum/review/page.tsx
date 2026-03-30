'use client'
import { useState } from 'react'
import { ChevronRight, MessageSquare, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { curriculumNodes, type CurriculumNode, type NodeStatus } from '@/data/mock-curriculum'

const STATUS_ORDER: NodeStatus[] = ['draft', 'under-review', 'approved', 'published']

const STATUS_LABELS: Record<NodeStatus, string> = {
  draft:          'Draft',
  'under-review': 'Under Review',
  approved:       'Approved',
  published:      'Published',
}

const STATUS_COLORS: Record<NodeStatus, string> = {
  draft:          'border-amber-500/20 bg-amber-500/5',
  'under-review': 'border-blue-500/20 bg-blue-500/5',
  approved:       'border-emerald-500/20 bg-emerald-500/5',
  published:      'border-primary/20 bg-primary/5',
}

const STATUS_HEADER_COLORS: Record<NodeStatus, string> = {
  draft:          'text-amber-400 border-b border-amber-500/20 bg-amber-500/5',
  'under-review': 'text-blue-400 border-b border-blue-500/20 bg-blue-500/5',
  approved:       'text-emerald-400 border-b border-emerald-500/20 bg-emerald-500/5',
  published:      'text-primary border-b border-primary/20 bg-primary/5',
}

const MOCK_COMMENTS: Record<string, string[]> = {
  'les-003': ['Objectives align well with KHDA standards. Minor formatting adjustment needed.'],
  'unt-004': ['Review thermodynamics learning outcomes — consider adding real-world applications.'],
  'les-005': ['Good lesson structure. Suggest adding more worked examples for struggling learners.'],
}

const REVIEWERS = [
  { initials: 'SA', color: '#0EA5E9', name: 'Sarah Al-Ahmad' },
  { initials: 'MK', color: '#10B981', name: 'Mohammed Khalid' },
]

export default function CurriculumReview() {
  const [nodes, setNodes] = useState<CurriculumNode[]>(curriculumNodes)
  const [comments, setComments] = useState<Record<string, string[]>>(MOCK_COMMENTS)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({})
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  function nextStatus(status: NodeStatus): NodeStatus | null {
    const idx = STATUS_ORDER.indexOf(status)
    return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null
  }

  function handleAdvance(nodeId: string) {
    setNodes(prev => prev.map(n => {
      if (n.id !== nodeId) return n
      const next = nextStatus(n.status)
      return next ? { ...n, status: next } : n
    }))
  }

  function handleApprove(nodeId: string) {
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, status: 'approved' } : n
    ))
    setActiveCardId(null)
  }

  function handleReject(nodeId: string) {
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, status: 'draft' } : n
    ))
    const fb = feedbackText[nodeId]
    if (fb) {
      setComments(prev => ({
        ...prev,
        [nodeId]: [...(prev[nodeId] ?? []), `[Rejected] ${fb}`],
      }))
    }
    setRejectingId(null)
    setFeedbackText(prev => ({ ...prev, [nodeId]: '' }))
  }

  function handleAddComment(nodeId: string) {
    const text = newComment[nodeId]?.trim()
    if (!text) return
    setComments(prev => ({ ...prev, [nodeId]: [...(prev[nodeId] ?? []), text] }))
    setNewComment(prev => ({ ...prev, [nodeId]: '' }))
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {STATUS_ORDER.map(status => {
        const col = nodes.filter(n => n.status === status)
        return (
          <div key={status} className="flex flex-col gap-3">
            {/* Column header */}
            <div className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${STATUS_HEADER_COLORS[status]}`}>
              <span>{STATUS_LABELS[status]}</span>
              <span className="text-[10px] opacity-60">{col.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1">
              {col.map(node => {
                const nodeComments = comments[node.id] ?? []
                const isActive = activeCardId === node.id
                const isRejecting = rejectingId === node.id
                const next = nextStatus(node.status)

                return (
                  <Card
                    key={node.id}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${STATUS_COLORS[node.status]}`}
                    onClick={() => setActiveCardId(isActive ? null : node.id)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div>
                        <Badge variant="outline" className="text-[8px] h-4 border-border text-muted-foreground capitalize mb-1">
                          {node.nodeType}
                        </Badge>
                        <p className="text-xs font-medium text-foreground leading-tight">{node.title}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {REVIEWERS.slice(0, 2).map(r => (
                            <Avatar key={r.initials} className="w-5 h-5 border border-background">
                              <AvatarFallback className="text-[8px] font-bold text-white" style={{ background: r.color }}>
                                {r.initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {nodeComments.length > 0 && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <MessageSquare className="w-2.5 h-2.5" /> {nodeComments.length}
                          </span>
                        )}
                      </div>

                      {/* Inline actions */}
                      {isActive && (
                        <div className="pt-2 border-t border-border space-y-2" onClick={e => e.stopPropagation()}>
                          {/* Comments */}
                          {nodeComments.length > 0 && (
                            <div className="space-y-1">
                              {nodeComments.map((c, i) => (
                                <p key={i} className="text-[10px] text-muted-foreground bg-muted/20 rounded-lg px-2 py-1">{c}</p>
                              ))}
                            </div>
                          )}
                          {/* Add comment */}
                          <div className="flex gap-1">
                            <input
                              value={newComment[node.id] ?? ''}
                              onChange={e => setNewComment(prev => ({ ...prev, [node.id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleAddComment(node.id)}
                              placeholder="Add comment…"
                              className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-primary/50"
                            />
                            <Button size="sm" className="h-5 text-[9px] px-2" onClick={() => handleAddComment(node.id)}>+</Button>
                          </div>

                          {/* Approve/Reject (for under-review) */}
                          {status === 'under-review' && (
                            <>
                              {isRejecting ? (
                                <div className="space-y-1">
                                  <textarea
                                    value={feedbackText[node.id] ?? ''}
                                    onChange={e => setFeedbackText(prev => ({ ...prev, [node.id]: e.target.value }))}
                                    placeholder="Rejection reason…"
                                    rows={2}
                                    className="w-full bg-background border border-border rounded-xl px-2 py-1 text-[10px] resize-none focus:outline-none focus:border-primary/50"
                                  />
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="destructive" onClick={() => handleReject(node.id)} className="h-5 text-[9px] px-2">Reject</Button>
                                    <Button size="sm" variant="outline" onClick={() => setRejectingId(null)} className="h-5 text-[9px] px-2">Cancel</Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-1">
                                  <Button size="sm" onClick={() => handleApprove(node.id)} className="h-6 text-[10px] gap-1 flex-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Approve
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setRejectingId(node.id)} className="h-6 text-[10px] gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
                                    <XCircle className="w-2.5 h-2.5" /> Reject
                                  </Button>
                                </div>
                              )}
                            </>
                          )}

                          {/* Move to next */}
                          {next && status !== 'under-review' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAdvance(node.id)}
                              className="w-full h-6 text-[10px] gap-1"
                            >
                              Move to {STATUS_LABELS[next]} <ChevronRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
              {col.length === 0 && (
                <p className="text-[10px] text-muted-foreground text-center py-4">No items</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
