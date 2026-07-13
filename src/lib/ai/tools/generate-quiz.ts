import { registerTool } from "./registry"

registerTool({
  id: "generate-quiz",
  name: "Generate Quiz",
  description: "Generate quiz questions for given concepts",
  execute: async (args) => {
    const conceptNames = (args.concepts as string[]) || []
    const count = (args.count as number) || 3

    const questions = conceptNames.slice(0, 3).flatMap((concept) =>
      Array.from({ length: Math.ceil(count / Math.max(conceptNames.length, 1)) }, (_, i) => ({
        question: `What is a key characteristic of ${concept}?`,
        options: [
          `Option A for ${concept}`,
          `Option B for ${concept}`,
          `Option C for ${concept}`,
          `Option D for ${concept}`,
        ],
        answer: "0",
        explanation: `${concept} is best described by Option A. Review the lesson to learn more.`,
        concept,
      }))
    ).slice(0, count)

    return { questions }
  },
})
