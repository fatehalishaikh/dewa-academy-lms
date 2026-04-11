'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'className'> & {
  href: string
  className?: string | ((props: { isActive: boolean }) => string)
  /** When true, only marks active on exact path match (no prefix matching) */
  end?: boolean
}

export function NavLink({ href, className, end = false, children, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = end
    ? pathname === href
    : pathname === href || (pathname?.startsWith(href + '/') ?? false)

  const resolvedClassName =
    typeof className === 'function' ? className({ isActive }) : className

  return (
    <Link href={href} className={resolvedClassName} {...props}>
      {children}
    </Link>
  )
}
