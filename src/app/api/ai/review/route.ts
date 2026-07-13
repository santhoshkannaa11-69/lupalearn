import { NextResponse } from "next/server"
import { handleChatMessage } from "@/lib/ai/tutor"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, language = "javascript", userId = "anonymous" } = body

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const message = `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``

    const { fullResponse } = await handleChatMessage(userId, message, undefined, { mode: "review" })
    const result = await fullResponse

    return NextResponse.json(result)
  } catch (error) {
    console.error("AI review error:", error)
    return NextResponse.json({ error: "Failed to review code" }, { status: 500 })
  }
}
