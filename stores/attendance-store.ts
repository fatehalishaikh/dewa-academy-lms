// Shim: re-exports from academy-store for backwards compatibility.
// Migrate callers to import from '@/stores/academy-store' directly.
export type { AttendanceStatus, AttendanceRecord } from '@/stores/academy-store'
export { useAcademyStore as useAttendanceStore } from '@/stores/academy-store'
