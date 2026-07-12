import { NextResponse } from "next/server"
import { getRecommendations, getRelatedContent } from "@/lib/recommendations"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nodeSlug = searchParams.get("node")

  if (nodeSlug) {
    const content = await getRelatedContent(nodeSlug)
    return NextResponse.json(content)
  }

  const recommendations = await getRecommendations()
  return NextResponse.json(recommendations)
}
