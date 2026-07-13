"use client"

import { useEffect, useRef } from "react"
import { Terminal as XTerm } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { terminalTheme } from "@/components/terminal/TerminalTheme"
import { useEditorStore } from "@/stores/editorStore"
import { TerminalShell } from "@/lib/editor-core/terminal-shell"
import "@xterm/xterm/css/xterm.css"

function PlaygroundTerminal() {
  const elRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<XTerm | null>(null)
  const shellRef = useRef<TerminalShell | null>(null)
  const bufRef = useRef("")

  useEffect(() => {
    if (!elRef.current || termRef.current) return

    const fit = new FitAddon()
    const term = new XTerm({
      theme: terminalTheme,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', monospace",
      cursorBlink: true,
      cursorStyle: "block",
      cols: 80,
      rows: 10,
    })

    term.loadAddon(fit)
    term.open(elRef.current)
    setTimeout(() => fit.fit(), 50)

    const store = useEditorStore.getState
    const shell = new TerminalShell(
      () => store().workspace,
      (p, c) => store().setFileContent(p, c),
      (p, n, l) => store().createFile(p, n, l),
      (p) => store().deleteFile(p),
    )
    shellRef.current = shell

    term.writeln(`${"\x1b[32m"}Welcome to LupaLearn Terminal${"\x1b[0m"}`)
    term.writeln(`${"\x1b[2m"}Type 'help' for commands. ↑↓ history. Tab complete.${"\x1b[0m"}`)
    writePrompt(term, shell)

    term.onData((data) => {
      const s = shellRef.current!
      const t = termRef.current!
      if (!s || !t) return

      // Ctrl+C
      if (data === "\x03") {
        bufRef.current = ""
        t.write("^C\r\n")
        writePrompt(t, s)
        return
      }

      // Ctrl+L
      if (data === "\x0c") {
        t.clear()
        writePrompt(t, s)
        return
      }

      // Ctrl+U
      if (data === "\x15") {
        clearLine(t, bufRef.current)
        bufRef.current = ""
        return
      }

      // Tab
      if (data === "\t") {
        const result = s.complete(bufRef.current)
        if (!result) return
        if (result.startsWith("--MULTI--")) {
          t.write("\r\n" + result.slice(9) + "\r\n")
          writePrompt(t, s)
          t.write(bufRef.current)
          return
        }
        bufRef.current += result
        t.write(result)
        return
      }

      // Enter
      if (data === "\r") {
        const line = bufRef.current
        t.write("\r\n")
        bufRef.current = ""

        if (line.trim()) {
          const { output, prompt } = s.exec(line)
          if (output === "__CLEAR__") {
            t.clear()
          } else {
            t.write(output)
          }
          if (prompt) writePrompt(t, s)
        } else {
          writePrompt(t, s)
        }
        return
      }

      // Backspace
      if (data === "\x7f") {
        if (bufRef.current.length > 0) {
          bufRef.current = bufRef.current.slice(0, -1)
          t.write("\b \b")
        }
        return
      }

      // Up
      if (data === "\x1b[A") {
        const prev = s.getHistory("up")
        if (prev !== undefined) {
          clearLine(t, bufRef.current)
          bufRef.current = prev
          t.write(prev)
        }
        return
      }

      // Down
      if (data === "\x1b[B") {
        const next = s.getHistory("down")
        clearLine(t, bufRef.current)
        bufRef.current = next ?? ""
        t.write(next ?? "")
        return
      }

      // Printable
      if (data.length === 1 && data.charCodeAt(0) >= 32) {
        bufRef.current += data
        t.write(data)
      }
    })

    termRef.current = term
    const ro = new ResizeObserver(() => fit.fit())
    if (elRef.current) ro.observe(elRef.current)

    return () => {
      ro.disconnect()
      term.dispose()
      termRef.current = null
    }
  }, [])

  return <div ref={elRef} className="h-full w-full" />
}

function writePrompt(term: XTerm, shell: TerminalShell) {
  term.write("\r" + shell.prompt)
}

function clearLine(term: XTerm, current: string) {
  const len = current.length + 10 // prompt length estimate
  term.write("\r" + " ".repeat(len) + "\r")
}

export { PlaygroundTerminal }
