export type Teacher = {
  id: string
  name: string
  initials: string
  department: string
  subjects: string[]
  classIds: string[]
  avatarColor: string
  email: string
  qualification: string
  yearsExperience: number
}

export const teachers: Teacher[] = [
  {
    id: 'tch-001',
    name: 'Dr. Sarah Ahmed',
    initials: 'SA',
    department: 'Mathematics',
    subjects: ['Mathematics', 'Statistics'],
    classIds: ['cls-001', 'cls-002'],
    avatarColor: '#00B8A9',
    email: 'sarah.ahmed@dewa-academy.ae',
    qualification: 'PhD Mathematics, UAE University',
    yearsExperience: 12,
  },
  {
    id: 'tch-002',
    name: 'Mr. James Wilson',
    initials: 'JW',
    department: 'Sciences',
    subjects: ['Physics', 'Chemistry'],
    classIds: ['cls-003', 'cls-004'],
    avatarColor: '#0EA5E9',
    email: 'james.wilson@dewa-academy.ae',
    qualification: 'MSc Physics, University of Edinburgh',
    yearsExperience: 8,
  },
  {
    id: 'tch-003',
    name: 'Ms. Layla Al-Farsi',
    initials: 'LF',
    department: 'Languages',
    subjects: ['English Language', 'Literature'],
    classIds: ['cls-005', 'cls-006'],
    avatarColor: '#8B5CF6',
    email: 'layla.alfarsi@dewa-academy.ae',
    qualification: 'MA English Literature, AUS',
    yearsExperience: 9,
  },
  {
    id: 'tch-004',
    name: 'Mr. Hassan Mahmoud',
    initials: 'HM',
    department: 'Sciences',
    subjects: ['Chemistry', 'Biology'],
    classIds: ['cls-007', 'cls-008', 'cls-010', 'cls-018', 'cls-022', 'cls-030'],
    avatarColor: '#10B981',
    email: 'hassan.mahmoud@dewa-academy.ae',
    qualification: 'MSc Chemistry, Cairo University',
    yearsExperience: 15,
  },
  {
    id: 'tch-005',
    name: 'Ms. Fatima Al-Zaabi',
    initials: 'FZ',
    department: 'Languages',
    subjects: ['Arabic', 'Social Studies'],
    classIds: ['cls-009', 'cls-012', 'cls-014', 'cls-019', 'cls-023', 'cls-026', 'cls-027', 'cls-032'],
    avatarColor: '#F59E0B',
    email: 'fatima.alzaabi@dewa-academy.ae',
    qualification: 'MA Arabic Literature, UAE University',
    yearsExperience: 7,
  },
]

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find(t => t.id === id)
}
