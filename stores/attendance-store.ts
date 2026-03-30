import { create } from 'zustand'

export type AttendanceStatus = 'present' | 'absent' | 'late'

export type AttendanceRecord = {
  date: string      // YYYY-MM-DD
  classId: string
  studentId: string
  status: AttendanceStatus
}

type AttendanceStore = {
  records: AttendanceRecord[]
  setAttendance: (date: string, classId: string, studentId: string, status: AttendanceStatus) => void
  saveAttendance: (date: string, classId: string, records: Record<string, AttendanceStatus>) => void
  getAttendanceMap: (date: string, classId: string) => Record<string, AttendanceStatus>
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: [],

  setAttendance(date, classId, studentId, status) {
    set(state => {
      const filtered = state.records.filter(
        r => !(r.date === date && r.classId === classId && r.studentId === studentId)
      )
      return { records: [...filtered, { date, classId, studentId, status }] }
    })
  },

  saveAttendance(date, classId, records) {
    set(state => {
      const filtered = state.records.filter(
        r => !(r.date === date && r.classId === classId)
      )
      const newRecords = Object.entries(records).map(([studentId, status]) => ({
        date, classId, studentId, status,
      }))
      return { records: [...filtered, ...newRecords] }
    })
  },

  getAttendanceMap(date, classId) {
    const map: Record<string, AttendanceStatus> = {}
    get().records
      .filter(r => r.date === date && r.classId === classId)
      .forEach(r => { map[r.studentId] = r.status })
    return map
  },
}))
