import type { Workspace, FolderNode, FileNode } from "@/stores/editorStore"
import { getFileContent } from "@/stores/editorStore"

const RESET = "\x1b[0m"
const GREEN = "\x1b[32m"
const CYAN = "\x1b[36m"
const YELLOW = "\x1b[33m"
const RED = "\x1b[31m"
const BLUE = "\x1b[34m"
const MAGENTA = "\x1b[35m"
const DIM = "\x1b[2m"
const BOLD = "\x1b[1m"

export class TerminalShell {
  cwd = "/"
  private history: string[] = []
  private histIdx = -1
  private getWorkspace: () => Workspace
  private setFileContent: ((p: string, c: string) => void) | null
  private createFile: ((p: string, n: string, l?: string) => void) | null
  private deleteFile: ((p: string) => void) | null

  constructor(
    getWs: () => Workspace,
    setFc?: (p: string, c: string) => void,
    crFile?: (p: string, n: string, l?: string) => void,
    delFile?: (p: string) => void,
  ) {
    this.getWorkspace = getWs
    this.setFileContent = setFc || null
    this.createFile = crFile || null
    this.deleteFile = delFile || null
    this.history = typeof window !== "undefined" && window.localStorage
      ? JSON.parse(localStorage.getItem("lupa-term-history") || "[]")
      : []
  }

  get prompt() { return `${GREEN}user@lupa${RESET}:${BLUE}${this.cwd}${RESET}$ ` }

  private root() { return this.getWorkspace().root }

  private find(path: string): FolderNode | FileNode | null {
    const parts = path.split("/").filter(Boolean)
    let cur: FolderNode = this.root()
    for (let i = 0; i < parts.length; i++) {
      const found = cur.children.find((c) => c.name === parts[i])
      if (!found) return null
      if ("children" in found) cur = found as FolderNode
      else return found
    }
    return cur
  }

  private resolve(p: string): string {
    if (!p) return this.cwd
    if (p.startsWith("/")) return p
    const base = this.cwd === "/" ? "" : this.cwd
    const parts = [...base.split("/").filter(Boolean), ...p.split("/").filter(Boolean)]
    const out: string[] = []
    for (const part of parts) {
      if (part === ".") continue
      if (part === "..") { out.pop(); continue }
      out.push(part)
    }
    return "/" + out.join("/")
  }

  private parent(path: string): { parent: FolderNode | null; name: string } {
    const parts = path.split("/").filter(Boolean)
    const name = parts.pop() || ""
    const pp = "/" + parts.join("/")
    const p = pp === "/" ? this.root() : this.find(pp)
    return { parent: p && "children" in p ? p as FolderNode : null, name }
  }

  private color(name: string, isDir: boolean): string {
    if (isDir) return CYAN
    const e = name.split(".").pop()?.toLowerCase()
    if (["js", "ts", "jsx", "tsx"].includes(e || "")) return YELLOW
    if (["py", "rb", "go", "rs"].includes(e || "")) return GREEN
    if (["html", "css", "scss"].includes(e || "")) return MAGENTA
    if (["json", "md", "yml", "yaml"].includes(e || "")) return BLUE
    return RESET
  }

  // ─── COMMANDS ───

  exec(line: string): { output: string; prompt: boolean } {
    if (!line.trim()) return { output: "", prompt: true }
    this.history.push(line)
    this.histIdx = this.history.length
    if (typeof window !== "undefined") {
      localStorage.setItem("lupa-term-history", JSON.stringify(this.history.slice(-200)))
    }

    const [cmd, ...args] = line.trim().split(/\s+/)

    switch (cmd) {
      case "clear": return { output: "__CLEAR__", prompt: false }
      case "exit": return { output: "", prompt: false }
      case "help": return { output: this.renderHelp(), prompt: true }
      case "ls": return { output: this.ls(args), prompt: true }
      case "cd": return { output: this.cd(args), prompt: false }
      case "pwd": return { output: this.cwd + "\n", prompt: true }
      case "echo": return { output: args.join(" ") + "\n", prompt: true }
      case "cat": return { output: this.cat(args), prompt: true }
      case "touch": return { output: this.touch(args), prompt: true }
      case "mkdir": return { output: this.mkdir(args), prompt: true }
      case "rm": return { output: this.rm(args), prompt: true }
      case "cp": return { output: this.cp(args), prompt: true }
      case "mv": return { output: this.mv(args), prompt: true }
      case "grep": return { output: this.grep(args), prompt: true }
      case "head": return { output: this.head(args), prompt: true }
      case "tail": return { output: this.tail(args), prompt: true }
      case "wc": return { output: this.wc(args), prompt: true }
      case "find": return { output: this.findCmd(args), prompt: true }
      case "sort": return { output: this.sortCmd(args), prompt: true }
      case "uniq": return { output: this.uniqCmd(args), prompt: true }
      case "whoami": return { output: "learner\n", prompt: true }
      case "date": return { output: new Date().toString() + "\n", prompt: true }
      case "history": return { output: this.history.map((h, i) => `  ${i + 1}  ${h}`).join("\n") + "\n", prompt: true }
      case "node":
      case "python":
        return { output: this.run(cmd, args), prompt: true }
      case "which": return { output: this.which(args), prompt: true }
      case "neofetch": return { output: this.neofetch(), prompt: true }
      default: return { output: `${RED}bash: ${cmd}: command not found${RESET}\n`, prompt: true }
    }
  }

  getHistory(dir: "up" | "down"): string {
    if (dir === "up" && this.histIdx > 0) {
      this.histIdx--
      return this.history[this.histIdx]
    }
    if (dir === "down" && this.histIdx < this.history.length - 1) {
      this.histIdx++
      return this.history[this.histIdx]
    }
    if (dir === "down") {
      this.histIdx = this.history.length
      return ""
    }
    return ""
  }

  complete(prefix: string): string | null {
    const parts = prefix.split(/\s+/)
    const last = parts[parts.length - 1] || ""

    if (parts.length === 1 && !/\s/.test(prefix)) {
      const cmds = ["ls","cd","pwd","cat","echo","touch","mkdir","rm","cp","mv","grep","head","tail","wc","find","sort","uniq","clear","help","exit","whoami","date","history","node","python","which","neofetch"]
      const match = cmds.filter((c) => c.startsWith(last))
      if (match.length === 1) return match[0].slice(prefix.length) + " "
      if (match.length > 1) return "--MULTI--\n" + match.join("  ")
      return null
    }

    const dir = last.startsWith("/") ? last.split("/").slice(0, -1).join("/") || "/" : this.resolve("..")
    const base = last.split("/").pop() || ""
    const node = this.find(dir)
    if (!node || !("children" in node)) return null
    const matches = (node as FolderNode).children.filter((c) => c.name.startsWith(base))
    if (matches.length === 1) {
      const m = matches[0]
      return m.name.slice(base.length) + ("children" in m ? "/" : " ")
    }
    if (matches.length > 1) return "--MULTI--\n" + matches.map((m) => this.color(m.name, "children" in m) + m.name + RESET).join("  ")
    return null
  }

  // ─── COMMAND IMPLEMENTATIONS ───

  private renderHelp(): string {
    return [
      `${BOLD}LupaLearn Terminal v0.1.0${RESET}`,
      `${DIM}─────────────────────────────${RESET}`,
      "",
      `${GREEN}File Ops${RESET}:  ls [path]  cd <path>  pwd  cat <file>  touch <file>  mkdir <dir>  rm <path>  cp <src> <dst>  mv <src> <dst>`,
      `${GREEN}Text${RESET}:      grep <pat> <file>  head <file>  tail <file>  wc <file>  sort <file>  uniq <file>`,
      `${GREEN}Run${RESET}:       node <code|file>  python <code|file>`,
      `${GREEN}System${RESET}:    echo  clear  history  which  whoami  date  neofetch  help  exit`,
      `${DIM}↑↓ history  Tab complete  Ctrl+C cancel  Ctrl+L clear  Ctrl+U clear line${RESET}`,
      "",
    ].join("\n")
  }

  private ls(args: string[]): string {
    const target = args[0] ? this.resolve(args[0]) : this.cwd
    const node = this.find(target)
    if (!node) return `${RED}ls: cannot access '${args[0] || ""}': No such file or directory${RESET}\n`
    if (!("children" in node)) return `${RED}ls: '${args[0] || ""}': Not a directory${RESET}\n`
    const kids = (node as FolderNode).children
    if (!kids.length) return "\n"
    return kids.map((c) => this.color(c.name, "children" in c) + c.name + ("children" in c ? "/" : "") + RESET).join("  ") + "\n"
  }

  private cd(args: string[]): string {
    const target = args[0] || "/"
    const resolved = this.resolve(target)
    const node = this.find(resolved)
    if (!node) return `${RED}cd: no such file or directory: ${target}${RESET}\n`
    if (!("children" in node)) return `${RED}cd: not a directory: ${target}${RESET}\n`
    this.cwd = resolved
    return ""
  }

  private cat(args: string[]): string {
    if (!args.length) return ""
    const target = this.resolve(args[0])
    const node = this.find(target)
    if (!node) return `${RED}cat: ${args[0]}: No such file or directory${RESET}\n`
    if ("children" in node) return `${RED}cat: ${args[0]}: Is a directory${RESET}\n`
    const content = getFileContent(this.getWorkspace(), target)
    return content + (content.endsWith("\n") ? "" : "\n")
  }

  private touch(args: string[]): string {
    if (!args.length) return `${RED}touch: missing operand${RESET}\n`
    const target = this.resolve(args[0])
    if (this.find(target)) return ""
    const { parent, name } = this.parent(target)
    if (!parent) return `${RED}touch: cannot touch '${args[0]}'${RESET}\n`
    const ext = name.split(".").pop() || "txt"
    const langMap: Record<string, string> = { js: "javascript", ts: "typescript", py: "python", html: "html", css: "css", rs: "rust", go: "go", json: "json", md: "markdown" }
    parent.children.push({ name, path: target, content: "", language: langMap[ext] || "plaintext" })
    return ""
  }

  private mkdir(args: string[]): string {
    if (!args.length) return `${RED}mkdir: missing operand${RESET}\n`
    const target = this.resolve(args[0])
    if (this.find(target)) return `${RED}mkdir: cannot create '${args[0]}': File exists${RESET}\n`
    const { parent, name } = this.parent(target)
    if (!parent) return `${RED}mkdir: cannot create '${args[0]}'${RESET}\n`
    parent.children.push({ name, path: target, children: [] })
    return ""
  }

  private rm(args: string[]): string {
    if (!args.length) return `${RED}rm: missing operand${RESET}\n`
    const target = this.resolve(args[0])
    if (!this.find(target)) return `${RED}rm: cannot remove '${args[0]}': No such file${RESET}\n`
    if (target === "/") return `${RED}rm: cannot remove root${RESET}\n`
    this.deleteFile?.(target)
    return ""
  }

  private cp(args: string[]): string {
    if (args.length < 2) return `${RED}cp: missing operand${RESET}\n`
    const src = this.resolve(args[0])
    const dst = this.resolve(args[1])
    const srcNode = this.find(src)
    if (!srcNode) return `${RED}cp: cannot stat '${args[0]}'${RESET}\n`
    if ("children" in srcNode) return `${RED}cp: directory copy not supported${RESET}\n`
    const { parent, name } = this.parent(dst)
    if (!parent) return `${RED}cp: cannot create '${args[1]}'${RESET}\n`
    parent.children.push({ name, path: dst, content: (srcNode as FileNode).content, language: (srcNode as FileNode).language })
    return ""
  }

  private mv(args: string[]): string {
    if (args.length < 2) return `${RED}mv: missing operand${RESET}\n`
    const src = this.resolve(args[0])
    const dst = this.resolve(args[1])
    const srcNode = this.find(src)
    if (!srcNode) return `${RED}mv: cannot stat '${args[0]}'${RESET}\n`
    if (!("children" in srcNode)) {
      const { parent, name } = this.parent(dst)
      if (parent) parent.children.push({ name, path: dst, content: (srcNode as FileNode).content, language: (srcNode as FileNode).language })
    }
    this.deleteFile?.(src)
    return ""
  }

  private grep(args: string[]): string {
    if (args.length < 2) return `${RED}grep: missing pattern or file${RESET}\n`
    const target = this.resolve(args[1])
    const node = this.find(target)
    if (!node || "children" in node) return ""
    const lines = (node as FileNode).content.split("\n").filter((l: string) => l.includes(args[0]))
    return lines.join("\n") + (lines.length ? "\n" : "")
  }

  private head(args: string[]): string {
    if (!args.length) return ""
    const target = this.resolve(args[0])
    const node = this.find(target)
    if (!node || "children" in node) return ""
    return (node as FileNode).content.split("\n").slice(0, 10).join("\n") + "\n"
  }

  private tail(args: string[]): string {
    if (!args.length) return ""
    const target = this.resolve(args[0])
    const node = this.find(target)
    if (!node || "children" in node) return ""
    return (node as FileNode).content.split("\n").slice(-10).join("\n") + "\n"
  }

  private wc(args: string[]): string {
    if (!args.length) return ""
    const target = this.resolve(args[0])
    const node = this.find(target)
    if (!node || "children" in node) return ""
    const c = (node as FileNode).content
    const lines = c.split("\n").length
    const words = c.split(/\s+/).filter(Boolean).length
    const chars = c.length
    return `${lines}  ${words}  ${chars}  ${args[0]}\n`
  }

  private findCmd(args: string[]): string {
    const target = args[0] ? this.resolve(args[0]) : this.cwd
    const node = this.find(target)
    if (!node || !("children" in node)) return ""
    const results: string[] = []
    const walk = (n: FolderNode | FileNode, p: string) => {
      if ("children" in n) {
        results.push(p + "/")
        for (const c of (n as FolderNode).children) walk(c, p + "/" + c.name)
      }
    }
    walk(node, target === "/" ? "" : target)
    return results.join("\n") + "\n"
  }

  private sortCmd(args: string[]): string {
    if (!args.length) return ""
    const target = this.resolve(args[0])
    const node = this.find(target)
    if (!node || "children" in node) return ""
    return (node as FileNode).content.split("\n").sort().join("\n") + "\n"
  }

  private uniqCmd(args: string[]): string {
    if (!args.length) return ""
    const target = this.resolve(args[0])
    const node = this.find(target)
    if (!node || "children" in node) return ""
    const seen = new Set<string>()
    return (node as FileNode).content.split("\n").filter((l: string) => { if (seen.has(l)) return false; seen.add(l); return true }).join("\n") + "\n"
  }

  private run(lang: string, args: string[]): string {
    if (!args.length) return `${RED}${lang}: missing expression or file${RESET}\n`
    const code = args.join(" ")
    const fileTarget = this.resolve(args[0])
    const fileNode = this.find(fileTarget)
    const source = fileNode && !("children" in fileNode) ? (fileNode as FileNode).content : code

    if (lang === "node" || lang === "javascript") {
      try {
        const logs: string[] = []
        const c = { log: (...a: unknown[]) => logs.push(a.map((x) => String(x)).join(" ")), error: (...a: unknown[]) => logs.push(`${RED}${a.map((x) => String(x)).join(" ")}${RESET}`), warn: (...a: unknown[]) => logs.push(`${YELLOW}${a.map((x) => String(x)).join(" ")}${RESET}`) }
        new Function("console", source)(c)
        return logs.join("\n") + "\n"
      } catch (e) {
        return `${RED}${String(e)}${RESET}\n`
      }
    }
    return `${YELLOW}${lang} runtime coming soon${RESET}\n`
  }

  private which(args: string[]): string {
    const builtins = ["ls","cd","pwd","cat","echo","touch","mkdir","rm","cp","mv","grep","head","tail","wc","find","sort","uniq","clear","help","exit","whoami","date","history","node","python","which","neofetch"]
    if (!args.length) return ""
    return builtins.includes(args[0]) ? `/usr/bin/${args[0]}\n` : `${RED}${args[0]} not found${RESET}\n`
  }

  private neofetch(): string {
    const ws = this.getWorkspace()
    const countFiles = (n: FolderNode): number => n.children.reduce((s, c) => s + ("children" in c ? countFiles(c as FolderNode) : 1), 0)
    const countDirs = (n: FolderNode): number => n.children.reduce((s, c) => s + ("children" in c ? 1 + countDirs(c as FolderNode) : 0), 0)
    return [
      "",
      `  ${GREEN}${BOLD}user@lupa${RESET}`,
      `  ${DIM}${"-".repeat(28)}${RESET}`,
      `  ${BLUE}OS${RESET}:        LupaLearn Playground v0.1.0`,
      `  ${BLUE}Shell${RESET}:     LupaTerminal`,
      `  ${BLUE}Terminal${RESET}:  xterm.js`,
      `  ${BLUE}Workspace${RESET}: ${ws.name}`,
      `  ${BLUE}Files${RESET}:     ${countFiles(ws.root)}`,
      `  ${BLUE}Dirs${RESET}:      ${countDirs(ws.root)}`,
      `  ${BLUE}Language${RESET}:  ${ws.language}`,
      "",
      `  ${GREEN}Type 'help' for commands${RESET}`,
      "",
    ].join("\n")
  }
}
