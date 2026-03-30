import Link from 'next/link'
import { useRoleStore } from '@/stores/role-store'

type Props = {
  studentId: string
  name: string
  className?: string
}

export function StudentNameLink({ studentId, name, className }: Props) {
  const { role } = useRoleStore()

  const href = role === 'admin'
    ? `/admin/students/${studentId}`
    : role === 'teacher'
    ? `/teacher/students/${studentId}`
    : null

  if (!href) {
    return <span className={className}>{name}</span>
  }

  return (
    <Link
      href={href}
      className={`${className ?? ''} hover:underline hover:text-primary transition-colors`}
      onClick={e => e.stopPropagation()}
    >
      {name}
    </Link>
  )
}
