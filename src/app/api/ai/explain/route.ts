import { NextResponse } from "next/server"
import { handleChatMessage } from "@/lib/ai/tutor"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { conceptSlug, lessonSlug, level } = body

    if (!conceptSlug && !lessonSlug) {
      return NextResponse.json({ error: "conceptSlug or lessonSlug required" }, { status: 400 })
    }

    const message = level
      ? `Explain ${conceptSlug || lessonSlug} at a ${level} level.`
      : `Explain ${conceptSlug || lessonSlug}.`

    const { fullResponse } = await handleChatMessage(
      body.userId || "anonymous",
      message,
      undefined,
      { conceptSlug, lessonSlug }
    )

    const result = await fullResponse
    return NextResponse.json(result)
  } catch (error) {
    console.error("AI explain error:", error)
    return NextResponse.json({ error: "Failed to explain" }, { status: 500 })
  }
}
