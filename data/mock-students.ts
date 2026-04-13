export type Student = {
  id: string
  name: string
  nameAr: string
  initials: string
  emiratesId: string
  gradeLevel: 'Grade 9' | 'Grade 10' | 'Grade 11'
  section: 'A' | 'B'
  parentId: string
  avatarColor: string
  status: 'active' | 'at-risk' | 'inactive'
  gpa: number
  attendanceRate: number
}

export const students: Student[] = [
  {
    id: 'stu-001',
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    initials: 'AR',
    emiratesId: '784-1998-1234567-1',
    gradeLevel: 'Grade 10',
    section: 'A',
    parentId: 'par-001',
    avatarColor: '#00B8A9',
    status: 'active',
    gpa: 3.7,
    attendanceRate: 96,
  },
  {
    id: 'stu-002',
    name: 'Fatima Hassan',
    nameAr: 'فاطمة حسن',
    initials: 'FH',
    emiratesId: '784-1999-2345678-2',
    gradeLevel: 'Grade 9',
    section: 'B',
    parentId: 'par-002',
    avatarColor: '#7C3AED',
    status: 'active',
    gpa: 3.9,
    attendanceRate: 98,
  },
  {
    id: 'stu-003',
    name: 'Omar Khalil',
    nameAr: 'عمر خليل',
    initials: 'OK',
    emiratesId: '784-1997-3456789-3',
    gradeLevel: 'Grade 11',
    section: 'A',
    parentId: 'par-003',
    avatarColor: '#D97706',
    status: 'at-risk',
    gpa: 2.4,
    attendanceRate: 78,
  },
  {
    id: 'stu-004',
    name: 'Sara Al-Zaabi',
    nameAr: 'سارة الزعابي',
    initials: 'SZ',
    emiratesId: '784-1998-4567890-4',
    gradeLevel: 'Grade 10',
    section: 'A',
    parentId: 'par-004',
    avatarColor: '#EC4899',
    status: 'active',
    gpa: 3.5,
    attendanceRate: 94,
  },
  {
    id: 'stu-005',
    name: 'Yousef Mahmoud',
    nameAr: 'يوسف محمود',
    initials: 'YM',
    emiratesId: '784-2000-5678901-5',
    gradeLevel: 'Grade 9',
    section: 'A',
    parentId: 'par-005',
    avatarColor: '#0EA5E9',
    status: 'active',
    gpa: 3.2,
    attendanceRate: 91,
  },
  {
    id: 'stu-006',
    name: 'Mariam Al-Sayed',
    nameAr: 'مريم السيد',
    initials: 'MS',
    emiratesId: '784-1999-6789012-6',
    gradeLevel: 'Grade 10',
    section: 'B',
    parentId: 'par-006',
    avatarColor: '#10B981',
    status: 'active',
    gpa: 3.8,
    attendanceRate: 97,
  },
  {
    id: 'stu-007',
    name: 'Khalid Al-Mansoori',
    nameAr: 'خالد المنصوري',
    initials: 'KM',
    emiratesId: '784-1997-7890123-7',
    gradeLevel: 'Grade 11',
    section: 'B',
    parentId: 'par-007',
    avatarColor: '#F59E0B',
    status: 'at-risk',
    gpa: 2.1,
    attendanceRate: 72,
  },
  {
    id: 'stu-008',
    name: 'Layla Ibrahim',
    nameAr: 'ليلى إبراهيم',
    initials: 'LI',
    emiratesId: '784-2000-8901234-8',
    gradeLevel: 'Grade 9',
    section: 'A',
    parentId: 'par-008',
    avatarColor: '#8B5CF6',
    status: 'active',
    gpa: 3.6,
    attendanceRate: 95,
  },
  {
    id: 'stu-009',
    name: 'Hamdan Al-Falasi',
    nameAr: 'حمدان الفلاسي',
    initials: 'HF',
    emiratesId: '784-1997-9012345-9',
    gradeLevel: 'Grade 11',
    section: 'A',
    parentId: 'par-003',
    avatarColor: '#EF4444',
    status: 'active',
    gpa: 3.1,
    attendanceRate: 88,
  },
  {
    id: 'stu-010',
    name: 'Nour Al-Hashimi',
    nameAr: 'نور الهاشمي',
    initials: 'NH',
    emiratesId: '784-1999-0123456-0',
    gradeLevel: 'Grade 10',
    section: 'B',
    parentId: 'par-006',
    avatarColor: '#06B6D4',
    status: 'active',
    gpa: 3.4,
    attendanceRate: 93,
  },
  {
    id: 'stu-011',
    name: 'Abdullah Al-Nuaimi',
    nameAr: 'عبدالله النعيمي',
    initials: 'AN',
    emiratesId: '784-1999-1122334-1',
    gradeLevel: 'Grade 9',
    section: 'B',
    parentId: 'par-005',
    avatarColor: '#84CC16',
    status: 'active',
    gpa: 2.9,
    attendanceRate: 85,
  },
  {
    id: 'stu-012',
    name: 'Reem Al-Marzouqi',
    nameAr: 'ريم المرزوقي',
    initials: 'RM',
    emiratesId: '784-1998-2233445-2',
    gradeLevel: 'Grade 10',
    section: 'A',
    parentId: 'par-004',
    avatarColor: '#F97316',
    status: 'active',
    gpa: 3.3,
    attendanceRate: 90,
  },
]

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id)
}

export function getStudentsByGrade(grade: string, section?: string): Student[] {
  return students.filter(s =>
    s.gradeLevel === grade && (section ? s.section === section : true)
  )
}
