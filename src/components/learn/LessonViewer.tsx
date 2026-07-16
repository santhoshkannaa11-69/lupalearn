"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { CommandBar } from "@/lib/command-system/CommandBar"
import { registerLessonCommands } from "@/lib/command-system/commands/lesson-commands"
import type { CommandContext } from "@/lib/command-system/types"
import { showToast } from "@/components/ui/Toast"
import { ReadinessScore, WhyLearnThis } from "@/components/learn/ReadinessScore"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Bookmark, Clock, Zap } from "lucide-react"

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
    .replace(/<Terminal[\s\S]*?\/>/g, "")
    .replace(/<Quiz[\s\S]*?\/>/g, "")
    .replace(/<Steps>[\s\S]*?<\/Steps>/g, "")
    .replace(/<Step[\s\S]*?\/?>/g, "")
    .replace(/<\/Step>/g, "")
    .replace(/<Callout type="info">/g, "> **💡 Insight:** ")
    .replace(/<Callout type="warning">/g, "> **⚠️ Watch out:** ")
    .replace(/<Callout type="tip">/g, "> **💡 Tip:** ")
    .replace(/<Callout type="danger">/g, "> **🚨 Caution:** ")
    .replace(/<\/Callout>/g, "\n")
    .replace(/import.*from.*;?\n?/g, "")
}

const difficultyConfig: Record<string, { label: string }> = {
  beginner: { label: "Beginner" },
  intermediate: { label: "Intermediate" },
  advanced: { label: "Advanced" },
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
      <div className="relative bg-elevated border border-border rounded-xl shadow-lg w-full max-w-lg max-h-[70vh] overflow-y-auto p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-text-primary mb-4">Commands</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Navigation</p>
            <div className="grid grid-cols-2 gap-1">
              {[":next", ":prev", ":dashboard", ":explore"].map((cmd) => (
                <span key={cmd} className="text-xs text-text-secondary font-mono bg-surface rounded-md px-2 py-1">{cmd}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Lesson</p>
            <div className="grid grid-cols-2 gap-1">
              {[":complete", ":bookmark"].map((cmd) => (
                <span key={cmd} className="text-xs text-text-secondary font-mono bg-surface rounded-md px-2 py-1">{cmd}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-text-muted"><span className="font-mono text-accent">j/k</span> scroll · <span className="font-mono text-accent">gg</span> top · <span className="font-mono text-accent">G</span> bottom · <span className="font-mono text-accent">?</span> help</p>
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
    lesson: navigation ? {
      slug: lesson.slug,
      title: lesson.title,
      moduleSlug: navigation.moduleSlug,
      schoolSlug: navigation.schoolSlug,
      currentIndex: navigation.currentIndex,
      totalInModule: navigation.totalInModule,
      nextSlug: navigation.nextSlug,
      prevSlug: navigation.prevSlug,
    } : undefined,
    bookmarks: { has: () => false, toggle: () => {} },
    progress: { complete: () => showToast("✓ Lesson completed!", "success"), isCompleted: () => false },
  }

  useEffect(() => { registerLessonCommands() }, [])

  useEffect(() => {
    const el = contentRef.current
    let gCount = 0
    let gTimer: ReturnType<typeof setTimeout> | null = null

    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ":" && !e.ctrlKey && !e.metaKey && !commandMode) {
        e.preventDefault(); setCommandMode(true); return
      }
      if (e.key === "?" && e.shiftKey && !commandMode) {
        e.preventDefault(); setHelpOpen((p) => !p); return
      }
      if (e.key === "Escape") {
        if (commandMode) { setCommandMode(false); return }
        if (helpOpen) { setHelpOpen(false); return }
        return
      }
      if (!commandMode && !helpOpen) {
        if (e.key === "j") { e.preventDefault(); el?.scrollBy(0, 40); return }
        if (e.key === "k") { e.preventDefault(); el?.scrollBy(0, -40); return }
        if (e.key === "G") { e.preventDefault(); el?.scrollTo(0, el?.scrollHeight || 0); return }
        if (e.key === "g") {
          gCount++
          if (gCount === 2) { e.preventDefault(); el?.scrollTo(0, 0); gCount = 0; if (gTimer) { clearTimeout(gTimer); gTimer = null } }
          else { if (gTimer) clearTimeout(gTimer); gTimer = setTimeout(() => { gCount = 0 }, 400) }
          return
        }
      }
    }
    document.addEventListener("keydown", handler)
    return () => { document.removeEventListener("keydown", handler); if (gTimer) clearTimeout(gTimer) }
  }, [commandMode, helpOpen])

  const diff = difficultyConfig[lesson.difficulty] || difficultyConfig.beginner

  return (
    <>
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-10 overflow-y-auto" style={{ height: "calc(100vh - 80px)" }}>
        {/* Learning Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl">{lesson.description}</p>
          )}

          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-soft text-accent border border-accent/20">
              {diff.label}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <Clock size={14} />{lesson.duration} min
            </span>
            <span className="flex items-center gap-1.5 text-sm text-accent">
              <Zap size={14} />+{lesson.xpReward} XP
            </span>
            {navigation && (
              <span className="text-sm text-text-muted ml-auto">
                {navigation.currentIndex + 1} of {navigation.totalInModule}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={() => showToast("✓ Completed!", "success")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-text-inverse text-sm font-medium rounded-xl hover:brightness-110 transition-all shadow-sm animate-glow-pulse"
            >
              <CheckCircle size={16} /> Mark Complete
            </button>
            <button
              onClick={() => showToast("Bookmarked!", "success")}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-text-secondary text-sm font-medium rounded-xl hover:bg-surface hover:border-border-hover transition-colors"
            >
              <Bookmark size={16} /> Bookmark
            </button>
          </div>
        </div>

        {/* Readiness */}
        {conceptSlugs && conceptSlugs.length > 0 && (
          <div className="mb-8">
            <ReadinessScore concepts={conceptSlugs} schoolSlug={navigation?.schoolSlug || "computer-science"} moduleSlug={navigation?.moduleSlug || "programming-fundamentals"} />
            <WhyLearnThis conceptSlug={conceptSlugs[0]} />
          </div>
        )}

        {/* Content */}
        {processedContent ? (
          <div className="mb-10">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const str = String(children).replace(/\n$/, "")
                    if (match) return (
                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div"
                        customStyle={{ background: "#1C1A17", borderRadius: "12px", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", margin: "20px 0", padding: "16px", border: "1px solid #2C2924" }}>
                        {str}
                      </SyntaxHighlighter>
                    )
                    if (str.includes("\n")) return (
                      <pre className="bg-surface rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono leading-relaxed text-text-secondary border border-border">
                        {str}
                      </pre>
                    )
                    return (
                      <code className="bg-accent-soft text-accent px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-text-primary mt-10 mb-4 tracking-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-text-primary mt-8 mb-3 tracking-tight">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-text-secondary mt-6 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-[15px] text-text-primary leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside text-text-primary space-y-1.5 mb-4 text-[15px]">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-text-primary space-y-1.5 mb-4 text-[15px]">{children}</ol>,
                  li: ({ children }) => <li className="text-[15px] leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
                  em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
                  a: ({ href, children }) => (
                    <a href={href || "#"} className="text-accent hover:text-accent/80 underline underline-offset-2 decoration-accent/30 transition-colors">{children}</a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-xl border border-border">
                      <table className="w-full text-sm">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-surface">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
                  tr: ({ children }) => <tr className="hover:bg-surface/50 transition-colors">{children}</tr>,
                  th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-3 text-sm text-text-primary">{children}</td>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent pl-4 my-6 py-2 text-sm text-text-secondary bg-accent-soft/50 rounded-r-xl">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-border my-8" />,
                  details: ({ children }) => <details className="my-4 rounded-xl border border-border overflow-hidden">{children}</details>,
                  summary: ({ children }) => (
                    <summary className="px-4 py-2.5 bg-surface text-sm font-medium text-text-secondary cursor-pointer hover:bg-surface/80 transition-colors">
                      {children}
                    </summary>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-6 rounded-xl overflow-hidden border border-border">
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
          <div className="mb-10 rounded-xl border border-border p-8">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen size={32} className="text-text-muted mb-3" />
              <p className="text-sm text-text-secondary mb-1">Lesson content not available</p>
              <p className="text-xs text-text-muted font-mono">{lesson.contentPath}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors">
            <ArrowLeft size={14} /> Back to Learning
          </Link>
          <div className="flex items-center gap-3">
            {navigation?.prevSlug && (
              <Link href={`/learn/${navigation.schoolSlug}/${navigation.moduleSlug}/${navigation.prevSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors">
                <ArrowLeft size={14} /> Previous
              </Link>
            )}
            {navigation?.nextSlug && (
              <Link href={`/learn/${navigation.schoolSlug}/${navigation.moduleSlug}/${navigation.nextSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-text-inverse text-sm font-medium rounded-xl hover:brightness-110 transition-all shadow-sm">
                Next Lesson <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        <div className="text-center py-6 text-xs text-text-muted">
          <span className="font-mono text-accent">:</span> commands · <span className="font-mono text-accent">j/k</span> scroll · <span className="font-mono text-accent">?</span> help
        </div>
      </div>

      {commandMode && <CommandBar context={commandContext} onClose={() => setCommandMode(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  )
}

export { LessonViewer }
