'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/stores/theme-store'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <button
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      {mounted && (isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />)}
    </button>
  )
}
