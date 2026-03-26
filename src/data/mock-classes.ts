export type ClassScheduleSlot = {
  day: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu'
  time: string
  room: string
}

export type AcademyClass = {
  id: string
  name: string
  subject: string
  gradeLevel: 'Grade 9' | 'Grade 10' | 'Grade 11'
  section: 'A' | 'B'
  teacherId: string
  studentIds: string[]
  schedule: ClassScheduleSlot[]
  room: string
  averageGrade: number
  attendanceRate: number
}

export const academyClasses: AcademyClass[] = [
  {
    id: 'cls-001',
    name: 'Grade 10A — Mathematics',
    subject: 'Mathematics',
    gradeLevel: 'Grade 10',
    section: 'A',
    teacherId: 'tch-001',
    studentIds: ['stu-001', 'stu-004', 'stu-012'],
    schedule: [
      { day: 'Sun', time: '08:00–09:00', room: 'R-101' },
      { day: 'Tue', time: '08:00–09:00', room: 'R-101' },
      { day: 'Thu', time: '10:00–11:00', room: 'R-101' },
    ],
    room: 'R-101',
    averageGrade: 78,
    attendanceRate: 93,
  },
  {
    id: 'cls-002',
    name: 'Grade 9B — Mathematics',
    subject: 'Mathematics',
    gradeLevel: 'Grade 9',
    section: 'B',
    teacherId: 'tch-001',
    studentIds: ['stu-002', 'stu-011'],
    schedule: [
      { day: 'Sun', time: '10:00–11:00', room: 'R-102' },
      { day: 'Tue', time: '10:00–11:00', room: 'R-102' },
      { day: 'Thu', time: '08:00–09:00', room: 'R-102' },
    ],
    room: 'R-102',
    averageGrade: 82,
    attendanceRate: 96,
  },
  {
    id: 'cls-003',
    name: 'Grade 10A — Physics',
    subject: 'Physics',
    gradeLevel: 'Grade 10',
    section: 'A',
    teacherId: 'tch-002',
    studentIds: ['stu-001', 'stu-004', 'stu-012'],
    schedule: [
      { day: 'Mon', time: '09:00–10:00', room: 'Lab-1' },
      { day: 'Wed', time: '09:00–10:00', room: 'Lab-1' },
    ],
    room: 'Lab-1',
    averageGrade: 74,
    attendanceRate: 91,
  },
  {
    id: 'cls-004',
    name: 'Grade 11A — Physics',
    subject: 'Physics',
    gradeLevel: 'Grade 11',
    section: 'A',
    teacherId: 'tch-002',
    studentIds: ['stu-003', 'stu-009'],
    schedule: [
      { day: 'Mon', time: '11:00–12:00', room: 'Lab-1' },
      { day: 'Wed', time: '11:00–12:00', room: 'Lab-1' },
    ],
    room: 'Lab-1',
    averageGrade: 69,
    attendanceRate: 84,
  },
  {
    id: 'cls-005',
    name: 'Grade 9A — English Language',
    subject: 'English Language',
    gradeLevel: 'Grade 9',
    section: 'A',
    teacherId: 'tch-003',
    studentIds: ['stu-005', 'stu-008'],
    schedule: [
      { day: 'Sun', time: '12:00–13:00', room: 'R-201' },
      { day: 'Tue', time: '12:00–13:00', room: 'R-201' },
      { day: 'Thu', time: '12:00–13:00', room: 'R-201' },
    ],
    room: 'R-201',
    averageGrade: 85,
    attendanceRate: 95,
  },
  {
    id: 'cls-006',
    name: 'Grade 10B — English Language',
    subject: 'English Language',
    gradeLevel: 'Grade 10',
    section: 'B',
    teacherId: 'tch-003',
    studentIds: ['stu-006', 'stu-010'],
    schedule: [
      { day: 'Mon', time: '13:00–14:00', room: 'R-201' },
      { day: 'Wed', time: '13:00–14:00', room: 'R-201' },
    ],
    room: 'R-201',
    averageGrade: 88,
    attendanceRate: 97,
  },
  {
    id: 'cls-007',
    name: 'Grade 11A — Chemistry',
    subject: 'Chemistry',
    gradeLevel: 'Grade 11',
    section: 'A',
    teacherId: 'tch-004',
    studentIds: ['stu-003', 'stu-009'],
    schedule: [
      { day: 'Sun', time: '09:00–10:00', room: 'Lab-2' },
      { day: 'Wed', time: '09:00–10:00', room: 'Lab-2' },
    ],
    room: 'Lab-2',
    averageGrade: 71,
    attendanceRate: 83,
  },
  {
    id: 'cls-008',
    name: 'Grade 9B — Chemistry',
    subject: 'Chemistry',
    gradeLevel: 'Grade 9',
    section: 'B',
    teacherId: 'tch-004',
    studentIds: ['stu-002', 'stu-011'],
    schedule: [
      { day: 'Tue', time: '09:00–10:00', room: 'Lab-2' },
      { day: 'Thu', time: '09:00–10:00', room: 'Lab-2' },
    ],
    room: 'Lab-2',
    averageGrade: 79,
    attendanceRate: 94,
  },
]

export function getClassById(id: string): AcademyClass | undefined {
  return academyClasses.find(c => c.id === id)
}

export function getClassesByTeacher(teacherId: string): AcademyClass[] {
  return academyClasses.filter(c => c.teacherId === teacherId)
}

export function getClassesByStudent(studentId: string): AcademyClass[] {
  return academyClasses.filter(c => c.studentIds.includes(studentId))
}
