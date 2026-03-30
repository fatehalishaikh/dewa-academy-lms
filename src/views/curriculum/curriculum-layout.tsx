'use client'
import { NavLink } from '@/components/ui/nav-link'
import { BarChart3, Network, ShieldCheck, FileText, Library, CheckSquare, Sparkles } from 'lucide-react'

const tabs = [
  { label: 'Dashboard',  href: '/curriculum/dashboard',  icon: BarChart3,    ai: true },
  { label: 'Builder',    href: '/curriculum/builder',    icon: Network,      ai: true },
  { label: 'Standards',  href: '/curriculum/standards',  icon: ShieldCheck,  ai: true },
  { label: 'Templates',  href: '/curriculum/templates',  icon: FileText,     ai: true },
  { label: 'Resources',  href: '/curriculum/resources',  icon: Library,      ai: false },
  { label: 'Review',     href: '/curriculum/review',     icon: CheckSquare,  ai: false },
]

export function CurriculumLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
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
      <div className="border-b border-border flex items-center gap-0 overflow-x-auto overflow-y-hidden">
        {tabs.map(({ label, href, icon: Icon, ai }) => (
          <NavLink
            key={href}
            href={href}
            end
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

      {children}
    </div>
  )
}
