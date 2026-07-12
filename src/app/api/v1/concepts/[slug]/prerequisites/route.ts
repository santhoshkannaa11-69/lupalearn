import { NextResponse } from "next/server"
import { getPrerequisites } from "@/lib/progression"

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const prereqs = await getPrerequisites(slug)
  return NextResponse.json({ concept: slug, prerequisites: prereqs })
}
