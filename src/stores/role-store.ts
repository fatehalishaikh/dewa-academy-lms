import { create } from 'zustand'
import { getStudentById } from '@/data/mock-students'
import { getTeacherById } from '@/data/mock-teachers'
import { getParentById } from '@/data/mock-parents'

export type UserRole = 'teacher' | 'admin' | 'student' | 'parent'

type RoleStore = {
  role: UserRole | null
  personId: string | null
  setRole: (role: UserRole, personId: string) => void
  clearRole: () => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  personId: null,
  setRole: (role, personId) => set({ role, personId }),
  clearRole: () => set({ role: null, personId: null }),
}))

export function useCurrentStudent() {
  const { role, personId } = useRoleStore()
  if (role !== 'student' || !personId) return null
  return getStudentById(personId) ?? null
}

export function useCurrentTeacher() {
  const { role, personId } = useRoleStore()
  if (role !== 'teacher' || !personId) return null
  return getTeacherById(personId) ?? null
}

export function useCurrentParent() {
  const { role, personId } = useRoleStore()
  if (role !== 'parent' || !personId) return null
  return getParentById(personId) ?? null
}
