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
    <header className="h-11 bg-[#0a0a0a] border-b border-[#1e1e1e] flex items-center px-4 gap-4">
      <button
        onClick={onMenuToggle}
        className="text-[#606060] hover:text-[#c0c0c0] transition-colors"
      >
        <Menu size={16} />
      </button>

      <Link href="/" className="flex items-center gap-2 shrink-0">
        <span className="text-[#00ff41] font-bold text-sm font-mono">Lupa</span>
        <span className="text-[#606060] font-mono text-sm">learn</span>
      </Link>

      <span className="text-[#606060] font-mono text-xs">~</span>

      <nav className="flex items-center gap-1 text-xs font-mono overflow-x-auto">
        <Link href="/" className="text-[#00ff41] hover:underline shrink-0">
          ~
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 shrink-0">
            <span className="text-[#606060]">/</span>
            {i === breadcrumbs.length - 1 ? (
              <span className="text-[#c0c0c0] truncate max-w-[200px]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-[#606060] hover:text-[#c0c0c0] hover:underline truncate max-w-[200px]">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
        <span className="text-[#00ff41] animate-blink ml-0.5">_</span>
      </nav>

      <div className="flex-1" />

      <button className="flex items-center gap-2 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors">
        <Search size={14} />
        <span className="hidden sm:inline">Search</span>
        <span className="hidden sm:inline text-[#606060] bg-[#121212] px-1.5 py-0.5 text-[10px] border border-[#1e1e1e]">
          ⌘K
        </span>
      </button>

      <button className="flex items-center gap-2 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors">
        <User size={14} />
        <span className="hidden sm:inline">Login</span>
      </button>
    </header>
  )
}

export { Header }
