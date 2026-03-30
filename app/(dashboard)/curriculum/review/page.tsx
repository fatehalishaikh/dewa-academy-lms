'use client'
import { useState } from 'react'
import { ChevronRight, ChevronDown, MessageSquare, CheckCircle2, XCircle, Bell, Clock, Zap } from 'lucide-react'
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

// Automation metadata per node (SLA, auto-routing)
const AUTOMATION: Record<string, { route: string; sla: string }> = {
  'les-003': { route: 'Auto-routed to Sarah Al-Ahmad', sla: 'SLA: 3 days left' },
  'unt-004': { route: 'Auto-routed to Mohammed Khalid', sla: 'SLA: 1 day left' },
  'les-005': { route: 'Auto-routed to Sarah Al-Ahmad', sla: 'SLA: 5 days left' },
}

const NOTIFICATIONS = [
  { id: 1, text: 'Mohammed Khalid approved Unit 2: Geometry', time: '10 min ago', read: false },
  { id: 2, text: "New comment on Newton's Laws lesson", time: '1 hr ago', read: false },
  { id: 3, text: "Lesson 'Kinematics' is overdue for review — SLA exceeded", time: 'Yesterday', read: true },
  { id: 4, text: "Discriminant lesson moved to 'Approved' by Sarah Al-Ahmad", time: '2 days ago', read: true },
]

type ReviewRole = 'Curriculum Coordinator' | 'Teacher' | 'Admin'

export default function CurriculumReview() {
  const [nodes, setNodes] = useState<CurriculumNode[]>(curriculumNodes)
  const [comments, setComments] = useState<Record<string, string[]>>(MOCK_COMMENTS)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({})
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [role, setRole] = useState<ReviewRole>('Curriculum Coordinator')
  const [notifOpen, setNotifOpen] = useState(false)

  const canApprove = role === 'Curriculum Coordinator' || role === 'Admin'

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

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <div className="space-y-4">
      {/* Role selector + Notifications */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Viewing as:</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value as ReviewRole)}
            className="bg-card border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
          >
            <option>Curriculum Coordinator</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
          {canApprove ? (
            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">Can approve</Badge>
          ) : (
            <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">Submit only</Badge>
          )}
        </div>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] text-primary-foreground font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 z-20 w-72 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                <span className="text-[9px] text-muted-foreground">{unreadCount} unread</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`px-3 py-2.5 border-b border-border last:border-0 ${n.read ? '' : 'bg-primary/5'}`}>
                  <p className="text-[10px] text-foreground">{n.text}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-4 gap-4">
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
                  const automation = AUTOMATION[node.id]
                  const slaUrgent = automation?.sla?.includes('1 day')

                  return (
                    <Card
                      key={node.id}
                      className={`rounded-2xl border overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${STATUS_COLORS[node.status]}`}
                      onClick={() => setActiveCardId(isActive ? null : node.id)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <div className="flex items-center gap-1 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-[8px] h-4 border-border text-muted-foreground capitalize">
                              {node.nodeType}
                            </Badge>
                            {node.version && (
                              <Badge variant="outline" className="text-[8px] h-4 border-muted-foreground/20 text-muted-foreground">
                                v{node.version}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs font-medium text-foreground leading-tight">{node.title}</p>
                        </div>

                        {/* Automation indicators */}
                        {automation && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                              <span className="text-[9px] text-blue-400">{automation.route}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className={`w-2.5 h-2.5 shrink-0 ${slaUrgent ? 'text-red-400' : 'text-muted-foreground'}`} />
                              <span className={`text-[9px] ${slaUrgent ? 'text-red-400 font-medium' : 'text-muted-foreground'}`}>{automation.sla}</span>
                            </div>
                          </div>
                        )}

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

                            {/* Role-based actions */}
                            {status === 'under-review' && canApprove && (
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

                            {/* Teacher: submit for review */}
                            {status === 'draft' && !canApprove && (
                              <Button size="sm" variant="outline" onClick={() => handleAdvance(node.id)} className="w-full h-6 text-[10px] gap-1">
                                Submit for Review <ChevronRight className="w-3 h-3" />
                              </Button>
                            )}

                            {/* Move to next (non-review for coordinators/admins) */}
                            {next && status !== 'under-review' && canApprove && (
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
    </div>
  )
}
