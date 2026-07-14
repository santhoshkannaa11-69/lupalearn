"use client"

import { useCallback, useRef } from "react"
import type { CommandContext, CommandResult, Command } from "../types"
import { parse } from "../parser"
import { resolve } from "../resolver"
import { executeResolved, handleCommandResult } from "../executor"
import { addToHistory } from "../history"
import { getAllCommands, registerCommand } from "../registry"
import { suggest } from "../resolver"

export function useCommands(ctx: CommandContext) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const execute = useCallback(async (input: string): Promise<CommandResult> => {
    const parsed = parse(input)
    if (!parsed) return { type: "none" }

    const resolved = resolve(parsed)
    if (!resolved) {
      return { type: "toast", message: `Unknown: ${parsed.name}`, variant: "error" }
    }

    addToHistory(input)
    const result = await executeResolved(resolved, ctxRef.current)
    handleCommandResult(result, ctxRef.current)
    return result
  }, [])

  const getSuggestions = useCallback((input: string, max?: number) => {
    const parsed = parse(input)
    if (!parsed) return []
    return suggest(parsed.name, max)
  }, [])

  const register = useCallback((cmd: Command) => {
    registerCommand(cmd)
  }, [])

  return { execute, getSuggestions, register, allCommands: getAllCommands() }
}
