'use client'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid, LayoutDashboard, ClipboardList, BookOpen, FileCheck, BookMarked,
  BarChart3, Users, LogOut, ChevronRight, Building2,
  GraduationCap, Briefcase,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore } from '@/stores/role-store'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Class Activities', icon: LayoutGrid, href: '/class-activities' },
  { label: 'Registration', icon: ClipboardList, href: '/registration' },
  { label: 'Learning Plans', icon: BookOpen, href: '/ilp' },
  { label: 'Assessments', icon: FileCheck, href: '/assessments' },
  { label: 'Curriculum', icon: BookMarked, href: '/curriculum' },
]

const adminItems = [
  { label: 'All Students', icon: Users, href: '/admin/students' },
  { label: 'All Teachers', icon: GraduationCap, href: '/admin/teachers' },
  { label: 'All Staff', icon: Briefcase, href: '/admin/staff' },
  { label: 'Reports', icon: BarChart3, href: '/reports' as string | null },
]

export function Sidebar() {

  const router = useRouter()
  const { clearRole } = useRoleStore()

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
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-tight tracking-tight">DEWA Academy</p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Modules</p>
        {navItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            key={label}
            href={href}
            className={navLinkClass}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Administration</p>
          {adminItems.map(({ label, icon: Icon, href }) =>
            href ? (
              <NavLink key={label} href={href} className={navLinkClass}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ) : (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground/35 cursor-not-allowed select-none"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </div>
            )
          )}
        </div>
      </nav>

      <div className="border-t border-sidebar-border/60 mx-3 mb-0" />

      {/* User + theme toggle + switch role */}
      <div className="px-4 py-4 space-y-1">
        <div className="flex items-center gap-3 px-1 py-1.5">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs font-semibold text-white" style={{ background: '#F59E0B' }}>
              <Building2 className="w-3.5 h-3.5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">Dr. Hassan Al-Mansoori</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">Administrator</p>
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
