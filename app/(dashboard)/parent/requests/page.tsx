'use client'

import { useState, useMemo } from 'react'
import {
  ClipboardList, CalendarOff, Users, FileText, HelpCircle,
  Sparkles, Send, Upload, ChevronDown, ChevronUp,
  CheckCircle2, Clock, XCircle, BookOpen, Brain,
  AlertTriangle, Lightbulb, GraduationCap, Calendar,
  Video, MapPin, FileCheck, Timer, Info, MessageSquare,
  TrendingUp, TrendingDown, Minus, X, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useCurrentParent } from '@/stores/role-store'
import { getStudentById } from '@/data/mock-students'
import { teachers } from '@/data/mock-teachers'
import { gradesByClass } from '@/data/mock-grades'
import {
  useRequestsStore,
  LEAVE_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS,
  DELIVERY_METHOD_LABELS,
  type RequestItem,
  type RequestType,
  type LeaveType,
  type MeetingMode,
} from '@/stores/requests-store'

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUEST_TABS: { id: RequestType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'leave',    label: 'Leave Request',    icon: CalendarOff, desc: 'Request absence for your child' },
  { id: 'meeting',  label: 'Meeting Request',  icon: Users,       desc: 'Schedule a meeting with a teacher' },
  { id: 'document', label: 'Document Request', icon: FileText,    desc: 'Request official documents' },
  { id: 'other',    label: 'Other Request',    icon: HelpCircle,  desc: 'Any other school request' },
]

const STATUS_CFG = {
  pending:  { label: 'Pending',  color: 'text-amber-400',   border: 'border-amber-500/30',   icon: Clock        },
  approved: { label: 'Approved', color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red-400',     border: 'border-red-500/30',     icon: XCircle      },
}

const TYPE_CFG: Record<RequestType, { label: string; icon: React.ElementType; color: string }> = {
  leave:    { label: 'Leave',    icon: CalendarOff, color: 'text-blue-400'   },
  meeting:  { label: 'Meeting',  icon: Users,       color: 'text-violet-400' },
  document: { label: 'Document', icon: FileText,    color: 'text-amber-400'  },
  other:    { label: 'Other',    icon: HelpCircle,  color: 'text-slate-400'  },
}

// Simulated timetable by grade
const TIMETABLE: Record<string, { subject: string; topic: string; teacher: string }[]> = {
  'Grade 9': [
    { subject: 'Mathematics',    topic: 'Algebra – Linear Equations',         teacher: 'Dr. Sarah Ahmed'      },
    { subject: 'Physics',        topic: 'Motion & Forces (Chapter 3)',         teacher: 'Mr. James Wilson'     },
    { subject: 'English',        topic: 'Essay Writing Practice',              teacher: 'Ms. Layla Al-Farsi'   },
    { subject: 'Chemistry',      topic: 'Organic Chemistry – Hydrocarbons',   teacher: 'Mr. Hassan Mahmoud'   },
    { subject: 'Arabic',         topic: 'Literary Texts – Modern Poetry',     teacher: 'Ms. Fatima Al-Zaabi'  },
  ],
  'Grade 10': [
    { subject: 'Mathematics',    topic: 'Trigonometry – Unit Circle',         teacher: 'Dr. Sarah Ahmed'      },
    { subject: 'Physics',        topic: 'Thermodynamics – Heat Transfer',     teacher: 'Mr. James Wilson'     },
    { subject: 'English',        topic: 'Literature Analysis – Othello Act 3', teacher: 'Ms. Layla Al-Farsi' },
    { subject: 'Chemistry',      topic: 'Electrochemistry – Galvanic Cells',  teacher: 'Mr. Hassan Mahmoud'   },
    { subject: 'Arabic',         topic: 'Grammar Review – Advanced Syntax',   teacher: 'Ms. Fatima Al-Zaabi'  },
  ],
  'Grade 11': [
    { subject: 'Mathematics',    topic: 'Calculus – Differentiation Rules',   teacher: 'Dr. Sarah Ahmed'      },
    { subject: 'Physics',        topic: 'Wave Optics – Interference & Diffraction', teacher: 'Mr. James Wilson' },
    { subject: 'English',        topic: 'Extended Essay – Research Methods',  teacher: 'Ms. Layla Al-Farsi'   },
    { subject: 'Chemistry',      topic: 'Gas Laws & Stoichiometry',           teacher: 'Mr. Hassan Mahmoud'   },
    { subject: 'Arabic',         topic: 'Classical Literature – Textual Analysis', teacher: 'Ms. Fatima Al-Zaabi' },
  ],
}

const DOCUMENT_PROCESSING: Record<string, { days: string; requirements: string[] }> = {
  bonafide:   { days: '2–3 business days', requirements: ['Valid student ID', 'Parent/Guardian signature', 'State purpose of document'] },
  transcript: { days: '5–7 business days', requirements: ['Request via parent portal', 'Processing fee may apply', 'Specify required date range'] },
  conduct:    { days: '3–4 business days', requirements: ['Signed request letter', 'No active disciplinary cases'] },
  tc:         { days: '7–10 business days', requirements: ['Original documents submission', 'Fee clearance confirmation', 'Parent/Guardian in-person visit'] },
  fee:        { days: '1–2 business days', requirements: ['Specify academic year', 'Specify term/semester'] },
  other:      { days: '5–7 business days', requirements: ['Submit detailed description', 'Attach supporting documents if any'] },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWeekdays(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(start), e = new Date(end)
  if (s > e) return 0
  let count = 0
  const cur = new Date(s)
  while (cur <= e) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

function formatDateShort(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function requestSummary(req: RequestItem): string {
  switch (req.type) {
    case 'leave':    return `${LEAVE_TYPE_LABELS[req.leaveType]} · ${req.startDate} → ${req.endDate}`
    case 'meeting':  return `${req.subject} · ${req.teacherName} · ${req.preferredDate}`
    case 'document': return `${DOCUMENT_TYPE_LABELS[req.documentType] ?? req.documentType}`
    case 'other':    return req.subject
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// ─── AI Panel content ─────────────────────────────────────────────────────────

function LeaveAIPanel({
  gradeLevel,
  startDate,
  endDate,
}: {
  gradeLevel: string
  startDate: string
  endDate: string
}) {
  const days = countWeekdays(startDate, endDate)
  const gradeKey = gradeLevel in TIMETABLE ? gradeLevel : 'Grade 10'
  const allSubjects = TIMETABLE[gradeKey]
  const missedSubjects = allSubjects.slice(0, Math.min(days, allSubjects.length))

  return (
    <div className="space-y-4">
      {/* Leave policy */}
      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardHeader className="pb-2 pt-2 px-4">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5 text-primary" />
            Leave Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 space-y-2.5">
          {[
            { title: 'Medical Leave', desc: 'Medical certificate required upon return.' },
            { title: 'Planned Absence', desc: 'Submit at least 3 school days in advance.' },
            { title: 'Emergency Absence', desc: 'Notify school within 24 hours by phone.' },
            { title: 'Max Days', desc: 'No more than 15 days per semester without special approval.' },
            { title: 'Make-up Work', desc: 'Student is responsible for missed assignments.' },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-foreground">{title}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Academic impact */}
      {days > 0 && (
        <Card className="rounded-xl border-amber-500/20 bg-amber-500/5 py-2 gap-2">
          <CardHeader className="pb-2 pt-2 px-4">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400">AI Academic Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-2 space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Based on the school timetable, your child will miss{' '}
              <span className="font-semibold text-foreground">{days} school day{days !== 1 ? 's' : ''}</span>{' '}
              covering the following topics:
            </p>
            <div className="space-y-2">
              {missedSubjects.map(({ subject, topic, teacher }) => (
                <div key={subject} className="flex items-start gap-2 p-2 rounded-xl bg-background/60 border border-border">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">{subject}</p>
                    <p className="text-[11px] text-muted-foreground">{topic}</p>
                    <p className="text-[11px] text-muted-foreground/70">{teacher}</p>
                  </div>
                </div>
              ))}
            </div>

            {days >= 3 && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
                <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-primary">AI Suggestion</p>
                  <p className="text-[11px] text-muted-foreground">
                    Review materials 1–2 days before absence and arrange make-up sessions with teachers upon return.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty state if no dates */}
      {days === 0 && (
        <Card className="rounded-xl border-border bg-card py-2 gap-2">
          <CardContent className="px-4 py-2 flex flex-col items-center gap-2">
            <Brain className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-[11px] text-muted-foreground text-center">
              Select leave dates to see the AI-generated academic impact for your child.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MeetingAIPanel({ teacherId, gradeLevel }: { teacherId: string; gradeLevel: string }) {
  const teacher = teachers.find(t => t.id === teacherId)

  // Find grade data for this teacher's subjects
  const relatedGrades = gradesByClass.filter(g => g.teacherId === teacherId).slice(0, 2)

  const trendIcon = (trend: 'up' | 'down' | 'flat') => {
    if (trend === 'up')   return <TrendingUp className="w-3 h-3 text-emerald-400" />
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />
    return <Minus className="w-3 h-3 text-muted-foreground" />
  }
  const trendColor = (trend: 'up' | 'down' | 'flat') => {
    if (trend === 'up')   return 'text-emerald-400'
    if (trend === 'down') return 'text-red-400'
    return 'text-muted-foreground'
  }

  if (!teacher) {
    return (
      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardContent className="px-4 py-2 flex flex-col items-center gap-2">
          <Users className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-[11px] text-muted-foreground text-center">
            Select a teacher to see performance insights and smart meeting recommendations.
          </p>
        </CardContent>
      </Card>
    )
  }

  const hasConcern = relatedGrades.some(g => g.average < 75 || g.trend === 'down')

  return (
    <div className="space-y-4">
      {/* Teacher card */}
      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardContent className="px-4 py-2">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: teacher.avatarColor }}
            >
              {teacher.initials}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{teacher.name}</p>
              <p className="text-[11px] text-muted-foreground">{teacher.department} · {teacher.subjects.join(', ')}</p>
              <p className="text-[11px] text-muted-foreground">{teacher.yearsExperience} yrs experience</p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground border-t border-border pt-2">{teacher.email}</p>
        </CardContent>
      </Card>

      {/* AI recommendation */}
      {hasConcern && (
        <Card className="rounded-xl border-amber-500/20 bg-amber-500/5 py-2 gap-2">
          <CardHeader className="pb-2 pt-2 px-4">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400">AI Recommendation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-2">
            <p className="text-[11px] text-muted-foreground">
              Based on recent assessment trends, a meeting with{' '}
              <span className="font-semibold text-foreground">{teacher.name}</span>{' '}
              is recommended to discuss performance and set improvement goals.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent grades */}
      {relatedGrades.length > 0 && (
        <Card className="rounded-xl border-border bg-card py-2 gap-2">
          <CardHeader className="pb-2 pt-2 px-4">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              Recent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-2 space-y-3">
            {relatedGrades.map(g => (
              <div key={g.classId}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-medium text-foreground">{g.subject}</p>
                  <div className="flex items-center gap-1">
                    {trendIcon(g.trend)}
                    <span className={`text-[11px] font-semibold ${trendColor(g.trend)}`}>{g.average}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted/40 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${g.average}%` }}
                  />
                </div>
                <div className="mt-1.5 space-y-0.5">
                  {g.assignments.slice(0, 2).map(a => (
                    <div key={a.title} className="flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground truncate max-w-[120px]">{a.title}</p>
                      <p className="text-[11px] font-medium text-foreground">{a.points}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Meeting tips */}
      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardHeader className="pb-2 pt-2 px-4">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary" />
            Meeting Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 space-y-2">
          {[
            'Prepare specific questions about grades or behaviour.',
            'Mention any changes at home that may affect studies.',
            'Ask for recommended study resources or practice material.',
          ].map(tip => (
            <div key={tip} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function DocumentAIPanel({ documentType }: { documentType: string }) {
  const info = DOCUMENT_PROCESSING[documentType] ?? DOCUMENT_PROCESSING.other

  return (
    <div className="space-y-4">
      {documentType ? (
        <>
          <Card className="rounded-xl border-primary/20 bg-primary/5 py-2 gap-2">
            <CardHeader className="pb-2 pt-2 px-4">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary">Processing Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-lg font-bold text-foreground mb-0.5">{info.days}</p>
              <p className="text-[11px] text-muted-foreground">After request is acknowledged by the school office.</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border bg-card py-2 gap-2">
            <CardHeader className="pb-2 pt-2 px-4">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-primary" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2 space-y-2">
              {info.requirements.map(req => (
                <div key={req} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground">{req}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="rounded-xl border-border bg-card py-2 gap-2">
          <CardContent className="px-4 py-2 flex flex-col items-center gap-2">
            <FileText className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-[11px] text-muted-foreground text-center">
              Select a document type to see processing time and requirements.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardHeader className="pb-2 pt-2 px-4">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary" />
            General Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 space-y-2">
          {[
            'All documents are issued with an official school stamp.',
            'Arabic translation available upon request.',
            'Contact the admin office for urgent processing.',
          ].map(note => (
            <div key={note} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground">{note}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function OtherAIPanel() {
  return (
    <div className="space-y-4">
      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardHeader className="pb-2 pt-2 px-4">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            How to Submit
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 space-y-2.5">
          {[
            { step: '1', text: 'Clearly describe the subject of your request.' },
            { step: '2', text: 'Provide all relevant details in the description field.' },
            { step: '3', text: 'The admin team will review and respond within 3–5 business days.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step}
              </span>
              <p className="text-[11px] text-muted-foreground">{text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border bg-card py-2 gap-2">
        <CardHeader className="pb-2 pt-2 px-4">
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Common Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 space-y-2">
          {[
            'Bus route / transport changes',
            'Cafeteria meal plan adjustments',
            'Locker allocation requests',
            'Extracurricular activity enquiries',
            'Feedback on school facilities',
          ].map(item => (
            <div key={item} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-primary shrink-0" />
              <p className="text-[11px] text-muted-foreground">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Recent Requests ──────────────────────────────────────────────────────────

function RecentRequests({ requests }: { requests: RequestItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (requests.length === 0) return null

  return (
    <Card className="rounded-xl border-border bg-card py-2 gap-2">
      <CardHeader className="pb-2 pt-2 px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Recent Requests
          <Badge variant="outline" className="ml-auto text-[11px] h-5 text-muted-foreground border-border">
            {requests.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-2 space-y-2">
        {requests.map(req => {
          const sc = STATUS_CFG[req.status]
          const tc = TYPE_CFG[req.type]
          const StatusIcon = sc.icon
          const TypeIcon = tc.icon
          const isExpanded = expandedId === req.id

          return (
            <div key={req.id} className="rounded-xl border border-border overflow-hidden">
              <button
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : req.id)}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-muted/40`}>
                  <TypeIcon className={`w-3.5 h-3.5 ${tc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-medium text-foreground">{tc.label}</p>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <p className="text-[11px] text-muted-foreground">{req.studentName}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{requestSummary(req)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={`text-[11px] h-5 ${sc.color} ${sc.border}`}>
                    <StatusIcon className="w-2.5 h-2.5 mr-1" />
                    {sc.label}
                  </Badge>
                  {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-2 space-y-2 border-t border-border bg-muted/10 pt-2">
                  {/* Type-specific detail */}
                  {req.type === 'leave' && (
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div><span className="text-muted-foreground">Type: </span><span className="text-foreground font-medium">{LEAVE_TYPE_LABELS[req.leaveType]}</span></div>
                      <div><span className="text-muted-foreground">Dates: </span><span className="text-foreground font-medium">{req.startDate} → {req.endDate}</span></div>
                      <div className="col-span-2"><span className="text-muted-foreground">Reason: </span><span className="text-foreground">{req.reason}</span></div>
                    </div>
                  )}
                  {req.type === 'meeting' && (
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div><span className="text-muted-foreground">Teacher: </span><span className="text-foreground font-medium">{req.teacherName}</span></div>
                      <div><span className="text-muted-foreground">Mode: </span><span className="text-foreground font-medium capitalize">{req.mode}</span></div>
                      <div><span className="text-muted-foreground">Date: </span><span className="text-foreground font-medium">{req.preferredDate} at {req.preferredTime}</span></div>
                      {req.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes: </span><span className="text-foreground">{req.notes}</span></div>}
                    </div>
                  )}
                  {req.type === 'document' && (
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div><span className="text-muted-foreground">Document: </span><span className="text-foreground font-medium">{DOCUMENT_TYPE_LABELS[req.documentType] ?? req.documentType}</span></div>
                      <div><span className="text-muted-foreground">Delivery: </span><span className="text-foreground font-medium">{DELIVERY_METHOD_LABELS[req.deliveryMethod] ?? req.deliveryMethod}</span></div>
                      {req.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes: </span><span className="text-foreground">{req.notes}</span></div>}
                    </div>
                  )}
                  {req.type === 'other' && (
                    <div className="space-y-1 text-[11px]">
                      <div><span className="text-muted-foreground">Subject: </span><span className="text-foreground font-medium">{req.subject}</span></div>
                      <div><span className="text-muted-foreground">Details: </span><span className="text-foreground">{req.description}</span></div>
                    </div>
                  )}

                  {req.reviewNote && (
                    <div className="p-2.5 rounded-lg bg-card border border-border mt-1">
                      <p className="text-[11px] font-semibold text-muted-foreground mb-0.5">School Response</p>
                      <p className="text-[11px] text-foreground">{req.reviewNote}</p>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Submitted: {formatDateShort(req.submittedDate)}
                    {req.reviewedBy && <> · Reviewed by {req.reviewedBy}</>}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RequestsPage() {
  const parent = useCurrentParent()
  const children = (parent?.childIds ?? []).map(id => getStudentById(id)).filter(Boolean)
  const { submitLeave, submitMeeting, submitDocument, submitOther, getByParent } = useRequestsStore()

  // Shared
  const [requestType, setRequestType] = useState<RequestType>('leave')
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? '')
  const [submitted, setSubmitted] = useState(false)
  const [submittedType, setSubmittedType] = useState<RequestType>('leave')

  // Leave form
  const [leaveType, setLeaveType]   = useState<LeaveType>('medical')
  const [startDate, setStartDate]   = useState('')
  const [endDate, setEndDate]       = useState('')
  const [leaveReason, setLeaveReason] = useState('')

  // Meeting form
  const [teacherId, setTeacherId]         = useState('')
  const [meetingSubject, setMeetingSubject] = useState('')
  const [prefDate, setPrefDate]           = useState('')
  const [prefTime, setPrefTime]           = useState('')
  const [meetingMode, setMeetingMode]     = useState<MeetingMode>('in-person')
  const [meetingNotes, setMeetingNotes]   = useState('')

  // Document form
  const [docType, setDocType]           = useState('')
  const [deliveryMethod, setDelivery]   = useState('')
  const [docNotes, setDocNotes]         = useState('')

  // Other form
  const [otherSubject, setOtherSubject]   = useState('')
  const [otherDesc, setOtherDesc]         = useState('')

  const selectedChild = children.find(c => c?.id === selectedChildId)
  const pastRequests  = parent ? getByParent(parent.id) : []

  const selectedTeacher = teachers.find(t => t.id === teacherId)

  // Populate subject when teacher changes
  function handleTeacherChange(id: string) {
    setTeacherId(id)
    const t = teachers.find(x => x.id === id)
    if (t) setMeetingSubject(t.subjects[0] ?? '')
  }

  // Validation per type
  const isFormValid = useMemo(() => {
    if (!selectedChildId) return false
    switch (requestType) {
      case 'leave':    return !!(startDate && endDate && leaveReason.trim() && startDate <= endDate)
      case 'meeting':  return !!(teacherId && prefDate && prefTime)
      case 'document': return !!(docType && deliveryMethod)
      case 'other':    return !!(otherSubject.trim() && otherDesc.trim())
    }
  }, [requestType, selectedChildId, startDate, endDate, leaveReason, teacherId, prefDate, prefTime, docType, deliveryMethod, otherSubject, otherDesc])

  function resetForms() {
    setStartDate(''); setEndDate(''); setLeaveReason(''); setLeaveType('medical')
    setTeacherId(''); setMeetingSubject(''); setPrefDate(''); setPrefTime(''); setMeetingMode('in-person'); setMeetingNotes('')
    setDocType(''); setDelivery(''); setDocNotes('')
    setOtherSubject(''); setOtherDesc('')
  }

  function handleSubmit() {
    if (!parent || !selectedChild || !isFormValid) return

    const base = {
      parentId: parent.id,
      studentId: selectedChild.id,
      studentName: selectedChild.name,
    }

    switch (requestType) {
      case 'leave':
        submitLeave({ ...base, leaveType, startDate, endDate, reason: leaveReason.trim() })
        break
      case 'meeting':
        submitMeeting({
          ...base,
          teacherId,
          teacherName: selectedTeacher?.name ?? '',
          subject: meetingSubject,
          preferredDate: prefDate,
          preferredTime: prefTime,
          mode: meetingMode,
          notes: meetingNotes.trim(),
        })
        break
      case 'document':
        submitDocument({ ...base, documentType: docType, deliveryMethod, notes: docNotes.trim() })
        break
      case 'other':
        submitOther({ ...base, subject: otherSubject.trim(), description: otherDesc.trim() })
        break
    }

    setSubmittedType(requestType)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      resetForms()
    }, 3000)
  }

  if (!parent) {
    return <div className="p-6"><p className="text-sm text-muted-foreground">No parent session found.</p></div>
  }

  // ── Form sections ──────────────────────────────────────────────────────────

  // Reusable inline child selector (for use inside grids)
  const childSelectField = children.length > 1 ? (
    <div className="space-y-1.5">
      <Label className="text-xs">Child</Label>
      <Select value={selectedChildId} onValueChange={v => v && setSelectedChildId(v)}>
        <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
          <SelectValue placeholder="Select child" />
        </SelectTrigger>
        <SelectContent>
          {children.map(child => child && (
            <SelectItem key={child.id} value={child.id} className="text-sm">{child.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : null

  const leaveForm = (
    <>
      {/* First two dropdowns side by side */}
      <div className="grid grid-cols-2 gap-3">
        {childSelectField}
        <div className={`space-y-1.5 ${children.length <= 1 ? 'col-span-2' : ''}`}>
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
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Start Date</Label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className="bg-muted/30 border-border h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">End Date</Label>
          <Input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)}
            className="bg-muted/30 border-border h-9 text-sm" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Reason</Label>
        <Textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)}
          placeholder="Describe the reason for the absence…"
          className="bg-muted/30 border-border text-sm resize-none min-h-20" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Supporting Document <span className="text-muted-foreground">(optional)</span></Label>
        <div className="border-2 border-dashed border-border rounded-xl px-4 py-2 text-center hover:border-primary/40 transition-colors cursor-pointer">
          <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
          <p className="text-[11px] text-muted-foreground">Drop file or <span className="text-primary">browse</span></p>
          <p className="text-[11px] text-muted-foreground mt-0.5">PDF, JPG, PNG — max 5 MB</p>
        </div>
      </div>
    </>
  )

  const meetingForm = (
    <>
      {/* First two dropdowns side by side */}
      <div className="grid grid-cols-2 gap-3">
        {childSelectField}
        <div className={`space-y-1.5 ${children.length <= 1 ? 'col-span-2' : ''}`}>
          <Label className="text-xs">Teacher</Label>
          <Select value={teacherId} onValueChange={handleTeacherChange}>
            <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map(t => (
                <SelectItem key={t.id} value={t.id} className="text-sm">
                  {t.name} — {t.subjects.join(', ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Subject / Purpose</Label>
        <Input value={meetingSubject} onChange={e => setMeetingSubject(e.target.value)}
          placeholder="e.g. Mathematics performance review"
          className="bg-muted/30 border-border h-9 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Preferred Date</Label>
          <Input type="date" value={prefDate} onChange={e => setPrefDate(e.target.value)}
            className="bg-muted/30 border-border h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preferred Time</Label>
          <Input type="time" value={prefTime} onChange={e => setPrefTime(e.target.value)}
            className="bg-muted/30 border-border h-9 text-sm" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          {(['in-person', 'online'] as MeetingMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMeetingMode(m)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                meetingMode === m
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'border-border text-muted-foreground hover:border-border hover:bg-muted/20'
              }`}
            >
              {m === 'in-person'
                ? <MapPin className="w-3.5 h-3.5" />
                : <Video className="w-3.5 h-3.5" />}
              {m === 'in-person' ? 'In-Person' : 'Online'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Additional Notes <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea value={meetingNotes} onChange={e => setMeetingNotes(e.target.value)}
          placeholder="Any specific topics or concerns to discuss…"
          className="bg-muted/30 border-border text-sm resize-none min-h-16" />
      </div>
    </>
  )

  const documentForm = (
    <>
      {/* First two dropdowns side by side */}
      <div className="grid grid-cols-2 gap-3">
        {childSelectField ?? (
          // When single child, pair docType + deliveryMethod side by side
          <div className="space-y-1.5">
            <Label className="text-xs">Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
                <SelectValue placeholder="Select document" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {children.length > 1 ? (
          <div className="space-y-1.5">
            <Label className="text-xs">Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
                <SelectValue placeholder="Select document" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label className="text-xs">Delivery Method</Label>
            <Select value={deliveryMethod} onValueChange={setDelivery}>
              <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
                <SelectValue placeholder="Select delivery" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DELIVERY_METHOD_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {children.length > 1 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Delivery Method</Label>
          <Select value={deliveryMethod} onValueChange={setDelivery}>
            <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DELIVERY_METHOD_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val} className="text-sm">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-1.5">
        <Label className="text-xs">Notes <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea value={docNotes} onChange={e => setDocNotes(e.target.value)}
          placeholder="e.g. purpose of the document, urgency…"
          className="bg-muted/30 border-border text-sm resize-none min-h-16" />
      </div>
    </>
  )

  const otherForm = (
    <>
      {children.length > 1 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Child</Label>
          <Select value={selectedChildId} onValueChange={v => v && setSelectedChildId(v)}>
            <SelectTrigger className="bg-muted/30 border-border h-9 text-sm">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map(child => child && (
                <SelectItem key={child.id} value={child.id} className="text-sm">{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-1.5">
        <Label className="text-xs">Subject</Label>
        <Input value={otherSubject} onChange={e => setOtherSubject(e.target.value)}
          placeholder="Brief subject of your request"
          className="bg-muted/30 border-border h-9 text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Textarea value={otherDesc} onChange={e => setOtherDesc(e.target.value)}
          placeholder="Provide full details of your request…"
          className="bg-muted/30 border-border text-sm resize-none min-h-28" />
      </div>
    </>
  )

  // ── Success summary ────────────────────────────────────────────────────────

  const successMessages: Record<RequestType, { title: string; desc: string }> = {
    leave:    { title: 'Leave Request Submitted',    desc: 'Your request has been sent. You will be notified once reviewed by the school.' },
    meeting:  { title: 'Meeting Request Submitted',  desc: `Your meeting request with ${selectedTeacher?.name ?? 'the teacher'} has been sent. You will receive a confirmation soon.` },
    document: { title: 'Document Request Submitted', desc: 'Your document request is being processed. Check the requests list for status updates.' },
    other:    { title: 'Request Submitted',          desc: 'Your request has been received. The admin team will review and respond within 3–5 business days.' },
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Parent Portal</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Requests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Submit and track requests for your child</p>
      </div>

      {/* Request type selector */}
      <div className="flex gap-2 flex-wrap">
        {REQUEST_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setRequestType(id); setSubmitted(false) }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
              requestType === id
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Form (3/5) ── */}
        <div className="lg:col-span-3">
          <Card className="rounded-xl border-border bg-card h-full py-2 gap-2">
            <CardHeader className="pb-2 pt-2 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {(() => {
                  const { icon: Icon, label, color } = TYPE_CFG[requestType]
                  return (
                    <>
                      <Icon className={`w-4 h-4 ${color}`} />
                      New {label}
                    </>
                  )
                })()}
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {REQUEST_TABS.find(t => t.id === requestType)?.desc}
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-2 space-y-4">
              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{successMessages[submittedType].title}</p>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {successMessages[submittedType].desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    Resetting form in a moment…
                  </div>
                </div>
              ) : (
                <>
                  {/* Child summary chip (when only 1 child) */}
                  {children.length === 1 && selectedChild && (
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/20 border border-border">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: selectedChild.avatarColor }}
                      >
                        {selectedChild.initials}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{selectedChild.name}</p>
                        <p className="text-[11px] text-muted-foreground">{selectedChild.gradeLevel} — Section {selectedChild.section}</p>
                      </div>
                    </div>
                  )}

                  <SectionDivider label="Request Details" />

                  {/* Dynamic form */}
                  {requestType === 'leave'    && leaveForm}
                  {requestType === 'meeting'  && meetingForm}
                  {requestType === 'document' && documentForm}
                  {requestType === 'other'    && otherForm}

                  <Button onClick={handleSubmit} disabled={!isFormValid} className="w-full" size="sm">
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Submit {TYPE_CFG[requestType].label}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── AI Smart Panel (2/5) ── */}
        <div className="lg:col-span-2 space-y-0">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Smart Panel</span>
          </div>

          {requestType === 'leave' && (
            <LeaveAIPanel
              gradeLevel={selectedChild?.gradeLevel ?? 'Grade 10'}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          {requestType === 'meeting' && (
            <MeetingAIPanel
              teacherId={teacherId}
              gradeLevel={selectedChild?.gradeLevel ?? 'Grade 10'}
            />
          )}
          {requestType === 'document' && (
            <DocumentAIPanel documentType={docType} />
          )}
          {requestType === 'other' && (
            <OtherAIPanel />
          )}
        </div>
      </div>

      {/* Recent requests */}
      <RecentRequests requests={pastRequests} />
    </div>
  )
}
