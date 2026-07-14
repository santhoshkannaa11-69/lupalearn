"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { LessonTerminal } from "@/components/terminal/LessonTerminal"
import { CommandBar } from "@/lib/command-system/CommandBar"
import { registerLessonCommands } from "@/lib/command-system/commands/lesson-commands"
import type { CommandContext } from "@/lib/command-system/types"
import { showToast } from "@/components/ui/Toast"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Bookmark, Terminal, Command } from "lucide-react"

type NavigationInfo = {
  schoolSlug: string
  moduleSlug: string
  currentIndex: number
  totalInModule: number
  nextSlug?: string
  prevSlug?: string
}

interface LessonViewerProps {
  lesson: {
    id: string
    slug: string
    title: string
    description: string | null
    contentPath: string
    contentType: string
    order: number
    duration: number | null
    xpReward: number
    difficulty: string
    tags: string
    moduleId: string
  }
  concepts: Array<{ id: string; slug: string; name: string; type: string; description: string | null }>
  mdxContent?: string
  navigation?: NavigationInfo
}

function cleanMdx(content: string): string {
  return content
    .replace(/<Terminal[\s\S]*?\/>/g, "")
    .replace(/<Quiz[\s\S]*?\/>/g, "")
    .replace(/import.*from.*;?\n?/g, "")
}

function HelpModal({ onClose }: { onClose: () => void }) {
  const categories = [
    { name: "Navigation", commands: [":next / :n", ":prev / :p", ":playground / :pg", ":dashboard / :d", ":explore / :e", ":quit / :q"] },
    { name: "Lesson", commands: [":complete / :c", ":bookmark / :b"] },
    { name: "AI", commands: [":tutor / :t"] },
    { name: "System", commands: [":help / :h"] },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      <div className="relative bg-[#121212] border border-[#1e1e1e] w-full max-w-lg max-h-[70vh] overflow-y-auto p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-sm font-bold text-[#ffffff] font-mono mb-4 uppercase tracking-wider">Commands</h2>
        {categories.map((cat) => (
          <div key={cat.name} className="mb-4">
            <p className="text-[10px] text-[#606060] font-mono uppercase tracking-wider mb-2">{cat.name}</p>
            <div className="grid grid-cols-2 gap-1">
              {cat.commands.map((cmd) => (
                <span key={cmd} className="text-xs text-[#c0c0c0] font-mono border border-[#1e1e1e] px-2 py-1">{cmd}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4 pt-3 border-t border-[#1e1e1e]">
          <p className="text-[10px] text-[#606060] font-mono">Scrolling: <span className="text-[#00ff41]">j</span> down · <span className="text-[#00ff41]">k</span> up · <span className="text-[#00ff41]">gg</span> top · <span className="text-[#00ff41]">G</span> bottom · <span className="text-[#00ff41]">?</span> this help</p>
          <p className="text-[10px] text-[#00ff41] font-mono mt-1">Press Esc to close</p>
        </div>
      </div>
    </div>
  )
}

function LessonViewer({ lesson, concepts, mdxContent, navigation }: LessonViewerProps) {
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const [commandMode, setCommandMode] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const cleanedContent = mdxContent ? cleanMdx(mdxContent) : ""

  const commandContext: CommandContext = {
    router: (href) => router.push(href),
    toast: (msg, variant) => showToast(msg, variant),
    showModal: (id) => { if (id === "command-help") setHelpOpen(true) },
    lesson: navigation
      ? {
          slug: lesson.slug,
          title: lesson.title,
          moduleSlug: navigation.moduleSlug,
          schoolSlug: navigation.schoolSlug,
          currentIndex: navigation.currentIndex,
          totalInModule: navigation.totalInModule,
          nextSlug: navigation.nextSlug,
          prevSlug: navigation.prevSlug,
        }
      : undefined,
    bookmarks: {
      has: () => false,
      toggle: () => {},
    },
    progress: {
      complete: () => showToast("✓ Lesson completed!", "success"),
      isCompleted: () => false,
    },
  }

  // Register commands
  useEffect(() => {
    registerLessonCommands()
  }, [])

  // Global keyboard handler
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const handler = (e: KeyboardEvent) => {
      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // `:` — open command bar
      if (e.key === ":" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setCommandMode(true)
        return
      }

      // `?` — show help
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault()
        setHelpOpen(true)
        return
      }

      // Esc — close command bar / help
      if (e.key === "Escape") {
        if (commandMode) setCommandMode(false)
        if (helpOpen) setHelpOpen(false)
        return
      }

      // j / k — scroll
      if (!commandMode) {
        const step = 40
        if (e.key === "j") { e.preventDefault(); el.scrollBy(0, step) }
        if (e.key === "k") { e.preventDefault(); el.scrollBy(0, -step) }
        if (e.key === "g" && e.repeat === false) {
          // gg — but we need to detect double-g
        }
        if (e.key === "G" && e.shiftKey) { e.preventDefault(); el.scrollTo(0, el.scrollHeight) }
        if (e.ctrlKey && e.key === "d") { e.preventDefault(); el.scrollBy(0, el.clientHeight * 0.5) }
        if (e.ctrlKey && e.key === "u") { e.preventDefault(); el.scrollBy(0, -el.clientHeight * 0.5) }
      }
    }

    // gg detection
    let gCount = 0
    let gTimer: ReturnType<typeof setTimeout> | null = null

    const gHandler = (e: KeyboardEvent) => {
      if (e.key === "g" && !commandMode) {
        gCount++
        if (gCount === 2) {
          e.preventDefault()
          el.scrollTo(0, 0)
          gCount = 0
          if (gTimer) clearTimeout(gTimer)
        }
        if (gTimer) clearTimeout(gTimer)
        gTimer = setTimeout(() => { gCount = 0 }, 400)
        return
      }
    }

    document.addEventListener("keydown", gHandler)
    el.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", gHandler)
      el.removeEventListener("keydown", handler)
    }
  }, [commandMode, helpOpen])

  const difficultyColor = {
    beginner: "success" as const,
    intermediate: "warning" as const,
    advanced: "error" as const,
  }

  return (
    <>
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-10 overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#606060] font-mono mb-4">
            <BookOpen size={12} />
            <span>{lesson.title}</span>
            <span className="text-[#1e1e1e]">/</span>
            <span className="text-[#c0c0c0]">{lesson.contentPath.split("/").slice(0, -1).pop()}</span>
            {navigation && (
              <span className="text-[#606060] ml-auto">
                <Command size={10} className="inline mr-1" />: for commands
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">{lesson.title}</h1>
          {lesson.description && <p className="text-sm text-[#606060] font-mono">{lesson.description}</p>}

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Badge variant={difficultyColor[lesson.difficulty as keyof typeof difficultyColor] || "default"}>{lesson.difficulty}</Badge>
            <span className="text-xs text-[#606060] font-mono">{lesson.duration} min</span>
            <span className="text-xs text-[#ffb000] font-mono">+{lesson.xpReward} XP</span>
            <div className="flex-1" />
            <button onClick={() => showToast("Bookmarked!", "success")} className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#00f0ff] font-mono transition-colors">
              <Bookmark size={12} /> Bookmark
            </button>
            {navigation && (
              <span className="text-[10px] text-[#606060] font-mono border border-[#1e1e1e] px-2 py-0.5">
                {navigation.currentIndex + 1}/{navigation.totalInModule}
              </span>
            )}
          </div>

          {concepts.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-[10px] text-[#606060] font-mono uppercase tracking-wider">Teaches:</span>
              {concepts.map((c) => (
                <Link key={c.id} href={`/explore?q=${c.slug}`} className="text-xs text-[#00f0ff] hover:underline font-mono border border-[#1e1e1e] px-2 py-0.5">{c.name}</Link>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {cleanedContent ? (
          <div className="border border-[#1e1e1e] p-6 bg-[#121212] mb-8">
            <div className="prose prose-invert max-w-none text-sm font-mono">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const str = String(children).replace(/\n$/, "")
                    if (match) return (
                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div"
                        customStyle={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 0, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", margin: "12px 0" }}>
                        {str}
                      </SyntaxHighlighter>
                    )
                    return <code className="bg-[#1a1a1a] text-[#00ff41] px-1 text-xs" {...props}>{children}</code>
                  },
                  h1: ({ children }) => <h1 className="text-lg font-bold text-[#ffffff] font-mono mt-6 mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold text-[#ffffff] font-mono mt-5 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold text-[#00ff41] font-mono mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-sm text-[#c0c0c0] leading-relaxed mb-3">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside text-[#c0c0c0] space-y-1 mb-3 text-sm">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-[#c0c0c0] space-y-1 mb-3 text-sm">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  strong: ({ children }) => <strong className="text-[#ffffff] font-bold">{children}</strong>,
                  a: ({ href, children }) => <a href={href || "#"} className="text-[#00f0ff] hover:underline font-mono text-sm">{children}</a>,
                  table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
                  th: ({ children }) => <th className="border border-[#1e1e1e] px-3 py-2 text-[#ffffff] font-mono text-left text-xs bg-[#0a0a0a]">{children}</th>,
                  td: ({ children }) => <td className="border border-[#1e1e1e] px-3 py-2 text-[#c0c0c0] font-mono text-xs">{children}</td>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-[#00ff41] pl-4 my-4 text-sm text-[#c0c0c0] italic">{children}</blockquote>,
                  hr: () => <hr className="border-[#1e1e1e] my-6" />,
                }}
              >
                {cleanedContent}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="border border-[#1e1e1e] p-6 bg-[#121212] mb-8">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Terminal size={32} className="text-[#606060] mb-3" />
              <p className="text-sm text-[#c0c0c0] font-mono mb-1">Lesson content not available</p>
              <p className="text-xs text-[#606060] font-mono">File: <span className="text-[#00ff41]">{lesson.contentPath}</span></p>
            </div>
          </div>
        )}

        {/* Practice Terminal */}
        <div className="border border-[#1e1e1e] p-4 bg-[#121212] mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={14} className="text-[#00ff41]" />
            <p className="text-xs font-bold text-[#ffffff] font-mono">Practice Terminal</p>
          </div>
          <LessonTerminal language="javascript" mode="interactive"
            code="// Practice what you've learned!\n// Write and run your code here\nconsole.log('Hello from LupaLearn!');" />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-[#1e1e1e] pt-6">
          <Link href={`/learn`} className="flex items-center gap-2 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <button onClick={() => showToast("✓ Completed!", "success")}
            className="flex items-center gap-2 px-4 py-2 border border-[#00ff41] text-[#00ff41] text-xs font-mono hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors">
            <CheckCircle size={14} /> Mark Complete
          </button>
          <div className="flex items-center gap-2">
            {navigation?.prevSlug && (
              <Link href={`/learn/${navigation.schoolSlug}/${navigation.moduleSlug}/${navigation.prevSlug}`}
                className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors">
                <ArrowLeft size={12} /> Prev
              </Link>
            )}
            {navigation?.nextSlug && (
              <Link href={`/learn/${navigation.schoolSlug}/${navigation.moduleSlug}/${navigation.nextSlug}`}
                className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors">
                Next <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="text-center py-6 text-[10px] text-[#606060] font-mono">
          <span className="text-[#00ff41]">:</span> commands · <span className="text-[#00ff41]">j/k</span> scroll · <span className="text-[#00ff41]">gg</span> top · <span className="text-[#00ff41]">G</span> bottom · <span className="text-[#00ff41]">?</span> help · <span className="text-[#00ff41]">:n/:p</span> navigate
        </div>
      </div>

      {/* Command Bar */}
      {commandMode && <CommandBar context={commandContext} onClose={() => setCommandMode(false)} />}

      {/* Help Modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  )
}

export { LessonViewer }
