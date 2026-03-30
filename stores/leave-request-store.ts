import { create } from 'zustand'

export type LeaveType = 'medical' | 'family-emergency' | 'travel' | 'religious' | 'other'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export type LeaveRequest = {
  id: string
  parentId: string
  studentId: string
  studentName: string
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  submittedDate: string
  reviewedBy?: string
  reviewNote?: string
}

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  medical:          'Medical',
  'family-emergency': 'Family Emergency',
  travel:           'Travel',
  religious:        'Religious / Public Holiday',
  other:            'Other',
}

export { LEAVE_TYPE_LABELS }

const initialRequests: LeaveRequest[] = [
  {
    id: 'lr-001',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    type: 'medical',
    startDate: '2026-03-05',
    endDate: '2026-03-06',
    reason: 'Scheduled medical appointment at Al Zahra Hospital for routine check-up.',
    status: 'approved',
    submittedDate: '2026-03-03',
    reviewedBy: 'Ms. Al Mansoori',
    reviewNote: 'Approved — please bring medical certificate upon return.',
  },
  {
    id: 'lr-002',
    parentId: 'par-001',
    studentId: 'stu-001',
    studentName: 'Ahmed Al-Rashid',
    type: 'travel',
    startDate: '2026-02-15',
    endDate: '2026-02-18',
    reason: 'Family travel for a wedding in Riyadh.',
    status: 'approved',
    submittedDate: '2026-02-10',
    reviewedBy: 'Ms. Al Mansoori',
  },
  {
    id: 'lr-003',
    parentId: 'par-002',
    studentId: 'stu-002',
    studentName: 'Fatima Hassan',
    type: 'other',
    startDate: '2026-03-20',
    endDate: '2026-03-20',
    reason: 'Participation in external robotics competition.',
    status: 'pending',
    submittedDate: '2026-03-18',
  },
]

let counter = 100

type LeaveRequestStore = {
  requests: LeaveRequest[]
  submitRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>) => string
  getRequestsByParent: (parentId: string) => LeaveRequest[]
  getRequestsByStudent: (studentId: string) => LeaveRequest[]
}

export const useLeaveRequestStore = create<LeaveRequestStore>((set, get) => ({
  requests: initialRequests,

  submitRequest: (req) => {
    const id = `lr-${String(++counter).padStart(3, '0')}`
    const newReq: LeaveRequest = {
      ...req,
      id,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    }
    set(s => ({ requests: [newReq, ...s.requests] }))
    return id
  },

  getRequestsByParent: (parentId) =>
    get().requests.filter(r => r.parentId === parentId),

  getRequestsByStudent: (studentId) =>
    get().requests.filter(r => r.studentId === studentId),
}))
