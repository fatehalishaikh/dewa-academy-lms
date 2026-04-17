'use client'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid, LayoutDashboard, BookOpen, BookMarked, FileCheck, Users,
  ClipboardList, TableProperties, LogOut, ChevronRight, X, Menu,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NavLink } from '@/components/ui/nav-link'
import { useRoleStore, useCurrentTeacher } from '@/stores/role-store'
import { ChatbotWidget } from '@/components/dashboard/chatbot-widget'
import { useSubjectStore } from '@/stores/subject-store'
import { subjectColor } from '@/lib/subject-colors'

const moduleLinks = [
  { label: 'Class Activities', icon: LayoutGrid, href: '/class-activities' },
  { label: 'Curriculum', icon: BookMarked, href: '/curriculum' },
  { label: 'Assessments', icon: FileCheck, href: '/assessments' },
]

const teacherLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/teacher/dashboard' },
  { label: 'Classes', icon: LayoutGrid, href: '/teacher/classes' },
  { label: 'Homework', icon: ClipboardList, href: '/teacher/homework' },
  { label: 'Gradebook', icon: TableProperties, href: '/teacher/gradebook' },
  { label: 'Students', icon: Users, href: '/teacher/students' },
]

function TeacherSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { clearRole } = useRoleStore()
  const teacher = useCurrentTeacher()
  const { activeSubject, setActiveSubject } = useSubjectStore()

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
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">Teacher Portal</p>
          </div>
          <button onClick={onClose} className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors shrink-0">
            <X className="w-4 h-4 text-sidebar-foreground" />
          </button>
        </div>

        {/* Subject switcher */}
        {teacher && teacher.subjects.length > 1 && (
          <div className="px-3 pb-3 border-b border-sidebar-border/60">
            <p className="px-1 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Subject</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveSubject('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  activeSubject === 'all'
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60'
                }`}
              >
                All
              </button>
              {teacher.subjects.map((subject) => {
                const color = subjectColor(subject)
                const isActive = activeSubject === subject
                return (
                  <button
                    key={subject}
                    onClick={() => setActiveSubject(subject)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1.5"
                    style={isActive ? { background: `${color}20`, color } : undefined}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = `${color}10`
                        e.currentTarget.style.color = color
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = ''
                        e.currentTarget.style.color = ''
                      }
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                    {subject}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">My Workspace</p>
          {teacherLinks.map(({ label, icon: Icon, href }) => (
            <NavLink key={label} href={href} className={navLinkClass} onClick={onClose}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

          <div className="pt-4">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Modules</p>
            {moduleLinks.map(({ label, icon: Icon, href }) => (
              <NavLink key={label} href={href} className={navLinkClass} onClick={onClose}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">Learning</p>
            <NavLink href="/ilp" className={navLinkClass} onClick={onClose}>
              <BookOpen className="w-4 h-4 shrink-0" />
              Learning Plans
            </NavLink>
          </div>
        </nav>

        <div className="border-t border-sidebar-border/60 mx-3 mb-0" />

        <div className="px-4 py-4 space-y-1">
          <div className="flex items-center gap-3 px-1 py-1.5">
            <Avatar className="w-8 h-8">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ background: teacher?.avatarColor ?? 'var(--accent-teacher)' }}
              >
                {teacher?.initials ?? 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">{teacher?.name ?? 'Teacher'}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{teacher?.department ?? 'Teacher'}</p>
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

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <TeacherSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
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
