"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SCHOOLS, NAV_ITEMS } from "@/lib/constants"
import {
  LayoutDashboard,
  GraduationCap,
  Terminal,
  Bot,
  Swords,
  Folder,
  Award,
  Users,
  BarChart3,
  Briefcase,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  "layout-dashboard": LayoutDashboard,
  "graduation-cap": GraduationCap,
  terminal: Terminal,
  bot: Bot,
  swords: Swords,
  folder: Folder,
  award: Award,
  users: Users,
  "chart-bar": BarChart3,
  briefcase: Briefcase,
  settings: Settings,
  search: Search,
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null)

  return (
    <aside
      className={cn(
        "bg-[#0a0a0a] border-r border-[#1e1e1e] flex flex-col transition-all duration-200 overflow-hidden",
        collapsed ? "w-0 border-r-0" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Quick nav items */}
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-mono transition-colors",
                isActive
                  ? "text-[#00ff41] bg-[#121212] border-l-2 border-[#00ff41]"
                  : "text-[#606060] hover:text-[#c0c0c0] hover:bg-[#121212] border-l-2 border-transparent"
              )}
            >
              {Icon && <Icon size={14} />}
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-[#1e1e1e]" />

        {/* Schools / Volumes */}
        <div className="px-3 py-1 text-[10px] text-[#606060] uppercase tracking-widest font-mono">
          Schools
        </div>

        {SCHOOLS.map((school) => {
          const isExpanded = expandedSchool === school.slug
          const schoolHref = `/learn/${school.slug}`
          const isActive = pathname === schoolHref || pathname.startsWith(schoolHref + "/")

          return (
            <div key={school.slug}>
              <button
                onClick={() => setExpandedSchool(isExpanded ? null : school.slug)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-1.5 text-xs font-mono transition-colors group",
                  isActive
                    ? "text-[#00ff41] bg-[#121212]"
                    : "text-[#606060] hover:text-[#c0c0c0] hover:bg-[#121212]"
                )}
              >
                <span
                  className="w-1.5 h-1.5 rounded-none flex-shrink-0"
                  style={{ backgroundColor: school.color }}
                />
                <span className="flex-1 text-left truncate">
                  <span className="text-[10px] text-[#606060] mr-1">v{String(school.number).padStart(2, "0")}</span>
                  {school.title}
                </span>
                {isExpanded ? (
                  <ChevronDown size={12} className="text-[#606060]" />
                ) : (
                  <ChevronRight size={12} className="text-[#606060]" />
                )}
              </button>

              {/* Categories would go here when expanded — placeholder for now */}
              {isExpanded && (
                <div className="ml-6 pl-2 border-l border-[#1e1e1e] space-y-0.5 mt-0.5 mb-1">
                  <div className="px-3 py-1 text-[10px] text-[#606060] italic">Loading categories...</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-2 text-[10px] text-[#606060]">
          <span className="w-1.5 h-1.5 rounded-none bg-[#00ff41] animate-pulse-glow" />
          <span className="font-mono">lupa@learn:~/</span>
          <span className="text-[#00ff41]">$</span>
          <span className="animate-blink">_</span>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
export type { SidebarProps }
