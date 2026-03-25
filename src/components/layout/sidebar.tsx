import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutGrid, ClipboardList, BookOpen, FileCheck, GraduationCap, BookMarked, BarChart3, Sun, Moon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { label: 'Class Activities', icon: LayoutGrid, to: '/class-activities' },
  { label: 'Registration', icon: ClipboardList, to: '/registration' },
  { label: 'Learning Plans', icon: BookOpen, to: '/ilp' },
  { label: 'Assessments', icon: FileCheck, to: '/assessments' },
  { label: 'Student Portal', icon: GraduationCap, to: null },
  { label: 'Curriculum', icon: BookMarked, to: '/curriculum' },
  { label: 'Reports', icon: BarChart3, to: null },
]

export function Sidebar() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggleTheme() {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    setIsDark(next)
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2.5">
        <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8 shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-sidebar-foreground leading-tight">DEWA Academy</p>
          <p className="text-[10px] text-muted-foreground leading-tight">School Management</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Modules</p>
        {navItems.map(({ label, icon: Icon, to }) =>
          to ? (
            <NavLink
              key={label}
              to={to}
              end={to === '/class-activities' || to === '/assessments'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'border-transparent text-sidebar-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ) : (
            <div
              key={label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border border-transparent text-muted-foreground/50 cursor-not-allowed select-none"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </div>
          )
        )}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User + theme toggle */}
      <div className="px-4 py-4 flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs font-semibold text-white" style={{ background: '#00B8A9' }}>SA</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-sidebar-foreground truncate">Dr. Sarah Ahmed</p>
          <p className="text-[11px] text-muted-foreground truncate">Administrator</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shrink-0"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  )
}
