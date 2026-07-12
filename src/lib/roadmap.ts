import { prisma } from "./db"
import { createHash } from "crypto"

type NodeBasic = { id: string; slug: string; name: string; type: string; description: string | null }

export type RoadmapStep = { node: NodeBasic; order: number; prerequisites: NodeBasic[]; lessonsCount: number; lessonSlugs: string[] }

export type GeneratedRoadmap = { goal: string; steps: RoadmapStep[]; estimatedHours: number; difficulty: string; constraints: RoadmapConstraints; hash: string }

export type RoadmapConstraints = { timePerDay?: number; difficulty?: "beginner" | "intermediate" | "advanced"; maxSteps?: number; focus?: string[] }

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
  "backend": "backend-developer", "back end": "backend-developer", "back-end": "backend-developer",
  "frontend": "frontend-developer", "front end": "frontend-developer", "front-end": "frontend-developer",
  "full stack": "fullstack-developer", "fullstack": "fullstack-developer",
  "data science": "data-scientist", "data scientist": "data-scientist",
  "devops": "devops-engineer", "mobile": "mobile-developer",
  "ai": "ai-engineer", "artificial intelligence": "ai-engineer", "machine learning": "ai-engineer",
  "python": "python-developer", "rust": "rust-developer", "javascript": "javascript-developer", "js": "javascript-developer",
}

function hashRoadmap(goal: string, constraints: RoadmapConstraints): string {
  return createHash("sha256").update(JSON.stringify({ goal, constraints })).digest("hex").slice(0, 12)
}

export async function generateRoadmap(goal: string, constraints: RoadmapConstraints = {}): Promise<GeneratedRoadmap> {
  const normalized = goal.toLowerCase().trim()
  const goalKey = GOAL_ALIASES[normalized] || normalized.replace(/\s+/g, "-")
  let targetSlugs = GOAL_MAP[goalKey]
  if (!targetSlugs) {
    const matching = await prisma.node.findMany({ where: { name: { contains: normalized }, type: { in: ["concept", "technology", "language", "framework", "tool"] } }, take: 5 })
    targetSlugs = matching.length > 0 ? matching.map((n) => n.slug) : ["variables", "data-types", "control-flow", "loops", "functions", "arrays", "git"]
  }
  if (constraints.focus?.length) targetSlugs = targetSlugs.filter((s) => constraints.focus!.includes(s)) || ["variables", "functions"]

  const targetNodes = await prisma.node.findMany({ where: { slug: { in: targetSlugs } } })
  if (targetNodes.length === 0) return { goal, steps: [], estimatedHours: 0, difficulty: "beginner", constraints, hash: hashRoadmap(goal, constraints) }

  const nodeMap = new Map(targetNodes.map((n) => [n.slug, n as NodeBasic]))
  const visited = new Set<string>()
  const allNodes: NodeBasic[] = []
  const queue = [...targetSlugs]

  while (queue.length > 0) {
    const slug = queue.shift()!
    if (visited.has(slug)) continue
    visited.add(slug)
    const node = nodeMap.get(slug)
    if (node) allNodes.push(node)
    const prereqs = await prisma.edge.findMany({ where: { sourceId: nodeMap.get(slug)?.id || "", relationType: "requires" }, include: { target: true } })
    for (const e of prereqs) {
      if (!visited.has(e.target.slug)) {
        if (!nodeMap.has(e.target.slug)) nodeMap.set(e.target.slug, e.target as NodeBasic)
        queue.push(e.target.slug)
      }
    }
  }

  const sorted: NodeBasic[] = []
  const marked = new Set<string>()
  for (const slug of targetSlugs) { if (!marked.has(slug)) { marked.add(slug); const n = nodeMap.get(slug); if (n) sorted.push(n) } }
  const seen = new Set<string>()
  const deduped = sorted.filter((n) => { if (seen.has(n.slug)) return false; seen.add(n.slug); return true })
  const capped = constraints.maxSteps ? deduped.slice(0, constraints.maxSteps) : deduped

  const steps: RoadmapStep[] = []
  for (let i = 0; i < capped.length; i++) {
    const node = capped[i]
    const prereqEdges = await prisma.edge.findMany({ where: { sourceId: node.id, relationType: "requires" }, include: { target: true } })
    const teachingEdges = await prisma.edge.findMany({ where: { targetId: node.id, relationType: "teaches", source: { type: "lesson" } }, include: { source: true } })
    const lessonSlugs = teachingEdges.map((e) => e.source.slug.replace("lesson-", ""))
    steps.push({ node, order: i + 1, prerequisites: prereqEdges.map((e) => e.target as NodeBasic), lessonsCount: lessonSlugs.length, lessonSlugs })
  }

  const h = constraints.timePerDay ? Math.max(1, Math.round(constraints.timePerDay / 60)) : 2
  return { goal, steps, estimatedHours: steps.length * h, difficulty: steps.length > 12 ? "advanced" : steps.length > 6 ? "intermediate" : "beginner", constraints, hash: hashRoadmap(goal, constraints) }
}

export async function saveGeneratedRoadmap(roadmap: GeneratedRoadmap) {
  return prisma.roadmap.upsert({
    where: { slug: `gen-${roadmap.hash}` },
    update: { title: `Roadmap: ${roadmap.goal}`, description: `Generated roadmap for "${roadmap.goal}" with ${roadmap.steps.length} steps`, type: "ai", goal: roadmap.goal, difficulty: roadmap.difficulty, estimatedHours: roadmap.estimatedHours, metadata: JSON.stringify(roadmap) },
    create: { slug: `gen-${roadmap.hash}`, title: `Roadmap: ${roadmap.goal}`, description: `Generated roadmap for "${roadmap.goal}" with ${roadmap.steps.length} steps`, type: "ai", goal: roadmap.goal, difficulty: roadmap.difficulty, estimatedHours: roadmap.estimatedHours, metadata: JSON.stringify(roadmap) },
  })
}

export async function getCachedRoadmap(hash: string) {
  const r = await prisma.roadmap.findUnique({ where: { slug: `gen-${hash}` } })
  return r?.metadata ? JSON.parse(r.metadata) as GeneratedRoadmap : null
}

export async function getPrebuiltRoadmaps() {
  return prisma.roadmap.findMany({ where: { type: "system" }, include: { steps: { orderBy: { order: "asc" }, include: { node: true } } } })
}
