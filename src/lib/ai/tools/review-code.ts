import { registerTool } from "./registry"

registerTool({
  id: "review-code",
  name: "Review Code",
  description: "Review a code snippet and provide feedback",
  execute: async (args) => {
    const code = (args.code as string) || ""
    const language = (args.language as string) || "javascript"

    if (!code) return { feedback: "No code provided to review." }

    const lines = code.split("\n").length
    const hasComments = code.includes("//") || code.includes("/*")
    const hasFunctions = code.includes("function") || code.includes("=>")
    const hasConsoleLog = code.includes("console.log")

    const suggestions: string[] = []
    if (!hasComments && lines > 5) suggestions.push("Consider adding comments for complex logic")
    if (!hasFunctions && lines > 3) suggestions.push("Consider breaking code into functions")
    if (hasConsoleLog) suggestions.push("Remove console.log statements in production code")

    return {
      feedback: `Reviewed ${language} code (${lines} lines).`,
      suggestions,
      summary: {
        lines,
        hasFunctions,
        hasComments,
        quality: lines < 10 ? "good" : "needs-review",
      },
    }
  },
})
