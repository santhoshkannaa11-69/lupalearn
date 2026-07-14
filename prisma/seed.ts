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

    // Technologies & languages
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

    // Higher-level concepts
    prisma.node.create({ data: { type: "concept", slug: "async-programming", name: "Async Programming", description: "Handling concurrent operations without blocking" } }),
    prisma.node.create({ data: { type: "concept", slug: "closures", name: "Closures", description: "Functions that remember their lexical scope" } }),
    prisma.node.create({ data: { type: "concept", slug: "prototypes", name: "Prototypes", description: "JavaScript's inheritance mechanism" } }),
    prisma.node.create({ data: { type: "concept", slug: "http", name: "HTTP", description: "Hypertext Transfer Protocol" } }),
    prisma.node.create({ data: { type: "concept", slug: "rest-apis", name: "REST APIs", description: "Representational State Transfer API design" } }),
    prisma.node.create({ data: { type: "concept", slug: "databases", name: "Databases", description: "Structured data storage and retrieval" } }),
    prisma.node.create({ data: { type: "concept", slug: "sql", name: "SQL", description: "Structured Query Language for relational databases" } }),
  ])

  const nodeMap = Object.fromEntries(concepts.map(n => [n.slug, n.id]))

  // ─── EDGES (Concept Relationships) ───
  // Convention: [dependent, prerequisite, "requires"]
  // source = dependent (learned later), target = prerequisite (learned first)
  const edges = [
    // Programming fundamentals prerequisites
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

    // OOP prerequisites
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

    // Related concepts
    ["closures", "functions", "related_to"],
    ["async-programming", "functions", "related_to"],
    ["recursion", "functions", "related_to"],
    ["pointers", "memory-management", "related_to"],
  ]

  for (const [source, target, type] of edges) {
    if (nodeMap[source] && nodeMap[target]) {
      await prisma.edge.create({
        data: {
          sourceId: nodeMap[source],
          targetId: nodeMap[target],
          relationType: type,
          strength: 8,
        },
      })
    }
  }

  // ─── VOLUME 1 (School of CS) ───
  const v1 = await prisma.volume.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
      slug: "computer-science",
      title: "School of Computer Science",
      subtitle: "CS Fundamentals",
      description: "Master the foundations of computer science.",
      icon: "cpu",
      color: "#00ff41",
      status: "active",
      order: 1,
    },
  })

  // ─── ALL 10 COURSES (Categories) ───
  const courseDefs = [
    { slug: "introduction-to-computing", title: "Introduction to Computing", order: 1, modules: [
      { slug: "what-is-a-computer", title: "What is a Computer?", order: 1 }, { slug: "history-of-computing", title: "History of Computing", order: 2 }, { slug: "generations", title: "Generations of Computers", order: 3 }, { slug: "types-of-computers", title: "Types of Computers", order: 4 }, { slug: "computer-components", title: "Computer Components", order: 5 }, { slug: "architecture-overview", title: "Architecture Overview", order: 6 }, { slug: "hardware-vs-software", title: "Hardware vs Software", order: 7 }, { slug: "computer-applications", title: "Computer Applications", order: 8 }, { slug: "future-of-computing", title: "Future of Computing", order: 9 },
    ]},
    { slug: "number-systems", title: "Number Systems", order: 2, modules: [
      { slug: "decimal-system", title: "Decimal System", order: 1 }, { slug: "binary-system", title: "Binary System", order: 2 }, { slug: "octal-system", title: "Octal System", order: 3 }, { slug: "hexadecimal-system", title: "Hexadecimal System", order: 4 }, { slug: "conversions", title: "Conversions Between Bases", order: 5 }, { slug: "binary-arithmetic", title: "Binary Arithmetic", order: 6 },
    ]},
    { slug: "data-representation", title: "Data Representation", order: 3, modules: [
      { slug: "bits-and-bytes", title: "Bits & Bytes", order: 1 }, { slug: "character-encoding", title: "Character Encoding", order: 2 }, { slug: "image-representation", title: "Image Representation", order: 3 }, { slug: "audio-representation", title: "Audio Representation", order: 4 }, { slug: "compression", title: "Compression", order: 5 },
    ]},
    { slug: "logic-boolean-algebra", title: "Logic & Boolean Algebra", order: 4, modules: [
      { slug: "boolean-basics", title: "Boolean Algebra Basics", order: 1 }, { slug: "logic-gates", title: "Logic Gates", order: 2 }, { slug: "boolean-laws", title: "Boolean Laws", order: 3 }, { slug: "karnaugh-maps", title: "Karnaugh Maps", order: 4 }, { slug: "logic-simplification", title: "Logic Simplification", order: 5 },
    ]},
    { slug: "digital-electronics", title: "Digital Electronics", order: 5, modules: [
      { slug: "combinational-circuits", title: "Combinational Circuits", order: 1 }, { slug: "sequential-circuits", title: "Sequential Circuits", order: 2 }, { slug: "multiplexers", title: "Multiplexers & Demultiplexers", order: 3 }, { slug: "flip-flops", title: "Flip-Flops", order: 4 }, { slug: "counters", title: "Counters", order: 5 }, { slug: "finite-state-machines", title: "Finite State Machines", order: 6 },
    ]},
    { slug: "mathematics", title: "Mathematics for Computer Science", order: 6, modules: [
      { slug: "set-theory", title: "Set Theory", order: 1 }, { slug: "relations-functions", title: "Relations & Functions", order: 2 }, { slug: "matrices", title: "Matrices", order: 3 }, { slug: "probability", title: "Probability", order: 4 }, { slug: "graph-theory", title: "Graph Theory", order: 5 }, { slug: "number-theory", title: "Number Theory", order: 6 },
    ]},
    { slug: "programming-fundamentals", title: "Programming Fundamentals", order: 7, modules: [
      { slug: "what-is-programming", title: "What is Programming?", order: 1 }, { slug: "variables-data-types", title: "Variables & Data Types", order: 2 }, { slug: "operators-expressions", title: "Operators & Expressions", order: 3 }, { slug: "control-flow", title: "Control Flow", order: 4 }, { slug: "loops", title: "Loops", order: 5 }, { slug: "functions", title: "Functions", order: 6 }, { slug: "scope-closures", title: "Scope & Closures", order: 7 }, { slug: "recursion", title: "Recursion", order: 8 }, { slug: "error-handling", title: "Error Handling", order: 9 }, { slug: "projects", title: "Projects", order: 10 },
    ]},
    { slug: "problem-solving", title: "Problem Solving", order: 8, modules: [
      { slug: "computational-thinking", title: "Computational Thinking", order: 1 }, { slug: "decomposition", title: "Decomposition", order: 2 }, { slug: "pattern-recognition", title: "Pattern Recognition", order: 3 }, { slug: "abstraction", title: "Abstraction", order: 4 }, { slug: "algorithm-design", title: "Algorithm Design", order: 5 },
    ]},
    { slug: "development-environment", title: "Development Environment", order: 9, modules: [
      { slug: "command-line", title: "Command Line Basics", order: 1 }, { slug: "version-control", title: "Version Control (Git)", order: 2 }, { slug: "code-editors", title: "Code Editors", order: 3 }, { slug: "package-managers", title: "Package Managers", order: 4 }, { slug: "debugging-tools", title: "Debugging Tools", order: 5 },
    ]},
    { slug: "computer-ethics", title: "Computer Ethics", order: 10, modules: [
      { slug: "open-source", title: "Open Source", order: 1 }, { slug: "privacy", title: "Privacy & Data Protection", order: 2 }, { slug: "security-ethics", title: "Security & Ethics", order: 3 }, { slug: "ai-ethics", title: "AI Ethics", order: 4 }, { slug: "professional-conduct", title: "Professional Conduct", order: 5 },
    ]},
  ]

  // Create categories and modules
  const catMap: Record<string, string> = {}
  const modMap: Record<string, string> = {}

  for (const course of courseDefs) {
    const cat = await prisma.category.create({
      data: { volumeId: v1.id, slug: course.slug, title: course.title, order: course.order },
    })
    catMap[course.slug] = cat.id

    for (const mod of course.modules) {
      const m = await prisma.module.create({
        data: { categoryId: cat.id, slug: mod.slug, title: mod.title, order: mod.order },
      })
      modMap[mod.slug] = m.id
    }
  }

  const BASE_PATH = "lessons/volume-01/course-07-programming-fundamentals"

  // All 45 lessons organized by module
  const lessonData = [
    // Module 1: What is Programming? (5)
    { slug: "what-is-a-program", title: "What Is a Program?", description: "Learn what a computer program actually is.", contentPath: `${BASE_PATH}/01-what-is-programming/01-what-is-a-program.mdx`, moduleSlug: "what-is-programming", order: 1, duration: 15, xp: 20, tags: ["programming", "fundamentals"], concepts: ["algorithms"] },
    { slug: "how-computers-execute-code", title: "How Computers Execute Code", description: "Understand the fetch-decode-execute cycle.", contentPath: `${BASE_PATH}/01-what-is-programming/02-how-computers-execute-code.mdx`, moduleSlug: "what-is-programming", order: 2, duration: 15, xp: 20, tags: ["computers", "execution"], concepts: ["algorithms"] },
    { slug: "programming-languages-overview", title: "Programming Languages Overview", description: "Explore different programming languages.", contentPath: `${BASE_PATH}/01-what-is-programming/03-programming-languages-overview.mdx`, moduleSlug: "what-is-programming", order: 3, duration: 15, xp: 15, tags: ["languages"], concepts: ["algorithms"] },
    { slug: "your-development-environment", title: "Your Development Environment", description: "Set up and use the LupaLearn Playground.", contentPath: `${BASE_PATH}/01-what-is-programming/04-your-development-environment.mdx`, moduleSlug: "what-is-programming", order: 4, duration: 15, xp: 20, tags: ["tools", "setup"], concepts: ["algorithms"] },
    { slug: "thinking-like-a-programmer", title: "Thinking Like a Programmer", description: "Learn problem-solving strategies.", contentPath: `${BASE_PATH}/01-what-is-programming/05-thinking-like-a-programmer.mdx`, moduleSlug: "what-is-programming", order: 5, duration: 20, xp: 25, tags: ["problem-solving", "mindset"], concepts: ["algorithms"] },

    // Module 2: Variables & Data Types (1 golden + 5 more planned)
    { slug: "variables-data-types", title: "Variables & Data Types", description: "Master variables and data types in programming.", contentPath: `${BASE_PATH}/02-variables-data-types/01-variables-data-types.mdx`, moduleSlug: "variables-data-types", order: 1, duration: 20, xp: 30, tags: ["variables", "data-types"], concepts: ["variables", "data-types"] },

    // Module 3: Operators & Expressions (5)
    { slug: "intro-to-operators", title: "Introduction to Operators", description: "Learn arithmetic operators and expressions.", contentPath: `${BASE_PATH}/03-operators-expressions/01-intro-to-operators.mdx`, moduleSlug: "operators-expressions", order: 1, duration: 15, xp: 20, tags: ["operators"], concepts: ["operators"] },
    { slug: "comparison-operators", title: "Comparison Operators", description: "Compare values with comparison operators.", contentPath: `${BASE_PATH}/03-operators-expressions/02-comparison-operators.mdx`, moduleSlug: "operators-expressions", order: 2, duration: 15, xp: 20, tags: ["comparison"], concepts: ["operators"] },
    { slug: "logical-operators", title: "Logical Operators", description: "Combine conditions with AND, OR, NOT.", contentPath: `${BASE_PATH}/03-operators-expressions/03-logical-operators.mdx`, moduleSlug: "operators-expressions", order: 3, duration: 15, xp: 25, tags: ["logic"], concepts: ["operators", "boolean-logic"] },
    { slug: "operator-precedence", title: "Operator Precedence", description: "Understand the order of operations.", contentPath: `${BASE_PATH}/03-operators-expressions/04-operator-precedence.mdx`, moduleSlug: "operators-expressions", order: 4, duration: 15, xp: 20, tags: ["precedence"], concepts: ["operators"] },
    { slug: "building-expressions", title: "Building Expressions", description: "Build complex expressions from simple ones.", contentPath: `${BASE_PATH}/03-operators-expressions/05-building-expressions.mdx`, moduleSlug: "operators-expressions", order: 5, duration: 20, xp: 30, tags: ["expressions"], concepts: ["operators"] },

    // Module 4: Control Flow (5)
    { slug: "if-else-basics", title: "If/Else Basics", description: "Make decisions in code with if/else.", contentPath: `${BASE_PATH}/04-control-flow/01-if-else-basics.mdx`, moduleSlug: "control-flow", order: 1, duration: 20, xp: 30, tags: ["conditionals"], concepts: ["control-flow"] },
    { slug: "conditional-chaining", title: "Conditional Chaining", description: "Chain multiple conditions together.", contentPath: `${BASE_PATH}/04-control-flow/02-conditional-chaining.mdx`, moduleSlug: "control-flow", order: 2, duration: 15, xp: 25, tags: ["conditionals"], concepts: ["control-flow"] },
    { slug: "switch-statements", title: "Switch Statements", description: "Use switch for fixed-value conditions.", contentPath: `${BASE_PATH}/04-control-flow/03-switch-statements.mdx`, moduleSlug: "control-flow", order: 3, duration: 15, xp: 25, tags: ["switch"], concepts: ["control-flow"] },
    { slug: "ternary-operator", title: "Ternary Operator", description: "Shorthand if/else with the ternary operator.", contentPath: `${BASE_PATH}/04-control-flow/04-ternary-operator.mdx`, moduleSlug: "control-flow", order: 4, duration: 15, xp: 20, tags: ["ternary"], concepts: ["control-flow"] },
    { slug: "nested-conditionals", title: "Nested Conditionals", description: "Nest if statements inside other if statements.", contentPath: `${BASE_PATH}/04-control-flow/05-nested-conditionals.mdx`, moduleSlug: "control-flow", order: 5, duration: 20, xp: 30, tags: ["nesting"], concepts: ["control-flow"] },

    // Module 5: Loops (5)
    { slug: "for-loops", title: "For Loops", description: "Repeat code with for loops.", contentPath: `${BASE_PATH}/05-loops/01-for-loops.mdx`, moduleSlug: "loops", order: 1, duration: 20, xp: 30, tags: ["for-loops"], concepts: ["loops"] },
    { slug: "while-loops", title: "While Loops", description: "Use while loops for conditional repetition.", contentPath: `${BASE_PATH}/05-loops/02-while-loops.mdx`, moduleSlug: "loops", order: 2, duration: 15, xp: 25, tags: ["while-loops"], concepts: ["loops"] },
    { slug: "loop-control", title: "Loop Control: Break and Continue", description: "Control loop execution with break and continue.", contentPath: `${BASE_PATH}/05-loops/03-loop-control.mdx`, moduleSlug: "loops", order: 3, duration: 15, xp: 25, tags: ["break-continue"], concepts: ["loops"] },
    { slug: "nested-loops", title: "Nested Loops", description: "Nest loops inside other loops.", contentPath: `${BASE_PATH}/05-loops/04-nested-loops.mdx`, moduleSlug: "loops", order: 4, duration: 20, xp: 30, tags: ["nested-loops"], concepts: ["loops"] },
    { slug: "loop-challenge", title: "Loop Challenge", description: "Apply loops to solve practical problems.", contentPath: `${BASE_PATH}/05-loops/05-loop-challenge.mdx`, moduleSlug: "loops", order: 5, duration: 25, xp: 45, tags: ["challenge"], concepts: ["loops"] },

    // Module 6: Functions (6)
    { slug: "function-basics-v2", title: "Function Basics", description: "Define and call functions.", contentPath: `${BASE_PATH}/06-functions/01-function-basics.mdx`, moduleSlug: "functions", order: 1, duration: 20, xp: 35, tags: ["functions"], concepts: ["functions"] },
    { slug: "parameters-arguments", title: "Parameters and Arguments", description: "Work with function parameters.", contentPath: `${BASE_PATH}/06-functions/02-parameters-arguments.mdx`, moduleSlug: "functions", order: 2, duration: 15, xp: 25, tags: ["parameters"], concepts: ["functions"] },
    { slug: "return-values", title: "Return Values", description: "Use return to send values from functions.", contentPath: `${BASE_PATH}/06-functions/03-return-values.mdx`, moduleSlug: "functions", order: 3, duration: 15, xp: 25, tags: ["return"], concepts: ["functions"] },
    { slug: "function-expressions", title: "Function Expressions", description: "Store functions in variables.", contentPath: `${BASE_PATH}/06-functions/04-function-expressions.mdx`, moduleSlug: "functions", order: 4, duration: 15, xp: 25, tags: ["expressions"], concepts: ["functions"] },
    { slug: "pure-functions", title: "Pure Functions", description: "Write predictable, testable functions.", contentPath: `${BASE_PATH}/06-functions/05-pure-functions.mdx`, moduleSlug: "functions", order: 5, duration: 15, xp: 25, tags: ["purity"], concepts: ["functions"] },
    { slug: "function-challenge", title: "Function Challenge", description: "Apply functions to solve problems.", contentPath: `${BASE_PATH}/06-functions/06-function-challenge.mdx`, moduleSlug: "functions", order: 6, duration: 25, xp: 50, tags: ["challenge"], concepts: ["functions"] },

    // Module 7: Scope & Closures (4)
    { slug: "what-is-scope", title: "What Is Scope?", description: "Understand variable visibility in code.", contentPath: `${BASE_PATH}/07-scope-closures/01-what-is-scope.mdx`, moduleSlug: "scope-closures", order: 1, duration: 15, xp: 25, tags: ["scope"], concepts: ["scope"] },
    { slug: "let-vs-var-vs-const", title: "Let vs Var vs Const", description: "Learn the differences between variable declarations.", contentPath: `${BASE_PATH}/07-scope-closures/02-let-vs-var-vs-const.mdx`, moduleSlug: "scope-closures", order: 2, duration: 20, xp: 30, tags: ["variables"], concepts: ["variables", "scope"] },
    { slug: "closures-intro", title: "Closures", description: "Functions that remember their scope.", contentPath: `${BASE_PATH}/07-scope-closures/03-closures-intro.mdx`, moduleSlug: "scope-closures", order: 3, duration: 25, xp: 40, tags: ["closures"], concepts: ["closures", "scope"] },
    { slug: "scope-challenge", title: "Scope Challenge", description: "Apply scope and closure concepts.", contentPath: `${BASE_PATH}/07-scope-closures/04-scope-challenge.mdx`, moduleSlug: "scope-closures", order: 4, duration: 20, xp: 40, tags: ["challenge"], concepts: ["scope", "closures"] },

    // Module 8: Recursion (4)
    { slug: "recursion-intro", title: "Recursion Introduction", description: "Learn what recursion is.", contentPath: `${BASE_PATH}/08-recursion/01-recursion-intro.mdx`, moduleSlug: "recursion", order: 1, duration: 25, xp: 40, tags: ["recursion"], concepts: ["recursion"] },
    { slug: "recursion-vs-iteration", title: "Recursion vs Iteration", description: "Compare recursive and iterative solutions.", contentPath: `${BASE_PATH}/08-recursion/02-recursion-vs-iteration.mdx`, moduleSlug: "recursion", order: 2, duration: 20, xp: 35, tags: ["comparison"], concepts: ["recursion", "loops"] },
    { slug: "recursion-patterns", title: "Common Recursion Patterns", description: "Recognize common recursion patterns.", contentPath: `${BASE_PATH}/08-recursion/03-recursion-patterns.mdx`, moduleSlug: "recursion", order: 3, duration: 25, xp: 40, tags: ["patterns"], concepts: ["recursion"] },
    { slug: "recursion-challenge", title: "Recursion Challenge", description: "Apply recursion to complex problems.", contentPath: `${BASE_PATH}/08-recursion/04-recursion-challenge.mdx`, moduleSlug: "recursion", order: 4, duration: 30, xp: 50, tags: ["challenge"], concepts: ["recursion"] },

    // Module 9: Error Handling (4)
    { slug: "try-catch", title: "Try/Catch", description: "Handle errors gracefully with try/catch.", contentPath: `${BASE_PATH}/09-error-handling/01-try-catch.mdx`, moduleSlug: "error-handling", order: 1, duration: 20, xp: 30, tags: ["try-catch"], concepts: ["error-handling"] },
    { slug: "error-types", title: "Error Types", description: "Recognize common JavaScript error types.", contentPath: `${BASE_PATH}/09-error-handling/02-error-types.mdx`, moduleSlug: "error-handling", order: 2, duration: 15, xp: 25, tags: ["error-types"], concepts: ["error-handling"] },
    { slug: "defensive-programming", title: "Defensive Programming", description: "Write code that prevents errors.", contentPath: `${BASE_PATH}/09-error-handling/03-defensive-programming.mdx`, moduleSlug: "error-handling", order: 3, duration: 20, xp: 30, tags: ["defensive"], concepts: ["error-handling"] },
    { slug: "error-handling-challenge", title: "Error Handling Challenge", description: "Apply error handling to real problems.", contentPath: `${BASE_PATH}/09-error-handling/04-error-handling-challenge.mdx`, moduleSlug: "error-handling", order: 4, duration: 25, xp: 45, tags: ["challenge"], concepts: ["error-handling"] },

    // Module 10: Projects (6)
    { slug: "project-number-guessing-game", title: "Project: Number Guessing Game", description: "Build a complete interactive game.", contentPath: `${BASE_PATH}/10-projects/01-number-guessing-game.mdx`, moduleSlug: "projects", order: 1, duration: 30, xp: 60, tags: ["game"], concepts: ["control-flow", "loops", "functions"] },
    { slug: "project-todo-list", title: "Project: Todo List", description: "Build a todo list manager.", contentPath: `${BASE_PATH}/10-projects/02-todo-list.mdx`, moduleSlug: "projects", order: 2, duration: 30, xp: 65, tags: ["todo"], concepts: ["functions", "arrays"] },
    { slug: "project-calculator-app", title: "Project: Calculator App", description: "Build a complete calculator application.", contentPath: `${BASE_PATH}/10-projects/03-calculator-app.mdx`, moduleSlug: "projects", order: 3, duration: 30, xp: 60, tags: ["calculator"], concepts: ["functions", "operators"] },
    { slug: "project-grade-tracker", title: "Project: Grade Tracker", description: "Build a grade management system.", contentPath: `${BASE_PATH}/10-projects/04-grade-tracker.mdx`, moduleSlug: "projects", order: 4, duration: 30, xp: 65, tags: ["grades"], concepts: ["functions", "arrays"] },
    { slug: "project-text-analyzer", title: "Project: Text Analyzer", description: "Build a text analysis tool.", contentPath: `${BASE_PATH}/10-projects/05-text-analyzer.mdx`, moduleSlug: "projects", order: 5, duration: 30, xp: 60, tags: ["text-analysis"], concepts: ["functions", "strings"] },
    { slug: "project-weather-cli", title: "Capstone: Weather CLI Tool", description: "Build a complete weather CLI tool.", contentPath: `${BASE_PATH}/10-projects/06-capstone-weather-cli.mdx`, moduleSlug: "projects", order: 6, duration: 45, xp: 100, tags: ["capstone"], concepts: ["functions", "error-handling"] },

    // ─── COURSE 1: Introduction to Computing (sample lessons) ───
    { slug: "what-is-computer-def", title: "What Is a Computer?", description: "Define what a computer is and its core functions.", contentPath: "lessons/volume-01/course-01-introduction-to-computing/what-is-computer.mdx", moduleSlug: "what-is-a-computer", order: 1, duration: 15, xp: 20, tags: ["computers"], concepts: ["algorithms"] },
    { slug: "history-of-computers", title: "History of Computers", description: "Trace the evolution of computing from abacus to AI.", contentPath: "lessons/volume-01/course-01-introduction-to-computing/history.mdx", moduleSlug: "history-of-computing", order: 1, duration: 20, xp: 25, tags: ["history"], concepts: ["algorithms"] },
    { slug: "computer-components", title: "Computer Components", description: "Identify CPU, RAM, storage, and other key components.", contentPath: "lessons/volume-01/course-01-introduction-to-computing/components.mdx", moduleSlug: "computer-components", order: 1, duration: 20, xp: 25, tags: ["hardware"], concepts: ["algorithms"] },

    // ─── COURSE 2: Number Systems (sample lessons) ───
    { slug: "binary-numbers-intro", title: "Introduction to Binary", description: "Learn how computers count using only 0s and 1s.", contentPath: "lessons/volume-01/course-02-number-systems/binary-intro.mdx", moduleSlug: "binary-system", order: 1, duration: 20, xp: 30, tags: ["binary"], concepts: ["binary"] },
    { slug: "hexadecimal-intro", title: "Introduction to Hexadecimal", description: "Understand base-16 numbering used in computing.", contentPath: "lessons/volume-01/course-02-number-systems/hex-intro.mdx", moduleSlug: "hexadecimal-system", order: 1, duration: 20, xp: 30, tags: ["hex"], concepts: ["binary"] },

    // ─── COURSE 3: Data Representation (sample lessons) ───
    { slug: "bits-and-bytes", title: "Bits & Bytes", description: "Understand the fundamental units of digital data.", contentPath: "lessons/volume-01/course-03-data-representation/bits-bytes.mdx", moduleSlug: "bits-and-bytes", order: 1, duration: 15, xp: 20, tags: ["data"], concepts: ["binary"] },
    { slug: "character-encoding", title: "Character Encoding", description: "Learn how text is represented in computers.", contentPath: "lessons/volume-01/course-03-data-representation/encoding.mdx", moduleSlug: "character-encoding", order: 1, duration: 20, xp: 25, tags: ["encoding"], concepts: ["binary"] },

    // ─── COURSE 4: Logic & Boolean Algebra (sample lessons) ───
    { slug: "boolean-algebra", title: "Boolean Algebra Basics", description: "Learn the fundamental laws of boolean logic.", contentPath: "lessons/volume-01/course-04-logic-boolean-algebra/boolean-algebra.mdx", moduleSlug: "boolean-basics", order: 1, duration: 20, xp: 30, tags: ["logic"], concepts: ["boolean-logic"] },
    { slug: "logic-gates-intro", title: "Introduction to Logic Gates", description: "Understand AND, OR, NOT, NAND, NOR, XOR gates.", contentPath: "lessons/volume-01/course-04-logic-boolean-algebra/logic-gates.mdx", moduleSlug: "logic-gates", order: 1, duration: 25, xp: 35, tags: ["gates"], concepts: ["boolean-logic"] },

    // ─── COURSE 5: Digital Electronics (sample lessons) ───
    { slug: "combinational-circuits", title: "Combinational Circuits", description: "Build circuits using logic gates.", contentPath: "lessons/volume-01/course-05-digital-electronics/combinational.mdx", moduleSlug: "combinational-circuits", order: 1, duration: 25, xp: 35, tags: ["circuits"], concepts: ["boolean-logic"] },
    { slug: "flip-flops-intro", title: "Introduction to Flip-Flops", description: "Learn the basic building blocks of sequential logic.", contentPath: "lessons/volume-01/course-05-digital-electronics/flip-flops.mdx", moduleSlug: "flip-flops", order: 1, duration: 25, xp: 35, tags: ["sequential"], concepts: ["boolean-logic"] },

    // ─── COURSE 6: Mathematics (sample lessons) ───
    { slug: "set-theory-intro", title: "Introduction to Set Theory", description: "Learn about sets, subsets, and set operations.", contentPath: "lessons/volume-01/course-06-mathematics/set-theory.mdx", moduleSlug: "set-theory", order: 1, duration: 20, xp: 30, tags: ["sets"], concepts: ["algorithms"] },
    { slug: "graph-theory-intro", title: "Introduction to Graph Theory", description: "Understand graphs, trees, and their applications in CS.", contentPath: "lessons/volume-01/course-06-mathematics/graph-theory.mdx", moduleSlug: "graph-theory", order: 1, duration: 25, xp: 35, tags: ["graphs"], concepts: ["graphs"] },

    // ─── COURSE 8: Problem Solving (sample lessons) ───
    { slug: "computational-thinking", title: "Computational Thinking", description: "Learn the four pillars of computational thinking.", contentPath: "lessons/volume-01/course-08-problem-solving/computational-thinking.mdx", moduleSlug: "computational-thinking", order: 1, duration: 20, xp: 25, tags: ["thinking"], concepts: ["algorithms"] },
    { slug: "algorithm-design", title: "Algorithm Design", description: "Design step-by-step solutions to problems.", contentPath: "lessons/volume-01/course-08-problem-solving/algorithm-design.mdx", moduleSlug: "algorithm-design", order: 1, duration: 25, xp: 35, tags: ["algorithms"], concepts: ["algorithms"] },

    // ─── COURSE 9: Development Environment (sample lessons) ───
    { slug: "command-line-basics", title: "Command Line Basics", description: "Navigate your computer using the terminal.", contentPath: "lessons/volume-01/course-09-development-environment/command-line.mdx", moduleSlug: "command-line", order: 1, duration: 20, xp: 25, tags: ["terminal"], concepts: ["algorithms"] },
    { slug: "git-introduction", title: "Introduction to Git", description: "Learn version control with Git.", contentPath: "lessons/volume-01/course-09-development-environment/git-intro.mdx", moduleSlug: "version-control", order: 1, duration: 25, xp: 35, tags: ["git"], concepts: ["git"] },

    // ─── COURSE 10: Computer Ethics (sample lessons) ───
    { slug: "open-source-intro", title: "Introduction to Open Source", description: "Understand open source software and licenses.", contentPath: "lessons/volume-01/course-10-computer-ethics/open-source.mdx", moduleSlug: "open-source", order: 1, duration: 20, xp: 25, tags: ["open-source"], concepts: ["algorithms"] },
    { slug: "ai-ethics-intro", title: "AI Ethics", description: "Explore ethical considerations in artificial intelligence.", contentPath: "lessons/volume-01/course-10-computer-ethics/ai-ethics.mdx", moduleSlug: "ai-ethics", order: 1, duration: 20, xp: 25, tags: ["ai-ethics"], concepts: ["algorithms"] },
  ]

  // Create lessons with proper module mapping
  const lessonRecords = await Promise.all(
    lessonData.map((l) =>
      prisma.lesson.create({
        data: {
          slug: l.slug,
          title: l.title,
          description: l.description,
          contentPath: l.contentPath,
          moduleId: modMap[l.moduleSlug],
          order: l.order,
          duration: l.duration,
          xpReward: l.xp,
          difficulty: "beginner",
          tags: JSON.stringify(l.tags),
        },
      })
    )
  )

  const lessonSlugToId = Object.fromEntries(lessonRecords.map((l) => [l.slug, l.id]))

  // Create knowledge graph nodes for each lesson
  const lessonGraphNodes = await Promise.all(
    lessonRecords.map((l) =>
      prisma.node.create({
        data: { type: "lesson", slug: `lesson-${l.slug}`, name: l.title, description: l.description },
      })
    )
  )
  const lessonNodeMap = Object.fromEntries(lessonGraphNodes.map((n, i) => [lessonRecords[i].slug, n.id]))

  // Connect lessons to concepts via teaches edges
  for (const lesson of lessonData) {
    const lessonNodeId = lessonNodeMap[lesson.slug]
    if (!lessonNodeId) continue
    for (const conceptSlug of lesson.concepts) {
      const conceptId = nodeMap[conceptSlug]
      if (conceptId) {
        await prisma.edge.create({
          data: { sourceId: lessonNodeId, targetId: conceptId, relationType: "teaches", strength: 10 },
        })
      }
    }
  }

  // ─── ROADMAP: Backend Developer ───
  const roadmap = await prisma.roadmap.create({
    data: {
      slug: "backend-developer",
      title: "Backend Developer Path",
      description: "Complete path from fundamentals to job-ready backend developer.",
      type: "system",
      goal: "Become a backend developer",
      difficulty: "beginner",
      estimatedHours: 200,
    },
  })

  const pathConcepts = ["variables", "data-types", "control-flow", "loops", "functions", "oop", "databases", "sql", "http", "rest-apis", "git", "linux"]
  for (let i = 0; i < pathConcepts.length; i++) {
    const nodeId = nodeMap[pathConcepts[i]]
    if (nodeId) {
      await prisma.roadmapStep.create({
        data: { roadmapId: roadmap.id, nodeId, order: i + 1 },
      })
    }
  }

  console.log("✅ Seed complete!")
  console.log(`   ${concepts.length} concept nodes`)
  console.log(`   ${edges.length} concept edges`)
  console.log(`   ${lessonData.length} lessons`)
  console.log(`   ${lessonData.reduce((s, l) => s + l.concepts.length, 0)} lesson→concept edges`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
