'use client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, BarChart3, Bot, Calendar,
  CalendarCheck, Target, BookOpen, FileCheck2,
  LogOut, ChevronRight, MessageSquare,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore, useCurrentStudent } from '@/stores/role-store'

const studentLinks = [
  { label: 'Dashboard',      icon: LayoutDashboard, href: '/student/dashboard'      },
  { label: 'Schedule',       icon: Calendar,       href: '/student/schedule'       },
  { label: 'Assignments',    icon: ClipboardList,  href: '/student/assignments'    },
  { label: 'Exams',          icon: FileCheck2,     href: '/student/exams'          },
  { label: 'Grades',         icon: BarChart3,      href: '/student/grades'         },
  { label: 'AI Tutor',       icon: Bot,            href: '/student/ai-tutor'       },
  { label: 'Plan',           icon: Target,         href: '/student/my-plan'        },
  { label: 'Courses',        icon: BookOpen,       href: '/student/my-courses'     },
  { label: 'Communication',  icon: MessageSquare,  href: '/student/communication'  },
  { label: 'Attendance',     icon: CalendarCheck,  href: '/student/attendance'     },
]

function StudentSidebar() {
  const router = useRouter()
  const { clearRole } = useRoleStore()
  const student = useCurrentStudent()

  function switchRole() {
    clearRole()
    router.push('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-semibold'
        : 'font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60'
    }`

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border/60">
      <div className="px-6 py-6 flex items-center gap-3">
        <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-tight tracking-tight">DEWA Academy</p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Navigation</p>
        {studentLinks.map(({ label, icon: Icon, href }) => (
          <NavLink key={label} href={href} className={navLinkClass} end>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border/60 mx-3 mb-0" />

      <div className="px-4 py-4 space-y-1">
        <div className="flex items-center gap-3 px-1 py-1.5">
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ background: student?.avatarColor ?? '#00B8A9' }}
            >
              {student?.initials ?? 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">{student?.name ?? 'Student'}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {student ? `${student.gradeLevel} — ${student.section}` : 'Student'}
            </p>
          </div>
          <ThemeToggle className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shrink-0" />
        </div>
        <button
          onClick={switchRole}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Switch Role
          <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
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
