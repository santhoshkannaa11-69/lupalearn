import { prisma } from "./db"
import { calculateConceptConfidence } from "./confidence"

type NodeBasic = {
  id: string
  slug: string
  name: string
  type: string
  description: string | null
}

type ConfidenceResult = {
  conceptId: string
  conceptSlug: string
  conceptName: string
  confidence: number
}

type NextStep = {
  concept: NodeBasic
  reason: string
  unlocks: string[]
  confidence: number
  order: number
  lessonsCount: number
  lessonSlugs: string[]
}

// ─── PREREQUISITES ───

export async function getPrerequisites(conceptSlug: string): Promise<NodeBasic[]> {
  const concept = await prisma.node.findUnique({ where: { slug: conceptSlug } })
  if (!concept) return []

  const prereqEdges = await prisma.edge.findMany({
    where: { sourceId: concept.id, relationType: "requires" },
    include: { target: true },
  })

  return prereqEdges.map((e) => e.target as NodeBasic)
}

// ─── DEPENDENTS (what this unlocks) ───

export async function getDependents(conceptSlug: string): Promise<NodeBasic[]> {
  const concept = await prisma.node.findUnique({ where: { slug: conceptSlug } })
  if (!concept) return []

  const depEdges = await prisma.edge.findMany({
    where: { targetId: concept.id, relationType: "requires" },
    include: { source: true },
  })

  return depEdges.map((e) => e.source as NodeBasic)
}

// ─── CONCEPT PROGRESSION ENGINE ───

export async function getNextSteps(
  userId: string,
  goal?: string,
  limit: number = 5
): Promise<NextStep[]> {
  // 1. Get all concepts with confidence
  const allConcepts = await prisma.node.findMany({
    where: { type: "concept" },
  })

  const confidenceMap = new Map<string, number>()
  for (const concept of allConcepts) {
    const conf = await calculateConceptConfidence(userId, concept.id)
    confidenceMap.set(concept.slug, conf)
  }

  // 2. Determine which concepts are "mastered" (confidence >= 70)
  const mastered = new Set(
    allConcepts.filter((c) => (confidenceMap.get(c.slug) || 0) >= 70).map((c) => c.slug)
  )

  // 3. Build a set of concepts the user has interacted with
  const completedLessonSlugs = await prisma.lessonCompletion.findMany({
    where: { userId, completed: true },
    include: { lesson: true },
  })
  const seenSlugs = new Set(completedLessonSlugs.map((c) => c.lesson.slug))

  // 4. If goal is provided, get the roadmap to prioritize
  let goalOrder = new Map<string, number>()
  if (goal) {
    const { generateRoadmap } = await import("./roadmap")
    const roadmap = await generateRoadmap(goal)
    roadmap.steps.forEach((s, i) => goalOrder.set(s.node.slug, i + 1))
  }

  // 5. Find the "frontier": concepts whose prerequisites are all mastered
  const frontier: { concept: NodeBasic; prereqsMet: string[]; missingPrereqs: string[] }[] = []

  for (const concept of allConcepts) {
    const slug = concept.slug
    if (mastered.has(slug)) continue // already mastered

    const prereqs = await getPrerequisites(slug)
    const prereqSlugs = prereqs.map((p) => p.slug)

    if (prereqSlugs.length === 0) {
      // No prerequisites — available immediately
      frontier.push({ concept: concept as NodeBasic, prereqsMet: [], missingPrereqs: [] })
    } else {
      const met = prereqSlugs.filter((p) => mastered.has(p))
      const missing = prereqSlugs.filter((p) => !mastered.has(p))
      if (met.length === prereqSlugs.length) {
        frontier.push({ concept: concept as NodeBasic, prereqsMet: met, missingPrereqs: [] })
      }
    }
  }

  // 6. Score each frontier concept by priority
  const scored: NextStep[] = await Promise.all(
    frontier.map(async (f) => {
      const conf = confidenceMap.get(f.concept.slug) || 0
      const roadmapOrder = goalOrder.get(f.concept.slug) || 999

      // Find lessons
      const teachingEdges = await prisma.edge.findMany({
        where: { targetId: f.concept.id, relationType: "teaches", source: { type: "lesson" } },
        include: { source: true },
      })
      const lessonSlugs = teachingEdges.map((e) => e.source.slug.replace("lesson-", ""))

      // What does this concept unlock?
      const deps = await getDependents(f.concept.slug)

      // Reason
      let reason = ""
      if (conf > 0 && conf < 70) {
        reason = `In progress (${conf}% confident). Keep going to solidify.`
      } else if (roadmapOrder < 999) {
        const prereqNames = f.prereqsMet.length > 0
          ? f.prereqsMet.map((s) => allConcepts.find((c) => c.slug === s)?.name || s).join(", ")
          : ""
        reason = prereqNames
          ? `Prerequisites (${prereqNames}) are complete. Next step in your roadmap.`
          : `Starts your roadmap toward ${goal || "this path"}.`
      } else {
        reason = `Unlocks ${deps.length} concept${deps.length !== 1 ? "s" : ""}: ${deps.slice(0, 3).map((d) => d.name).join(", ")}${deps.length > 3 ? "..." : ""}`
      }

      return {
        concept: f.concept,
        reason,
        unlocks: deps.map((d) => d.slug),
        confidence: conf,
        order: roadmapOrder,
        lessonsCount: lessonSlugs.length,
        lessonSlugs,
      }
    })
  )

  // 7. Sort: roadmap order first, then lowest confidence (weak areas first), then most unlocks
  scored.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    if (a.confidence !== b.confidence) return a.confidence - b.confidence
    return b.unlocks.length - a.unlocks.length
  })

  return scored.slice(0, limit)
}

// ─── CONCEPT MASTERY SUMMARY ───

export async function getConceptMasterySummary(userId: string) {
  const allConcepts = await prisma.node.findMany({ where: { type: "concept" } })

  const results: ConfidenceResult[] = []
  for (const concept of allConcepts) {
    const confidence = await calculateConceptConfidence(userId, concept.id)
    results.push({
      conceptId: concept.id,
      conceptSlug: concept.slug,
      conceptName: concept.name,
      confidence,
    })
  }

  const weakAreas = results.filter((r) => r.confidence < 40)
  const inProgress = results.filter((r) => r.confidence >= 40 && r.confidence < 70)
  const mastered = results.filter((r) => r.confidence >= 70)
  const averageConfidence = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length)
    : 0

  return {
    all: results,
    weakAreas,
    inProgress,
    mastered,
    averageConfidence,
    totalConcepts: results.length,
    weakCount: weakAreas.length,
    inProgressCount: inProgress.length,
    masteredCount: mastered.length,
  }
}
