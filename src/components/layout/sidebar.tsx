import { NavLink } from 'react-router-dom'
import { LayoutGrid, ClipboardList, BookOpen, FileCheck, GraduationCap, BookMarked, BarChart3, Sparkles } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { label: 'Class Activities', icon: LayoutGrid, to: '/class-activities', active: true },
  { label: 'Registration', icon: ClipboardList, to: null },
  { label: 'Learning Plans', icon: BookOpen, to: null },
  { label: 'Assessments', icon: FileCheck, to: null },
  { label: 'Student Portal', icon: GraduationCap, to: null },
  { label: 'Curriculum', icon: BookMarked, to: null },
  { label: 'Reports', icon: BarChart3, to: null },
]

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#00B8A9' }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
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
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ) : (
            <div
              key={label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground/50 cursor-not-allowed select-none"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </div>
          )
        )}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User */}
      <div className="px-4 py-4 flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs font-semibold text-white" style={{ background: '#00B8A9' }}>SA</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-sidebar-foreground truncate">Dr. Sarah Ahmed</p>
          <p className="text-[11px] text-muted-foreground truncate">Administrator</p>
        </div>
      </div>
    </aside>
  )
}
