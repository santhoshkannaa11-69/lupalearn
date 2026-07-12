import { prisma } from "./db"
import { calculateConceptConfidence } from "./confidence"

type NodeBasic = {
  id: string
  slug: string
  name: string
  type: string
  description: string | null
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

type ConfidenceResult = {
  conceptId: string
  conceptSlug: string
  conceptName: string
  confidence: number
}

export async function getPrerequisites(conceptSlug: string): Promise<NodeBasic[]> {
  const concept = await prisma.node.findUnique({ where: { slug: conceptSlug } })
  if (!concept) return []
  const prereqEdges = await prisma.edge.findMany({
    where: { sourceId: concept.id, relationType: "requires" },
    include: { target: true },
  })
  return prereqEdges.map((e) => e.target as NodeBasic)
}

export async function getDependents(conceptSlug: string): Promise<NodeBasic[]> {
  const concept = await prisma.node.findUnique({ where: { slug: conceptSlug } })
  if (!concept) return []
  const depEdges = await prisma.edge.findMany({
    where: { targetId: concept.id, relationType: "requires" },
    include: { source: true },
  })
  return depEdges.map((e) => e.source as NodeBasic)
}

export async function getNextSteps(userId: string, goal?: string, limit: number = 5): Promise<NextStep[]> {
  const allConcepts = await prisma.node.findMany({ where: { type: "concept" } })

  const confidenceMap = new Map<string, number>()
  for (const concept of allConcepts) {
    const conf = await calculateConceptConfidence(userId, concept.id)
    confidenceMap.set(concept.slug, conf)
  }

  const mastered = new Set(allConcepts.filter((c) => (confidenceMap.get(c.slug) || 0) >= 70).map((c) => c.slug))

  let goalOrder = new Map<string, number>()
  if (goal) {
    const { generateRoadmap } = await import("./roadmap")
    const roadmap = await generateRoadmap(goal)
    roadmap.steps.forEach((s, i) => goalOrder.set(s.node.slug, i + 1))
  }

  const frontier: { concept: NodeBasic; prereqsMet: string[] }[] = []
  for (const concept of allConcepts) {
    if (mastered.has(concept.slug)) continue
    const prereqs = await getPrerequisites(concept.slug)
    const prereqSlugs = prereqs.map((p) => p.slug)
    if (prereqSlugs.length === 0) {
      frontier.push({ concept: concept as NodeBasic, prereqsMet: [] })
    } else {
      const met = prereqSlugs.filter((p) => mastered.has(p))
      if (met.length === prereqSlugs.length)
        frontier.push({ concept: concept as NodeBasic, prereqsMet: met })
    }
  }

  const scored: NextStep[] = await Promise.all(
    frontier.map(async (f) => {
      const conf = confidenceMap.get(f.concept.slug) || 0
      const roadmapOrder = goalOrder.get(f.concept.slug) || 999
      const teachingEdges = await prisma.edge.findMany({
        where: { targetId: f.concept.id, relationType: "teaches", source: { type: "lesson" } },
        include: { source: true },
      })
      const lessonSlugs = teachingEdges.map((e) => e.source.slug.replace("lesson-", ""))
      const deps = await getDependents(f.concept.slug)
      let reason = ""
      if (conf > 0 && conf < 70) reason = `In progress (${conf}% confident). Keep going to solidify.`
      else if (roadmapOrder < 999) reason = `Next step in your ${goal || "learning"} path.`
      else reason = `Unlocks ${deps.length} concept${deps.length !== 1 ? "s" : ""}: ${deps.slice(0, 3).map((d) => d.name).join(", ")}${deps.length > 3 ? "..." : ""}`
      return { concept: f.concept, reason, unlocks: deps.map((d) => d.slug), confidence: conf, order: roadmapOrder, lessonsCount: lessonSlugs.length, lessonSlugs }
    })
  )

  scored.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    if (a.confidence !== b.confidence) return a.confidence - b.confidence
    return b.unlocks.length - a.unlocks.length
  })

  return scored.slice(0, limit)
}

export async function getConceptMasterySummary(userId: string) {
  const allConcepts = await prisma.node.findMany({ where: { type: "concept" } })
  const results: ConfidenceResult[] = []
  for (const concept of allConcepts) {
    const confidence = await calculateConceptConfidence(userId, concept.id)
    results.push({ conceptId: concept.id, conceptSlug: concept.slug, conceptName: concept.name, confidence })
  }
  return {
    all: results,
    weakAreas: results.filter((r) => r.confidence < 40),
    inProgress: results.filter((r) => r.confidence >= 40 && r.confidence < 70),
    mastered: results.filter((r) => r.confidence >= 70),
    averageConfidence: results.length > 0 ? Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length) : 0,
    totalConcepts: results.length,
    weakCount: results.filter((r) => r.confidence < 40).length,
    inProgressCount: results.filter((r) => r.confidence >= 40 && r.confidence < 70).length,
    masteredCount: results.filter((r) => r.confidence >= 70).length,
  }
}
