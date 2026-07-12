import { prisma } from "./db"
import type { LessonVersion } from "@prisma/client"

export type { LessonVersion }
export type VersionStatus = "draft" | "review" | "published" | "archived"

export async function createDraft(lessonId: string, contentPath: string, changelog?: string): Promise<LessonVersion> {
  const latest = await prisma.lessonVersion.findFirst({ where: { lessonId }, orderBy: { version: "desc" } })
  const version = (latest?.version || 0) + 1
  return prisma.lessonVersion.create({ data: { lessonId, version, contentPath, status: "draft", changelog: changelog || null } })
}

export async function publishVersion(versionId: string): Promise<LessonVersion> {
  const version = await prisma.lessonVersion.findUnique({ where: { id: versionId } })
  if (!version) throw new Error("Version not found")
  if (version.status !== "draft" && version.status !== "review") throw new Error(`Cannot publish version with status "${version.status}"`)
  await prisma.lessonVersion.updateMany({ where: { lessonId: version.lessonId, status: "published" }, data: { status: "archived" } })
  const updated = await prisma.lessonVersion.update({ where: { id: versionId }, data: { status: "published" } })
  await prisma.lesson.update({ where: { id: version.lessonId }, data: { contentPath: version.contentPath } })
  return updated
}

export async function submitForReview(versionId: string): Promise<LessonVersion> {
  return prisma.lessonVersion.update({ where: { id: versionId }, data: { status: "review" } })
}

export async function archiveVersion(versionId: string): Promise<LessonVersion> {
  return prisma.lessonVersion.update({ where: { id: versionId }, data: { status: "archived" } })
}

export async function rollbackToVersion(lessonId: string, targetVersion: number): Promise<LessonVersion> {
  const target = await prisma.lessonVersion.findFirst({ where: { lessonId, version: targetVersion, status: "published" } })
  if (!target) throw new Error(`Published version ${targetVersion} not found`)
  await prisma.lessonVersion.updateMany({ where: { lessonId, status: "published" }, data: { status: "archived" } })
  const updated = await prisma.lessonVersion.update({ where: { id: target.id }, data: { status: "published" } })
  await prisma.lesson.update({ where: { id: lessonId }, data: { contentPath: target.contentPath } })
  return updated
}

export async function getLessonVersions(lessonId: string): Promise<LessonVersion[]> {
  return prisma.lessonVersion.findMany({ where: { lessonId }, orderBy: { version: "desc" } })
}

export async function getPublishedVersion(lessonId: string): Promise<LessonVersion | null> {
  return prisma.lessonVersion.findFirst({ where: { lessonId, status: "published" }, orderBy: { version: "desc" } })
}
