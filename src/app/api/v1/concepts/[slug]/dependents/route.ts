import { NextResponse } from "next/server"
import { getDependents } from "@/lib/progression"

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const deps = await getDependents(slug)
  return NextResponse.json({ concept: slug, dependents: deps })
}
