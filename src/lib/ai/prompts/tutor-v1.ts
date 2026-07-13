import { SYSTEM_PROMPT as BASE } from "./base-v1"

export const version = 1
export const name = "tutor"

export function buildPrompt(ctx: {
  level: string
  question: string
  weakConcepts: string[]
  strongConcepts: string[]
  currentConcept?: string
  goal?: string
}): Array<{ role: string; content: string }> {
  const messages = [
    { role: "system", content: BASE },
    {
      role: "system",
      content: buildContextBlock(ctx),
    },
    { role: "user", content: ctx.question },
  ]
  return messages
}

function buildContextBlock(ctx: {
  level: string
  weakConcepts: string[]
  strongConcepts: string[]
  currentConcept?: string
  goal?: string
}): string {
  return `## Learner Context
- Level: ${ctx.level}
- Current concept: ${ctx.currentConcept || "not specified"}
- Strong areas: ${ctx.strongConcepts.slice(0, 5).join(", ") || "none yet"}
- Needs review: ${ctx.weakConcepts.slice(0, 5).join(", ") || "none"}
- Goal: ${ctx.goal || "not specified"}

Adapt your explanation to this context. If the learner is a beginner, start with fundamentals. If intermediate, build on what they know. If advanced, focus on depth.`
}
