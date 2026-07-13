import { prisma } from "@/lib/db"
import { getPrerequisites, getDependents } from "@/lib/progression"

export async function buildKnowledgeContext(conceptSlug?: string) {
  if (!conceptSlug) {
    return { slug: undefined, name: undefined, prerequisites: [], dependents: [] }
  }

  const node = await prisma.node.findUnique({ where: { slug: conceptSlug } })
  const prereqs = await getPrerequisites(conceptSlug)
  const deps = await getDependents(conceptSlug)

  return {
    slug: conceptSlug,
    name: node?.name ?? conceptSlug,
    prerequisites: prereqs.map((p) => ({ slug: p.slug, name: p.name })),
    dependents: deps.map((d) => ({ slug: d.slug, name: d.name })),
  }
}
