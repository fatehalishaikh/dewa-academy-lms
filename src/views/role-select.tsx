import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Users, BookOpen, Building2, ChevronRight, Sparkles } from 'lucide-react'
import { useRoleStore, type UserRole } from '@/stores/role-store'
import { students } from '@/data/mock-students'
import { teachers } from '@/data/mock-teachers'
import { parents } from '@/data/mock-parents'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type RoleConfig = {
  role: UserRole
  label: string
  description: string
  icon: React.ElementType
  accentColor: string
  borderColor: string
  defaultRoute: string
  personas: { id: string; name: string; initials: string; avatarColor: string; subtitle: string }[]
}

const roleConfigs: RoleConfig[] = [
  {
    role: 'student',
    label: 'Student',
    description: 'View assignments, grades, schedule and AI-powered learning tools',
    icon: GraduationCap,
    accentColor: '#00B8A9',
    borderColor: 'rgba(0,184,169,0.3)',
    defaultRoute: '/student/dashboard',
    personas: students.slice(0, 3).map(s => ({
      id: s.id,
      name: s.name,
      initials: s.initials,
      avatarColor: s.avatarColor,
      subtitle: `${s.gradeLevel} — Section ${s.section}`,
    })),
  },
  {
    role: 'parent',
    label: 'Parent',
    description: "Monitor your child's progress, grades, attendance and messages",
    icon: Users,
    accentColor: '#8B5CF6',
    borderColor: 'rgba(139,92,246,0.3)',
    defaultRoute: '/parent/dashboard',
    personas: parents.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      initials: p.initials,
      avatarColor: p.avatarColor,
      subtitle: `${p.relationship} · ${p.childIds.length} ${p.childIds.length === 1 ? 'child' : 'children'}`,
    })),
  },
  {
    role: 'teacher',
    label: 'Teacher',
    description: 'Manage classes, create homework, grade submissions and track students',
    icon: BookOpen,
    accentColor: '#0EA5E9',
    borderColor: 'rgba(14,165,233,0.3)',
    defaultRoute: '/teacher/classes',
    personas: teachers.map(t => ({
      id: t.id,
      name: t.name,
      initials: t.initials,
      avatarColor: t.avatarColor,
      subtitle: t.department,
    })),
  },
  {
    role: 'admin',
    label: 'Administrator',
    description: 'Full access to all modules — registration, analytics, reports and system config',
    icon: Building2,
    accentColor: '#F59E0B',
    borderColor: 'rgba(245,158,11,0.3)',
    defaultRoute: '/class-activities',
    personas: [
      { id: 'adm-001', name: 'Dr. Hassan Al-Mansoori', initials: 'HM', avatarColor: '#F59E0B', subtitle: 'Principal' },
      { id: 'adm-002', name: 'Ms. Rania Al-Khouri', initials: 'RK', avatarColor: '#EF4444', subtitle: 'VP Academics' },
    ],
  },
]

export function RoleSelectPage() {
  const router = useRouter()
  const { setRole } = useRoleStore()
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null)

  function handleSelect(role: UserRole, personId: string, defaultRoute: string) {
    setRole(role, personId)
    router.push(defaultRoute)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 flex items-center gap-3 border-b border-border">
        <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8" />
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">DEWA Academy</p>
          <p className="text-[11px] text-muted-foreground leading-tight">School Management System</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI-Powered Platform
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Select your role to continue to your personalized dashboard</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {roleConfigs.map((config) => {
            const Icon = config.icon
            const isHovered = hoveredRole === config.role
            return (
              <div
                key={config.role}
                className="relative rounded-2xl border bg-card transition-all duration-200 overflow-hidden"
                style={{
                  borderColor: isHovered ? config.borderColor : 'var(--border)',
                  boxShadow: isHovered ? `0 0 0 1px ${config.borderColor}, 0 8px 32px rgba(0,0,0,0.3)` : undefined,
                }}
                onMouseEnter={() => setHoveredRole(config.role)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                {/* Top accent bar */}
                <div
                  className="h-0.5 w-full transition-opacity duration-200"
                  style={{ background: config.accentColor, opacity: isHovered ? 1 : 0.3 }}
                />

                <div className="p-5">
                  {/* Icon + label */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${config.accentColor}20` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: config.accentColor }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{config.label}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{config.description}</p>

                  {/* Personas */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Select persona</p>
                    {config.personas.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => handleSelect(config.role, persona.id, config.defaultRoute)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-accent transition-colors text-left group"
                      >
                        <Avatar className="w-7 h-7 shrink-0">
                          <AvatarFallback
                            className="text-[10px] font-bold text-white"
                            style={{ background: persona.avatarColor }}
                          >
                            {persona.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-foreground truncate">{persona.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{persona.subtitle}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: config.accentColor }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground">
          This is a UI/UX prototype. All data is simulated.
        </p>
      </div>
    </div>
  )
}
