import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const [nodes, edges] = await Promise.all([
    prisma.node.findMany({ select: { id: true, slug: true, name: true, type: true } }),
    prisma.edge.findMany({ select: { id: true, sourceId: true, targetId: true, relationType: true } }),
  ])
  return NextResponse.json({ nodes, edges })
}
