// A real-ish terminal shell for the LupaLearn Playground
// Operates on the workspace file tree from editorStore

import type { Workspace, FolderNode, FileNode } from "@/stores/editorStore"
import { getFileContent } from "@/stores/editorStore"

type FileSystem = {
  cwd: string
  root: FolderNode
}

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
}

export class TerminalShell {
  private fs: FileSystem
  private history: string[] = []
  private historyIdx = -1
  private _currentLine = ""
  private running = false

  // Callbacks
  onWrite: ((text: string) => void) | null = null
  onClear: (() => void) | null = null
  onExit: (() => void) | null = null

  // Store reference for file operations
  private getWorkspace: () => Workspace
  private setFileContent: ((path: string, content: string) => void) | null
  private createFile: ((path: string, name: string, lang?: string) => void) | null
  private deleteFile: ((path: string) => void) | null

  constructor(
    getWorkspace: () => Workspace,
    setFileContent?: (path: string, content: string) => void,
    createFile?: (path: string, name: string, lang?: string) => void,
    deleteFile?: (path: string) => void,
  ) {
    this.getWorkspace = getWorkspace
    this.setFileContent = setFileContent || null
    this.createFile = createFile || null
    this.deleteFile = deleteFile || null
    this.fs = { cwd: "/", root: getWorkspace().root }
  }

  refreshFS() {
    this.fs.root = this.getWorkspace().root
  }

  get currentLine() { return this._currentLine }
  set currentLine(v: string) { this._currentLine = v }
  get prompt() { return `\r\x1b[32muser@lupa\x1b[0m:\x1b[34m${this.fs.cwd}\x1b[0m$ ` }

  private write(text: string) {
    this.onWrite?.(text)
  }

  private writeln(text: string = "") {
    this.onWrite?.(text + "\r\n")
  }

  private findNode(path: string): FolderNode | FileNode | null {
    const parts = path.split("/").filter(Boolean)
    let current: FolderNode | null = this.fs.root
    for (let i = 0; i < parts.length && current; i++) {
      const found = current.children.find((c) => c.name === parts[i])
      if (!found) return null
      if ("children" in found) {
        current = found as FolderNode
      } else {
        return found
      }
    }
    return current
  }

  private findParent(path: string): { parent: FolderNode | null; name: string } {
    const parts = path.split("/").filter(Boolean)
    const name = parts.pop() || ""
    const parentPath = "/" + parts.join("/")
    const found = parentPath === "/" ? this.fs.root : this.findNode(parentPath)
    const parent = found && "children" in found ? found as FolderNode : null
    return { parent, name }
  }

  private resolvePath(p: string): string {
    if (!p) return this.fs.cwd
    if (p.startsWith("/")) return p
    const cwd = this.fs.cwd === "/" ? "" : this.fs.cwd
    const parts = [...cwd.split("/").filter(Boolean), ...p.split("/").filter(Boolean)]
    const resolved: string[] = []
    for (const part of parts) {
      if (part === ".") continue
      if (part === "..") { resolved.pop(); continue }
      resolved.push(part)
    }
    return "/" + resolved.join("/")
  }

  private colorForType(node: FolderNode | FileNode): string {
    if ("children" in node) return COLORS.cyan
    const ext = (node as FileNode).name.split(".").pop()?.toLowerCase()
    if (["js", "ts", "jsx", "tsx"].includes(ext || "")) return COLORS.yellow
    if (["py", "rb", "go", "rs"].includes(ext || "")) return COLORS.green
    if (["html", "css", "scss"].includes(ext || "")) return COLORS.magenta
    if (["json", "md", "yml", "yaml"].includes(ext || "")) return COLORS.blue
    return COLORS.reset
  }

  execute(input: string): string | null {
    const trimmed = input.trim()
    if (!trimmed) return null

    this.history.push(trimmed)
    this.historyIdx = this.history.length

    const parts = this.parseLine(trimmed)
    const cmd = parts[0]?.toLowerCase()
    const args = parts.slice(1)

    switch (cmd) {
      case "clear": return "__CLEAR__"
      case "exit": this.onExit?.(); return ""
      case "help": return this.cmdHelp(args)
      case "ls": return this.cmdLs(args)
      case "cd": return this.cmdCd(args)
      case "pwd": return this.fs.cwd + "\r\n"
      case "echo": return args.join(" ") + "\r\n"
      case "cat": return this.cmdCat(args)
      case "mkdir": return this.cmdMkdir(args)
      case "touch": return this.cmdTouch(args)
      case "rm": return this.cmdRm(args)
      case "cp": return this.cmdCp(args)
      case "mv": return this.cmdMv(args)
      case "grep": return this.cmdGrep(args)
      case "head": return this.cmdHead(args)
      case "tail": return this.cmdTail(args)
      case "wc": return this.cmdWc(args)
      case "find": return this.cmdFind(args)
      case "sort": return this.cmdSort(args)
      case "uniq": return this.cmdUniq(args)
      case "whoami": return "learner\r\n"
      case "date": return new Date().toString() + "\r\n"
      case "history": return this.history.map((h, i) => `  ${i + 1}  ${h}`).join("\r\n") + "\r\n"
      case "node":
      case "python":
        return this.cmdRun(cmd, args)
      case "which": return this.cmdWhich(args)
      case "neofetch": return this.cmdNeofetch()
      default:
        if (trimmed) return `\x1b[31mbash: ${cmd}: command not found\x1b[0m\r\n`
        return ""
    }
  }

  // ─── COMMAND IMPLEMENTATIONS ───

  private cmdHelp(_args: string[]): string {
    return [
      "",
      `${COLORS.bold}LupaLearn Terminal v0.1.0${COLORS.reset}`,
      `${COLORS.dim}────────────────────────────────${COLORS.reset}`,
      "",
      `  ${COLORS.green}File Operations${COLORS.reset}`,
      `    ls [path]       List directory contents`,
      `    cd <path>       Change directory`,
      `    pwd             Print working directory`,
      `    cat <file>      Display file contents`,
      `    touch <file>    Create empty file`,
      `    mkdir <dir>     Create directory`,
      `    rm <path>       Remove file or directory`,
      `    cp <src> <dst>  Copy file or directory`,
      `    mv <src> <dst>  Move/rename file or directory`,
      "",
      `  ${COLORS.green}Text Processing${COLORS.reset}`,
      `    grep <pat> <f>  Search for pattern in file`,
      `    head <file>     Show first 10 lines`,
      `    tail <file>     Show last 10 lines`,
      `    wc <file>       Count lines, words, chars`,
      `    sort <file>     Sort lines alphabetically`,
      `    uniq <file>     Remove duplicate lines`,
      "",
      `  ${COLORS.green}Execution${COLORS.reset}`,
      `    node <code>     Execute JavaScript`,
      `    python <code>   Execute Python (simulated)`,
      "",
      `  ${COLORS.green}System${COLORS.reset}`,
      `    echo <text>     Print text`,
      `    clear           Clear terminal`,
      `    history         Show command history`,
      `    which <cmd>     Show command path`,
      `    whoami          Show current user`,
      `    date            Show current date/time`,
      `    neofetch        Show system info`,
      `    help            Show this help`,
      `    exit            Exit terminal`,
      "",
      `${COLORS.dim}Pro tip: Up/Down arrows for history, Tab for completion${COLORS.reset}`,
      "\r\n",
    ].join("\r\n")
  }

  private cmdLs(args: string[]): string {
    this.refreshFS()
    const target = args[0] ? this.resolvePath(args[0]) : this.fs.cwd
    const node = this.findNode(target)
    if (!node) return `\x1b[31mls: cannot access '${target}': No such file or directory\x1b[0m\r\n`
    if (!("children" in node)) return `\x1b[31mls: cannot access '${target}': Not a directory\x1b[0m\r\n`

    const children = (node as FolderNode).children
    if (children.length === 0) return "\r\n"

    // Build columns
    const lines: string[] = []
    let line = ""
    for (const child of children) {
      const color = this.colorForType(child)
      const suffix = "children" in child ? "/" : ""
      const entry = `${color}${child.name}${suffix}${COLORS.reset}`
      if (line.length + entry.length + 2 > 80) {
        lines.push(line)
        line = entry + "  "
      } else {
        line += entry + "  "
      }
    }
    if (line) lines.push(line)
    return lines.join("\r\n") + "\r\n"
  }

  private cmdCd(args: string[]): string {
    this.refreshFS()
    const target = args[0] || "/"
    const resolved = this.resolvePath(target)
    const node = this.findNode(resolved)
    if (!node) return `\x1b[31mcd: no such file or directory: ${target}\x1b[0m\r\n`
    if (!("children" in node)) return `\x1b[31mcd: not a directory: ${target}\x1b[0m\r\n`
    this.fs.cwd = resolved
    return ""
  }

  private cmdCat(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node) return `\x1b[31mcat: ${args[0]}: No such file or directory\x1b[0m\r\n`
    if ("children" in node) return `\x1b[31mcat: ${args[0]}: Is a directory\x1b[0m\r\n`
    const ws = this.getWorkspace()
    const content = getFileContent(ws, target)
    return content + (content.endsWith("\n") ? "" : "\r\n")
  }

  private cmdMkdir(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\x1b[31mmkdir: missing operand\x1b[0m\r\n"
    const target = this.resolvePath(args[0])
    const { parent, name } = this.findParent(target)
    if (!parent) return `\x1b[31mmkdir: cannot create directory '${args[0]}': No such file or directory\x1b[0m\r\n`
    if (this.findNode(target)) return `\x1b[31mmkdir: cannot create directory '${args[0]}': File exists\x1b[0m\r\n`
    parent.children.push({ name, path: target, children: [] })
    return ""
  }

  private cmdTouch(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\x1b[31mtouch: missing operand\x1b[0m\r\n"
    const target = this.resolvePath(args[0])
    if (this.findNode(target)) return "" // already exists
    const { parent, name } = this.findParent(target)
    if (!parent) return `\x1b[31mtouch: cannot touch '${args[0]}': No such file or directory\x1b[0m\r\n`
    const ext = name.split(".").pop() || "txt"
    const langMap: Record<string, string> = { js: "javascript", ts: "typescript", py: "python", html: "html", css: "css", rs: "rust", go: "go", json: "json", md: "markdown" }
    parent.children.push({ name, path: target, content: "", language: langMap[ext] || "plaintext" })
    return ""
  }

  private cmdRm(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\x1b[31mrm: missing operand\x1b[0m\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node) return `\x1b[31mrm: cannot remove '${args[0]}': No such file or directory\x1b[0m\r\n`
    if (target === "/") return "\x1b[31mrm: cannot remove root directory\x1b[0m\r\n"
    this.deleteFile?.(target)
    return ""
  }

  private cmdCp(args: string[]): string {
    this.refreshFS()
    if (args.length < 2) return "\x1b[31mcp: missing file operand\x1b[0m\r\n"
    const src = this.resolvePath(args[0])
    const dst = this.resolvePath(args[1])
    const srcNode = this.findNode(src)
    if (!srcNode) return `\x1b[31mcp: cannot stat '${args[0]}': No such file or directory\x1b[0m\r\n`
    if ("children" in srcNode) return "\x1b[31mcp: directory copy not supported yet\x1b[0m\r\n"
    const content = (srcNode as FileNode).content
    const { parent, name } = this.findParent(dst)
    if (!parent) return `\x1b[31mcp: cannot create '${args[1]}': No such file or directory\x1b[0m\r\n`
    const ext = name.split(".").pop() || "txt"
    parent.children.push({ name, path: dst, content, language: (srcNode as FileNode).language })
    return ""
  }

  private cmdMv(args: string[]): string {
    this.refreshFS()
    if (args.length < 2) return "\x1b[31mmv: missing file operand\x1b[0m\r\n"
    const src = this.resolvePath(args[0])
    const dst = this.resolvePath(args[1])
    const srcNode = this.findNode(src)
    if (!srcNode) return `\x1b[31mmv: cannot stat '${args[0]}': No such file or directory\x1b[0m\r\n`
    // Copy
    if (!("children" in srcNode)) {
      const content = (srcNode as FileNode).content
      const { parent, name } = this.findParent(dst)
      if (!parent) return `\x1b[31mmv: cannot create '${args[1]}': No such file or directory\x1b[0m\r\n`
      parent.children.push({ name, path: dst, content, language: (srcNode as FileNode).language })
    }
    // Remove original
    this.deleteFile?.(src)
    return ""
  }

  private cmdGrep(args: string[]): string {
    this.refreshFS()
    if (args.length < 2) return "\x1b[31mgrep: missing pattern or file\x1b[0m\r\n"
    const pattern = args[0]
    const target = this.resolvePath(args[1])
    const node = this.findNode(target)
    if (!node || "children" in node) return "\r\n"
    const content = (node as FileNode).content
    const lines = content.split("\n")
    const matches = lines.filter((l: string) => l.includes(pattern))
    if (matches.length === 0) return "\r\n"
    return matches.map((l: string) => l.trimEnd()).join("\r\n") + "\r\n"
  }

  private cmdHead(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node || "children" in node) return "\r\n"
    const lines = (node as FileNode).content.split("\n").slice(0, 10)
    return lines.join("\r\n") + (lines.length === 10 ? "\r\n" : "")
  }

  private cmdTail(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node || "children" in node) return "\r\n"
    const lines = (node as FileNode).content.split("\n").slice(-10)
    return lines.join("\r\n") + "\r\n"
  }

  private cmdWc(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node || "children" in node) return "\r\n"
    const content = (node as FileNode).content
    const lines = content.split("\n").length
    const words = content.split(/\s+/).filter(Boolean).length
    const chars = content.length
    return `${lines}  ${words}  ${chars}  ${args[0]}\r\n`
  }

  private cmdFind(args: string[]): string {
    this.refreshFS()
    const target = args[0] ? this.resolvePath(args[0]) : this.fs.cwd
    const node = this.findNode(target)
    if (!node || !("children" in node)) return "\r\n"
    const results: string[] = []
    const walk = (n: FolderNode | FileNode, path: string) => {
      if ("children" in n) {
        results.push(path + "/")
        for (const child of (n as FolderNode).children) walk(child, path + "/" + child.name)
      }
    }
    walk(node, target === "/" ? "" : target)
    return results.join("\r\n") + "\r\n"
  }

  private cmdSort(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node || "children" in node) return "\r\n"
    return (node as FileNode).content.split("\n").sort().join("\r\n") + "\r\n"
  }

  private cmdUniq(args: string[]): string {
    this.refreshFS()
    if (args.length === 0) return "\r\n"
    const target = this.resolvePath(args[0])
    const node = this.findNode(target)
    if (!node || "children" in node) return "\r\n"
    const seen = new Set<string>()
    return (node as FileNode).content.split("\n").filter((l: string) => { if (seen.has(l)) return false; seen.add(l); return true }).join("\r\n") + "\r\n"
  }

  private cmdRun(lang: string, args: string[]): string {
    this.refreshFS()
    const code = args.join(" ")
    if (!code && args.length === 0) return `\x1b[31m${lang}: missing expression\x1b[0m\r\n`

    // Check if first arg is a file
    const fileTarget = this.resolvePath(args[0])
    const fileNode = this.findNode(fileTarget)
    const source = fileNode && !("children" in fileNode) ? (fileNode as FileNode).content : code

    if (lang === "node" || lang === "javascript") {
      try {
        const logs: string[] = []
        const mockConsole = { log: (...a: unknown[]) => logs.push(a.map((x) => String(x)).join(" ")), error: (...a: unknown[]) => logs.push(`\x1b[31m${a.map((x) => String(x)).join(" ")}\x1b[0m`), warn: (...a: unknown[]) => logs.push(`\x1b[33m${a.map((x) => String(x)).join(" ")}\x1b[0m`) }
        const fn = new Function("console", source)
        fn(mockConsole)
        return logs.join("\r\n") + "\r\n"
      } catch (e) {
        return `\x1b[31m${String(e)}\x1b[0m\r\n`
      }
    }
    return `\x1b[33m${lang} runtime coming soon\x1b[0m\r\n`
  }

  private cmdWhich(args: string[]): string {
    const builtins = ["ls", "cd", "pwd", "cat", "echo", "mkdir", "touch", "rm", "cp", "mv", "grep", "head", "tail", "wc", "find", "sort", "uniq", "clear", "help", "exit", "whoami", "date", "history", "node", "python", "which", "neofetch"]
    if (args.length === 0) return "\r\n"
    if (builtins.includes(args[0])) return `/usr/bin/${args[0]}\r\n`
    return `\x1b[31m${args[0]} not found\x1b[0m\r\n`
  }

  private cmdNeofetch(): string {
    const ws = this.getWorkspace()
    const fileCount = countFiles(ws.root)
    const folderCount = countFolders(ws.root)
    return [
      "",
      `  ${COLORS.green}${COLORS.bold}user@lupa${COLORS.reset}`,
      `  ${COLORS.dim}${"-".repeat(30)}${COLORS.reset}`,
      `  ${COLORS.blue}OS${COLORS.reset}:        LupaLearn Playground v0.1.0`,
      `  ${COLORS.blue}Host${COLORS.reset}:      Browser`,
      `  ${COLORS.blue}Kernel${COLORS.reset}:    JavaScript ES2022`,
      `  ${COLORS.blue}Shell${COLORS.reset}:     LupaTerminal`,
      `  ${COLORS.blue}Terminal${COLORS.reset}:  xterm.js`,
      `  ${COLORS.blue}Workspace${COLORS.reset}: ${ws.name}`,
      `  ${COLORS.blue}Files${COLORS.reset}:     ${fileCount}`,
      `  ${COLORS.blue}Folders${COLORS.reset}:   ${folderCount}`,
      `  ${COLORS.blue}Language${COLORS.reset}:  ${ws.language}`,
      "",
      `  ${COLORS.green}Welcome to LupaLearn!${COLORS.reset}`,
      "  Type 'help' for available commands",
      "\r\n",
    ].join("\r\n")
  }

  // ─── UTILITIES ───

  private parseLine(line: string): string[] {
    const args: string[] = []
    let current = ""
    let inQuote = false
    for (const ch of line) {
      if (ch === '"' || ch === "'") { inQuote = !inQuote; continue }
      if (ch === " " && !inQuote) { if (current) { args.push(current); current = "" }; continue }
      current += ch
    }
    if (current) args.push(current)
    return args
  }

  getCompletions(prefix: string): string[] {
    this.refreshFS()
    const parts = prefix.split(/\s+/)
    const last = parts[parts.length - 1] || ""
    if (parts.length === 1 && !prefix.includes(" ")) {
      const cmds = ["ls", "cd", "pwd", "cat", "echo", "touch", "mkdir", "rm", "cp", "mv", "grep", "head", "tail", "wc", "find", "sort", "uniq", "clear", "help", "exit", "whoami", "date", "history", "node", "python", "which", "neofetch"]
      return cmds.filter((c) => c.startsWith(last)).map((c) => c.slice(prefix.length))
    }
    // File completion
    const resolved = last.startsWith("/") ? last : this.fs.cwd + "/" + last
    const dir = resolved.split("/").slice(0, -1).join("/") || "/"
    const prefixName = resolved.split("/").pop() || ""
    const node = this.findNode(dir)
    if (!node || !("children" in node)) return []
    return (node as FolderNode).children.filter((c) => c.name.startsWith(prefixName)).map((c) => c.name.slice(prefixName.length) + ("children" in c ? "/" : " "))
  }
}

function countFiles(node: FolderNode): number {
  let count = 0
  for (const child of node.children) {
    if ("children" in child) count += countFiles(child as FolderNode)
    else count++
  }
  return count
}

function countFolders(node: FolderNode): number {
  let count = 0
  for (const child of node.children) {
    if ("children" in child) {
      count++
      count += countFolders(child as FolderNode)
    }
  }
  return count
}
