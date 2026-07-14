import type { ParsedCommand, ResolvedCommand, Command } from "./types"
import { getCommand } from "./registry"
import { fuzzyMatch } from "./fuzzy-matcher"
import { getAllCommands } from "./registry"

export function resolve(parsed: ParsedCommand): ResolvedCommand | null {
  // 1. Direct lookup by ID or alias
  const direct = getCommand(parsed.name)
  if (direct) {
    return {
      command: direct,
      args: parsed.args,
      parsed,
      confidence: 1.0,
    }
  }

  // 2. Fuzzy match
  const fuzzy = fuzzyMatch(parsed.name, getAllCommands())
  if (fuzzy.length > 0) {
    const best = fuzzy[0]
    return {
      command: best.command,
      args: parsed.args,
      parsed,
      confidence: best.score,
    }
  }

  return null
}

export function suggest(partial: string, maxResults: number = 5): ResolvedCommand[] {
  const fuzzy = fuzzyMatch(partial, getAllCommands())
  return fuzzy.slice(0, maxResults).map((f) => ({
    command: f.command,
    args: [],
    parsed: { name: f.matchedAlias, args: [], raw: ":" + f.matchedAlias },
    confidence: f.score,
    matchedAlias: f.matchedAlias,
  }))
}
