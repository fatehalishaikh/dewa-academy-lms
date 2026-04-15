'use client'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './sidebar'
import { ChatbotWidget } from '@/components/dashboard/chatbot-widget'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-sidebar border-b border-sidebar-border/60 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
          >
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
