const STORAGE_KEY = "lupa-command-history"
const MAX_HISTORY = 100

let history: string[] = []

export function loadHistory(): string[] {
  if (history.length > 0) return history
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    history = stored ? JSON.parse(stored) : []
  } catch {
    history = []
  }
  return history
}

export function addToHistory(command: string): void {
  // Don't duplicate consecutive identical commands
  if (history[history.length - 1] === command) return
  history.push(command)
  if (history.length > MAX_HISTORY) {
    history = history.slice(-MAX_HISTORY)
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch { /* localStorage full or unavailable */ }
}

export function clearHistory(): void {
  history = []
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}
