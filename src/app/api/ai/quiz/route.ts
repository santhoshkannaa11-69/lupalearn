import { NextResponse } from "next/server"
import { executeTool } from "@/lib/ai/tools/registry"
import { buildLearningContext } from "@/lib/ai/context/index"
import "@/lib/ai/tools/generate-quiz"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { conceptSlugs, count = 5, userId = "anonymous" } = body

    if (!conceptSlugs || !Array.isArray(conceptSlugs) || conceptSlugs.length === 0) {
      return NextResponse.json({ error: "conceptSlugs array required" }, { status: 400 })
    }

    const ctx = await buildLearningContext({ userId })
    const result = await executeTool("generate-quiz", { concepts: conceptSlugs, count }, ctx)

    return NextResponse.json(result)
  } catch (error) {
    console.error("AI quiz error:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
