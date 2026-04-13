'use client'
import { useThemeStore } from '@/stores/theme-store'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, BarChart3, Calendar, MessageSquare, CalendarOff, FileText,
  LogOut, Sun, Moon, ChevronRight,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore, useCurrentParent } from '@/stores/role-store'
import { ChatbotWidget } from '@/components/dashboard/chatbot-widget'

const parentLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/parent/dashboard' },
  { label: "Child's Grades", icon: BarChart3, href: '/parent/grades' },
  { label: 'Attendance', icon: Calendar, href: '/parent/attendance' },
  { label: 'Messages', icon: MessageSquare, href: '/parent/messages' },
  { label: 'Leave Request', icon: CalendarOff, href: '/parent/leave-request' },
  { label: 'Reports', icon: FileText, href: '/parent/reports' },
]

function ParentSidebar() {
  const { isDark, toggleTheme } = useThemeStore()
  const router = useRouter()
  const { clearRole } = useRoleStore()
  const parent = useCurrentParent()

  function switchRole() {
    clearRole()
    router.push('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
      isActive
        ? 'bg-primary/10 text-primary border-primary/20'
        : 'border-transparent text-sidebar-foreground hover:bg-sidebar-accent'
    }`

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      <div className="px-6 py-5 flex items-center gap-2.5">
        <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8 shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-sidebar-foreground leading-tight">DEWA Academy</p>
          <p className="text-[10px] text-muted-foreground leading-tight">Parent Portal</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Navigation</p>
        {parentLinks.map(({ label, icon: Icon, href }) => (
          <NavLink key={label} href={href} className={navLinkClass} end>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="px-4 py-4 space-y-2">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ background: parent?.avatarColor ?? '#8B5CF6' }}
            >
              {parent?.initials ?? 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-sidebar-foreground truncate">{parent?.name ?? 'Parent'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{parent?.relationship ?? 'Guardian'}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shrink-0"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
        <button
          onClick={switchRole}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Switch Role
          <ChevronRight className="w-3 h-3 ml-auto" />
        </button>
      </div>
    </aside>
  )
}

export function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ParentSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <ChatbotWidget />
    </div>
  )
}
