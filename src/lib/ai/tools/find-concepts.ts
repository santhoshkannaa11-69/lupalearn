import { registerTool } from "./registry"
import { prisma } from "@/lib/db"

registerTool({
  id: "find-concepts",
  name: "Find Concepts",
  description: "Find related concepts in the knowledge graph",
  execute: async (args) => {
    const query = (args.query as string) || ""
    if (!query) return { concepts: [] }

    const nodes = await prisma.node.findMany({
      where: {
        name: { contains: query },
        type: { in: ["concept", "language", "framework", "tool"] },
      },
      take: 10,
    })

    return {
      concepts: nodes.map((n) => ({
        slug: n.slug,
        name: n.name,
        type: n.type,
        description: n.description,
      })),
    }
  },
})
