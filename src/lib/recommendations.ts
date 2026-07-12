import { prisma } from "./db"
import { getNextSteps, getConceptMasterySummary } from "./progression"

type Recommendation = {
  type: "continue-learning" | "review-again" | "trending"
  title: string
  description: string
  reason: string
  href: string
  priority: number
}

export async function getTrendingConcepts() {
  const trending = await prisma.node.findMany({
    where: { type: { in: ["concept", "language", "framework", "tool"] } },
    include: { incomingEdges: true, outgoingEdges: true },
    orderBy: { incomingEdges: { _count: "desc" } },
    take: 8,
  })
  return trending.map((n) => ({
    id: n.id, slug: n.slug, name: n.name, type: n.type,
    description: n.description, connectionCount: n.incomingEdges.length + n.outgoingEdges.length,
  }))
}

export async function getRelatedContent(nodeSlug: string) {
  const node = await prisma.node.findUnique({
    where: { slug: nodeSlug },
    include: { outgoingEdges: { include: { target: true } }, incomingEdges: { include: { source: true } } },
  })
  if (!node) return { relatedNodes: [], relatedLessons: [] }
  const ids = new Set<string>()
  const nodes: Array<{ id: string; slug: string; name: string; type: string; description: string | null }> = []
  for (const e of node.outgoingEdges) { if (!ids.has(e.target.id)) { ids.add(e.target.id); nodes.push(e.target) } }
  for (const e of node.incomingEdges) { if (!ids.has(e.source.id)) { ids.add(e.source.id); nodes.push(e.source) } }
  const lessonSlugs = nodes.filter((n) => n.type === "lesson").map((n) => n.slug.replace("lesson-", ""))
  const lessons = lessonSlugs.length > 0 ? await prisma.lesson.findMany({ where: { slug: { in: lessonSlugs } }, take: 5 }) : []
  return { relatedNodes: nodes, relatedLessons: lessons }
}

export async function getRecommendations(userId: string, goal?: string): Promise<Record<string, Recommendation[]>> {
  const categories: Record<string, Recommendation[]> = {}

  const nextSteps = await getNextSteps(userId, goal, 3)
  categories["continue-learning"] = nextSteps.map((s, i) => ({
    type: "continue-learning" as const, title: s.concept.name,
    description: s.concept.description || `Step ${s.order} in your learning path`,
    reason: s.reason,
    href: s.lessonSlugs[0] ? `/learn/computer-science/programming-fundamentals/${s.lessonSlugs[0]}` : `/explore?q=${s.concept.slug}`,
    priority: i + 1,
  }))

  const summary = await getConceptMasterySummary(userId)
  const weakSorted = summary.weakAreas.sort((a, b) => a.confidence - b.confidence).slice(0, 3)
  categories["review-again"] = weakSorted.map((w, i) => ({
    type: "review-again" as const, title: `Review: ${w.conceptName}`,
    description: `Confidence: ${w.confidence}% — needs practice`,
    reason: "Below mastery threshold. Review to improve retention.",
    href: `/explore?q=${w.conceptSlug}`, priority: i + 1,
  }))

  const trending = await getTrendingConcepts()
  categories["trending"] = trending.slice(0, 3).map((t, i) => ({
    type: "trending" as const, title: t.name,
    description: t.description || `${t.type} with ${t.connectionCount} connections`,
    reason: `Popular topic with ${t.connectionCount} related resources`,
    href: `/explore?q=${t.slug}`, priority: i + 1,
  }))

  return categories
}
