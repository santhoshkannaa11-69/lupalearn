"use client"

import { useState } from "react"
import { useEditorStore, getActiveFileContent } from "@/stores/editorStore"
import { Sparkles, Bug, Zap, Loader2 } from "lucide-react"

const AI_ACTIONS = [
  { id: "explain", label: "Explain", icon: Sparkles, color: "var(--color-info)" },
  { id: "fix", label: "Fix", icon: Bug, color: "var(--color-warning)" },
  { id: "optimize", label: "Optimize", icon: Zap, color: "var(--color-accent)" },
]

function AIActions() {
  const [loading, setLoading] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const setBottomPanelTab = useEditorStore((s) => s.setBottomPanelTab)

  const handleAction = async (actionId: string) => {
    const code = getActiveFileContent()
    if (!code) {
      setOutput("No code selected. Open a file first.")
      setBottomPanelTab("ai-output")
      return
    }

    setLoading(actionId)
    setOutput(null)

    // Simulated AI response for MVP
    await new Promise((r) => setTimeout(r, 800))

    const responses: Record<string, string> = {
      explain: `## AI Explanation\n\nThis code appears to be a JavaScript/TypeScript program. Here's what it does:\n\n1. It defines variables or functions\n2. It performs operations on data\n3. It outputs results\n\n**Key concepts used:**\n- Variable declarations\n- Function definitions\n- Console output`,
      fix: `## AI Code Review\n\nNo critical issues found in the current code.\n\n**Suggestions:**\n- Consider adding input validation\n- Use strict equality (===) instead of loose equality (==)\n- Add error handling for edge cases`,
      optimize: `## AI Optimization Suggestions\n\n1. **Performance**: Current implementation is O(n). Consider if this can be optimized.\n2. **Readability**: Add comments for complex logic\n3. **Best practices**: Use const instead of let where values don't change`,
    }

    setOutput(responses[actionId] || "AI response coming soon.")
    setBottomPanelTab("ai-output")
    setLoading(null)
  }

  return (
    <div className="flex items-center gap-1">
      {AI_ACTIONS.map((action) => {
        const Icon = action.icon
        const isActive = loading === action.id
        return (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={isActive}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono border border-border hover:border-border-hover bg-surface hover:bg-surface transition-colors disabled:opacity-50"
            style={{ color: action.color }}
            title={action.label}
          >
            {isActive ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export { AIActions, AI_ACTIONS }


