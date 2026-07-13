import { NextResponse } from "next/server"
import { runGraphHealthCheck } from "@/lib/knowledge-integrity"
import { prisma } from "@/lib/db"

export async function GET() {
  const [health, lessonCount, nodeCount, edgeCount] = await Promise.all([
    runGraphHealthCheck(),
    prisma.lesson.count(),
    prisma.node.count(),
    prisma.edge.count(),
  ])

  return NextResponse.json({
    health,
    stats: { lessons: lessonCount, nodes: nodeCount, edges: edgeCount },
  })
}
