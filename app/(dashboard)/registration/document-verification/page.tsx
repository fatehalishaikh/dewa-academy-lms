'use client'
import { useState } from 'react'
import { ScanSearch, Sparkles, CheckCircle2, AlertCircle, Clock, ThumbsUp, Flag, RefreshCw, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockApplications } from '@/data/mock-registration'
import { useAcademyStore } from '@/stores/academy-store'

const pendingApps = mockApplications.filter(a =>
  a.stage === 'Documents Under Review' || a.stage === 'Emirates ID Verified'
)

function VerificationBadge({ status }: { status: string }) {
  if (status === 'Verified')
    return <Badge variant="outline" className="text-[9px] bg-green-500/10 text-green-400 border-green-500/20">Verified</Badge>
  if (status === 'Flagged')
    return <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20">Flagged</Badge>
  if (status === 'Rejected')
    return <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20">Rejected</Badge>
  return <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</Badge>
}

function FieldStatusIcon({ matches }: { matches: boolean }) {
  return matches
    ? <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
    : <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
}

export default function DocumentVerification() {
  const [selectedApp, setSelectedApp] = useState(pendingApps[0] ?? null)
  const [rescanning, setRescanning] = useState(false)
  const [approvedApps, setApprovedApps] = useState<Set<string>>(new Set())
  const [flaggedApps, setFlaggedApps] = useState<Set<string>>(new Set())
  const [resubmitOpen, setResubmitOpen] = useState(false)
  const [resubmitNote, setResubmitNote] = useState('')
  const [resubmitSent, setResubmitSent] = useState(false)
  const { addNotification } = useAcademyStore()

  const hasMismatch = selectedApp?.documents.some(d =>
    d.extractedFields.some(f => !f.matchesApplication)
  ) ?? false

  const isApproved = selectedApp ? approvedApps.has(selectedApp.id) : false
  const isFlagged = selectedApp ? flaggedApps.has(selectedApp.id) : false

  function handleRescan() {
    setRescanning(true)
    setTimeout(() => setRescanning(false), 1600)
  }

  function handleApproveAll() {
    if (!selectedApp) return
    setApprovedApps(prev => new Set([...prev, selectedApp.id]))
    addNotification({ type: 'registration', title: 'Documents approved', body: `All documents approved for ${selectedApp.nameEn}`, recipientRole: 'admin' })
  }

  function handleFlag() {
    if (!selectedApp) return
    setFlaggedApps(prev => {
      const next = new Set(prev)
      if (next.has(selectedApp.id)) next.delete(selectedApp.id)
      else next.add(selectedApp.id)
      return next
    })
  }

  function handleResubmit() {
    if (!selectedApp) return
    addNotification({ type: 'registration', title: 'Resubmission requested', body: `Resubmission requested for ${selectedApp.nameEn}`, recipientRole: 'admin' })
    setResubmitSent(true)
    setTimeout(() => { setResubmitSent(false); setResubmitOpen(false); setResubmitNote('') }, 2000)
  }

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Left: Application list */}
      <div className="w-64 shrink-0 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ScanSearch className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-foreground">Pending Verification</p>
          <Badge variant="outline" className="text-[9px] ml-auto">{pendingApps.length}</Badge>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-1">
            {pendingApps.map(app => {
              const hasDoc = app.documents.length > 0
              const flagged = app.flagged
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all space-y-1.5 ${
                    selectedApp?.id === app.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">{app.initials}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{app.nameEn}</p>
                      <p className="text-[9px] text-muted-foreground">{app.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {flagged && <Flag className="w-3 h-3 text-red-400" />}
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 ${hasDoc ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-muted/40'}`}>
                      {app.documents.length} docs
                    </Badge>
                    <span className="text-[9px] text-muted-foreground ml-auto">{app.stage === 'Emirates ID Verified' ? 'ID only' : 'In review'}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Document detail */}
      {selectedApp ? (
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{selectedApp.nameEn}</h3>
              <p className="text-xs text-muted-foreground">{selectedApp.id} · {selectedApp.applicationType}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs h-7 gap-1" disabled={rescanning} onClick={handleRescan}>
                <RefreshCw className={`w-3 h-3 ${rescanning ? 'animate-spin' : ''}`} />
                {rescanning ? 'Scanning…' : 'Re-scan'}
              </Button>
              {isApproved ? (
                <Button size="sm" className="text-xs h-7 gap-1 bg-green-600 hover:bg-green-600 cursor-default">
                  <CheckCircle2 className="w-3 h-3" />Approved
                </Button>
              ) : (
                <Button size="sm" className="text-xs h-7 gap-1 bg-primary hover:bg-primary/90" onClick={handleApproveAll}>
                  <ThumbsUp className="w-3 h-3" />Approve All
                </Button>
              )}
              <Button
                size="sm" variant="outline"
                className={`text-xs h-7 gap-1 ${isFlagged ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-red-400 border-red-500/30 hover:bg-red-500/10'}`}
                onClick={handleFlag}
              >
                <Flag className="w-3 h-3" />{isFlagged ? 'Unflag' : 'Flag'}
              </Button>
            </div>
          </div>

          {/* AI recommendation banner */}
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            hasMismatch
              ? 'bg-red-500/8 border-red-500/20'
              : 'bg-green-500/8 border-green-500/20'
          }`}>
            <Sparkles className={`w-4 h-4 shrink-0 ${hasMismatch ? 'text-red-400' : 'text-green-400'}`} />
            <div>
              <p className={`text-xs font-semibold ${hasMismatch ? 'text-red-400' : 'text-green-400'}`}>
                {hasMismatch
                  ? 'AI Recommendation: Flag for Manual Review'
                  : 'AI Recommendation: Documents look consistent — approve'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {hasMismatch
                  ? 'Discrepancy detected between extracted data and application data. Review highlighted fields.'
                  : 'All extracted fields match application data within acceptable confidence range.'}
              </p>
            </div>
          </div>

          {/* Documents */}
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-1">
              {selectedApp.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl text-center gap-2">
                  <Clock className="w-8 h-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                  <p className="text-xs text-muted-foreground/70">Waiting for applicant to submit documents</p>
                </div>
              ) : (
                selectedApp.documents.map(doc => (
                  <Card key={doc.type} className="border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm">{doc.type}</CardTitle>
                          <VerificationBadge status={doc.verificationStatus} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">OCR: {doc.ocrConfidence}% confidence</span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground">{doc.uploadedDate}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ScanSearch className="w-3 h-3" />Extracted Data
                          </p>
                          {doc.extractedFields.map(f => (
                            <div key={f.field} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 mb-1 ${
                              !f.matchesApplication ? 'bg-red-500/8 border border-red-500/20' : 'bg-muted/30'
                            }`}>
                              <FieldStatusIcon matches={f.matchesApplication} />
                              <div className="min-w-0 flex-1">
                                <p className="text-[9px] text-muted-foreground">{f.field}</p>
                                <p className="text-xs font-medium text-foreground truncate">{f.value}</p>
                              </div>
                              <span className={`text-[9px] shrink-0 ${f.confidence >= 90 ? 'text-green-400' : f.confidence >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                                {f.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Application Data</p>
                          {doc.extractedFields.map(f => (
                            <div key={f.field} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 mb-1 ${
                              !f.matchesApplication ? 'bg-red-500/8 border border-red-500/20' : 'bg-muted/30'
                            }`}>
                              <FieldStatusIcon matches={f.matchesApplication} />
                              <div className="min-w-0 flex-1">
                                <p className="text-[9px] text-muted-foreground">{f.field}</p>
                                <p className="text-xs font-medium text-foreground truncate">
                                  {f.matchesApplication ? f.value : <span className="text-red-400">Mismatch detected</span>}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {/* Checklist status */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Document Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {selectedApp.checklist.map(({ document, required, completed, flagged: f }) => (
                      <div key={document} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        f ? 'bg-red-500/8 border border-red-500/20'
                        : completed ? 'bg-green-500/8 border border-green-500/20'
                        : 'bg-muted/20'
                      }`}>
                        {f ? <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                          : completed ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          : <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                        <span className="text-xs text-foreground flex-1">{document}</span>
                        {required && <span className="text-[9px] text-muted-foreground">Required</span>}
                        {f && <span className="text-[9px] text-red-400 font-medium">Flagged</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => setResubmitOpen(v => !v)}>
                      Request Resubmission
                    </Button>
                  </div>
                  {resubmitOpen && (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={resubmitNote}
                        onChange={e => setResubmitNote(e.target.value)}
                        placeholder="Note to applicant about what needs resubmitting…"
                        className="text-xs resize-none h-20"
                      />
                      <Button size="sm" className="w-full text-xs gap-1.5" onClick={handleResubmit} disabled={resubmitSent}>
                        {resubmitSent ? <><CheckCircle2 className="w-3 h-3" />Sent</> : <><Send className="w-3 h-3" />Send Request</>}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select an application to review
        </div>
      )}
    </div>
  )
}
