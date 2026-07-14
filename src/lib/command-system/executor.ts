import type { CommandContext, CommandResult, ResolvedCommand } from "./types"
import { resolve } from "./resolver"
import { parse } from "./parser"

export async function executeInput(
  input: string,
  ctx: CommandContext
): Promise<CommandResult> {
  const parsed = parse(input)
  if (!parsed) {
    return { type: "none" }
  }

  const resolved = resolve(parsed)
  if (!resolved) {
    return {
      type: "toast",
      message: `Unknown command: ${parsed.name}`,
      variant: "error",
    }
  }

  return executeResolved(resolved, ctx)
}

export async function executeResolved(
  resolved: ResolvedCommand,
  ctx: CommandContext
): Promise<CommandResult> {
  try {
    const result = await resolved.command.execute(ctx)
    return result
  } catch (e) {
    return {
      type: "toast",
      message: `Command error: ${e instanceof Error ? e.message : String(e)}`,
      variant: "error",
    }
  }
}

export function handleCommandResult(result: CommandResult, ctx: CommandContext): void {
  switch (result.type) {
    case "navigate":
      ctx.router(result.href)
      break
    case "toast":
      ctx.toast(result.message, result.variant)
      break
    case "modal":
      ctx.showModal(result.id)
      break
    case "execute":
      console.log("Execute action:", result.action, result.data)
      break
    case "none":
      break
  }
}
