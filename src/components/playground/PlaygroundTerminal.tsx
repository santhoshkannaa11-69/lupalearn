"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Terminal as XTerm } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import { terminalTheme } from "@/components/terminal/TerminalTheme"
import { useEditorStore } from "@/stores/editorStore"
import "@xterm/xterm/css/xterm.css"

// Simple local shell simulation
class LocalShell {
  private cwd = "~/project"
  private history: string[] = []
  private historyIdx = -1
  private currentLine = ""

  get prompt() { return `user@lupa:${this.cwd}$` }

  execute(cmd: string): string {
    this.history.push(cmd)
    this.historyIdx = this.history.length

    const parts = cmd.trim().split(/\s+/)
    const command = parts[0]?.toLowerCase()

    switch (command) {
      case "clear": return "__CLEAR__"
      case "echo": return parts.slice(1).join(" ") + "\n"
      case "ls": return "index.js\nstyle.css\nindex.html\n"
      case "pwd": return `/home/user${this.cwd}\n`
      case "date": return new Date().toString() + "\n"
      case "whoami": return "learner\n"
      case "help": return "Available commands: echo, ls, pwd, date, whoami, clear, help, node, python, cat\n"
      case "node":
        const code = parts.slice(1).join(" ")
        if (code) return this.runJS(code)
        return "node: missing arguments\n"
      case "python":
        return "Python runner coming soon\n"
      case "cat":
        if (parts[1]) return `[Content of ${parts[1]}]\n`
        return "cat: missing filename\n"
      default:
        if (cmd.trim()) return `Command not found: ${command}. Try 'help'\n`
        return ""
    }
  }

  private runJS(code: string): string {
    try {
      const result = eval(code)
      return String(result) + "\n"
    } catch (e) {
      return `Error: ${e}\n`
    }
  }
}

function PlaygroundTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const shellRef = useRef(new LocalShell())
  const [ready, setReady] = useState(false)

  const handleData = useCallback((data: string) => {
    const xterm = xtermRef.current
    if (!xterm) return

    // Handle special keys
    if (data === "\r") {
      const line = shellRef.current["currentLine"] || ""
      xterm.write("\r\n")
      if (line) {
        const output = shellRef.current.execute(line)
        if (output === "__CLEAR__") {
          xterm.clear()
        } else {
          xterm.write(output)
        }
      }
      shellRef.current["currentLine"] = ""
      xterm.write(`\r${shellRef.current.prompt} `)
    } else if (data === "\x7f") {
      // Backspace
      const line = shellRef.current["currentLine"] || ""
      if (line.length > 0) {
        shellRef.current["currentLine"] = line.slice(0, -1)
        xterm.write("\b \b")
      }
    } else if (data === "\x1b[A") {
      // Up arrow - history
    } else if (data.length === 1 && data.charCodeAt(0) >= 32) {
      // Printable characters
      shellRef.current["currentLine"] = (shellRef.current["currentLine"] || "") + data
      xterm.write(data)
    }
  }, [])

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    const fitAddon = new FitAddon()
    const xterm = new XTerm({
      theme: terminalTheme,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      cursorBlink: true,
      cursorStyle: "block",
      allowProposedApi: true,
      cols: 80,
      rows: 10,
      disableStdin: false,
    })

    xterm.loadAddon(fitAddon)
    xterm.loadAddon(new WebLinksAddon())
    xterm.open(terminalRef.current)

    setTimeout(() => fitAddon.fit(), 50)

    const shell = shellRef.current
    xterm.write(`Welcome to LupaLearn Playground Terminal\r\n`)
    xterm.write(`Type 'help' for available commands\r\n\r\n`)
    xterm.write(`\r${shell.prompt} `)
    xterm.onData(handleData)

    xtermRef.current = xterm
    setReady(true)

    const ro = new ResizeObserver(() => fitAddon.fit())
    if (terminalRef.current) ro.observe(terminalRef.current)

    return () => {
      ro.disconnect()
      xterm.dispose()
      xtermRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={terminalRef} className="h-full w-full" />
  )
}

export { PlaygroundTerminal }
