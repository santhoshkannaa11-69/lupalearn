"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, GraduationCap, Swords, Terminal, Bot, User, ChevronRight, Zap } from "lucide-react"

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Learn", href: "/learn", icon: GraduationCap },
  { label: "Practice", href: "/challenges", icon: Swords },
  { label: "Build", href: "/playground", icon: Terminal },
  { label: "Mentor", href: "/ai-tutor", icon: Bot },
  { label: "Profile", href: "/profile", icon: User },
] as const

function NavigationRail() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <nav
      className={cn(
        "h-full bg-surface border-r border-border flex flex-col transition-all duration-200 relative",
        expanded ? "w-48" : "w-16"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setHoveredIdx(null) }}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 border-b border-border transition-all duration-200",
        expanded ? "px-4 justify-between" : "justify-center"
      )}>
        <span className="text-accent font-bold text-lg">🐺</span>
        {expanded && <span className="text-sm font-semibold text-text-primary">LupaLearn</span>}
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-1 p-2">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          const isHovered = hoveredIdx === idx

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-150 group relative",
                expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-muted hover:text-text-secondary hover:bg-surface/80"
              )}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={cn(
                "relative",
                isActive && "after:absolute after:inset-[-4px] after:rounded-lg after:border after:border-accent/20"
              )}>
                <Icon size={20} />
                {isActive && (
                  <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-accent" />
                )}
              </div>
              {expanded && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {/* Tooltip when collapsed */}
              {!expanded && isHovered && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-elevated border border-border rounded-xl text-sm text-text-primary whitespace-nowrap shadow-lg z-50 animate-fade-in">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* XP / Footer */}
      <div className={cn(
        "border-t border-border py-3 transition-all duration-200",
        expanded ? "px-4" : "px-0 flex justify-center"
      )}>
        {expanded ? (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Zap size={14} className="text-accent" />
            <span>1,250 XP</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-accent-soft flex items-center justify-center">
            <Zap size={16} className="text-accent" />
          </div>
        )}
      </div>
    </nav>
  )
}

export { NavigationRail }
