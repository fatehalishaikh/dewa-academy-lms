import { create } from 'zustand'
import { getStudentById } from '@/data/mock-students'
import { getTeacherById } from '@/data/mock-teachers'
import { getParentById } from '@/data/mock-parents'

export type UserRole = 'teacher' | 'admin' | 'student' | 'parent'

const VALID_ROLES: UserRole[] = ['teacher', 'admin', 'student', 'parent']
const COOKIE_OPTS = '; path=/; max-age=2592000; SameSite=Lax' // 30 days

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}${COOKIE_OPTS}`
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; max-age=0`
}

function readCookieState(): { role: UserRole | null; personId: string | null } {
  const role = getCookie('lms_role') as UserRole | null
  const personId = getCookie('lms_person_id')
  if (role && VALID_ROLES.includes(role) && personId) return { role, personId }
  return { role: null, personId: null }
}

type RoleStore = {
  role: UserRole | null
  personId: string | null
  setRole: (role: UserRole, personId: string) => void
  clearRole: () => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  ...readCookieState(),
  setRole: (role, personId) => {
    setCookie('lms_role', role)
    setCookie('lms_person_id', personId)
    set({ role, personId })
  },
  clearRole: () => {
    deleteCookie('lms_role')
    deleteCookie('lms_person_id')
    set({ role: null, personId: null })
  },
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
