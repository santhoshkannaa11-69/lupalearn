import { prisma } from "./db"

export async function getRecommendations(userId?: string) {
  // Get trending concepts (most edges/connections)
  const trending = await prisma.node.findMany({
    where: { type: { in: ["concept", "language", "framework", "tool"] } },
    include: {
      incomingEdges: true,
      outgoingEdges: true,
    },
    orderBy: {
      incomingEdges: { _count: "desc" },
    },
    take: 8,
  })

  const popularConcepts = trending.map((n) => ({
    id: n.id,
    slug: n.slug,
    name: n.name,
    type: n.type,
    description: n.description,
    connectionCount: n.incomingEdges.length + n.outgoingEdges.length,
  }))

  return { popularConcepts }
}

export async function getRelatedContent(nodeSlug: string) {
  const node = await prisma.node.findUnique({
    where: { slug: nodeSlug },
    include: {
      outgoingEdges: {
        include: { target: true },
      },
      incomingEdges: {
        include: { source: true },
      },
    },
  })

  if (!node) return { relatedNodes: [], relatedLessons: [] }

  const relatedNodeIds = new Set<string>()
  const relatedNodes: Array<{ id: string; slug: string; name: string; type: string; description: string | null }> = []

  for (const edge of node.outgoingEdges) {
    if (edge.target.id !== node.id && !relatedNodeIds.has(edge.target.id)) {
      relatedNodeIds.add(edge.target.id)
      relatedNodes.push(edge.target)
    }
  }
  for (const edge of node.incomingEdges) {
    if (edge.source.id !== node.id && !relatedNodeIds.has(edge.source.id)) {
      relatedNodeIds.add(edge.source.id)
      relatedNodes.push(edge.source)
    }
  }

  // Find lessons that teach any of these related concepts
  const relatedLessonNodes = await prisma.node.findMany({
    where: {
      type: "lesson",
      slug: {
        in: relatedNodes.map((n) => `lesson-${n.slug}`),
      },
    },
  })

  const lessonSlugs = relatedLessonNodes.map((n) => n.slug.replace("lesson-", ""))
  const relatedLessons = lessonSlugs.length > 0
    ? await prisma.lesson.findMany({
        where: { slug: { in: lessonSlugs } },
        take: 5,
      })
    : []

  return { relatedNodes, relatedLessons }
}
