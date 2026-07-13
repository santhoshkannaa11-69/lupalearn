import { NextResponse } from "next/server"
import { validateCredentials, createSession, setSessionCookie, clearSession } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const { username, password, action } = await request.json()

    if (action === "logout") {
      await clearSession()
      return NextResponse.json({ success: true })
    }

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createSession(username)
    await setSessionCookie(token)

    return NextResponse.json({ success: true, username })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
