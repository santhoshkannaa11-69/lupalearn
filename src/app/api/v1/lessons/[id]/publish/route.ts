import { NextResponse } from "next/server"
import { publishVersion } from "@/lib/versioning"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  if (!body.versionId) return NextResponse.json({ error: "versionId is required" }, { status: 400 })
  try {
    const version = await publishVersion(body.versionId)
    return NextResponse.json({ version })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to publish" }, { status: 400 })
  }
}
