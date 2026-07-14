import type { Command, CommandCategory } from "./types"

const commands = new Map<string, Command>()
const aliasMap = new Map<string, string>() // alias → command id

export function registerCommand(cmd: Command): void {
  if (commands.has(cmd.id)) return // Already registered — skip
  commands.set(cmd.id, cmd)
  for (const alias of cmd.aliases) {
    aliasMap.set(alias.toLowerCase(), cmd.id)
  }
}

export function getCommand(idOrAlias: string): Command | undefined {
  const id = aliasMap.get(idOrAlias.toLowerCase()) || idOrAlias
  return commands.get(id)
}

export function getAllCommands(): Command[] {
  return Array.from(commands.values())
}

export function getCommandsByCategory(category: CommandCategory): Command[] {
  return getAllCommands().filter((c) => c.category === category)
}

export function getCommandCount(): number {
  return commands.size
}
