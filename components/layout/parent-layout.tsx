'use client'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, BarChart3, Calendar, MessageSquare, ClipboardList, FileText,
  LogOut, ChevronRight, X, Menu,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore, useCurrentParent } from '@/stores/role-store'
import { ChatbotWidget } from '@/components/dashboard/chatbot-widget'

const parentLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/parent/dashboard' },
  { label: "Child's Grades", icon: BarChart3, href: '/parent/grades' },
  { label: 'Attendance', icon: Calendar, href: '/parent/attendance' },
  { label: 'Communication', icon: MessageSquare, href: '/parent/communication' },
  { label: 'Requests', icon: ClipboardList, href: '/parent/requests' },
  { label: 'Reports', icon: FileText, href: '/parent/reports' },
]

function ParentSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { clearRole } = useRoleStore()
  const parent = useCurrentParent()

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
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside className={`
        w-64 shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border/60
        fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-6 py-6 flex items-center gap-3">
          <img src="/dewa-logo-only.svg" alt="DEWA" className="w-8 h-8 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground leading-tight tracking-tight">DEWA Academy</p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">Parent Portal</p>
          </div>
          <button onClick={onClose} className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors shrink-0">
            <X className="w-4 h-4 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Navigation</p>
          {parentLinks.map(({ label, icon: Icon, href }) => (
            <NavLink key={label} href={href} className={navLinkClass} end onClick={onClose}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border/60 mx-3 mb-0" />

        <div className="px-4 py-4 space-y-1">
          <div className="flex items-center gap-3 px-1 py-1.5">
            <Avatar className="w-8 h-8">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ background: parent?.avatarColor ?? 'var(--accent-parent)' }}
              >
                {parent?.initials ?? 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">{parent?.name ?? 'Parent'}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{parent?.relationship ?? 'Guardian'}</p>
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
    </>
  )
}

export function ParentLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ParentSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-sidebar border-b border-sidebar-border/60 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors">
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <img src="/dewa-logo-only.svg" alt="DEWA" className="w-6 h-6" />
          <span className="text-sm font-semibold text-sidebar-foreground">DEWA Academy</span>
        </div>
        {children}
      </main>
      <ChatbotWidget />
    </div>
  )
}
