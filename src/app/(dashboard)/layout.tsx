'use client'
import { useRoleStore } from '@/stores/role-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { TeacherLayout } from '@/components/layout/teacher-layout'
import { StudentLayout } from '@/components/layout/student-layout'
import { ParentLayout } from '@/components/layout/parent-layout'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = useRoleStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !role) router.replace('/')
  }, [mounted, role, router])

  if (!mounted || !role) return null

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
