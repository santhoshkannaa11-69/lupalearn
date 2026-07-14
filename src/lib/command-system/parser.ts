import type { ParsedCommand } from "./types"

export function parse(input: string): ParsedCommand | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Require `:` prefix for commands
  if (!trimmed.startsWith(":")) return null

  const withoutPrefix = trimmed.slice(1).trim()
  if (!withoutPrefix) return null

  const parts = splitRespectingQuotes(withoutPrefix)
  const name = parts[0]?.toLowerCase() || ""
  const args = parts.slice(1)

  return { name, args, raw: trimmed }
}

function splitRespectingQuotes(input: string): string[] {
  const parts: string[] = []
  let current = ""
  let inQuote = false
  let quoteChar = ""

  for (const ch of input) {
    if (inQuote) {
      if (ch === quoteChar) {
        inQuote = false
      } else {
        current += ch
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = true
      quoteChar = ch
    } else if (ch === " ") {
      if (current) {
        parts.push(current)
        current = ""
      }
    } else {
      current += ch
    }
  }
  if (current) parts.push(current)
  return parts
}

export function isCommandInput(input: string): boolean {
  return input.startsWith(":")
}
