import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import crypto from "crypto"

const SESSION_COOKIE = "lupa_admin_session"
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4 hours (reduced from 8)

function getKey(): Buffer {
  const secret = process.env.ADMIN_SECRET
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SECRET must be at least 32 characters in production")
    }
  }
  return Buffer.from((secret || "dev-secret-min-32-chars-for-dev-only!!").padEnd(32).slice(0, 32))
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv)
  let enc = cipher.update(text, "utf8", "hex")
  enc += cipher.final("hex")
  return iv.toString("hex") + ":" + enc
}

function decrypt(encrypted: string): string | null {
  try {
    const parts = encrypted.split(":")
    if (parts.length !== 2) return null
    const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), Buffer.from(parts[0], "hex"))
    let dec = decipher.update(parts[1], "hex", "utf8")
    dec += decipher.final("utf8")
    return dec
  } catch {
    return null
  }
}

export async function createSession(username: string): Promise<string> {
  return encrypt(JSON.stringify({ username, expiresAt: Date.now() + SESSION_DURATION_MS }))
}

export async function verifySession(token: string): Promise<{ authenticated: boolean; username?: string }> {
  const decrypted = decrypt(token)
  if (!decrypted) return { authenticated: false }
  try {
    const data = JSON.parse(decrypted)
    if (data.expiresAt && data.expiresAt > Date.now()) {
      return { authenticated: true, username: data.username }
    }
    return { authenticated: false }
  } catch {
    return { authenticated: false }
  }
}

export async function getSession(): Promise<{ authenticated: boolean; username?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return { authenticated: false }
    return verifySession(token)
  } catch {
    return { authenticated: false }
  }
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session.authenticated) redirect("/admin/login")
  return session
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/admin",
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function validateCredentials(username: string, password: string): boolean {
  // In production, ADMIN_USERNAME and ADMIN_PASSWORD must be set via environment variables
  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD

  if (process.env.NODE_ENV === "production") {
    // Production: only allow env-var-based auth
    if (!adminUser || !adminPass) return false
    return username === adminUser && password === adminPass
  }

  // Dev: fallback to defaults if not configured
  return username === (adminUser || "admin") && password === (adminPass || "lupalearn2024")
}
