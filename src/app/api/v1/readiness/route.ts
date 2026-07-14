import { NextResponse } from "next/server"
import { getLessonReadiness, getProjectReadiness } from "@/lib/readiness"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"
  const concepts = searchParams.get("concepts")?.split(",").filter(Boolean) || []
  const type = searchParams.get("type") || "lesson"

  if (concepts.length === 0) {
    return NextResponse.json({ error: "concepts parameter required (comma-separated)" }, { status: 400 })
  }

  const result = type === "project"
    ? await getProjectReadiness(userId, concepts)
    : await getLessonReadiness(userId, concepts)

  return NextResponse.json(result)
}
