import { create } from 'zustand'

const COOKIE_OPTS = '; path=/; max-age=2592000; SameSite=Lax'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}${COOKIE_OPTS}`
}

function readTheme(): boolean {
  const val = getCookie('lms_theme')
  // default to dark if no cookie
  return val === 'light' ? false : true
}

type ThemeStore = {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: readTheme(),
  toggleTheme: () => {
    const next = !get().isDark
    setCookie('lms_theme', next ? 'dark' : 'light')
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
    }
    set({ isDark: next })
  },
}))
