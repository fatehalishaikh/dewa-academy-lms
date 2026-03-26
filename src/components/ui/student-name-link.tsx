import { Link } from 'react-router-dom'
import { useRoleStore } from '@/stores/role-store'

type Props = {
  studentId: string
  name: string
  className?: string
}

export function StudentNameLink({ studentId, name, className }: Props) {
  const { role } = useRoleStore()

  const to = role === 'admin'
    ? `/admin/students/${studentId}`
    : role === 'teacher'
    ? `/teacher/students/${studentId}`
    : null

  if (!to) {
    return <span className={className}>{name}</span>
  }

  return (
    <Link
      to={to}
      className={`${className ?? ''} hover:underline hover:text-primary transition-colors`}
      onClick={e => e.stopPropagation()}
    >
      {name}
    </Link>
  )
}
