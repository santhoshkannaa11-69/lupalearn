"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { LessonTerminal } from "@/components/terminal/LessonTerminal"
import { CommandBar } from "@/lib/command-system/CommandBar"
import { registerLessonCommands } from "@/lib/command-system/commands/lesson-commands"
import type { CommandContext } from "@/lib/command-system/types"
import { showToast } from "@/components/ui/Toast"
import { ReadinessScore, WhyLearnThis } from "@/components/learn/ReadinessScore"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Bookmark, Terminal, Command, Clock, Zap, ChevronDown } from "lucide-react"

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
  conceptSlugs?: string[]
  navigation?: NavigationInfo
}

function preprocessContent(content: string): string {
  return content
    // Strip custom MDX components that ReactMarkdown can't render
    .replace(/<Terminal[\s\S]*?\/>/g, "")
    .replace(/<Quiz[\s\S]*?\/>/g, "")
    .replace(/<Steps>[\s\S]*?<\/Steps>/g, "")
    .replace(/<Step[\s\S]*?\/?>/g, "")
    .replace(/<\/Step>/g, "")
    // Convert Callout to blockquote
    .replace(/<Callout type="info">/g, "> **💡 Info:** ")
    .replace(/<Callout type="warning">/g, "> **⚠️ Warning:** ")
    .replace(/<Callout type="tip">/g, "> **💡 Tip:** ")
    .replace(/<Callout type="danger">/g, "> **🚨 Danger:** ")
    .replace(/<\/Callout>/g, "\n")
    .replace(/import.*from.*;?\n?/g, "")
}

const difficultyConfig = {
  beginner: { label: "Beginner", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  intermediate: { label: "Intermediate", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  advanced: { label: "Advanced", color: "bg-red-500/10 text-red-400 border-red-500/20" },
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Commands</h2>
        {categories.map((cat) => (
          <div key={cat.name} className="mb-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">{cat.name}</p>
            <div className="grid grid-cols-2 gap-1">
              {cat.commands.map((cmd) => (
                <span key={cmd} className="text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-1">{cmd}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Scrolling: <span className="text-zinc-900 dark:text-zinc-100 font-medium">j</span> down · <span className="text-zinc-900 dark:text-zinc-100 font-medium">k</span> up · <span className="text-zinc-900 dark:text-zinc-100 font-medium">gg</span> top · <span className="text-zinc-900 dark:text-zinc-100 font-medium">G</span> bottom · <span className="text-zinc-900 dark:text-zinc-100 font-medium">?</span> this help</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Press <span className="font-mono">Esc</span> to close</p>
        </div>
      </div>
    </div>
  )
}

function LessonViewer({ lesson, concepts, mdxContent, conceptSlugs, navigation }: LessonViewerProps) {
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const [commandMode, setCommandMode] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const processedContent = mdxContent ? preprocessContent(mdxContent) : ""

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

  useEffect(() => {
    registerLessonCommands()
  }, [])

  useEffect(() => {
    const el = contentRef.current
    let gCount = 0
    let gTimer: ReturnType<typeof setTimeout> | null = null

    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === ":" && !e.ctrlKey && !e.metaKey && !commandMode) {
        e.preventDefault()
        setCommandMode(true)
        return
      }

      if (e.key === "?" && e.shiftKey && !commandMode) {
        e.preventDefault()
        setHelpOpen((prev) => !prev)
        return
      }

      if (e.key === "Escape") {
        if (commandMode) { setCommandMode(false); return }
        if (helpOpen) { setHelpOpen(false); return }
        return
      }

      if (!commandMode && !helpOpen) {
        const step = 40
        if (e.key === "j") { e.preventDefault(); el?.scrollBy(0, step); return }
        if (e.key === "k") { e.preventDefault(); el?.scrollBy(0, -step); return }
        if (e.key === "G") { e.preventDefault(); el?.scrollTo(0, el?.scrollHeight || 0); return }
        if (e.ctrlKey && e.key === "d") { e.preventDefault(); el?.scrollBy(0, (el?.clientHeight || 0) * 0.5); return }
        if (e.ctrlKey && e.key === "u") { e.preventDefault(); el?.scrollBy(0, -((el?.clientHeight || 0) * 0.5)); return }

        if (e.key === "g") {
          gCount++
          if (gCount === 2) {
            e.preventDefault()
            el?.scrollTo(0, 0)
            gCount = 0
            if (gTimer) { clearTimeout(gTimer); gTimer = null }
          } else {
            if (gTimer) clearTimeout(gTimer)
            gTimer = setTimeout(() => { gCount = 0 }, 400)
          }
          return
        }
      }
    }

    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
      if (gTimer) clearTimeout(gTimer)
    }
  }, [commandMode, helpOpen])

  const diff = difficultyConfig[lesson.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner

  return (
    <>
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-10 overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
        {/* Hero Section */}
        <div className="mb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            <Link href="/learn" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Learn</Link>
            <ChevronDown size={12} className="-rotate-90" />
            <Link href={`/learn/${navigation?.schoolSlug}`} className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors capitalize">{navigation?.schoolSlug?.replace(/-/g, " ")}</Link>
            <ChevronDown size={12} className="-rotate-90" />
            <span className="text-zinc-700 dark:text-zinc-200 capitalize">{navigation?.moduleSlug?.replace(/-/g, " ")}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{lesson.description}</p>
          )}

          {/* Meta bar */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${diff.color}`}>
              {diff.label}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <Clock size={14} />
              {lesson.duration} min
            </span>
            <span className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
              <Zap size={14} />
              +{lesson.xpReward} XP
            </span>
            {navigation && (
              <span className="text-sm text-zinc-400 dark:text-zinc-500 ml-auto">
                {navigation.currentIndex + 1} of {navigation.totalInModule}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => showToast("✓ Completed!", "success")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle size={16} />
              Mark Complete
            </button>
            <button
              onClick={() => showToast("Bookmarked!", "success")}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bookmark size={16} />
              Bookmark
            </button>
          </div>
        </div>

        {/* Readiness & Why Learn */}
        {conceptSlugs && conceptSlugs.length > 0 && (
          <div className="mb-8">
            <ReadinessScore concepts={conceptSlugs} schoolSlug={navigation?.schoolSlug || "computer-science"} moduleSlug={navigation?.moduleSlug || "programming-fundamentals"} />
            <WhyLearnThis conceptSlug={conceptSlugs[0]} />
          </div>
        )}

        {/* Lesson Content */}
        {processedContent ? (
          <div className="mb-10">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const str = String(children).replace(/\n$/, "")
                    if (match) return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          background: "#1e1e1e",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontFamily: "'JetBrains Mono', monospace",
                          margin: "16px 0",
                          padding: "16px",
                        }}
                      >
                        {str}
                      </SyntaxHighlighter>
                    )
                    if (str.includes("\n")) return (
                      <pre className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {str}
                      </pre>
                    )
                    return (
                      <code className="bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mt-10 mb-4 tracking-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mt-8 mb-3 tracking-tight">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mt-6 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 space-y-1.5 mb-4 text-[15px]">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-700 dark:text-zinc-300 space-y-1.5 mb-4 text-[15px]">{children}</ol>,
                  li: ({ children }) => <li className="text-[15px] leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-zinc-600 dark:text-zinc-400">{children}</em>,
                  a: ({ href, children }) => (
                    <a href={href || "#"} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-200 dark:decoration-emerald-800 transition-colors">
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <table className="w-full text-sm">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-zinc-50 dark:bg-zinc-800/50">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{children}</tbody>,
                  tr: ({ children }) => <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">{children}</tr>,
                  th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{children}</td>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-emerald-500 pl-4 my-6 py-2 text-sm text-zinc-600 dark:text-zinc-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-zinc-200 dark:border-zinc-800 my-8" />,
                  details: ({ children }) => <details className="my-4 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">{children}</details>,
                  summary: ({ children }) => (
                    <summary className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2">
                      {children}
                    </summary>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-6 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                      <img src={src} alt={alt || ""} className="w-full" />
                    </div>
                  ),
                  pre: ({ children }) => <div className="[&>pre]:m-0">{children}</div>,
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="mb-10 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen size={32} className="text-zinc-300 dark:text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Lesson content not available</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">File: {lesson.contentPath}</p>
            </div>
          </div>
        )}

        {/* Practice Terminal */}
        <div className="mb-10 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <Terminal size={16} className="text-zinc-500 dark:text-zinc-400" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Practice Terminal</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto">JavaScript</span>
          </div>
          <LessonTerminal language="javascript" mode="interactive"
            code="// Practice what you've learned!\n// Write and run your code here\nconsole.log('Hello from LupaLearn!');" />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={`/learn`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Learning
          </Link>
          <div className="flex items-center gap-3">
            {navigation?.prevSlug && (
              <Link
                href={`/learn/${navigation.schoolSlug}/${navigation.moduleSlug}/${navigation.prevSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <ArrowLeft size={14} />
                Previous
              </Link>
            )}
            {navigation?.nextSlug && (
              <Link
                href={`/learn/${navigation.schoolSlug}/${navigation.moduleSlug}/${navigation.nextSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Next Lesson
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="font-mono text-zinc-500 dark:text-zinc-400">:</span> commands &middot;
          <span className="font-mono text-zinc-500 dark:text-zinc-400"> j/k</span> scroll &middot;
          <span className="font-mono text-zinc-500 dark:text-zinc-400"> ?</span> help
        </div>
      </div>

      {commandMode && <CommandBar context={commandContext} onClose={() => setCommandMode(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  )
}

export { LessonViewer }
