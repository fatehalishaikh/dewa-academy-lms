export type SubjectGrade = {
  classId: string
  subject: string
  teacherId: string
  teacher: string
  average: number
  trend: 'up' | 'down' | 'flat'
  assignments: { title: string; grade: number; points: string; date: string }[]
}

export const gradesByClass: SubjectGrade[] = [
  {
    classId: 'cls-001',
    subject: 'Mathematics',
    teacherId: 'tch-001',
    teacher: 'Dr. Sarah Ahmed',
    average: 84,
    trend: 'up',
    assignments: [
      { title: 'Chapter 4 Quiz', grade: 92, points: '23/25', date: 'Mar 20' },
      { title: 'Problem Set 3', grade: 80, points: '40/50', date: 'Mar 10' },
      { title: 'Mid-Unit Test', grade: 88, points: '44/50', date: 'Feb 28' },
    ],
  },
  {
    classId: 'cls-003',
    subject: 'Physics',
    teacherId: 'tch-002',
    teacher: 'Mr. James Wilson',
    average: 76,
    trend: 'down',
    assignments: [
      { title: 'Midterm Exam', grade: 78, points: '78/100', date: 'Mar 18' },
      { title: 'Lab Report 2', grade: 75, points: '75/100', date: 'Mar 5' },
      { title: 'Waves Problem Set', grade: 71, points: '71/100', date: 'Feb 20' },
    ],
  },
  {
    classId: 'cls-005',
    subject: 'English Language',
    teacherId: 'tch-003',
    teacher: 'Ms. Layla Al-Farsi',
    average: 91,
    trend: 'up',
    assignments: [
      { title: 'Essay — Persuasive Writing', grade: 94, points: '47/50', date: 'Mar 22' },
      { title: 'Reading Comprehension Test', grade: 89, points: '89/100', date: 'Mar 12' },
      { title: 'Vocabulary Quiz', grade: 92, points: '23/25', date: 'Mar 1' },
    ],
  },
  {
    classId: 'cls-007',
    subject: 'Chemistry',
    teacherId: 'tch-004',
    teacher: 'Mr. Hassan Mahmoud',
    average: 68,
    trend: 'down',
    assignments: [
      { title: 'Periodic Table Quiz', grade: 65, points: '65/100', date: 'Mar 21' },
      { title: 'Lab Report — Titration', grade: 70, points: '35/50', date: 'Mar 8' },
      { title: 'Balancing Equations Test', grade: 62, points: '62/100', date: 'Feb 25' },
    ],
  },
  {
    classId: 'cls-009',
    subject: 'Arabic',
    teacherId: 'tch-005',
    teacher: 'Ms. Fatima Al-Zaabi',
    average: 87,
    trend: 'flat',
    assignments: [
      { title: 'Dictation Test', grade: 88, points: '44/50', date: 'Mar 19' },
      { title: 'Grammar Exercise', grade: 85, points: '85/100', date: 'Mar 6' },
      { title: 'Reading Passage', grade: 90, points: '45/50', date: 'Feb 22' },
    ],
  },
]

export function gradeColor(g: number): string {
  if (g >= 90) return 'text-emerald-400'
  if (g >= 75) return 'text-amber-400'
  return 'text-red-400'
}

export function gradeBorderColor(g: number): string {
  if (g >= 90) return 'border-emerald-500/40'
  if (g >= 75) return 'border-amber-500/40'
  return 'border-red-500/40'
}

export function letterGrade(g: number): string {
  if (g >= 90) return 'A'
  if (g >= 80) return 'B'
  if (g >= 70) return 'C'
  if (g >= 60) return 'D'
  return 'F'
}
