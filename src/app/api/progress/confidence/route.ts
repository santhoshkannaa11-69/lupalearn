import { NextResponse } from "next/server"
import { calculateAllConceptConfidence, calculateConceptConfidence } from "@/lib/confidence"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"
  const conceptSlug = searchParams.get("concept")

  if (conceptSlug) {
    const node = await (await import("@/lib/db")).prisma.node.findUnique({ where: { slug: conceptSlug } })
    if (!node) return NextResponse.json({ error: "Concept not found" }, { status: 404 })
    const confidence = await calculateConceptConfidence(userId, node.id)
    return NextResponse.json({ conceptSlug, confidence })
  }

  const results = await calculateAllConceptConfidence(userId)
  const weakAreas = results.filter((r) => r.confidence < 40)
  const strongAreas = results.filter((r) => r.confidence >= 70)

  return NextResponse.json({
    all: results,
    weakAreas,
    strongAreas,
    averageConfidence: results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length)
      : 0,
  })
}
