import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    // For MVP, we simulate execution
    // Future: actual sandboxed execution via Docker/WASM
    const output = simulateExecution(code, language || "javascript")

    return NextResponse.json({ output })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

function simulateExecution(code: string, _language: string): string {
  try {
    // For JavaScript, use eval in a limited context
    if (_language === "javascript" || _language === "js") {
      const logs: string[] = []
      const mockConsole = {
        log: (...args: unknown[]) => logs.push(args.map((a) => String(a)).join(" ")),
        error: (...args: unknown[]) => logs.push(`Error: ${args.map((a) => String(a)).join(" ")}`),
        warn: (...args: unknown[]) => logs.push(`Warning: ${args.map((a) => String(a)).join(" ")}`),
      }

      const fn = new Function("console", code)
      fn(mockConsole)
      return logs.join("\n") || "Code executed successfully (no output)"
    }

    return `Simulated execution for ${_language}\nOutput will appear here when a runtime is connected.`
  } catch (e) {
    return `Runtime Error: ${e}`
  }
}
