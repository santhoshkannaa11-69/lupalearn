import { NextResponse } from "next/server"
import { getRecommendations, getRelatedContent } from "@/lib/recommendations"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"
  const goal = searchParams.get("goal") || undefined
  const nodeSlug = searchParams.get("node")

  // If a specific node is requested, return related content
  if (nodeSlug) {
    const content = await getRelatedContent(nodeSlug)
    return NextResponse.json(content)
  }

  // Otherwise return full recommendations
  const recommendations = await getRecommendations(userId, goal)
  return NextResponse.json({ categories: recommendations })
}
