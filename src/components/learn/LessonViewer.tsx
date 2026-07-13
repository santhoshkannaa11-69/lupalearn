"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Badge } from "@/components/ui/Badge"
import { LessonTerminal } from "@/components/terminal/LessonTerminal"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Bookmark, Terminal } from "lucide-react"

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
  concepts: Array<{
    id: string
    slug: string
    name: string
    type: string
    description: string | null
  }>
  mdxContent?: string
}

// Strip custom MDX component tags that ReactMarkdown can't render
function cleanMdx(content: string): string {
  return content
    // Remove <Terminal ... /> blocks
    .replace(/<Terminal[\s\S]*?\/>/g, "")
    .replace(/<Quiz[\s\S]*?\/>/g, "")
    // Remove custom import statements
    .replace(/import.*from.*;?\n?/g, "")
}

function LessonViewer({ lesson, concepts, mdxContent }: LessonViewerProps) {
  const cleanedContent = mdxContent ? cleanMdx(mdxContent) : ""
  const difficultyColor = {
    beginner: "success" as const,
    intermediate: "warning" as const,
    advanced: "error" as const,
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#606060] font-mono mb-4">
          <BookOpen size={12} />
          <span>{lesson.title}</span>
          <span className="text-[#1e1e1e]">/</span>
          <span className="text-[#c0c0c0]">{lesson.contentPath.split("/").slice(0, -1).pop()}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-sm text-[#606060] font-mono">{lesson.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <Badge variant={difficultyColor[lesson.difficulty as keyof typeof difficultyColor] || "default"}>
            {lesson.difficulty}
          </Badge>
          <span className="text-xs text-[#606060] font-mono">{lesson.duration} min</span>
          <span className="text-xs text-[#ffb000] font-mono">+{lesson.xpReward} XP</span>
          <div className="flex-1" />
          <button className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#00f0ff] font-mono transition-colors">
            <Bookmark size={12} />
            Bookmark
          </button>
        </div>

        {/* Concepts */}
        {concepts.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[10px] text-[#606060] font-mono uppercase tracking-wider">Teaches:</span>
            {concepts.map((c) => (
              <Link
                key={c.id}
                href={`/explore?q=${c.slug}`}
                className="text-xs text-[#00f0ff] hover:underline font-mono border border-[#1e1e1e] px-2 py-0.5"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* MDX Content */}
      {cleanedContent ? (
        <div className="border border-[#1e1e1e] p-6 bg-[#121212] mb-8">
          <div className="prose prose-invert max-w-none text-sm font-mono">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  const codeStr = String(children).replace(/\n$/, "")
                  if (match) {
                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 0, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", margin: "12px 0" }}
                      >
                        {codeStr}
                      </SyntaxHighlighter>
                    )
                  }
                  return <code className="bg-[#1a1a1a] text-[#00ff41] px-1 text-xs" {...props}>{children}</code>
                },
                h1: ({ children }) => <h1 className="text-lg font-bold text-[#ffffff] font-mono mt-6 mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold text-[#ffffff] font-mono mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold text-[#00ff41] font-mono mt-4 mb-2">{children}</h3>,
                p: ({ children }) => {
                  return <p className="text-sm text-[#c0c0c0] leading-relaxed mb-3">{children}</p>
                },
                ul: ({ children }) => <ul className="list-disc list-inside text-[#c0c0c0] space-y-1 mb-3 text-sm">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-[#c0c0c0] space-y-1 mb-3 text-sm">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="text-[#ffffff] font-bold">{children}</strong>,
                a: ({ href, children }) => (
                  <a href={href || "#"} className="text-[#00f0ff] hover:underline font-mono text-sm">{children}</a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="border border-[#1e1e1e] px-3 py-2 text-[#ffffff] font-mono text-left text-xs bg-[#0a0a0a]">{children}</th>,
                td: ({ children }) => <td className="border border-[#1e1e1e] px-3 py-2 text-[#c0c0c0] font-mono text-xs">{children}</td>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#00ff41] pl-4 my-4 text-sm text-[#c0c0c0] italic">{children}</blockquote>
                ),
                hr: () => <hr className="border-[#1e1e1e] my-6" />,
              }}
            >
              {mdxContent}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="border border-[#1e1e1e] p-6 bg-[#121212] mb-8">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Terminal size={32} className="text-[#606060] mb-3" />
            <p className="text-sm text-[#c0c0c0] font-mono mb-1">Lesson content not available</p>
            <p className="text-xs text-[#606060] font-mono">
              File: <span className="text-[#00ff41]">{lesson.contentPath}</span>
            </p>
          </div>
        </div>
      )}

      {/* Embedded Terminal for practice */}
      <div className="border border-[#1e1e1e] p-4 bg-[#121212] mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={14} className="text-[#00ff41]" />
          <p className="text-xs font-bold text-[#ffffff] font-mono">Practice Terminal</p>
        </div>
        <LessonTerminal
          language="javascript"
          mode="interactive"
          code="// Practice what you've learned!\n// Write and run your code here\nconsole.log('Hello from LupaLearn!');"
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[#1e1e1e] pt-6">
        <Link
          href={`/learn`}
          className="flex items-center gap-2 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors"
        >
          <ArrowLeft size={14} />
          Back to schools
        </Link>

        <Link
          href={concepts.length > 0 ? `/explore?q=${concepts[0].slug}` : "#"}
          className="flex items-center gap-2 px-4 py-2 border border-[#00ff41] text-[#00ff41] text-xs font-mono hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors"
        >
          <CheckCircle size={14} />
          Mark Complete
        </Link>

        <Link
          href="/playground"
          className="flex items-center gap-2 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors"
        >
          Open Playground
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export { LessonViewer }
