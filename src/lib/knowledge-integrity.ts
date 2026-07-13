import { prisma } from "./db"

export type GraphHealthCheck = {
  name: string
  status: "pass" | "fail" | "warn"
  message: string
  count?: number
  items?: Array<{ name: string; slug: string; details?: string }>
}

export type GraphHealthReport = {
  score: number
  checks: GraphHealthCheck[]
  timestamp: number
}

export async function runGraphHealthCheck(): Promise<GraphHealthReport> {
  const checks: GraphHealthCheck[] = []

  // 1. Orphan concepts — concepts with no teaching edges from lessons
  const allConcepts = await prisma.node.findMany({ where: { type: "concept" } })
  const orphanConcepts: Array<{ name: string; slug: string }> = []
  for (const concept of allConcepts) {
    const teachesCount = await prisma.edge.count({
      where: { targetId: concept.id, relationType: "teaches", source: { type: "lesson" } },
    })
    if (teachesCount === 0) orphanConcepts.push({ name: concept.name, slug: concept.slug })
  }
  checks.push({
    name: "Orphan Concepts",
    status: orphanConcepts.length === 0 ? "pass" : "fail",
    message: orphanConcepts.length === 0
      ? "All concepts have at least one lesson"
      : `${orphanConcepts.length} concept(s) have no linked lessons`,
    count: orphanConcepts.length,
    items: orphanConcepts.slice(0, 20),
  })

  // 2. Orphan lessons — lessons not linked to any concept
  const allLessons = await prisma.lesson.findMany()
  const orphanLessons: Array<{ name: string; slug: string }> = []
  for (const lesson of allLessons) {
    const lessonNode = await prisma.node.findUnique({ where: { slug: `lesson-${lesson.slug}` } })
    if (lessonNode) {
      const teachesCount = await prisma.edge.count({
        where: { sourceId: lessonNode.id, relationType: "teaches" },
      })
      if (teachesCount === 0) orphanLessons.push({ name: lesson.title, slug: lesson.slug })
    }
  }
  checks.push({
    name: "Orphan Lessons",
    status: orphanLessons.length === 0 ? "pass" : "warn",
    message: orphanLessons.length === 0
      ? "All lessons teach at least one concept"
      : `${orphanLessons.length} lesson(s) are not linked to any concept`,
    count: orphanLessons.length,
    items: orphanLessons.slice(0, 20),
  })

  // 3. Cyclic prerequisites — detect cycles in the requires edge graph
  const allNodes = await prisma.node.findMany({ where: { type: "concept" } })
  const nodeIds = new Set(allNodes.map((n) => n.id))
  const edges = await prisma.edge.findMany({
    where: { relationType: "requires" },
    select: { sourceId: true, targetId: true },
  })
  const adj = new Map<string, string[]>()
  for (const e of edges) {
    if (nodeIds.has(e.sourceId) && nodeIds.has(e.targetId)) {
      if (!adj.has(e.sourceId)) adj.set(e.sourceId, [])
      adj.get(e.sourceId)!.push(e.targetId)
    }
  }

  let cycleCount = 0
  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(u: string): boolean {
    visited.add(u)
    inStack.add(u)
    const neighbors = adj.get(u) || []
    for (const v of neighbors) {
      if (inStack.has(v)) { cycleCount++; return true }
      if (!visited.has(v) && dfs(v)) { cycleCount++; return true }
    }
    inStack.delete(u)
    return false
  }

  for (const id of allNodes.map((n) => n.id)) {
    if (!visited.has(id)) dfs(id)
  }

  checks.push({
    name: "Cyclic Prerequisites",
    status: cycleCount === 0 ? "pass" : "fail",
    message: cycleCount === 0
      ? "No cycles detected in prerequisite graph"
      : `${cycleCount} cycle(s) detected in prerequisite graph`,
    count: cycleCount,
  })

  // 4. Broken edges — edges pointing to deleted nodes
  const deletedSource = edges.filter((e) => !nodeIds.has(e.sourceId))
  const deletedTarget = edges.filter((e) => !nodeIds.has(e.targetId))
  const totalBroken = deletedSource.length + deletedTarget.length
  checks.push({
    name: "Broken Edges",
    status: totalBroken === 0 ? "pass" : "fail",
    message: totalBroken === 0
      ? "All edges connect to valid nodes"
      : `${totalBroken} edge(s) point to deleted nodes`,
    count: totalBroken,
  })

  // 5. Missing prerequisites — concepts with no prerequisite chain
  const noPrereqs = allConcepts.filter((c) => {
    return !edges.some((e) => e.targetId === c.id) && !edges.some((e) => e.sourceId === c.id)
  })
  checks.push({
    name: "Isolated Concepts",
    status: noPrereqs.length <= 3 ? "warn" : "fail",
    message: `${noPrereqs.length} concept(s) have no prerequisite relationships`,
    count: noPrereqs.length,
    items: noPrereqs.slice(0, 10).map((c) => ({ name: c.name, slug: c.slug })),
  })

  // 6. Duplicate concept names
  const nameCounts = new Map<string, number>()
  for (const c of allConcepts) {
    const lower = c.name.toLowerCase()
    nameCounts.set(lower, (nameCounts.get(lower) || 0) + 1)
  }
  const duplicates = Array.from(nameCounts.entries()).filter(([, count]) => count > 1)
  checks.push({
    name: "Duplicate Concepts",
    status: duplicates.length === 0 ? "pass" : "warn",
    message: duplicates.length === 0 ? "No duplicate concept names" : `${duplicates.length} duplicate concept name(s) found`,
    count: duplicates.length,
    items: duplicates.map(([name]) => ({ name, slug: name.replace(/\s+/g, "-") })),
  })

  // 7. Concepts with no incoming or outgoing edges at all
  const allEdgeNodeIds = new Set<string>()
  for (const e of edges) { allEdgeNodeIds.add(e.sourceId); allEdgeNodeIds.add(e.targetId) }
  const isolated = allConcepts.filter((c) => !allEdgeNodeIds.has(c.id))
  checks.push({
    name: "Dead-End Concepts",
    status: isolated.length === 0 ? "pass" : "warn",
    message: isolated.length === 0
      ? "All concepts are connected"
      : `${isolated.length} concept(s) have no relationships at all`,
    count: isolated.length,
    items: isolated.slice(0, 10).map((c) => ({ name: c.name, slug: c.slug })),
  })

  // Calculate score
  const passCount = checks.filter((c) => c.status === "pass").length
  const totalChecks = checks.length
  const score = Math.round((passCount / totalChecks) * 100)

  return { score, checks, timestamp: Date.now() }
}

export async function getPublishSafety(lessonSlug: string): Promise<{ safe: boolean; issues: string[] }> {
  const issues: string[] = []
  const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } })
  if (!lesson) return { safe: false, issues: ["Lesson not found"] }

  if (!lesson.contentPath) issues.push("No content path set")
  if (!lesson.duration) issues.push("No estimated duration set")
  if (!lesson.xpReward) issues.push("No XP reward set")
  if (!lesson.difficulty) issues.push("No difficulty level set")

  const lessonNode = await prisma.node.findUnique({ where: { slug: `lesson-${lessonSlug}` } })
  if (!lessonNode) {
    issues.push("No lesson node in knowledge graph")
  } else {
    const teachesCount = await prisma.edge.count({
      where: { sourceId: lessonNode.id, relationType: "teaches" },
    })
    if (teachesCount === 0) issues.push("Lesson not linked to any concept")
  }

  return { safe: issues.length === 0, issues }
}

export async function getImpactAnalysis(nodeSlug: string): Promise<{
  nodeName: string
  lessons: number
  quizzes: number
  projects: number
  concepts: number
  roadmaps: number
  edges: number
  details: string[]
}> {
  const node = await prisma.node.findUnique({ where: { slug: nodeSlug } })
  if (!node) return { nodeName: nodeSlug, lessons: 0, quizzes: 0, projects: 0, concepts: 0, roadmaps: 0, edges: 0, details: ["Node not found"] }

  const allEdges = await prisma.edge.findMany({
    where: { OR: [{ sourceId: node.id }, { targetId: node.id }] },
    include: { source: true, target: true },
  })
  const edges = allEdges.length

  const lessons = await prisma.lesson.count({
    where: { slug: { in: (await prisma.edge.findMany({
      where: { targetId: node.id, relationType: "teaches", source: { type: "lesson" } },
      select: { source: { select: { slug: true } } },
    })).map((e) => e.source.slug.replace("lesson-", "")) } },
  })

  const roadmaps = await prisma.roadmapStep.count({ where: { nodeId: node.id } })
  const details = allEdges.map((e) => `${e.source.name} --[${e.relationType}]--> ${e.target.name}`).slice(0, 50)

  return {
    nodeName: node.name,
    lessons,
    quizzes: 0,
    projects: 0,
    concepts: allEdges.filter((e) => e.source.type === "concept" || e.target.type === "concept").length,
    roadmaps,
    edges,
    details,
  }
}

export async function createGraphRevision(author: string, summary: string, changes: string[]) {
  return prisma.graphRevision?.create({
    data: { author, summary, changes: JSON.stringify(changes), createdAt: new Date() },
  })
}
