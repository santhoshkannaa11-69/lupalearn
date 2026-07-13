import { registerTool } from "./registry"

registerTool({
  id: "show-progress",
  name: "Show Progress",
  description: "Show the user's learning progress summary",
  execute: async (_args, ctx) => {
    const { learner, goals } = ctx
    return {
      level: learner.level,
      confidence: learner.confidence,
      weakConcepts: learner.weakConcepts,
      strongConcepts: learner.strongConcepts,
      completedLessons: learner.completedLessons.length,
      goal: goals.primary || "No goal set",
      summary: `${learner.strongConcepts.length} concepts mastered, ${learner.weakConcepts.length} need review. Level: ${learner.level}`,
    }
  },
})
