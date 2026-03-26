import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Network, ShieldCheck, FileText, Library, CheckSquare, Sparkles } from 'lucide-react'

const tabs = [
  { label: 'Dashboard',  to: 'dashboard',  icon: BarChart3,    ai: true },
  { label: 'Builder',    to: 'builder',    icon: Network,      ai: true },
  { label: 'Standards',  to: 'standards',  icon: ShieldCheck,  ai: true },
  { label: 'Templates',  to: 'templates',  icon: FileText,     ai: true },
  { label: 'Resources',  to: 'resources',  icon: Library,      ai: false },
  { label: 'Review',     to: 'review',     icon: CheckSquare,  ai: false },
]

export function CurriculumLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Curriculum &amp; Lesson Planner</h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI-Powered Curriculum Intelligence
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-sm font-semibold text-foreground">March 26, 2026</p>
          </div>
        </div>

        {/* Tab nav */}
        <nav className="flex gap-1">
          {tabs.map(({ label, to, icon: Icon, ai }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border ${
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
              {ai && <Sparkles className="w-2.5 h-2.5 text-primary/60 shrink-0" />}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children ?? <Outlet />}
      </div>
    </div>
  )
}
