import { registerTool } from "./registry"
import { prisma } from "@/lib/db"

registerTool({
  id: "search-lesson",
  name: "Search Lessons",
  description: "Search for lessons by concept or keyword",
  execute: async (args) => {
    const query = (args.query as string) || ""
    if (!query) return { results: [] }

    const nodes = await prisma.node.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
        type: { in: ["concept", "language", "framework", "tool"] },
      },
      take: 5,
    })

    const results = []
    for (const node of nodes) {
      const teachingEdges = await prisma.edge.findMany({
        where: { targetId: node.id, relationType: "teaches", source: { type: "lesson" } },
        include: { source: true },
      })
      for (const edge of teachingEdges) {
        const lessonSlug = edge.source.slug.replace("lesson-", "")
        const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } })
        if (lesson) {
          results.push({
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
            conceptSlug: node.slug,
            conceptName: node.name,
            relevance: teachingEdges.length,
          })
        }
      }
    }

    return { results: results.slice(0, 5) }
  },
})
