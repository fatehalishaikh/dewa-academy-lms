'use client'
import { AssessmentsLayout } from '@/views/assessments/assessments-layout'
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AssessmentsLayout>{children}</AssessmentsLayout>
}
