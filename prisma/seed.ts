import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding LupaLearn...")

  // Clear existing data
  await prisma.edge.deleteMany()
  await prisma.roadmapStep.deleteMany()
  await prisma.roadmap.deleteMany()
  await prisma.lessonVersion.deleteMany()
  await prisma.lessonCompletion.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()
  await prisma.category.deleteMany()
  await prisma.volume.deleteMany()
  await prisma.node.deleteMany()
  await prisma.project.deleteMany()
  await prisma.challenge.deleteMany()
  await prisma.quizQuestion.deleteMany()

  // ─── CONCEPT NODES ───
  const concepts = await Promise.all([
    // Programming fundamentals
    prisma.node.create({ data: { type: "concept", slug: "variables", name: "Variables", description: "Storing and referencing data in memory" } }),
    prisma.node.create({ data: { type: "concept", slug: "data-types", name: "Data Types", description: "Types of data: integers, floats, strings, booleans" } }),
    prisma.node.create({ data: { type: "concept", slug: "operators", name: "Operators", description: "Arithmetic, relational, logical, and bitwise operators" } }),
    prisma.node.create({ data: { type: "concept", slug: "control-flow", name: "Control Flow", description: "Conditional execution with if/else and switch" } }),
    prisma.node.create({ data: { type: "concept", slug: "loops", name: "Loops", description: "Repeating execution with for, while, and do-while" } }),
    prisma.node.create({ data: { type: "concept", slug: "functions", name: "Functions", description: "Reusable blocks of code with parameters and return values" } }),
    prisma.node.create({ data: { type: "concept", slug: "scope", name: "Scope", description: "Visibility and lifetime of variables" } }),
    prisma.node.create({ data: { type: "concept", slug: "recursion", name: "Recursion", description: "Functions that call themselves" } }),
    prisma.node.create({ data: { type: "concept", slug: "arrays", name: "Arrays", description: "Ordered collections of elements" } }),
    prisma.node.create({ data: { type: "concept", slug: "strings", name: "Strings", description: "Text manipulation and processing" } }),
    prisma.node.create({ data: { type: "concept", slug: "pointers", name: "Pointers", description: "Memory addresses and indirect access" } }),
    prisma.node.create({ data: { type: "concept", slug: "memory-management", name: "Memory Management", description: "Allocation, deallocation, and memory safety" } }),

    // OOP
    prisma.node.create({ data: { type: "concept", slug: "oop", name: "Object-Oriented Programming", description: "Programming paradigm based on objects and classes" } }),
    prisma.node.create({ data: { type: "concept", slug: "classes", name: "Classes & Objects", description: "Blueprints and instances in OOP" } }),
    prisma.node.create({ data: { type: "concept", slug: "inheritance", name: "Inheritance", description: "Hierarchical relationships between classes" } }),
    prisma.node.create({ data: { type: "concept", slug: "polymorphism", name: "Polymorphism", description: "Many forms: method overriding and overloading" } }),
    prisma.node.create({ data: { type: "concept", slug: "encapsulation", name: "Encapsulation", description: "Hiding internal state and requiring access through methods" } }),
    prisma.node.create({ data: { type: "concept", slug: "abstraction", name: "Abstraction", description: "Hiding complexity, exposing essentials" } }),

    // Data structures
    prisma.node.create({ data: { type: "concept", slug: "linked-lists", name: "Linked Lists", description: "Linear data structure with nodes pointing to each other" } }),
    prisma.node.create({ data: { type: "concept", slug: "stacks-queues", name: "Stacks & Queues", description: "LIFO and FIFO data structures" } }),
    prisma.node.create({ data: { type: "concept", slug: "hash-tables", name: "Hash Tables", description: "Key-value storage with O(1) average lookup" } }),
    prisma.node.create({ data: { type: "concept", slug: "trees", name: "Trees", description: "Hierarchical data structures" } }),
    prisma.node.create({ data: { type: "concept", slug: "graphs", name: "Graphs", description: "Networks of nodes and edges" } }),

    // Algorithms
    prisma.node.create({ data: { type: "concept", slug: "searching", name: "Searching Algorithms", description: "Linear and binary search" } }),
    prisma.node.create({ data: { type: "concept", slug: "sorting", name: "Sorting Algorithms", description: "Bubble, selection, insertion, merge, quick sort" } }),
    prisma.node.create({ data: { type: "concept", slug: "complexity", name: "Time & Space Complexity", description: "Big O notation and algorithm analysis" } }),

    // Computer science
    prisma.node.create({ data: { type: "concept", slug: "binary", name: "Binary Numbers", description: "Base-2 number system used by computers" } }),
    prisma.node.create({ data: { type: "concept", slug: "boolean-logic", name: "Boolean Logic", description: "AND, OR, NOT, truth tables, logic gates" } }),
    prisma.node.create({ data: { type: "concept", slug: "algorithms", name: "Algorithms", description: "Step-by-step procedures for solving problems" } }),
    prisma.node.create({ data: { type: "concept", slug: "databases", name: "Databases", description: "Structured data storage and retrieval" } }),
    prisma.node.create({ data: { type: "concept", slug: "sql", name: "SQL", description: "Structured Query Language for relational databases" } }),
    prisma.node.create({ data: { type: "concept", slug: "http", name: "HTTP", description: "Hypertext Transfer Protocol" } }),
    prisma.node.create({ data: { type: "concept", slug: "rest-apis", name: "REST APIs", description: "Representational State Transfer API design" } }),
    prisma.node.create({ data: { type: "concept", slug: "networking", name: "Networking", description: "Computer networking fundamentals" } }),
    prisma.node.create({ data: { type: "concept", slug: "cloud", name: "Cloud Computing", description: "Cloud infrastructure and services" } }),
    prisma.node.create({ data: { type: "concept", slug: "ci-cd", name: "CI/CD", description: "Continuous integration and deployment" } }),

    // Higher-level programming concepts
    prisma.node.create({ data: { type: "concept", slug: "async-programming", name: "Async Programming", description: "Handling concurrent operations without blocking" } }),
    prisma.node.create({ data: { type: "concept", slug: "closures", name: "Closures", description: "Functions that remember their lexical scope" } }),
    prisma.node.create({ data: { type: "concept", slug: "prototypes", name: "Prototypes", description: "JavaScript's inheritance mechanism" } }),
    prisma.node.create({ data: { type: "concept", slug: "error-handling", name: "Error Handling", description: "Try/catch, exceptions, and defensive programming" } }),

    // Languages
    prisma.node.create({ data: { type: "language", slug: "python", name: "Python", description: "High-level, interpreted programming language" } }),
    prisma.node.create({ data: { type: "language", slug: "javascript", name: "JavaScript", description: "Language of the web" } }),
    prisma.node.create({ data: { type: "language", slug: "typescript", name: "TypeScript", description: "Typed superset of JavaScript" } }),
    prisma.node.create({ data: { type: "language", slug: "rust", name: "Rust", description: "Systems programming language focused on safety" } }),
    prisma.node.create({ data: { type: "language", slug: "go", name: "Go", description: "Concurrent systems language by Google" } }),
    prisma.node.create({ data: { type: "language", slug: "java", name: "Java", description: "Object-oriented, platform-independent language" } }),

    // Frameworks
    prisma.node.create({ data: { type: "framework", slug: "react", name: "React", description: "UI library for building component-based interfaces" } }),
    prisma.node.create({ data: { type: "framework", slug: "nextjs", name: "Next.js", description: "React framework with SSR, SSG, and App Router" } }),
    prisma.node.create({ data: { type: "framework", slug: "nodejs", name: "Node.js", description: "JavaScript runtime for server-side applications" } }),

    // Tools
    prisma.node.create({ data: { type: "tool", slug: "git", name: "Git", description: "Distributed version control system" } }),
    prisma.node.create({ data: { type: "tool", slug: "docker", name: "Docker", description: "Containerization platform" } }),
    prisma.node.create({ data: { type: "tool", slug: "linux", name: "Linux", description: "Open-source operating system kernel" } }),
  ])

  const nodeMap = Object.fromEntries(concepts.map(n => [n.slug, n.id]))

  // ─── EDGES (Concept Relationships) ───
  // Convention: [dependent, prerequisite, "requires"]
  // source = dependent (learned later), target = prerequisite (learned first)
  const edges = [
    // Programming fundamentals
    ["data-types", "variables", "requires"],
    ["operators", "variables", "requires"],
    ["control-flow", "variables", "requires"],
    ["control-flow", "operators", "requires"],
    ["loops", "control-flow", "requires"],
    ["functions", "variables", "requires"],
    ["functions", "control-flow", "requires"],
    ["scope", "functions", "requires"],
    ["recursion", "functions", "requires"],
    ["arrays", "variables", "requires"],
    ["strings", "variables", "requires"],
    ["strings", "arrays", "requires"],
    ["error-handling", "control-flow", "requires"],
    ["error-handling", "functions", "requires"],

    // OOP
    ["oop", "functions", "requires"],
    ["classes", "oop", "requires"],
    ["inheritance", "classes", "requires"],
    ["polymorphism", "classes", "requires"],
    ["encapsulation", "classes", "requires"],
    ["abstraction", "oop", "requires"],

    // Data structures
    ["linked-lists", "pointers", "requires"],
    ["linked-lists", "arrays", "requires"],
    ["stacks-queues", "arrays", "requires"],
    ["hash-tables", "arrays", "requires"],
    ["trees", "linked-lists", "requires"],
    ["graphs", "trees", "requires"],

    // Algorithms
    ["searching", "arrays", "requires"],
    ["sorting", "arrays", "requires"],
    ["complexity", "algorithms", "requires"],

    // Advanced topics
    ["async-programming", "functions", "requires"],
    ["closures", "functions", "requires"],
    ["prototypes", "oop", "requires"],
    ["databases", "sql", "requires"],
    ["rest-apis", "http", "requires"],
    ["http", "networking", "requires"],
    ["cloud", "networking", "requires"],
    ["ci-cd", "git", "requires"],
    ["docker", "linux", "requires"],
    ["algorithms", "functions", "requires"],

    // Language → concepts
    ["python", "variables", "teaches"],
    ["python", "functions", "teaches"],
    ["python", "oop", "teaches"],
    ["javascript", "variables", "teaches"],
    ["javascript", "functions", "teaches"],
    ["javascript", "closures", "teaches"],
    ["javascript", "prototypes", "teaches"],
    ["javascript", "async-programming", "teaches"],
    ["rust", "variables", "teaches"],
    ["rust", "memory-management", "teaches"],
    ["rust", "pointers", "teaches"],
    ["typescript", "javascript", "teaches"],
    ["typescript", "variables", "teaches"],
    ["go", "variables", "teaches"],
    ["go", "functions", "teaches"],
    ["java", "variables", "teaches"],
    ["java", "oop", "teaches"],

    // Related concepts
    ["closures", "functions", "related_to"],
    ["async-programming", "functions", "related_to"],
    ["recursion", "functions", "related_to"],
    ["pointers", "memory-management", "related_to"],
    ["sql", "databases", "related_to"],
  ]

  for (const [source, target, type] of edges) {
    if (nodeMap[source] && nodeMap[target]) {
      await prisma.edge.create({
        data: { sourceId: nodeMap[source], targetId: nodeMap[target], relationType: type, strength: 8 },
      })
    }
  }

  // ─── VOLUME 1 (School of CS) ───
  const v1 = await prisma.volume.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1, slug: "computer-science",
      title: "School of Computer Science", subtitle: "CS Fundamentals",
      description: "Master the foundations of computer science.",
      icon: "cpu", color: "#00ff41", status: "active", order: 1,
    },
  })

  const catProg = await prisma.category.create({
    data: { volumeId: v1.id, slug: "programming-fundamentals", title: "Programming Fundamentals", order: 7 },
  })

  const mod1 = await prisma.module.create({
    data: { categoryId: catProg.id, slug: "variables-data-types", title: "Variables & Data Types", order: 1 },
  })

  // ─── LESSONS ───
  const lessonData = [
    { slug: "what-are-variables", title: "What Are Variables?", description: "Learn how computers store and reference data using variables.", contentPath: "lessons/volume-01/course-07/01-variables/01-what-are-variables.mdx", moduleId: mod1.id, order: 1, duration: 15, xpReward: 20, tags: JSON.stringify(["variables", "fundamentals", "memory"]) },
    { slug: "data-types-in-python", title: "Data Types in Python", description: "Explore Python's built-in types: int, float, str, bool, and more.", contentPath: "lessons/volume-01/course-07/01-variables/02-data-types.mdx", moduleId: mod1.id, order: 2, duration: 20, xpReward: 25, tags: JSON.stringify(["python", "data-types", "fundamentals"]) },
    { slug: "variables-in-javascript", title: "Variables in JavaScript", description: "var, let, const — understanding JavaScript variable declarations.", contentPath: "lessons/volume-01/course-07/01-variables/03-variables-js.mdx", moduleId: mod1.id, order: 3, duration: 20, xpReward: 25, tags: JSON.stringify(["javascript", "variables", "scope"]) },
    { slug: "operators-expressions", title: "Operators & Expressions", description: "Arithmetic, comparison, logical, and assignment operators.", contentPath: "lessons/volume-01/course-07/02-operators/01-operators.mdx", moduleId: mod1.id, order: 4, duration: 20, xpReward: 25, tags: JSON.stringify(["operators", "expressions"]) },
    { slug: "control-flow-if-else", title: "Control Flow: If/Else", description: "Make decisions in your code with conditionals.", contentPath: "lessons/volume-01/course-07/03-control-flow/01-if-else.mdx", moduleId: mod1.id, order: 5, duration: 20, xpReward: 30, tags: JSON.stringify(["control-flow", "conditionals"]) },
    { slug: "loops-for-while", title: "Loops: For & While", description: "Repeat code efficiently using loops.", contentPath: "lessons/volume-01/course-07/04-loops/01-loops.mdx", moduleId: mod1.id, order: 6, duration: 25, xpReward: 30, tags: JSON.stringify(["loops", "iteration"]) },
    { slug: "functions-basics", title: "Functions: The Building Blocks", description: "Write reusable code with functions.", contentPath: "lessons/volume-01/course-07/05-functions/01-functions-basics.mdx", moduleId: mod1.id, order: 7, duration: 25, xpReward: 35, tags: JSON.stringify(["functions", "reusability"]) },
    { slug: "scope-closures", title: "Scope & Closures", description: "Understand variable visibility and how closures work.", contentPath: "lessons/volume-01/course-07/05-functions/02-scope-closures.mdx", moduleId: mod1.id, order: 8, duration: 30, xpReward: 40, tags: JSON.stringify(["scope", "closures", "javascript"]) },
    { slug: "recursion", title: "Recursion: Functions That Call Themselves", description: "Solve problems by breaking them into smaller versions of themselves.", contentPath: "lessons/volume-01/course-07/05-functions/03-recursion.mdx", moduleId: mod1.id, order: 9, duration: 30, xpReward: 45, tags: JSON.stringify(["recursion", "functions"]) },
    { slug: "binary-numbers", title: "Binary Numbers & Bit Manipulation", description: "How computers represent numbers in binary.", contentPath: "lessons/volume-01/course-02-number-systems/01-binary/binary-numbers.mdx", moduleId: mod1.id, order: 10, duration: 25, xpReward: 35, tags: JSON.stringify(["binary", "number-systems"]) },
    { slug: "error-handling-basics", title: "Error Handling Basics", description: "Try/catch, exceptions, and writing defensive code.", contentPath: "lessons/volume-01/course-07/06-error-handling/01-error-handling.mdx", moduleId: mod1.id, order: 11, duration: 20, xpReward: 30, tags: JSON.stringify(["error-handling", "debugging"]) },
    { slug: "intro-to-oop", title: "Introduction to OOP", description: "Understand object-oriented programming concepts.", contentPath: "lessons/volume-01/course-07/07-oop/01-intro-oop.mdx", moduleId: mod1.id, order: 12, duration: 25, xpReward: 35, tags: JSON.stringify(["oop", "classes"]) },
    { slug: "git-basics", title: "Git Basics", description: "Version control fundamentals with Git.", contentPath: "lessons/volume-01/course-09/01-git/01-git-basics.mdx", moduleId: mod1.id, order: 13, duration: 30, xpReward: 40, tags: JSON.stringify(["git", "version-control"]) },
  ]

  const lessons = await Promise.all(
    lessonData.map((l) => prisma.lesson.create({ data: l }))
  )

  const lessonMap = Object.fromEntries(lessons.map(l => [l.slug, l.id]))

  // Create nodes for each lesson
  const lessonNodes = await Promise.all(
    lessons.map((l) =>
      prisma.node.create({
        data: { type: "lesson", slug: `lesson-${l.slug}`, name: l.title, description: l.description },
      })
    )
  )
  const lessonNodeMap = Object.fromEntries(lessonNodes.map((n, i) => [lessons[i].slug, n.id]))

  // ─── CONNECT LESSONS TO CONCEPTS ───
  const lessonEdges = [
    ["what-are-variables", "variables"],
    ["data-types-in-python", "data-types"],
    ["data-types-in-python", "python"],
    ["variables-in-javascript", "variables"],
    ["variables-in-javascript", "javascript"],
    ["operators-expressions", "operators"],
    ["control-flow-if-else", "control-flow"],
    ["loops-for-while", "loops"],
    ["functions-basics", "functions"],
    ["scope-closures", "scope"],
    ["scope-closures", "closures"],
    ["recursion", "recursion"],
    ["binary-numbers", "binary"],
    ["error-handling-basics", "error-handling"],
    ["intro-to-oop", "oop"],
    ["intro-to-oop", "classes"],
    ["git-basics", "git"],
  ]

  for (const [lessonSlug, conceptSlug] of lessonEdges) {
    const lessonNodeId = lessonNodeMap[lessonSlug]
    const conceptId = nodeMap[conceptSlug]
    if (lessonNodeId && conceptId) {
      await prisma.edge.create({
        data: { sourceId: lessonNodeId, targetId: conceptId, relationType: "teaches", strength: 10 },
      })
    }
  }

  // ─── ROADMAP: Backend Developer ───
  const roadmap = await prisma.roadmap.create({
    data: {
      slug: "backend-developer",
      title: "Backend Developer Path",
      description: "Complete path from fundamentals to job-ready backend developer.",
      type: "system", goal: "Become a backend developer",
      difficulty: "beginner", estimatedHours: 200,
    },
  })

  const pathConcepts = ["variables", "data-types", "control-flow", "loops", "functions",
    "oop", "databases", "sql", "http", "rest-apis", "git", "linux"]
  for (let i = 0; i < pathConcepts.length; i++) {
    const nodeId = nodeMap[pathConcepts[i]]
    if (nodeId) {
      await prisma.roadmapStep.create({
        data: { roadmapId: roadmap.id, nodeId, order: i + 1 },
      })
    }
  }

  // ─── VERIFICATION ───
  const allConcepts = await prisma.node.findMany({ where: { type: "concept" } })
  let orphanCount = 0
  for (const concept of allConcepts) {
    const incoming = await prisma.edge.count({
      where: { targetId: concept.id, relationType: "teaches", source: { type: "lesson" } },
    })
    if (incoming === 0) {
      console.log(`  ⚠ No lesson teaches: ${concept.name}`)
      orphanCount++
    }
  }

  console.log("✅ Seed complete!")
  console.log(`   ${concepts.length} concept nodes`)
  console.log(`   ${edges.length} concept edges`)
  console.log(`   ${lessonEdges.length} lesson→concept edges`)
  console.log(`   ${lessons.length} lessons`)
  console.log(`   ${pathConcepts.length} roadmap steps`)
  console.log(`   ${orphanCount} concepts without linked lessons`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
