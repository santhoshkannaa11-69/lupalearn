"use client"

import { useEffect, useRef, useCallback } from "react"
import { Terminal as XTerm } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import { terminalTheme } from "@/components/terminal/TerminalTheme"
import { useEditorStore } from "@/stores/editorStore"
import { TerminalShell } from "@/lib/editor-core/terminal-shell"
import "@xterm/xterm/css/xterm.css"

function PlaygroundTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const shellRef = useRef<TerminalShell | null>(null)
  const inputBuffer = useRef("")
  const commandHistory = useRef<string[]>([])
  const historyIndex = useRef(-1)
  const initialized = useRef(false)

  const setFileContent = useEditorStore((s) => s.setFileContent)
  const createFile = useEditorStore((s) => s.createFile)
  const deleteFile = useEditorStore((s) => s.deleteFile)
  const getWorkspaceFn = useCallback(() => useEditorStore.getState().workspace, [])

  const writeToTerminal = useCallback((text: string) => {
    xtermRef.current?.write(text)
  }, [])

  useEffect(() => {
    if (terminalRef.current && !initialized.current) {
      initialized.current = true
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

      const shell = new TerminalShell(getWorkspaceFn, setFileContent, createFile, deleteFile)
      shell.onWrite = (text) => xterm.write(text)
      shell.onClear = () => xterm.clear()
      shell.onExit = () => {
        xterm.write("\r\n\x1b[33m[Terminal closed. Refresh to restart]\x1b[0m\r\n")
      }
      shellRef.current = shell

      // Welcome message
      xterm.writeln("\x1b[32mWelcome to LupaLearn Terminal v0.1.0\x1b[0m")
      xterm.writeln("\x1b[2mType 'help' for available commands. Up/Down for history. Tab for completion.\x1b[0m")
      xterm.write(shell.prompt)
      inputBuffer.current = ""

      // Key handler
      xterm.onData((data) => {
        const s = shellRef.current
        if (!s) return

        // Ctrl+C — interrupt
        if (data === "\x03") {
          inputBuffer.current = ""
          xterm.write("^C\r\n")
          xterm.write(s.prompt)
          return
        }

        // Tab — completion
        if (data === "\t") {
          const completions = s.getCompletions(inputBuffer.current)
          if (completions.length === 1) {
            inputBuffer.current += completions[0]
            xterm.write(completions[0])
          } else if (completions.length > 1) {
            xterm.write("\r\n")
            completions.forEach((c) => xterm.write(c + "  "))
            xterm.write("\r\n" + s.prompt + inputBuffer.current)
          }
          return
        }

        // Enter
        if (data === "\r") {
          const line = inputBuffer.current
          xterm.write("\r\n")
          if (line.trim()) {
            commandHistory.current.push(line)
            historyIndex.current = commandHistory.current.length
            const result = s.execute(line)
            if (result === "__CLEAR__") {
              xterm.clear()
            } else if (result) {
              xterm.write(result)
            }
          }
          inputBuffer.current = ""
          xterm.write(s.prompt)
          return
        }

        // Backspace
        if (data === "\x7f") {
          if (inputBuffer.current.length > 0) {
            inputBuffer.current = inputBuffer.current.slice(0, -1)
            xterm.write("\b \b")
          }
          return
        }

        // Up arrow — history back
        if (data === "\x1b[A") {
          if (historyIndex.current > 0) {
            historyIndex.current--
            const prev = commandHistory.current[historyIndex.current]
            // Clear current line
            const len = inputBuffer.current.length
            for (let i = 0; i < len; i++) xterm.write("\b \b")
            inputBuffer.current = prev
            xterm.write(prev)
          }
          return
        }

        // Down arrow — history forward
        if (data === "\x1b[B") {
          if (historyIndex.current < commandHistory.current.length - 1) {
            historyIndex.current++
            const next = commandHistory.current[historyIndex.current]
            const len = inputBuffer.current.length
            for (let i = 0; i < len; i++) xterm.write("\b \b")
            inputBuffer.current = next
            xterm.write(next)
          } else {
            historyIndex.current = commandHistory.current.length
            const len = inputBuffer.current.length
            for (let i = 0; i < len; i++) xterm.write("\b \b")
            inputBuffer.current = ""
          }
          return
        }

        // Ctrl+L — clear
        if (data === "\x0c") {
          xterm.clear()
          xterm.write(s.prompt + inputBuffer.current)
          return
        }

        // Ctrl+U — clear line
        if (data === "\x15") {
          const len = inputBuffer.current.length
          for (let i = 0; i < len; i++) xterm.write("\b \b")
          inputBuffer.current = ""
          return
        }

        // Printable characters
        if (data.length === 1 && data.charCodeAt(0) >= 32) {
          inputBuffer.current += data
          xterm.write(data)
        }
      })

      xtermRef.current = xterm

      const ro = new ResizeObserver(() => fitAddon.fit())
      if (terminalRef.current) ro.observe(terminalRef.current)

      return () => {
        ro.disconnect()
        xterm.dispose()
        xtermRef.current = null
        initialized.current = false
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={terminalRef} className="h-full w-full" />
}

export { PlaygroundTerminal }
