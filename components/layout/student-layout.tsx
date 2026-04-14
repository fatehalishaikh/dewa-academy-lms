'use client'
import { useState } from 'react'
import { useThemeStore } from '@/stores/theme-store'
import { useRouter } from 'next/navigation'
import {
  Home, ClipboardList, BarChart3, Bot, Calendar,
  CalendarCheck, Target, BookOpen, FileCheck2,
  LogOut, Sun, Moon, ChevronRight, MessageSquare,
  Menu, X, GraduationCap,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore, useCurrentStudent } from '@/stores/role-store'
import { cn } from '@/lib/utils'

const studentLinks = [
  { label: 'Dashboard',      icon: Home,           href: '/student/dashboard'      },
  { label: 'Schedule',       icon: Calendar,       href: '/student/schedule'       },
  { label: 'Assignments',    icon: ClipboardList,  href: '/student/assignments'    },
  { label: 'Exams',          icon: FileCheck2,     href: '/student/exams'          },
  { label: 'Grades',         icon: BarChart3,      href: '/student/grades'         },
  { label: 'AI Tutor',       icon: Bot,            href: '/student/ai-tutor'       },
  { label: 'My Plan',        icon: Target,         href: '/student/my-plan'        },
  { label: 'Courses',        icon: BookOpen,       href: '/student/my-courses'     },
  { label: 'Communication',  icon: MessageSquare,  href: '/student/communication'  },
  { label: 'Attendance',     icon: CalendarCheck,  href: '/student/attendance'     },
]

function StudentSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isDark, toggleTheme } = useThemeStore()
  const router = useRouter()
  const { clearRole } = useRoleStore()
  const student = useCurrentStudent()

  function switchRole() {
    clearRole()
    router.push('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200',
      isActive
        ? 'bg-primary/10 text-primary shadow-sm'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 flex flex-col h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">DEWA Academy</p>
              <p className="text-xs text-muted-foreground leading-tight">Student Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Separator className="bg-border" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          {studentLinks.map(({ label, icon: Icon, href }) => (
            <NavLink key={label} href={href} className={navLinkClass} end>
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Separator className="bg-border" />

        {/* Footer */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/50">
            <Avatar className="w-9 h-9 ring-2 ring-background">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ background: student?.avatarColor ?? '#007560' }}
              >
                {student?.initials ?? 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{student?.name ?? 'Student'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {student ? `${student.gradeLevel} - ${student.section}` : 'Student'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={switchRole}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Switch Role
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        </div>
      </aside>
    </>
  )
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const student = useCurrentStudent()
  
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <button
        onClick={onMenuClick}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">DEWA Academy</span>
      </div>
      
      <Avatar className="w-8 h-8">
        <AvatarFallback
          className="text-[10px] font-semibold text-white"
          style={{ background: student?.avatarColor ?? '#007560' }}
        >
          {student?.initials ?? 'S'}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
