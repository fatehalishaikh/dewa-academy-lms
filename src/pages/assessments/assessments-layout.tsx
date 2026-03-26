import { NavLink } from 'react-router-dom'
import { Sparkles, BarChart3, Database, PlusCircle, CalendarDays, CheckSquare, TrendingUp } from 'lucide-react'

const navItems = [
  { label: 'Dashboard',     to: '/assessments/dashboard',      icon: BarChart3,    ai: true  },
  { label: 'Question Bank', to: '/assessments/question-bank',  icon: Database,     ai: true  },
  { label: 'Create Exam',   to: '/assessments/create-exam',    icon: PlusCircle,   ai: true  },
  { label: 'Schedule',      to: '/assessments/schedule',       icon: CalendarDays, ai: false },
  { label: 'Grading',       to: '/assessments/grading',        icon: CheckSquare,  ai: true  },
  { label: 'Results',       to: '/assessments/results',        icon: TrendingUp,   ai: true  },
]

interface Props { children: React.ReactNode }

export function AssessmentsLayout({ children }: Props) {
  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Assessments & Exams</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Assessment Intelligence
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-sm font-semibold text-foreground">March 26, 2026</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-border flex items-center gap-0 overflow-x-auto overflow-y-hidden">
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

      {children}
    </div>
  )
}
