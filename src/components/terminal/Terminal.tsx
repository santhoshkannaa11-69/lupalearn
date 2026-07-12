"use client"

import { useEffect, useRef, useCallback } from "react"
import { Terminal as XTerm } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import { terminalTheme } from "./TerminalTheme"
import { cn } from "@/lib/utils"
import "@xterm/xterm/css/xterm.css"

interface TerminalProps {
  className?: string
  initialContent?: string
  readonly?: boolean
  prompt?: string
  onData?: (data: string) => void
  height?: string
}

function Terminal({
  className,
  initialContent,
  readonly = false,
  prompt = "> user@lupa:~$",
  onData,
  height = "300px",
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  const handleData = useCallback(
    (data: string) => {
      if (onData) {
        onData(data)
      }
    },
    [onData]
  )

  useEffect(() => {
    if (!terminalRef.current) return

    const fitAddon = new FitAddon()
    fitAddonRef.current = fitAddon

    const xterm = new XTerm({
      theme: terminalTheme,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      cursorBlink: true,
      cursorStyle: "block",
      allowProposedApi: true,
      disableStdin: readonly,
      cols: 80,
      rows: 15,
    })

    xterm.loadAddon(fitAddon)
    xterm.loadAddon(new WebLinksAddon())
    xterm.open(terminalRef.current)

    // Wait for terminal to be mounted before fitting
    setTimeout(() => {
      fitAddon.fit()
    }, 50)

    if (initialContent) {
      xterm.writeln(initialContent)
    }

    if (!readonly) {
      xterm.write(`${prompt} `)
      xterm.onData(handleData)
    }

    xtermRef.current = xterm

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
    })

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      xterm.dispose()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={terminalRef}
      className={cn("border border-[#1e1e1e] overflow-hidden", className)}
      style={{ height }}
    />
  )
}

export { Terminal }
