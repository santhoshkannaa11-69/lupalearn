import { prisma } from "@/lib/db"
import { calculateAllConceptConfidence } from "@/lib/confidence"

export async function buildProgressContext(userId: string) {
  const confidenceResults = await calculateAllConceptConfidence(userId)

  const confidence: Record<string, number> = {}
  const weakConcepts: string[] = []
  const strongConcepts: string[] = []

  for (const r of confidenceResults) {
    confidence[r.conceptSlug] = r.confidence
    if (r.confidence < 40) weakConcepts.push(r.conceptSlug)
    if (r.confidence >= 70) strongConcepts.push(r.conceptSlug)
  }

  const avgConf = confidenceResults.length > 0
    ? confidenceResults.reduce((s, r) => s + r.confidence, 0) / confidenceResults.length
    : 0

  const level: "beginner" | "intermediate" | "advanced" = avgConf < 25 ? "beginner" : avgConf < 60 ? "intermediate" : "advanced"

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId, completed: true },
    include: { lesson: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return {
    level,
    confidence,
    weakConcepts,
    strongConcepts,
    completedLessons: completions.map((c) => c.lesson.slug),
    averageConfidence: Math.round(avgConf),
  }
}
