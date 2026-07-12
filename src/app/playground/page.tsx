"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Terminal, Code, Eye, Sparkles } from "lucide-react"

export default function PlaygroundPage() {
  return (
    <Shell>
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e1e] bg-[#0a0a0a]">
          <Badge variant="info">Playground</Badge>
          <span className="text-xs text-[#606060] font-mono">lupa@playground:~$</span>
          <div className="flex-1" />
          <Button variant="ghost" size="sm">
            <Code size={14} /> Editor
          </Button>
          <Button variant="ghost" size="sm">
            <Terminal size={14} /> Terminal
          </Button>
          <Button variant="ghost" size="sm">
            <Eye size={14} /> Preview
          </Button>
          <Button variant="primary" size="sm">
            <Sparkles size={14} /> AI
          </Button>
        </div>

        {/* Main area */}
        <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center max-w-md">
            <Terminal size={48} className="mx-auto text-[#606060] mb-4" />
            <h2 className="text-lg font-bold text-[#c0c0c0] font-mono mb-2">Playground</h2>
            <p className="text-sm text-[#606060] font-mono mb-6">
              Full IDE workspace coming soon. Monaco editor, xterm.js terminal, live preview,
              and AI-powered code assistance.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-[#606060] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00ff41]" />
                JavaScript
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00f0ff]" />
                Python
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#ffb000]" />
                TypeScript
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#ff00aa]" />
                Rust
              </span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
