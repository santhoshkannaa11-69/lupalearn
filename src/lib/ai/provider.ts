import type { AIProviderConfig, StreamChunk } from "./types"

type ProviderResponse = {
  stream: AsyncGenerator<StreamChunk>
  text: Promise<string>
}

export function createProvider(config?: AIProviderConfig): {
  complete: (messages: Array<{ role: string; content: string }>) => ProviderResponse
} {
  const openRouterKey = config?.apiKey || process.env.OPENROUTER_API_KEY || ""
  const groqKey = process.env.GROQ_API_KEY || ""

  if (openRouterKey) {
    return createOpenAICompatibleProvider(openRouterKey, config?.model || "openai/gpt-4o-mini", "https://openrouter.ai/api/v1")
  }
  if (groqKey) {
    return createOpenAICompatibleProvider(groqKey, config?.model || "llama-3.3-70b-versatile", "https://api.groq.com/openai/v1")
  }
  return createSimulatedProvider()
}

// ─── OpenAI-compatible provider (OpenRouter / Groq) ───

function createOpenAICompatibleProvider(apiKey: string, model: string, baseUrl: string) {
  return {
    complete: (messages: Array<{ role: string; content: string }>): ProviderResponse => {
      let fullText = ""
      const stream: AsyncGenerator<StreamChunk> = (async function* () {
        try {
          const res = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model, messages, stream: true }),
          })
          if (!res.ok || !res.body) {
            yield { type: "error" as const, data: `API error: ${res.status}` }
            return
          }
          const reader = res.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ""
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") { yield { type: "done" as const, data: fullText }; return }
                try {
                  const json = JSON.parse(data)
                  const token = json.choices?.[0]?.delta?.content || ""
                  if (token) { fullText += token; yield { type: "token" as const, data: token } }
                } catch { /* skip */ }
              }
            }
          }
          yield { type: "done" as const, data: fullText }
        } catch (e) {
          yield { type: "error" as const, data: String(e) }
        }
      })()
      return { stream, text: (async () => { for await (const _ of stream) { /* drain */ }; return fullText })() }
    },
  }
}

// ─── Simulated Provider ───
// Professional responses that stream fast and reference real concepts

function createSimulatedProvider() {
  return {
    complete: (messages: Array<{ role: string; content: string }>): ProviderResponse => {
      const lastMsg = messages[messages.length - 1]?.content || ""
      const response = buildResponse(lastMsg)
      const chunks = splitIntoChunks(response, 3)

      const stream: AsyncGenerator<StreamChunk> = (async function* () {
        for (const chunk of chunks) {
          await new Promise((r) => setTimeout(r, 8))
          yield { type: "token" as const, data: chunk }
        }
        yield { type: "done" as const, data: response }
      })()

      return { stream, text: Promise.resolve(response) }
    },
  }
}

function splitIntoChunks(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/(?<=\s)/)
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(""))
  }
  return chunks
}

// ─── Dynamic Response Builder ───
// Generates unique, varied responses based on the actual user query

function buildResponse(query: string): string {
  const keyTerms = extractKeyTerms(query)
  const topic = keyTerms.length > 0 ? keyTerms[0] : query.trim().split(/\s+/).slice(0, 3).join(" ") || "this concept"
  const lang = detectLanguage(query)
  const responseType = classifyQuery(query)
  const seed = hashStr(query)

  return generateResponse(topic, lang, responseType, keyTerms, seed)
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}

function extractKeyTerms(query: string): string[] {
  const known = ["variables","functions","recursion","loops","arrays","objects","classes","promises","async","await","callbacks","closures","prototypes","scope","hoisting","events","DOM","CSS","HTML","React","Node","Python","Rust","Go","Java","TypeScript","SQL","Git","Docker","Linux","HTTP","API","REST","GraphQL","JSON","algorithm","data structure","linked list","stack","queue","tree","graph","sorting","searching","big O","complexity","OOP","inheritance","polymorphism","encapsulation","abstraction","interface","module","package","dependency","testing","debugging","error handling","security","performance","optimization","design pattern","singleton","factory","observer","MVC","middleware","web socket","SSR","SSG","CSR","JWT","OAuth","cors","types","strings","numbers","booleans","null","undefined","NaN","operators","conditions","switch","if else","ternary","map","filter","reduce","spread","rest","destructuring","template literal","arrow function","promise all","race","allSettled","try catch","finally","throw","class","extends","super","static","getter","setter","memoization","currying","composition","piping","throttling","debouncing","mutation","immutability","pure function","side effect","higher order","callback","closure","IIFE","module pattern","prototype chain","this binding","call","apply","bind","new","instanceof","typeof","void","delete","in","with","eval","global","strict mode","ECMAScript","ES6","ES2015","ES2020","ES2021","ES2022","ES2023","TC39","polyfill","transpile","bundler","webpack","vite","rollup","esbuild","babel","prettier","eslint","tsc","npm","yarn","pnpm","npx","node_modules","package.json","lock file","semver","workspace","monorepo","turbo","lerna","nx"]
  return known.filter((k) => query.toLowerCase().includes(k)).slice(0, 3)
}

function detectLanguage(query: string): string {
  const langs = { javascript: ["javascript","js","node","react","vue","angular","next","nuxt","svelte","solid","express","typescript"], python: ["python","django","flask","fastapi","pandas","numpy","jupyter"], rust: ["rust","cargo","tokio"], go: ["golang","go "], java: ["java","spring","maven","gradle"], cpp: ["c++","cpp","c plus plus"], html: ["html","dom","css","scss","sass","tailwind","bootstrap"] }
  for (const [lang, keywords] of Object.entries(langs)) {
    if (keywords.some((k) => query.toLowerCase().includes(k))) return lang
  }
  return "javascript"
}

function classifyQuery(query: string): "explain" | "compare" | "howto" | "debug" | "why" | "general" {
  const q = query.toLowerCase()
  if (q.includes("difference") || q.includes(" vs ") || q.includes("versus") || q.includes("compare")) return "compare"
  if (q.includes("how to") || q.includes("how do") || q.includes("implement") || q.includes("write")) return "howto"
  if (q.includes("error") || q.includes("bug") || q.includes("broken") || q.includes("not working") || q.includes("fix")) return "debug"
  if (q.startsWith("why")) return "why"
  if (q.startsWith("what") || q.startsWith("explain") || q.startsWith("define") || q.startsWith("tell me")) return "explain"
  return "general"
}

function generateResponse(topic: string, lang: string, type: string, keyTerms: string[], seed: number): string {
  const heading = responseHeading(topic, type, seed)
  const explanation = responseExplanation(topic, lang, type, keyTerms, seed)
  const example = responseExample(topic, lang, seed)
  const connection = responseConnection(topic, keyTerms, seed)
  const nextSteps = responseNextSteps(topic, type, seed)

  return `${heading}\n\n${explanation}\n\n${example}\n\n${connection}\n\n${nextSteps}`
}

function pick<T>(arr: T[], seed: number, offset: number = 0): T {
  return arr[(seed + offset) % arr.length]
}

function responseHeading(topic: string, type: string, seed: number): string {
  const h = pick([
    `## ${capitalize(topic)}`,
    `## Understanding ${capitalize(topic)}`,
    `## ${capitalize(topic)} — Overview`,
    `## Let's Explore ${capitalize(topic)}`,
    `## ${capitalize(topic)}: Core Concepts`,
  ], seed, 0)
  return h
}

function responseExplanation(topic: string, lang: string, type: string, keyTerms: string[], seed: number): string {
  const ex = pick([
    `${capitalize(topic)} is a fundamental concept in ${lang} programming. It allows developers to write cleaner, more maintainable code by following established patterns. Understanding this deeply will help you build more robust applications.`,
    `At its core, ${topic} in ${lang} is about writing code that is easier to reason about and maintain. This concept helps you structure your programs in a way that scales well as complexity grows.`,
    `Think of ${topic} as a tool that simplifies how you write ${lang} code. Instead of repeating yourself or writing complex logic, this approach gives you a cleaner, more expressive way to accomplish your goals.`,
    `${capitalize(topic)} builds on the programming fundamentals you've already learned. In ${lang}, it's one of the most important concepts to master because it appears in almost every non-trivial project.`,
    `When working with ${topic} in ${lang}, the key insight is that it changes how you think about structuring your code. It shifts your mental model from step-by-step instructions to higher-level patterns.`,
  ], seed, 1)
  return ex
}

function responseExample(topic: string, lang: string, seed: number): string {
  const examples = pick([
    `\`\`\`${lang}
// ${capitalize(topic)} in ${lang} — practical example
function workWith${capitalize(topic).replace(/\\s/g, "")}() {
  const items = ["learn", "practice", "build"];
  const result = items.map(item => \`\$\{item} — $\{topic}\`);
  console.log(result);
  return result;
}
workWith${capitalize(topic).replace(/\\s/g, "")}();
\`\`\``,
    `\`\`\`${lang}
// Example: ${capitalize(topic)} in action
const data = ["concept", "application", "mastery"];
const processed = data
  .filter(item => item.length > 5)
  .map(item => item.toUpperCase());
console.log("Result:", processed);
\`\`\``,
    `\`\`\`${lang}
// Quick example of ${topic}
function handle${capitalize(topic).replace(/\\s/g, "")}(input) {
  const result = input || "default value";
  console.log(\`Processing: $\{result}\`);
  return result;
}
handle${capitalize(topic).replace(/\\s/g, "")}("learning LupaLearn");
\`\`\``,
  ], seed, 2)
  return examples
}

function responseConnection(topic: string, keyTerms: string[], seed: number): string {
  const conns = pick([
    `### Explore the Knowledge Graph\n\n${capitalize(topic)} connects to other concepts in the **School of Computer Science**. Use the **Explorer** mode (\`⌘K\`) to discover these relationships and see how ${topic} fits into the bigger picture of your learning journey.`,
    `### Related Topics\n\n${capitalize(topic)} is part of a broader set of concepts in the curriculum. To see how it connects to related topics like the ones you've been studying, open the [Explorer](/explore) and search for "${topic}".`,
    `### Learning Path Connection\n\n${capitalize(topic)} appears in multiple learning paths on LupaLearn. Whether you're following the **Guided** curriculum or exploring freely, this concept is a building block for more advanced material.`,
  ], seed, 3)
  return conns
}

function responseNextSteps(topic: string, type: string, seed: number): string {
  const steps = pick([
    `### What's Next?\n\n1. **Practice** — Open the [Playground](/playground) and experiment with ${topic}\n2. **Quiz yourself** — Say "quiz me on ${topic}" to test your knowledge\n3. **Dive deeper** — Ask "tell me more about ${topic}" for advanced details\n4. **Review code** — Paste your code and ask "review this"\n5. **Explore** — Search [Explorer](/explore?q=${encodeURIComponent(topic)}) for related lessons`,
    `### Next Steps\n\n- Try writing ${topic} code in the [Playground](/playground)\n- Say "generate a quiz" to test your understanding\n- Ask "how does this relate to other concepts" to see connections\n- Search for "${topic}" in [Explorer](/explore?q=${encodeURIComponent(topic)})`,
    `### Keep Learning\n\nHere's what you can do:\n\n1. **Experiment** — Use the [Playground](/playground) to write and run code\n2. **Practice** — Say "quiz me" for a quick knowledge check\n3. **Explore further** — Ask about related topics or search in [Explorer](/explore)\n4. **Review** — Paste your existing code and ask for a review`,
  ], seed, 4)
  return steps
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
