"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SCHOOLS } from "@/lib/constants"
import { Menu, Search, User } from "lucide-react"

interface HeaderProps {
  onMenuToggle: () => void
}

function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname()

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, i, arr) => {
      const href = "/" + arr.slice(0, i + 1).join("/")
      const school = SCHOOLS.find((s) => s.slug === seg)
      const label = school?.title || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      return { href, label }
    })

  return (
    <header className="h-11 bg-bg border-b border-border flex items-center px-4 gap-4">
      <button
        onClick={onMenuToggle}
        className="text-text-muted hover:text-text-secondary transition-colors"
      >
        <Menu size={16} />
      </button>

      <Link href="/" className="flex items-center gap-2 shrink-0">
        <span className="text-accent font-bold text-sm font-mono">Lupa</span>
        <span className="text-text-muted font-mono text-sm">learn</span>
      </Link>

      <span className="text-text-muted font-mono text-xs">~</span>

      <nav className="flex items-center gap-1 text-xs font-mono overflow-x-auto">
        <Link href="/" className="text-accent hover:underline shrink-0">
          ~
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 shrink-0">
            <span className="text-text-muted">/</span>
            {i === breadcrumbs.length - 1 ? (
              <span className="text-text-secondary truncate max-w-[200px]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-text-muted hover:text-text-secondary hover:underline truncate max-w-[200px]">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
        <span className="text-accent animate-blink ml-0.5">_</span>
      </nav>

      <div className="flex-1" />

      <Link href="/explore" className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary font-mono transition-colors">
        <Search size={14} />
        <span className="hidden sm:inline">Search</span>
        <span className="hidden sm:inline text-text-muted bg-surface px-1.5 py-0.5 text-[10px] border border-border">
          ⌘K
        </span>
      </Link>

      <Link href="/dashboard" className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary font-mono transition-colors">
        <User size={14} />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
    </header>
  )
}

export { Header }

