import type { Command, FuzzyMatchResult } from "./types"

const MIN_SCORE = 0.3

export function fuzzyMatch(input: string, commands: Command[]): FuzzyMatchResult[] {
  const lower = input.toLowerCase()
  const results: FuzzyMatchResult[] = []

  for (const cmd of commands) {
    // Check all aliases
    const allNames = [cmd.id.toLowerCase(), ...cmd.aliases.map((a) => a.toLowerCase())]

    for (const alias of allNames) {
      const score = scoreMatch(lower, alias)
      if (score >= MIN_SCORE) {
        results.push({ command: cmd, score, matchedAlias: alias })
        break // Only the best alias per command
      }
    }
  }

  return results.sort((a, b) => b.score - a.score)
}

function scoreMatch(input: string, target: string): number {
  // Exact match
  if (target === input) return 1.0

  // Prefix match (":next" matches ":next-lesson")
  if (target.startsWith(input)) return 0.9

  // Contains match
  if (target.includes(input)) return 0.7

  // Character-by-character subsequence match
  let ci = 0
  for (let ti = 0; ti < target.length && ci < input.length; ti++) {
    if (input[ci] === target[ti]) ci++
  }
  if (ci === input.length) {
    return 0.5 + (input.length / target.length) * 0.3
  }

  return 0
}
