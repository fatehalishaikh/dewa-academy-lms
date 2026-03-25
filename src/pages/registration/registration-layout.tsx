import { NavLink } from 'react-router-dom'
import { Sparkles, BarChart3, FileText, PlusCircle, ScanSearch, Brain, Bell, Link } from 'lucide-react'

const navItems = [
  { label: 'Dashboard',              to: '/registration/dashboard',             icon: BarChart3,   ai: true  },
  { label: 'Applications',           to: '/registration/applications',          icon: FileText,    ai: false },
  { label: 'New Application',        to: '/registration/new-application',       icon: PlusCircle,  ai: false },
  { label: 'Document Verification',  to: '/registration/document-verification', icon: ScanSearch,  ai: true  },
  { label: 'AI Scoring',             to: '/registration/ai-scoring',            icon: Brain,       ai: true  },
  { label: 'Communications',         to: '/registration/communications',        icon: Bell,        ai: false },
  { label: 'Integrations',           to: '/registration/integrations',          icon: Link,        ai: false },
]

interface RegistrationLayoutProps { children: React.ReactNode }

export function RegistrationLayout({ children }: RegistrationLayoutProps) {
  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Registration & Admission</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Admissions Intelligence
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-sm font-semibold text-foreground">March 25, 2026</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-border flex items-center gap-0 overflow-x-auto">
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
