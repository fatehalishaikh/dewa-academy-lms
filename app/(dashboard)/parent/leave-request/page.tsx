'use client'
import { useState } from 'react'
import {
  Sparkles, CalendarOff, CheckCircle2, Clock, XCircle,
  Upload, Send, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'
import { useLeaveRequestStore, LEAVE_TYPE_LABELS, type LeaveType } from '@/stores/leave-request-store'

const statusConfig = {
  pending:  { label: 'Pending',  color: 'text-amber-400',   border: 'border-amber-500/30',   icon: Clock         },
  approved: { label: 'Approved', color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2  },
  rejected: { label: 'Rejected', color: 'text-red-400',     border: 'border-red-500/30',     icon: XCircle       },
}

export default function LeaveRequestPage() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)
  const { submitRequest, getRequestsByParent } = useLeaveRequestStore()

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? '')
  const [leaveType, setLeaveType] = useState<LeaveType>('medical')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const pastRequests = parent ? getRequestsByParent(parent.id) : []
  const selectedChild = children.find(c => c?.id === selectedChildId)

  function handleSubmit() {
    if (!selectedChildId || !startDate || !endDate || !reason.trim() || !parent) return
    submitRequest({
      parentId: parent.id,
      studentId: selectedChildId,
      studentName: selectedChild?.name ?? '',
      type: leaveType,
      startDate,
      endDate,
      reason: reason.trim(),
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setStartDate('')
      setEndDate('')
      setReason('')
      setLeaveType('medical')
    }, 2500)
  }

  const isFormValid = selectedChildId && startDate && endDate && reason.trim() && startDate <= endDate

  if (!parent) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No parent found.</p></div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Leave Management</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Apply for Leave</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Submit an absence or leave request for your child</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarOff className="w-4 h-4 text-primary" />
              New Leave Request
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-foreground">Request Submitted</p>
                <p className="text-xs text-muted-foreground text-center">
                  Your leave request has been sent to the school. You will be notified once reviewed.
                </p>
              </div>
            ) : (
              <>
                {/* Child selector */}
                {children.length > 1 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Child</Label>
                    <Select value={selectedChildId} onValueChange={v => v && setSelectedChildId(v)}>
                      <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
                        <SelectValue placeholder="Select child" />
                      </SelectTrigger>
                      <SelectContent>
                        {children.map(child => child && (
                          <SelectItem key={child.id} value={child.id} className="text-sm">
                            {child.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Leave type */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Leave Type</Label>
                  <Select value={leaveType} onValueChange={v => setLeaveType(v as LeaveType)}>
                    <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(LEAVE_TYPE_LABELS) as [LeaveType, string][]).map(([val, label]) => (
                        <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="bg-muted/30 border-border h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="bg-muted/30 border-border h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Reason</Label>
                  <Textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Provide details for the leave request…"
                    className="bg-muted/30 border-border text-sm resize-none min-h-24"
                  />
                </div>

                {/* Document upload (UI only) */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Supporting Document <span className="text-muted-foreground">(optional)</span></Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
                    <p className="text-xs text-muted-foreground">Drop file here or <span className="text-primary">browse</span></p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PDF, JPG, PNG — max 5MB</p>
                  </div>
                </div>

                <Button onClick={handleSubmit} disabled={!isFormValid} className="w-full" size="sm">
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Submit Leave Request
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Guidelines */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Leave Policy</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {[
                { title: 'Medical Leave', desc: 'Requires a medical certificate upon return to school.' },
                { title: 'Planned Absence', desc: 'Submit at least 3 school days in advance.' },
                { title: 'Emergency Absence', desc: 'Notify the school within 24 hours by phone.' },
                { title: 'Maximum Leave', desc: 'Students must not exceed 15 days per semester without special approval.' },
                { title: 'Make-up Work', desc: 'Students are responsible for catching up on missed work.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedChild && (
            <Card className="rounded-2xl border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: selectedChild.avatarColor }}
                  >
                    {selectedChild.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{selectedChild.name}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedChild.gradeLevel} — {selectedChild.section}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Past requests */}
      {pastRequests.length > 0 && (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold">Previous Requests</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2">
            {pastRequests.map(req => {
              const cfg = statusConfig[req.status]
              const Icon = cfg.icon
              const isExpanded = expandedId === req.id
              return (
                <div key={req.id} className="rounded-xl border border-border overflow-hidden">
                  <button
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{LEAVE_TYPE_LABELS[req.type]}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {req.studentName} · {req.startDate} to {req.endDate}
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] h-5 shrink-0 ${cfg.color} ${cfg.border}`}>
                      {cfg.label}
                    </Badge>
                    {isExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 border-t border-border bg-muted/10">
                      <p className="text-[11px] text-muted-foreground pt-2">{req.reason}</p>
                      {req.reviewNote && (
                        <div className="p-2 rounded-lg bg-card border border-border">
                          <p className="text-[10px] font-medium text-muted-foreground mb-0.5">School Note</p>
                          <p className="text-[11px] text-foreground">{req.reviewNote}</p>
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground">Submitted: {req.submittedDate}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
