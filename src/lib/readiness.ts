import { prisma } from "./db"
import { calculateConceptConfidence } from "./confidence"
import { getDependents } from "./progression"

export type ReadinessResult = {
  overall: number
  prerequisites: Array<{
    slug: string
    name: string
    confidence: number
    required: boolean
  }>
  missingCount: number
  totalCount: number
  needsReview: boolean
}

export async function getLessonReadiness(userId: string, conceptSlugs: string[]): Promise<ReadinessResult> {
  const prereqs: Array<{ slug: string; name: string; confidence: number; required: boolean }> = []

  for (const slug of conceptSlugs) {
    const concept = await prisma.node.findUnique({ where: { slug } })
    if (!concept) continue

    const prereqEdges = await prisma.edge.findMany({
      where: { sourceId: concept.id, relationType: "requires" },
      include: { target: true },
    })

    for (const edge of prereqEdges) {
      const conf = await calculateConceptConfidence(userId, edge.target.id)
      prereqs.push({
        slug: edge.target.slug,
        name: edge.target.name,
        confidence: conf,
        required: true,
      })
    }
  }

  // Deduplicate by slug
  const seen = new Set<string>()
  const unique = prereqs.filter((p) => {
    if (seen.has(p.slug)) return false
    seen.add(p.slug)
    return true
  })

  const totalCount = unique.length
  const missingCount = unique.filter((p) => p.confidence < 40).length
  const needsReview = missingCount > 0
  const overall = totalCount > 0
    ? Math.round(unique.reduce((s, p) => s + Math.min(p.confidence, 100), 0) / totalCount)
    : 100

  return { overall, prerequisites: unique, missingCount, totalCount, needsReview }
}

export async function getProjectReadiness(userId: string, conceptSlugs: string[]): Promise<ReadinessResult> {
  return getLessonReadiness(userId, conceptSlugs)
}

export async function getWhyLearnThis(conceptSlug: string): Promise<Array<{ slug: string; name: string; domain: string }>> {
  const deps = await getDependents(conceptSlug)
  return deps.map((d) => ({
    slug: d.slug,
    name: d.name,
    domain: d.type === "language" ? "Language" : d.type === "framework" ? "Framework" : "Concept",
  }))
}
