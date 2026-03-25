import { NavLink } from 'react-router-dom'
import { Sparkles, BarChart3, ClipboardCheck, GitBranch, Filter, ShieldAlert, Bell, Target, FolderOpen } from 'lucide-react'

const navItems = [
  { label: 'Dashboard',        to: '/ilp/dashboard',           icon: BarChart3,      ai: true  },
  { label: 'Learning Profiles', to: '/ilp/profile-assessment', icon: ClipboardCheck, ai: false },
  { label: 'Pathways',         to: '/ilp/pathway-builder',     icon: GitBranch,      ai: false },
  { label: 'Smart Rules',      to: '/ilp/curation-rules',      icon: Filter,         ai: false },
  { label: 'Risk & Alerts',    to: '/ilp/risk-intervention',   icon: ShieldAlert,    ai: false },
  { label: 'Notifications',    to: '/ilp/notifications',       icon: Bell,           ai: false },
  { label: 'Goals',            to: '/ilp/goal-setting',        icon: Target,         ai: false },
  { label: 'Content',          to: '/ilp/content-management',  icon: FolderOpen,     ai: false },
]

interface IlpLayoutProps { children: React.ReactNode }

export function IlpLayout({ children }: IlpLayoutProps) {
  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Individual Learning Plans</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Personalization Engine
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-sm font-semibold text-foreground">March 25, 2026</p>
        </div>
      </div>

      {/* Single flat nav */}
      <div className="border-b border-border flex items-center gap-0">
        {navItems.map(({ label, to, icon: Icon, ai }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`
            }
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {label}
            {ai && <Sparkles className="w-3 h-3 text-primary/60" />}
          </NavLink>
        ))}
      </div>

      {/* Page content */}
      {children}
    </div>
  )
}
