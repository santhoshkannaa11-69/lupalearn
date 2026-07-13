import { NextResponse } from "next/server"
import { handleChatMessage } from "@/lib/ai/tutor"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, sessionId, lessonSlug, conceptSlug, goal, mode } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { response, fullResponse } = await handleChatMessage(
      body.userId || "anonymous",
      message,
      sessionId,
      { lessonSlug, conceptSlug, goal, mode }
    )

    // Collect the full streaming response
    const chunks: string[] = []
    for await (const chunk of response) {
      if (chunk.type === "token") chunks.push(chunk.data as string)
    }

    const result = await fullResponse
    result.markdown = chunks.join("")

    return NextResponse.json(result)
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
