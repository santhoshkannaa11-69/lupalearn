import type { Command } from "../types"
import { registerCommand } from "../registry"

// ─── Navigation ───

export function registerLessonCommands() {
  registerCommand({
    id: "next-lesson",
    aliases: ["n", "next"],
    title: "Next Lesson",
    description: "Go to the next lesson in this module",
    category: "navigation",
    usage: [":n", ":next"],
    examples: [":n", ":next"],
    execute: (ctx) => {
      const slug = ctx.lesson?.nextSlug
      if (!slug || !ctx.lesson) return { type: "none" }
      return { type: "navigate", href: `/learn/${ctx.lesson.schoolSlug}/${ctx.lesson.moduleSlug}/${slug}` }
    },
  })

  registerCommand({
    id: "prev-lesson",
    aliases: ["p", "prev", "previous"],
    title: "Previous Lesson",
    description: "Go to the previous lesson in this module",
    category: "navigation",
    usage: [":p", ":prev", ":previous"],
    examples: [":p", ":prev"],
    execute: (ctx) => {
      const slug = ctx.lesson?.prevSlug
      if (!slug || !ctx.lesson) return { type: "none" }
      return { type: "navigate", href: `/learn/${ctx.lesson.schoolSlug}/${ctx.lesson.moduleSlug}/${slug}` }
    },
  })

  registerCommand({
    id: "playground",
    aliases: ["pg", "play"],
    title: "Open Playground",
    description: "Open the code playground",
    category: "navigation",
    usage: [":pg", ":playground", ":play"],
    examples: [":pg", ":playground"],
    execute: () => ({ type: "navigate" as const, href: "/playground" }),
  })

  registerCommand({
    id: "tutor",
    aliases: ["t", "ai"],
    title: "AI Tutor",
    description: "Open the AI Tutor",
    category: "ai",
    usage: [":t", ":tutor", ":ai"],
    examples: [":t", ":tutor"],
    execute: () => ({ type: "navigate" as const, href: "/ai-tutor" }),
  })

  registerCommand({
    id: "dashboard",
    aliases: ["d", "db"],
    title: "Dashboard",
    description: "Open your learning dashboard",
    category: "navigation",
    usage: [":d", ":dashboard", ":db"],
    examples: [":d", ":dashboard"],
    execute: () => ({ type: "navigate" as const, href: "/dashboard" }),
  })

  registerCommand({
    id: "explore",
    aliases: ["e", "search"],
    title: "Explorer",
    description: "Search and explore the knowledge graph",
    category: "navigation",
    usage: [":e", ":explore", ":search"],
    examples: [":e", ":explore"],
    execute: () => ({ type: "navigate" as const, href: "/explore" }),
  })

  registerCommand({
    id: "quit",
    aliases: ["q", "back"],
    title: "Back to School",
    description: "Go back to the current school",
    category: "navigation",
    usage: [":q", ":quit", ":back"],
    examples: [":q", ":quit"],
    execute: (ctx) => {
      const slug = ctx.lesson?.schoolSlug
      return { type: "navigate" as const, href: slug ? `/learn/${slug}` : "/learn" }
    },
  })

  // ─── Lesson Actions ───

  registerCommand({
    id: "complete",
    aliases: ["c", "done"],
    title: "Mark Complete",
    description: "Mark this lesson as completed",
    category: "lesson",
    usage: [":c", ":complete", ":done"],
    examples: [":c", ":complete"],
    execute: (ctx) => {
      const slug = ctx.lesson?.slug
      if (!slug) return { type: "none" }
      ctx.progress?.complete(slug)
      return { type: "toast", message: "✓ Lesson marked as complete", variant: "success" }
    },
  })

  registerCommand({
    id: "bookmark",
    aliases: ["b", "bm"],
    title: "Toggle Bookmark",
    description: "Bookmark or unbookmark this lesson",
    category: "lesson",
    usage: [":b", ":bookmark", ":bm"],
    examples: [":b", ":bookmark"],
    execute: (ctx) => {
      const slug = ctx.lesson?.slug
      if (!slug) return { type: "none" }
      const isBookmarked = ctx.bookmarks?.has(slug)
      ctx.bookmarks?.toggle(slug)
      return {
        type: "toast" as const,
        message: isBookmarked ? "Bookmark removed" : "✓ Lesson bookmarked",
        variant: isBookmarked ? "info" : "success",
      }
    },
  })

  // ─── Help / System ───

  registerCommand({
    id: "help",
    aliases: ["h", "?"],
    title: "Help",
    description: "Show available commands",
    category: "system",
    usage: [":h", ":help", ":?"],
    examples: [":h", ":help"],
    execute: () => ({ type: "modal" as const, id: "command-help" }),
  })
}
