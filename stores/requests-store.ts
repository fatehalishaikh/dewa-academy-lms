import { create } from 'zustand'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RequestType = 'leave' | 'meeting' | 'document' | 'other'
export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type LeaveType = 'medical' | 'family-emergency' | 'travel' | 'religious' | 'other'
export type MeetingMode = 'online' | 'in-person'

interface BaseRequest {
  id: string
  parentId: string
  studentId: string
  studentName: string
  status: RequestStatus
  submittedDate: string
  reviewedBy?: string
  reviewNote?: string
}

export interface LeaveRequestData extends BaseRequest {
  type: 'leave'
  leaveType: LeaveType
  startDate: string
  endDate: string
  reason: string
}

export interface MeetingRequestData extends BaseRequest {
  type: 'meeting'
  teacherId: string
  teacherName: string
  subject: string
  preferredDate: string
  preferredTime: string
  mode: MeetingMode
  notes: string
}

export interface DocumentRequestData extends BaseRequest {
  type: 'document'
  documentType: string
  deliveryMethod: string
  notes: string
}

export interface OtherRequestData extends BaseRequest {
  type: 'other'
  subject: string
  description: string
}

export type RequestItem =
  | LeaveRequestData
  | MeetingRequestData
  | DocumentRequestData
  | OtherRequestData

// ─── Labels ───────────────────────────────────────────────────────────────────

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  medical: 'Medical',
  'family-emergency': 'Family Emergency',
  travel: 'Travel',
  religious: 'Religious / Public Holiday',
  other: 'Other',
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  bonafide: 'Bonafide / Enrollment Certificate',
  transcript: 'Academic Transcript',
  conduct: 'Certificate of Good Conduct',
  tc: 'Transfer Certificate',
  fee: 'Fee Receipt',
  other: 'Other',
}

export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  email: 'Email (PDF)',
  pickup: 'School Counter Pickup',
  post: 'Postal Delivery',
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const seed: RequestItem[] = [
  {
    id: 'req-001',
    type: 'leave',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    leaveType: 'medical',
    startDate: '2026-04-10',
    endDate: '2026-04-11',
    reason: 'Routine dental procedure — recovery advised.',
    status: 'approved',
    submittedDate: '2026-04-08',
    reviewedBy: 'Admin Office',
    reviewNote: 'Approved. Please bring medical note upon return.',
  },
  {
    id: 'req-002',
    type: 'meeting',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    teacherId: 'tch-001',
    teacherName: 'Dr. Sarah Ahmed',
    subject: 'Mathematics',
    preferredDate: '2026-04-18',
    preferredTime: '14:00',
    mode: 'in-person',
    notes: 'Would like to discuss Q3 performance and next-term preparation.',
    status: 'pending',
    submittedDate: '2026-04-13',
  },
  {
    id: 'req-003',
    type: 'document',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    documentType: 'bonafide',
    deliveryMethod: 'email',
    notes: 'Needed for bank account opening.',
    status: 'pending',
    submittedDate: '2026-04-14',
  },
  {
    id: 'req-004',
    type: 'leave',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    leaveType: 'travel',
    startDate: '2026-03-20',
    endDate: '2026-03-24',
    reason: 'Family trip — planned in advance.',
    status: 'approved',
    submittedDate: '2026-03-10',
    reviewedBy: 'Admin Office',
    reviewNote: 'Approved. Work packets will be shared beforehand.',
  },
  {
    id: 'req-005',
    type: 'other',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    subject: 'Bus Route Change',
    description: 'Requesting a change in the morning bus pickup point to Al Quoz 2.',
    status: 'rejected',
    submittedDate: '2026-03-28',
    reviewedBy: 'Transport Admin',
    reviewNote: 'Route change not available at this time. Please contact transport office directly.',
  },
]

// ─── Store ────────────────────────────────────────────────────────────────────

interface RequestsState {
  requests: RequestItem[]
  submitLeave: (data: Omit<LeaveRequestData, 'id' | 'status' | 'submittedDate'>) => string
  submitMeeting: (data: Omit<MeetingRequestData, 'id' | 'status' | 'submittedDate'>) => string
  submitDocument: (data: Omit<DocumentRequestData, 'id' | 'status' | 'submittedDate'>) => string
  submitOther: (data: Omit<OtherRequestData, 'id' | 'status' | 'submittedDate'>) => string
  getByParent: (parentId: string) => RequestItem[]
  decideRequest: (id: string, decision: 'approved' | 'rejected', by: string, note?: string) => void
}

let _counter = seed.length + 1
function nextId() {
  return `req-${String(_counter++).padStart(3, '0')}`
}
function today() {
  return new Date().toISOString().slice(0, 10)
}

export const useRequestsStore = create<RequestsState>((set, get) => ({
  requests: seed,

  submitLeave: (data) => {
    const id = nextId()
    set(s => ({
      requests: [
        { ...data, id, type: 'leave', status: 'pending', submittedDate: today() },
        ...s.requests,
      ],
    }))
    return id
  },

  submitMeeting: (data) => {
    const id = nextId()
    set(s => ({
      requests: [
        { ...data, id, type: 'meeting', status: 'pending', submittedDate: today() },
        ...s.requests,
      ],
    }))
    return id
  },

  submitDocument: (data) => {
    const id = nextId()
    set(s => ({
      requests: [
        { ...data, id, type: 'document', status: 'pending', submittedDate: today() },
        ...s.requests,
      ],
    }))
    return id
  },

  submitOther: (data) => {
    const id = nextId()
    set(s => ({
      requests: [
        { ...data, id, type: 'other', status: 'pending', submittedDate: today() },
        ...s.requests,
      ],
    }))
    return id
  },

  getByParent: (parentId) => get().requests.filter(r => r.parentId === parentId),

  decideRequest: (id, decision, by, note) => {
    set(s => ({
      requests: s.requests.map(r =>
        r.id === id
          ? { ...r, status: decision, reviewedBy: by, reviewNote: note }
          : r
      ),
    }))
  },
}))
