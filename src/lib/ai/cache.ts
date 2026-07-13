type CacheEntry = {
  response: string
  createdAt: number
  hits: number
}

const cache = new Map<string, CacheEntry>()
const TTL_MS = 1000 * 60 * 60 // 1 hour

function buildKey(messages: Array<{ role: string; content: string }>): string {
  const last = messages[messages.length - 1]
  if (!last) return ""
  // Only cache simple explain-like queries (short user messages)
  if (last.content.length > 200) return ""
  return `tutor:${last.content.toLowerCase().trim().slice(0, 100)}`
}

export function getCached(messages: Array<{ role: string; content: string }>): string | null {
  const key = buildKey(messages)
  if (!key) return null
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.createdAt > TTL_MS) {
    cache.delete(key)
    return null
  }
  entry.hits++
  return entry.response
}

export function setCached(messages: Array<{ role: string; content: string }>, response: string): void {
  const key = buildKey(messages)
  if (!key) return
  cache.set(key, { response, createdAt: Date.now(), hits: 1 })
}

export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.entries()).map(([k, v]) => ({
      key: k,
      hits: v.hits,
      age: Math.round((Date.now() - v.createdAt) / 1000) + "s",
    })),
  }
}
