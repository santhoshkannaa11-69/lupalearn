import { NextResponse } from "next/server"
import { getWhyLearnThis } from "@/lib/readiness"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const concept = searchParams.get("concept")

  if (!concept) {
    return NextResponse.json({ error: "concept parameter required" }, { status: 400 })
  }

  const unlocks = await getWhyLearnThis(concept)
  return NextResponse.json({ concept, unlocks })
}
