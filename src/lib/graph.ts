import { prisma } from "./db"

export async function getConceptBySlug(slug: string) {
  return prisma.node.findUnique({
    where: { slug },
    include: {
      incomingEdges: {
        include: { source: true },
      },
      outgoingEdges: {
        include: { target: true },
      },
    },
  })
}

export async function getAllConcepts() {
  return prisma.node.findMany({
    where: { type: "concept" },
    orderBy: { name: "asc" },
  })
}

export async function getAllNodes() {
  return prisma.node.findMany({
    orderBy: { name: "asc" },
  })
}

export async function searchNodes(query: string) {
  return prisma.node.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { slug: { contains: query } },
      ],
    },
    orderBy: { name: "asc" },
    take: 20,
  })
}

export async function getLessonsForConcept(conceptSlug: string) {
  const concept = await prisma.node.findUnique({
    where: { slug: conceptSlug },
    include: {
      incomingEdges: {
        where: { relationType: "teaches" },
        include: { source: true },
      },
    },
  })

  if (!concept) return []

  const lessonNodeSlugs = concept.incomingEdges
    .filter((e) => e.source.type === "lesson")
    .map((e) => e.source.slug.replace("lesson-", ""))

  if (lessonNodeSlugs.length === 0) return []

  return prisma.lesson.findMany({
    where: { slug: { in: lessonNodeSlugs } },
    orderBy: { order: "asc" },
  })
}

export async function getPrerequisites(conceptSlug: string) {
  const concept = await prisma.node.findUnique({
    where: { slug: conceptSlug },
    include: {
      outgoingEdges: {
        where: { relationType: "requires" },
        include: { target: true },
      },
    },
  })

  return concept?.outgoingEdges.map((e) => e.target) ?? []
}

export async function getRelatedConcepts(conceptSlug: string) {
  const concept = await prisma.node.findUnique({
    where: { slug: conceptSlug },
    include: {
      outgoingEdges: {
        where: { relationType: "related_to" },
        include: { target: true },
      },
      incomingEdges: {
        where: { relationType: "related_to" },
        include: { source: true },
      },
    },
  })

  if (!concept) return []

  const related = [
    ...concept.outgoingEdges.map((e) => e.target),
    ...concept.incomingEdges.map((e) => e.source),
  ]
  return related
}

export async function getRoadmapBySlug(slug: string) {
  return prisma.roadmap.findUnique({
    where: { slug },
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: { node: true },
      },
    },
  })
}

export async function getAllRoadmaps() {
  return prisma.roadmap.findMany({
    orderBy: { title: "asc" },
  })
}

export async function getLessonBySlug(slug: string) {
  return prisma.lesson.findUnique({
    where: { slug },
    include: {
      module: {
        include: {
          category: {
            include: {
              volume: true,
            },
          },
        },
      },
    },
  })
}

export async function getAllLessons() {
  return prisma.lesson.findMany({
    orderBy: { order: "asc" },
    take: 50,
  })
}

export async function getConceptsForLesson(lessonSlug: string) {
  const lessonNode = await prisma.node.findUnique({
    where: { slug: `lesson-${lessonSlug}` },
    include: {
      outgoingEdges: {
        where: { relationType: "teaches" },
        select: {
          target: {
            select: { id: true, slug: true, name: true, type: true, description: true },
          },
        },
      },
    },
  })

  return (lessonNode?.outgoingEdges.map((e) => ({
    id: e.target.id,
    slug: e.target.slug,
    name: e.target.name,
    type: e.target.type,
    description: e.target.description,
  })) ?? [])
}
