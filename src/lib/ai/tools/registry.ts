import type { ToolDefinition, LearningContext } from "../types"

const tools = new Map<string, ToolDefinition>()

export function registerTool(tool: ToolDefinition) {
  tools.set(tool.id, tool)
}

export function getTool(id: string): ToolDefinition | undefined {
  return tools.get(id)
}

export function getAllTools(): ToolDefinition[] {
  return Array.from(tools.values())
}

export async function executeTool(
  id: string,
  args: Record<string, unknown>,
  ctx: LearningContext
): Promise<Record<string, unknown>> {
  const tool = tools.get(id)
  if (!tool) throw new Error(`Tool not found: ${id}`)
  return tool.execute(args, ctx)
}
