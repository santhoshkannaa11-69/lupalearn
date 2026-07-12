"use client"

import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { LessonTerminal } from "@/components/terminal/LessonTerminal"
import Link from "next/link"
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Bookmark } from "lucide-react"

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
    module?: {
      title: string
      category?: {
        title: string
        volume?: {
          slug: string
          title: string
        }
      }
    }
  }
  concepts: Array<{
    id: string
    slug: string
    name: string
    type: string
    description: string | null
  }>
}

function LessonViewer({ lesson, concepts }: LessonViewerProps) {
  const tags = JSON.parse(lesson.tags || "[]") as string[]

  const difficultyColor = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  } as const

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#606060] font-mono mb-4">
          <BookOpen size={12} />
          <span>{lesson.module?.category?.volume?.title || "School"}</span>
          <span className="text-[#1e1e1e]">/</span>
          <span>{lesson.module?.category?.title || "Category"}</span>
          <span className="text-[#1e1e1e]">/</span>
          <span>{lesson.module?.title || "Module"}</span>
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
          <Badge variant="info">{lesson.contentType}</Badge>
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

      {/* Content area */}
      <div className="border border-[#1e1e1e] p-6 bg-[#121212] mb-8">
        <h2 className="text-lg font-bold text-[#ffffff] font-mono mb-4">Lesson Content</h2>
        <p className="text-sm text-[#606060] font-mono">
          Content from <span className="text-[#00ff41]">{lesson.contentPath}</span> will render here.
        </p>

        {/* Placeholder for actual MDX content */}
        <div className="mt-6 space-y-4 text-sm text-[#c0c0c0] font-mono leading-relaxed">
          <p>In this lesson, you&apos;ll learn the fundamental concepts behind this topic. Follow along with the interactive terminal below.</p>

          <h3 className="text-base font-bold text-[#ffffff] mt-6">Key Points</h3>
          <ul className="list-disc list-inside space-y-1 text-[#c0c0c0]">
            <li>Understand the core concept and why it matters</li>
            <li>See real code examples that demonstrate the concept</li>
            <li>Practice with the interactive terminal</li>
            <li>Test your knowledge with the quiz</li>
          </ul>
        </div>

        {/* Embedded Terminal */}
        <div className="mt-6">
          <LessonTerminal
            language="python"
            mode="interactive"
            code="# Welcome to the lesson!\n# Try running this code:\nprint('Hello from LupaLearn!')"
          />
        </div>
      </div>

      {/* Quiz Section */}
      <div className="border border-[#1e1e1e] p-6 bg-[#121212] mb-8">
        <Badge variant="warning" className="mb-3">Quick Quiz</Badge>
        <p className="text-sm text-[#606060] font-mono mb-4">Test what you&apos;ve learned in this lesson.</p>

        <div className="space-y-3">
          <p className="text-sm text-[#c0c0c0] font-mono">
            Question: What best describes the main concept of this lesson?
          </p>
          {["Option A", "Option B", "Option C", "Option D"].map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-3 px-3 py-2 border border-[#1e1e1e] cursor-pointer hover:border-[#2a2a2a] transition-colors text-sm font-mono"
            >
              <input type="radio" name="quiz" className="accent-[#00ff41]" />
              <span className="text-[#c0c0c0]">{opt}</span>
            </label>
          ))}
        </div>
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
          href="#"
          className="flex items-center gap-2 px-4 py-2 border border-[#00ff41] text-[#00ff41] text-xs font-mono hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-colors"
        >
          Mark Complete
          <CheckCircle size={14} />
        </Link>

        <Link
          href="#"
          className="flex items-center gap-2 text-xs text-[#606060] hover:text-[#c0c0c0] font-mono transition-colors"
        >
          Next lesson
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export { LessonViewer }
