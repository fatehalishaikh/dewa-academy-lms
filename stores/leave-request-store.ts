// Shim: re-exports from academy-store for backwards compatibility.
// Migrate callers to import from '@/stores/academy-store' directly.

export type { LeaveType, LeaveStatus, LeaveRequest } from '@/stores/academy-store'

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  medical:            'Medical',
  'family-emergency': 'Family Emergency',
  travel:             'Travel',
  religious:          'Religious / Public Holiday',
  other:              'Other',
}

export { useAcademyStore as useLeaveRequestStore } from '@/stores/academy-store'
