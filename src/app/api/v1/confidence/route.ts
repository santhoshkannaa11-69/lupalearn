import { NextResponse } from "next/server"
import { getConceptMasterySummary } from "@/lib/progression"
import { calculateConceptConfidence } from "@/lib/confidence"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"
  const conceptSlug = searchParams.get("concept")
  if (conceptSlug) {
    const node = await prisma.node.findUnique({ where: { slug: conceptSlug } })
    if (!node) return NextResponse.json({ error: "Concept not found" }, { status: 404 })
    const confidence = await calculateConceptConfidence(userId, node.id)
    return NextResponse.json({ conceptSlug, confidence })
  }
  const summary = await getConceptMasterySummary(userId)
  return NextResponse.json(summary)
}
