'use client'
import { useRoleStore } from '@/stores/role-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { TeacherLayout } from '@/components/layout/teacher-layout'
import { StudentLayout } from '@/components/layout/student-layout'
import { ParentLayout } from '@/components/layout/parent-layout'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useRoleStore()
  const router = useRouter()

  useEffect(() => {
    if (!role) router.replace('/')
  }, [role, router])

  if (!role) return null

  const layouts = {
    admin: AppLayout,
    teacher: TeacherLayout,
    student: StudentLayout,
    parent: ParentLayout,
  } as const

  const Layout = layouts[role]
  return (
    <TooltipProvider delay={400}>
      <Layout>{children}</Layout>
    </TooltipProvider>
  )
}
