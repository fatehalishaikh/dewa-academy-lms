export type Staff = {
  id: string
  name: string
  initials: string
  role: string
  department: string
  avatarColor: string
  email: string
  phone: string
  qualification: string
  yearsExperience: number
  status: 'active' | 'on-leave'
}

export const staff: Staff[] = [
  {
    id: 'stf-001',
    name: 'Ms. Reem Al-Maktoum',
    initials: 'RM',
    role: 'Registrar',
    department: 'Administration',
    avatarColor: '#00B8A9',
    email: 'reem.almaktoum@dewa-academy.ae',
    phone: '+971 50 111 2233',
    qualification: 'BSc Business Administration, Zayed University',
    yearsExperience: 10,
    status: 'active',
  },
  {
    id: 'stf-002',
    name: 'Mr. Khalid Nasser',
    initials: 'KN',
    role: 'IT Administrator',
    department: 'Information Technology',
    avatarColor: '#0EA5E9',
    email: 'khalid.nasser@dewa-academy.ae',
    phone: '+971 55 222 3344',
    qualification: 'BSc Computer Science, UAEU',
    yearsExperience: 6,
    status: 'active',
  },
  {
    id: 'stf-003',
    name: 'Ms. Hind Obaid',
    initials: 'HO',
    role: 'School Counselor',
    department: 'Student Services',
    avatarColor: '#8B5CF6',
    email: 'hind.obaid@dewa-academy.ae',
    phone: '+971 52 333 4455',
    qualification: 'MSc Counseling Psychology, AUS',
    yearsExperience: 9,
    status: 'active',
  },
  {
    id: 'stf-004',
    name: 'Ms. Sara Bin Rashid',
    initials: 'SR',
    role: 'School Nurse',
    department: 'Medical',
    avatarColor: '#10B981',
    email: 'sara.binrashid@dewa-academy.ae',
    phone: '+971 54 444 5566',
    qualification: 'BSc Nursing, HAAD Certified',
    yearsExperience: 5,
    status: 'active',
  },
  {
    id: 'stf-005',
    name: 'Mr. Omar Al-Shamsi',
    initials: 'OS',
    role: 'Librarian',
    department: 'Library & Resources',
    avatarColor: '#EC4899',
    email: 'omar.alshamsi@dewa-academy.ae',
    phone: '+971 56 555 6677',
    qualification: 'MA Library & Information Science, UAEU',
    yearsExperience: 8,
    status: 'on-leave',
  },
  {
    id: 'stf-006',
    name: 'Mr. Tariq Hassan',
    initials: 'TH',
    role: 'Facilities Manager',
    department: 'Operations',
    avatarColor: '#F59E0B',
    email: 'tariq.hassan@dewa-academy.ae',
    phone: '+971 50 666 7788',
    qualification: 'BSc Facilities Management, HCT',
    yearsExperience: 12,
    status: 'active',
  },
]

export function getStaffById(id: string): Staff | undefined {
  return staff.find(s => s.id === id)
}
