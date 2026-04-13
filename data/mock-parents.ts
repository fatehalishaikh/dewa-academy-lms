export type Parent = {
  id: string
  name: string
  nameAr: string
  initials: string
  childIds: string[]
  avatarColor: string
  email: string
  phone: string
  relationship: 'Father' | 'Mother' | 'Guardian'
}

export const parents: Parent[] = [
  {
    id: 'par-001',
    name: 'Mohammed Al-Rashid',
    nameAr: 'محمد الراشد',
    initials: 'MR',
    childIds: ['stu-001'],
    avatarColor: '#00B8A9',
    email: 'm.alrashid@email.ae',
    phone: '+971 50 123 4567',
    relationship: 'Father',
  },
  {
    id: 'par-002',
    name: 'Aisha Hassan',
    nameAr: 'عائشة حسن',
    initials: 'AH',
    childIds: ['stu-002'],
    avatarColor: '#7C3AED',
    email: 'aisha.hassan@email.ae',
    phone: '+971 55 234 5678',
    relationship: 'Mother',
  },
  {
    id: 'par-003',
    name: 'Khalid Khalil',
    nameAr: 'خالد خليل',
    initials: 'KK',
    childIds: ['stu-003', 'stu-009'],
    avatarColor: '#D97706',
    email: 'k.khalil@email.ae',
    phone: '+971 52 345 6789',
    relationship: 'Father',
  },
  {
    id: 'par-004',
    name: 'Fatima Al-Zaabi',
    nameAr: 'فاطمة الزعابي',
    initials: 'FZ',
    childIds: ['stu-004', 'stu-012'],
    avatarColor: '#EC4899',
    email: 'f.alzaabi@email.ae',
    phone: '+971 56 456 7890',
    relationship: 'Mother',
  },
  {
    id: 'par-005',
    name: 'Ibrahim Mahmoud',
    nameAr: 'إبراهيم محمود',
    initials: 'IM',
    childIds: ['stu-005', 'stu-011'],
    avatarColor: '#0EA5E9',
    email: 'i.mahmoud@email.ae',
    phone: '+971 50 567 8901',
    relationship: 'Father',
  },
  {
    id: 'par-006',
    name: 'Hassan Al-Sayed',
    nameAr: 'حسن السيد',
    initials: 'HS',
    childIds: ['stu-006', 'stu-010'],
    avatarColor: '#10B981',
    email: 'h.alsayed@email.ae',
    phone: '+971 55 678 9012',
    relationship: 'Father',
  },
  {
    id: 'par-007',
    name: 'Sultan Al-Mansoori',
    nameAr: 'سلطان المنصوري',
    initials: 'SM',
    childIds: ['stu-007'],
    avatarColor: '#F59E0B',
    email: 's.almansoori@email.ae',
    phone: '+971 52 789 0123',
    relationship: 'Father',
  },
  {
    id: 'par-008',
    name: 'Omar Ibrahim',
    nameAr: 'عمر إبراهيم',
    initials: 'OI',
    childIds: ['stu-008'],
    avatarColor: '#8B5CF6',
    email: 'o.ibrahim@email.ae',
    phone: '+971 56 890 1234',
    relationship: 'Father',
  },
]

export function getParentById(id: string): Parent | undefined {
  return parents.find(p => p.id === id)
}

export function getParentByChildId(childId: string): Parent | undefined {
  return parents.find(p => p.childIds.includes(childId))
}
