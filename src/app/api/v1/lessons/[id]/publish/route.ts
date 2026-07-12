import { NextResponse } from "next/server"
import { publishVersion } from "@/lib/versioning"
import { prisma } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const versionId = body.versionId

  if (!versionId) {
    return NextResponse.json({ error: "versionId is required" }, { status: 400 })
  }

  try {
    const version = await publishVersion(versionId)
    return NextResponse.json({ version })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to publish"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
