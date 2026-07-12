import { create } from "zustand"

export type FileNode = {
  name: string
  path: string
  content: string
  language: string
}

export type FolderNode = {
  name: string
  path: string
  children: (FileNode | FolderNode)[]
}

export type Workspace = {
  id: string
  name: string
  language: string
  root: FolderNode
}

export type BottomPanelTab = "terminal" | "preview" | "problems" | "ai-output"

interface EditorState {
  // Workspace
  workspace: Workspace
  openFiles: string[]
  activeFile: string | null

  // UI state (separate from workspace data)
  sidebarOpen: boolean
  bottomPanelTab: BottomPanelTab
  bottomPanelHeight: number
  commandPaletteOpen: boolean
  newFileDialogOpen: boolean
  saveDialogOpen: boolean

  // Execution
  isRunning: boolean
  lastOutput: string

  // Undo/redo stacks per file
  undoStacks: Record<string, string[]>
  redoStacks: Record<string, string[]>

  // Actions
  setActiveFile: (path: string | null) => void
  openFile: (path: string) => void
  closeFile: (path: string) => void
  setFileContent: (path: string, content: string) => void
  createFile: (path: string, name: string, language?: string) => void
  deleteFile: (path: string) => void
  renameFile: (oldPath: string, newPath: string) => void
  setWorkspace: (workspace: Workspace) => void
  toggleSidebar: () => void
  setBottomPanelTab: (tab: BottomPanelTab) => void
  setBottomPanelHeight: (h: number) => void
  toggleCommandPalette: () => void
  toggleNewFileDialog: () => void
  toggleSaveDialog: () => void
  setIsRunning: (v: boolean) => void
  setLastOutput: (v: string) => void
  undo: (path: string) => void
  redo: (path: string) => void

  // Language detection
  detectLanguage: (name: string) => string
}

function detectLanguage(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase()
  const langMap: Record<string, string> = {
    js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
    py: "python", rb: "ruby", rs: "rust", go: "go", java: "java",
    html: "html", css: "css", scss: "scss", json: "json", md: "markdown",
    sql: "sql", sh: "shell", yml: "yaml", yaml: "yaml", xml: "xml",
    c: "c", cpp: "cpp", h: "c", cs: "csharp", swift: "swift", kt: "kotlin",
  }
  return langMap[ext || ""] || "plaintext"
}

function createDefaultWorkspace(): Workspace {
  return {
    id: "default",
    name: "My Project",
    language: "javascript",
    root: {
      name: "project",
      path: "/",
      children: [
        {
          name: "index.js",
          path: "/index.js",
          content: "// Welcome to LupaLearn Playground\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet(\"Developer\"));\n",
          language: "javascript",
        },
      ],
    },
  }
}

function findNode(root: FolderNode, path: string): FileNode | FolderNode | null {
  if (root.path === path) return root
  for (const child of root.children) {
    if (child.path === path) return child
    if ("children" in child) {
      const found = findNode(child as FolderNode, path)
      if (found) return found
    }
  }
  return null
}

function deleteNodeFromParent(root: FolderNode, path: string): boolean {
  root.children = root.children.filter((c) => {
    if (c.path === path) return false
    if ("children" in c) {
      return deleteNodeFromParent(c as FolderNode, path)
    }
    return true
  })
  return true
}

function getAllFilePaths(node: FolderNode): string[] {
  const paths: string[] = []
  for (const child of node.children) {
    if ("children" in child) {
      paths.push(...getAllFilePaths(child as FolderNode))
    } else {
      paths.push(child.path)
    }
  }
  return paths
}

export const useEditorStore = create<EditorState>((set, get) => ({
  workspace: createDefaultWorkspace(),
  openFiles: ["/index.js"],
  activeFile: "/index.js",
  sidebarOpen: true,
  bottomPanelTab: "terminal",
  bottomPanelHeight: 200,
  commandPaletteOpen: false,
  newFileDialogOpen: false,
  saveDialogOpen: false,
  isRunning: false,
  lastOutput: "",
  undoStacks: {},
  redoStacks: {},

  setActiveFile: (path) => set({ activeFile: path }),

  openFile: (path) => {
    const { openFiles } = get()
    if (!openFiles.includes(path)) {
      set({ openFiles: [...openFiles, path], activeFile: path })
    } else {
      set({ activeFile: path })
    }
  },

  closeFile: (path) => {
    const { openFiles, activeFile } = get()
    const newFiles = openFiles.filter((f) => f !== path)
    let newActive = activeFile
    if (activeFile === path) {
      const idx = openFiles.indexOf(path)
      newActive = newFiles[Math.min(idx, newFiles.length - 1)] || null
    }
    set({ openFiles: newFiles, activeFile: newActive })
  },

  setFileContent: (path, content) => {
    const ws = { ...get().workspace }
    const node = findNode(ws.root, path)
    if (node && "content" in node) {
      // Push to undo stack
      const oldContent = node.content
      const slug = path
      const undo = { ...get().undoStacks }
      if (!undo[slug]) undo[slug] = []
      undo[slug] = [...undo[slug].slice(-49), oldContent]
      set({ undoStacks: undo, redoStacks: { ...get().redoStacks, [slug]: [] } })

      node.content = content
      set({ workspace: ws })
    }
  },

  createFile: (path, name, language) => {
    const ws = { ...get().workspace }
    const parent = findNode(ws.root, path)
    if (parent && "children" in parent) {
      const lang = language || detectLanguage(name)
      const filePath = path === "/" ? `/${name}` : `${path}/${name}`
      parent.children = [
        ...parent.children,
        {
          name,
          path: filePath,
          content: getTemplate(lang),
          language: lang,
        },
      ]
      set({ workspace: ws })
      get().openFile(filePath)
    }
  },

  deleteFile: (path) => {
    const ws = { ...get().workspace }
    deleteNodeFromParent(ws.root, path)
    const { openFiles, activeFile } = get()
    const newFiles = openFiles.filter((f) => f !== path)
    const newActive = activeFile === path ? null : activeFile
    set({ workspace: ws, openFiles: newFiles, activeFile: newActive })
  },

  renameFile: (oldPath, newPath) => {
    const ws = { ...get().workspace }
    const node = findNode(ws.root, oldPath)
    if (node) {
      const name = newPath.split("/").pop() || node.name
      node.name = name
      if ("content" in node) {
        node.language = detectLanguage(name)
      }
      node.path = newPath
    }
    const { openFiles, activeFile } = get()
    const newFiles = openFiles.map((f) => (f === oldPath ? newPath : f))
    const newActive = activeFile === oldPath ? newPath : activeFile
    set({ workspace: ws, openFiles: newFiles, activeFile: newActive })
  },

  setWorkspace: (workspace) => {
    const files = getAllFilePaths(workspace.root)
    set({ workspace, openFiles: files.length > 0 ? [files[0]] : [], activeFile: files[0] || null })
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),
  setBottomPanelHeight: (h) => set({ bottomPanelHeight: h }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  toggleNewFileDialog: () => set((s) => ({ newFileDialogOpen: !s.newFileDialogOpen })),
  toggleSaveDialog: () => set((s) => ({ saveDialogOpen: !s.saveDialogOpen })),
  setIsRunning: (v) => set({ isRunning: v }),
  setLastOutput: (v) => set({ lastOutput: v }),

  undo: (path) => {
    const { undoStacks, redoStacks, workspace } = get()
    const stack = undoStacks[path]
    if (!stack || stack.length === 0) return
    const prev = stack[stack.length - 1]
    const node = findNode(workspace.root, path)
    if (node && "content" in node) {
      const redo = { ...redoStacks }
      if (!redo[path]) redo[path] = []
      redo[path] = [...redo[path], node.content]
      const newUndo = { ...undoStacks, [path]: stack.slice(0, -1) }
      node.content = prev
      set({ workspace: { ...workspace }, undoStacks: newUndo, redoStacks: redo })
    }
  },

  redo: (path) => {
    const { undoStacks, redoStacks, workspace } = get()
    const stack = redoStacks[path]
    if (!stack || stack.length === 0) return
    const next = stack[stack.length - 1]
    const node = findNode(workspace.root, path)
    if (node && "content" in node) {
      const undo = { ...undoStacks }
      if (!undo[path]) undo[path] = []
      undo[path] = [...undo[path], node.content]
      const newRedo = { ...redoStacks, [path]: stack.slice(0, -1) }
      node.content = next
      set({ workspace: { ...workspace }, undoStacks: undo, redoStacks: newRedo })
    }
  },

  detectLanguage,
}))

// ─── Language Templates ───

function getTemplate(language: string): string {
  const templates: Record<string, string> = {
    javascript: '// JavaScript\n\nconsole.log("Hello, LupaLearn!");\n',
    typescript: '// TypeScript\n\nconst greeting: string = "Hello, LupaLearn!";\nconsole.log(greeting);\n',
    python: '# Python\n\nprint("Hello, LupaLearn!")\n',
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>LupaLearn</title>\n</head>\n<body>\n  <h1>Hello, LupaLearn!</h1>\n</body>\n</html>\n',
    css: '/* CSS */\n\nbody {\n  background: #0a0a0a;\n  color: #00ff41;\n  font-family: monospace;\n}\n',
    rust: '// Rust\n\nfn main() {\n    println!("Hello, LupaLearn!");\n}\n',
    go: '// Go\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, LupaLearn!")\n}\n',
    java: '// Java\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, LupaLearn!");\n    }\n}\n',
  }
  return templates[language] || `// ${language}\n\nconsole.log("Hello, LupaLearn!");\n`
}

// ─── Find file content helper ───

export function getFileContent(workspace: Workspace, path: string): string {
  const node = findNode(workspace.root, path)
  if (node && "content" in node) return node.content
  return ""
}

export function getActiveFileContent(): string {
  const state = useEditorStore.getState()
  if (!state.activeFile) return ""
  return getFileContent(state.workspace, state.activeFile)
}
