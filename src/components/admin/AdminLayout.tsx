"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, FileText, ListChecks, Swords, FolderOpen, Send, GitBranch,
  CircleDot, Code2, Globe, Wrench, Share2, AlertTriangle, HeartPulse,
  Search, Settings, ChevronRight, ChevronDown, Menu, BookOpen,
} from "lucide-react"

type NavSection = {
  label: string
  items: Array<{ label: string; href: string; icon: React.ElementType }>
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Content",
    items: [
      { label: "Lessons", href: "/admin/lessons", icon: FileText },
      { label: "Quizzes", href: "/admin/quizzes", icon: ListChecks },
      { label: "Challenges", href: "/admin/challenges", icon: Swords },
      { label: "Publish Queue", href: "/admin/publish", icon: Send },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { label: "Graph", href: "/admin/graph", icon: GitBranch },
      { label: "Concepts", href: "/admin/graph/nodes", icon: CircleDot },
      { label: "Relationships", href: "/admin/graph/edges", icon: Share2 },
      { label: "Orphans", href: "/admin/graph/orphans", icon: AlertTriangle },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Health", href: "/admin/graph/orphans", icon: HeartPulse },
      { label: "ADR", href: "/admin/adr", icon: BookOpen },
    ],
  },
]

function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["Content", "Knowledge", "System"])

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <div className="h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-[#0a0a0a] border-r border-[#1e1e1e] flex flex-col transition-all duration-200 overflow-hidden",
          collapsed ? "w-0 border-r-0" : "w-56"
        )}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-[#1e1e1e]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-[#00ff41] font-bold text-sm font-mono">Lupa</span>
            <span className="text-[#606060] font-mono text-sm">Admin</span>
          </Link>
          <button onClick={() => setCollapsed(true)} className="text-[#606060] hover:text-[#c0c0c0]">
            <Menu size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {NAV_SECTIONS.map((section) => {
            const isExpanded = expandedSections.includes(section.label)
            return (
              <div key={section.label}>
                <button
                  onClick={() => toggleSection(section.label)}
                  className="flex items-center gap-1 w-full px-2 py-1 text-[10px] text-[#606060] font-mono uppercase tracking-widest hover:text-[#c0c0c0] transition-colors"
                >
                  {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                  {section.label}
                </button>
                {isExpanded && (
                  <div className="mt-1 space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-xs font-mono transition-colors rounded-sm",
                            isActive
                              ? "text-[#00ff41] bg-[#121212]"
                              : "text-[#606060] hover:text-[#c0c0c0] hover:bg-[#121212]"
                          )}
                        >
                          <Icon size={12} />
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="p-3 border-t border-[#1e1e1e]">
          <Link href="/" className="flex items-center gap-1 text-[10px] text-[#606060] font-mono hover:text-[#c0c0c0] transition-colors">
            ← Back to LupaLearn
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export { AdminLayout }
