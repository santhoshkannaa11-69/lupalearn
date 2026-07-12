import { prisma } from "./db"

type NodeBasic = {
  id: string
  slug: string
  name: string
  type: string
  description: string | null
}

export type RoadmapStep = {
  node: NodeBasic
  order: number
  prerequisites: NodeBasic[]
  lessonsCount: number
  lessonSlugs: string[]
}

export type GeneratedRoadmap = {
  goal: string
  steps: RoadmapStep[]
  estimatedHours: number
  difficulty: string
}

// Knowledge graph goal → concept mapping
const GOAL_MAP: Record<string, string[]> = {
  "backend-developer": ["http", "rest-apis", "databases", "sql", "git", "linux", "variables", "functions", "oop"],
  "frontend-developer": ["javascript", "react", "git", "http", "rest-apis", "variables", "functions", "closures", "async-programming"],
  "fullstack-developer": ["javascript", "typescript", "react", "nodejs", "databases", "sql", "git", "http", "rest-apis", "variables", "functions"],
  "data-scientist": ["python", "databases", "sql", "statistics", "algorithms", "functions", "variables"],
  "devops-engineer": ["linux", "docker", "git", "http", "networking", "cloud", "ci-cd"],
  "mobile-developer": ["javascript", "react", "oop", "variables", "functions", "git", "rest-apis"],
  "ai-engineer": ["python", "variables", "functions", "oop", "databases", "sql", "algorithms", "async-programming"],
  "python-developer": ["python", "variables", "data-types", "control-flow", "loops", "functions", "oop", "git"],
  "rust-developer": ["rust", "variables", "data-types", "control-flow", "functions", "memory-management", "pointers", "git"],
  "javascript-developer": ["javascript", "variables", "data-types", "functions", "closures", "async-programming", "oop", "git"],
}

const GOAL_ALIASES: Record<string, string> = {
  "backend": "backend-developer",
  "back end": "backend-developer",
  "back-end": "backend-developer",
  "frontend": "frontend-developer",
  "front end": "frontend-developer",
  "front-end": "frontend-developer",
  "full stack": "fullstack-developer",
  "fullstack": "fullstack-developer",
  "data science": "data-scientist",
  "data scientist": "data-scientist",
  "devops": "devops-engineer",
  "mobile": "mobile-developer",
  "ai": "ai-engineer",
  "artificial intelligence": "ai-engineer",
  "machine learning": "ai-engineer",
  "python": "python-developer",
  "rust": "rust-developer",
  "javascript": "javascript-developer",
  "js": "javascript-developer",
}

export async function generateRoadmap(goal: string): Promise<GeneratedRoadmap> {
  // Normalize the goal
  const normalized = goal.toLowerCase().trim()
  const goalKey = GOAL_ALIASES[normalized] || normalized.replace(/\s+/g, "-")

  // Find target concept slugs from the goal map
  let targetSlugs = GOAL_MAP[goalKey]
  if (!targetSlugs) {
    // Try a fuzzy match — search nodes by name
    const matchingNodes = await prisma.node.findMany({
      where: {
        name: { contains: normalized },
        type: { in: ["concept", "technology", "language", "framework", "tool"] },
      },
      take: 5,
    })
    if (matchingNodes.length > 0) {
      targetSlugs = matchingNodes.map((n) => n.slug)
    } else {
      // Fallback to a default beginner path
      targetSlugs = ["variables", "data-types", "control-flow", "loops", "functions", "arrays", "git"]
    }
  }

  // Get all target nodes
  const targetNodes = await prisma.node.findMany({
    where: { slug: { in: targetSlugs } },
  })

  if (targetNodes.length === 0) {
    return { goal, steps: [], estimatedHours: 0, difficulty: "beginner" }
  }

  const nodeMap = new Map(targetNodes.map((n) => [n.slug, n as NodeBasic]))

  // BFS to collect all prerequisites
  const visited = new Set<string>()
  const allNodes: NodeBasic[] = []
  const queue = [...targetSlugs]

  while (queue.length > 0) {
    const slug = queue.shift()!
    if (visited.has(slug)) continue
    visited.add(slug)

    const node = nodeMap.get(slug)
    if (node) allNodes.push(node)

    // Convention: edge [dependent, prerequisite, "requires"]
    // source = dependent, target = prerequisite
    // For concept X, find edges where sourceId = X.id to get its prerequisites
    const prereqs = await prisma.edge.findMany({
      where: {
        sourceId: nodeMap.get(slug)?.id || "",
        relationType: "requires",
      },
      include: { target: true },
    })

    for (const edge of prereqs) {
      if (!visited.has(edge.target.slug)) {
        if (!nodeMap.has(edge.target.slug)) {
          nodeMap.set(edge.target.slug, edge.target as NodeBasic)
        }
        queue.push(edge.target.slug)
      }
    }
  }

  // Topological sort based on prerequisites
  const sorted: NodeBasic[] = []
  const tempMarked = new Set<string>()

  function visit(nodeSlug: string) {
    if (tempMarked.has(nodeSlug)) return
    tempMarked.add(nodeSlug)

    const node = nodeMap.get(nodeSlug)
    if (!node) return

    sorted.push(node)
  }

  // Process target concepts first, then prerequisites naturally
  for (const slug of targetSlugs) {
    visit(slug)
  }

  // Remove duplicates while preserving order
  const seen = new Set<string>()
  const deduped = sorted.filter((n) => {
    if (seen.has(n.slug)) return false
    seen.add(n.slug)
    return true
  })

  // Count lessons for each concept
  const steps: RoadmapStep[] = []
  for (let i = 0; i < deduped.length; i++) {
    const node = deduped[i]

    // Convention: edge [dependent, prerequisite, "requires"]
    // source = dependent, target = prerequisite
    // So for concept X, find edges where sourceId = X.id → target is the prerequisite
    const prereqEdges = await prisma.edge.findMany({
      where: {
        sourceId: node.id,
        relationType: "requires",
      },
      include: { target: true },
    })

    // Find lessons that teach this concept via the edge table
    const teachingEdges = await prisma.edge.findMany({
      where: {
        targetId: node.id,
        relationType: "teaches",
        source: { type: "lesson" },
      },
      include: { source: true },
    })
    const lessonsCount = teachingEdges.length
    const lessonSlugs = teachingEdges.map((e) => e.source.slug.replace("lesson-", ""))

    steps.push({
      node,
      order: i + 1,
      prerequisites: prereqEdges.map((e) => e.target as NodeBasic),
      lessonsCount,
      lessonSlugs,
    })
  }

  const estimatedHours = steps.length * 2 // rough estimate: 2 hours per concept
  const difficulty = steps.length > 12 ? "advanced" : steps.length > 6 ? "intermediate" : "beginner"

  return { goal, steps, estimatedHours, difficulty }
}

export async function getPrebuiltRoadmaps() {
  return prisma.roadmap.findMany({
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: { node: true },
      },
    },
  })
}

export async function getUserRoadmaps(userId: string) {
  return prisma.userLearningPath.findMany({
    where: { userId },
    include: {
      progress: {
        include: { node: true },
      },
    },
    orderBy: { startedAt: "desc" },
  })
}
