export type CommandCategory = "navigation" | "lesson" | "ai" | "system"

export type CommandResult =
  | { type: "navigate"; href: string }
  | { type: "toast"; message: string; variant?: "info" | "success" | "error" }
  | { type: "modal"; id: string }
  | { type: "execute"; action: string; data?: unknown }
  | { type: "none" }

export type CommandContext = {
  router: (href: string) => void
  toast: (message: string, variant?: "info" | "success" | "error") => void
  showModal: (id: string) => void
  lesson?: {
    slug: string
    title: string
    moduleSlug: string
    schoolSlug: string
    currentIndex: number
    totalInModule: number
    nextSlug?: string
    prevSlug?: string
  }
  bookmarks?: {
    has: (slug: string) => boolean
    toggle: (slug: string) => void
  }
  progress?: {
    complete: (slug: string) => void
    isCompleted: (slug: string) => boolean
  }
}

export type ParsedCommand = {
  name: string
  args: string[]
  raw: string
}

export type ResolvedCommand = {
  command: Command
  args: string[]
  parsed: ParsedCommand
  confidence: number
  matchedAlias?: string
}

export interface Command {
  id: string
  aliases: string[]
  title: string
  description: string
  category: CommandCategory
  usage?: string[]
  examples?: string[]
  execute: (ctx: CommandContext) => CommandResult | Promise<CommandResult>
}

export type FuzzyMatchResult = {
  command: Command
  score: number
  matchedAlias: string
}
