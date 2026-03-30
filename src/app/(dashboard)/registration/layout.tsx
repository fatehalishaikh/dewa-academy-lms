'use client'
import { RegistrationLayout } from '@/views/registration/registration-layout'
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RegistrationLayout>{children}</RegistrationLayout>
}
