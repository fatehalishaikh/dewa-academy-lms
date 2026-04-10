'use client'
import { useThemeStore } from '@/stores/theme-store'
import { useRouter } from 'next/navigation'
import {
  Home, ClipboardList, BarChart3, Bot, Calendar,
  CalendarCheck, Target, BookOpen, FileCheck2,
  LogOut, Sun, Moon, ChevronRight,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore, useCurrentStudent } from '@/stores/role-store'

const studentLinks = [
  { label: 'My Dashboard',   icon: Home,          href: '/student/dashboard'   },
  { label: 'My Assignments', icon: ClipboardList,  href: '/student/assignments' },
  { label: 'My Exams',       icon: FileCheck2,     href: '/student/exams'       },
  { label: 'My Grades',      icon: BarChart3,      href: '/student/grades'      },
  { label: 'AI Tutor',       icon: Bot,            href: '/student/ai-tutor'    },
  { label: 'Attendance',     icon: CalendarCheck,  href: '/student/attendance'  },
  { label: 'My Plan',        icon: Target,         href: '/student/my-plan'     },
  { label: 'My Courses',     icon: BookOpen,       href: '/student/my-courses'  },
  { label: 'Schedule',       icon: Calendar,       href: '/student/schedule'    },
]

function StudentSidebar() {
  const { isDark, toggleTheme } = useThemeStore()
  const router = useRouter()
  const { clearRole } = useRoleStore()
  const student = useCurrentStudent()

  function switchRole() {
    clearRole()
    router.push('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
      isActive
        ? 'bg-primary/10 text-primary border-primary/20'
        : 'border-transparent text-sidebar-foreground hover:bg-sidebar-accent'
    }`

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      <div className="px-6 py-5 flex items-center gap-2.5">
        <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8 shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-sidebar-foreground leading-tight">DEWA Academy</p>
          <p className="text-[10px] text-muted-foreground leading-tight">Student Portal</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Navigation</p>
        {studentLinks.map(({ label, icon: Icon, href }) => (
          <NavLink key={label} href={href} className={navLinkClass} end>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="px-4 py-4 space-y-2">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ background: student?.avatarColor ?? '#00B8A9' }}
            >
              {student?.initials ?? 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-sidebar-foreground truncate">{student?.name ?? 'Student'}</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {student ? `${student.gradeLevel} — ${student.section}` : 'Student'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shrink-0"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
        <button
          onClick={switchRole}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Switch Role
          <ChevronRight className="w-3 h-3 ml-auto" />
        </button>
      </div>
    </aside>
  )
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
