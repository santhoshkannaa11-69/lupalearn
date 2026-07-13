import { prisma } from "@/lib/db"

export async function buildRoadmapContext(goal?: string) {
  if (!goal) return { slug: undefined, title: undefined, goal: undefined, steps: [] }

  // Look for system roadmap matching the goal
  const roadmap = await prisma.roadmap.findFirst({
    where: { slug: { contains: goal.toLowerCase().replace(/\s+/g, "-") } },
  })

  if (!roadmap) return { slug: undefined, title: undefined, goal, steps: [] }

  const steps = await prisma.roadmapStep.findMany({
    where: { roadmapId: roadmap.id },
    orderBy: { order: "asc" },
    include: { node: true },
  })

  return {
    slug: roadmap.slug,
    title: roadmap.title,
    goal: roadmap.goal || undefined,
    steps: steps.map((s) => ({
      order: s.order,
      conceptSlug: s.node.slug,
      conceptName: s.node.name,
    })),
  }
}
