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
      { slug: "welcome-to-cs", title: "Welcome to CS", order: 1 }, { slug: "history-of-computing", title: "History of Computing", order: 2 }, { slug: "understanding-computers", title: "Understanding Computers", order: 3 }, { slug: "inside-computer", title: "Inside a Computer", order: 4 }, { slug: "operating-systems", title: "Operating Systems", order: 5 }, { slug: "networks-internet", title: "Networks & Internet", order: 6 }, { slug: "programming-sdlc", title: "Programming & SDLC", order: 7 }, { slug: "careers-roadmap", title: "Careers & Roadmap", order: 8 },
    ]},
    { slug: "number-systems", title: "Number Systems", order: 2, modules: [
      { slug: "why-binary", title: "Why Computers Use Binary", order: 1 }, { slug: "binary-numbers", title: "Binary Numbers", order: 2 }, { slug: "other-num-systems", title: "Other Number Systems", order: 3 }, { slug: "binary-arithmetic", title: "Binary Arithmetic", order: 4 }, { slug: "data-rep", title: "Data Representation", order: 5 },
    ]},
    { slug: "data-representation", title: "Data Representation", order: 3, modules: [
      { slug: "intro-data-repr", title: "Introduction to Data Representation", order: 1 }, { slug: "repr-numbers", title: "Representing Numbers", order: 2 }, { slug: "repr-text", title: "Representing Text", order: 3 }, { slug: "repr-images", title: "Representing Images", order: 4 }, { slug: "repr-audio", title: "Representing Audio", order: 5 }, { slug: "repr-video", title: "Representing Video", order: 6 }, { slug: "files-storage", title: "Files & Storage", order: 7 },
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
  const C1 = "lessons/volume-01/course-01-introduction-to-computing"
  const C2 = "lessons/volume-01/course-02-number-systems"
  const C3 = "lessons/volume-01/course-03-data-representation"
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

    // ─── COURSE 1: Introduction to Computing (35 lessons, 8 modules) ───
    // Module 1: Welcome to CS (5)
    { slug: "welcome-to-lupalearn", title: "Welcome to LupaLearn & Your CS Journey", description: "Why learn CS, course roadmap, how to learn effectively.", contentPath: `${C1}/01-welcome-to-cs/01-welcome-to-lupalearn.mdx`, moduleSlug: "welcome-to-cs", order: 1, duration: 15, xp: 25, tags: ["cs", "welcome"], concepts: ["algorithms"] },
    { slug: "what-is-computing-c1", title: "What Is Computing?", description: "Computing in everyday life, data processing, automation.", contentPath: `${C1}/01-welcome-to-cs/02-what-is-computing.mdx`, moduleSlug: "welcome-to-cs", order: 2, duration: 15, xp: 20, tags: ["computing"], concepts: ["algorithms"] },
    { slug: "what-is-computer-science", title: "What Is Computer Science?", description: "Definition, major branches, real-world applications.", contentPath: `${C1}/01-welcome-to-cs/03-what-is-cs.mdx`, moduleSlug: "welcome-to-cs", order: 3, duration: 15, xp: 20, tags: ["cs"], concepts: ["algorithms"] },
    { slug: "data-vs-information", title: "Data vs Information vs Knowledge", description: "The DIKW pyramid, transforming raw data into wisdom.", contentPath: `${C1}/01-welcome-to-cs/04-data-vs-information.mdx`, moduleSlug: "welcome-to-cs", order: 4, duration: 15, xp: 20, tags: ["data"], concepts: ["algorithms"] },
    { slug: "how-computers-changed-world", title: "How Computers Changed the World", description: "Impact on communication, healthcare, finance, space, AI.", contentPath: `${C1}/01-welcome-to-cs/05-how-computers-changed-world.mdx`, moduleSlug: "welcome-to-cs", order: 5, duration: 20, xp: 25, tags: ["impact"], concepts: ["algorithms"] },
    // Module 2: History of Computing (5)
    { slug: "early-computing-devices", title: "Early Computing Devices", description: "Abacus, Pascaline, Difference Engine.", contentPath: `${C1}/02-history-of-computing/01-early-computing.mdx`, moduleSlug: "history-of-computing", order: 1, duration: 15, xp: 20, tags: ["history"], concepts: ["algorithms"] },
    { slug: "babbage-lovelace", title: "Charles Babbage & Ada Lovelace", description: "The Analytical Engine, first programmer.", contentPath: `${C1}/02-history-of-computing/02-babbage-lovelace.mdx`, moduleSlug: "history-of-computing", order: 2, duration: 15, xp: 25, tags: ["history"], concepts: ["algorithms"] },
    { slug: "turing-modern-computing", title: "Alan Turing and Modern Computing", description: "Turing Machine, Enigma, Turing Test.", contentPath: `${C1}/02-history-of-computing/03-turing-modern-computing.mdx`, moduleSlug: "history-of-computing", order: 3, duration: 20, xp: 30, tags: ["turing"], concepts: ["algorithms"] },
    { slug: "generations-of-computers", title: "Generations of Computers", description: "Vacuum tubes to AI — five generations.", contentPath: `${C1}/02-history-of-computing/04-generations.mdx`, moduleSlug: "history-of-computing", order: 4, duration: 20, xp: 25, tags: ["history"], concepts: ["algorithms"] },
    { slug: "future-of-computing-c1", title: "The Future of Computing", description: "Quantum, AI, edge, neuromorphic computing.", contentPath: `${C1}/02-history-of-computing/05-future-of-computing.mdx`, moduleSlug: "history-of-computing", order: 5, duration: 20, xp: 25, tags: ["future"], concepts: ["algorithms"] },
    // Module 3: Understanding Computers (5)
    { slug: "what-makes-a-computer", title: "What Makes a Computer?", description: "Four core functions, essential components, types.", contentPath: `${C1}/03-understanding-computers/01-what-makes-a-computer.mdx`, moduleSlug: "understanding-computers", order: 1, duration: 15, xp: 20, tags: ["computers"], concepts: ["algorithms"] },
    { slug: "hardware-components", title: "Hardware Components", description: "Motherboard, CPU, RAM, SSD, GPU, PSU.", contentPath: `${C1}/03-understanding-computers/02-hardware-components.mdx`, moduleSlug: "understanding-computers", order: 2, duration: 20, xp: 25, tags: ["hardware"], concepts: ["algorithms"] },
    { slug: "software-components", title: "Software Components", description: "OS, applications, drivers, firmware, the software stack.", contentPath: `${C1}/03-understanding-computers/03-software-components.mdx`, moduleSlug: "understanding-computers", order: 3, duration: 15, xp: 20, tags: ["software"], concepts: ["algorithms"] },
    { slug: "firmware-explained", title: "Firmware Explained", description: "BIOS/UEFI, device firmware, vs HW and SW.", contentPath: `${C1}/03-understanding-computers/04-firmware-explained.mdx`, moduleSlug: "understanding-computers", order: 4, duration: 15, xp: 20, tags: ["firmware"], concepts: ["algorithms"] },
    { slug: "hw-sw-firmware", title: "Hardware vs Software vs Firmware", description: "How all three layers work together.", contentPath: `${C1}/03-understanding-computers/05-hardware-vs-software-vs-firmware.mdx`, moduleSlug: "understanding-computers", order: 5, duration: 15, xp: 20, tags: ["comparison"], concepts: ["algorithms"] },
    // Module 4: Inside a Computer (5)
    { slug: "cpu-the-brain", title: "CPU — The Brain of the Computer", description: "Fetch-decode-execute, cores, threads, cache.", contentPath: `${C1}/04-inside-a-computer/01-cpu-brain.mdx`, moduleSlug: "inside-computer", order: 1, duration: 20, xp: 30, tags: ["cpu"], concepts: ["algorithms"] },
    { slug: "memory-ram", title: "Memory (RAM)", description: "How RAM works, types, vs storage.", contentPath: `${C1}/04-inside-a-computer/02-memory-ram.mdx`, moduleSlug: "inside-computer", order: 2, duration: 15, xp: 25, tags: ["memory"], concepts: ["algorithms"] },
    { slug: "storage-hdd-ssd", title: "Storage (HDD, SSD)", description: "HDD vs SSD, storage hierarchy.", contentPath: `${C1}/04-inside-a-computer/03-storage-hdd-ssd.mdx`, moduleSlug: "inside-computer", order: 3, duration: 15, xp: 25, tags: ["storage"], concepts: ["algorithms"] },
    { slug: "input-output-devices", title: "Input & Output Devices", description: "Keyboards, mice, monitors, USB, drivers.", contentPath: `${C1}/04-inside-a-computer/04-input-output-devices.mdx`, moduleSlug: "inside-computer", order: 4, duration: 15, xp: 20, tags: ["io"], concepts: ["algorithms"] },
    { slug: "how-everything-works-together", title: "How Everything Works Together", description: "Complete data flow from keystroke to display.", contentPath: `${C1}/04-inside-a-computer/05-how-everything-works-together.mdx`, moduleSlug: "inside-computer", order: 5, duration: 20, xp: 30, tags: ["integration"], concepts: ["algorithms"] },
    // Module 5: Operating Systems (5)
    { slug: "what-is-os", title: "What Is an Operating System?", description: "OS functions, process/memory/device management.", contentPath: `${C1}/05-operating-systems/01-what-is-os.mdx`, moduleSlug: "operating-systems", order: 1, duration: 20, xp: 25, tags: ["os"], concepts: ["algorithms"] },
    { slug: "windows-linux-macos", title: "Windows, Linux & macOS", description: "Comparing the three major operating systems.", contentPath: `${C1}/05-operating-systems/02-windows-linux-macos.mdx`, moduleSlug: "operating-systems", order: 2, duration: 20, xp: 25, tags: ["os"], concepts: ["algorithms"] },
    { slug: "processes-and-programs", title: "Processes and Programs", description: "Program vs process, multitasking, context switching.", contentPath: `${C1}/05-operating-systems/03-processes-programs.mdx`, moduleSlug: "operating-systems", order: 3, duration: 15, xp: 20, tags: ["os"], concepts: ["algorithms"] },
    { slug: "files-and-file-systems", title: "Files and File Systems", description: "NTFS, ext4, APFS, paths, permissions.", contentPath: `${C1}/05-operating-systems/04-files-file-systems.mdx`, moduleSlug: "operating-systems", order: 4, duration: 15, xp: 20, tags: ["os"], concepts: ["algorithms"] },
    { slug: "ui-vs-command-line", title: "UI vs Command Line", description: "GUI vs CLI, when to use each.", contentPath: `${C1}/05-operating-systems/05-ui-vs-cli.mdx`, moduleSlug: "operating-systems", order: 5, duration: 15, xp: 20, tags: ["os"], concepts: ["algorithms"] },
    // Module 6: Networks & Internet (4)
    { slug: "what-is-network", title: "What Is a Network?", description: "LAN, WAN, routers, switches, network types.", contentPath: `${C1}/06-networks-internet/01-what-is-network.mdx`, moduleSlug: "networks-internet", order: 1, duration: 15, xp: 20, tags: ["networking"], concepts: ["algorithms"] },
    { slug: "how-internet-works", title: "How the Internet Works", description: "IP addresses, DNS, packets, routing.", contentPath: `${C1}/06-networks-internet/02-how-internet-works.mdx`, moduleSlug: "networks-internet", order: 2, duration: 20, xp: 30, tags: ["internet"], concepts: ["algorithms"] },
    { slug: "websites-browsers-servers", title: "Websites, Browsers & Servers", description: "Client-server model, HTTP, cloud computing.", contentPath: `${C1}/06-networks-internet/03-websites-browsers-servers.mdx`, moduleSlug: "networks-internet", order: 3, duration: 15, xp: 20, tags: ["web"], concepts: ["algorithms"] },
    { slug: "cloud-computing-basics", title: "Cloud Computing Basics", description: "IaaS, PaaS, SaaS, AWS, Azure, GCP.", contentPath: `${C1}/06-networks-internet/04-cloud-computing-basics.mdx`, moduleSlug: "networks-internet", order: 4, duration: 15, xp: 20, tags: ["cloud"], concepts: ["algorithms"] },
    // Module 7: Programming & SDLC (4)
    { slug: "what-is-programming-intro", title: "What Is Programming?", description: "Problem-solving, instructions, input-output model.", contentPath: `${C1}/07-programming-sdlc/01-what-is-programming.mdx`, moduleSlug: "programming-sdlc", order: 1, duration: 15, xp: 20, tags: ["programming"], concepts: ["algorithms"] },
    { slug: "programming-languages-cs101", title: "Programming Languages Explained", description: "Levels, compilation vs interpretation, language comparison.", contentPath: `${C1}/07-programming-sdlc/02-programming-languages.mdx`, moduleSlug: "programming-sdlc", order: 2, duration: 20, xp: 25, tags: ["languages"], concepts: ["algorithms"] },
    { slug: "how-software-is-built", title: "How Software Is Built", description: "Team roles, tools, development cycle.", contentPath: `${C1}/07-programming-sdlc/03-how-software-is-built.mdx`, moduleSlug: "programming-sdlc", order: 3, duration: 20, xp: 25, tags: ["software"], concepts: ["algorithms"] },
    { slug: "sdlc-lifecycle", title: "The Software Development Lifecycle", description: "Requirements, design, implementation, testing, deployment, maintenance.", contentPath: `${C1}/07-programming-sdlc/04-sdlc-lifecycle.mdx`, moduleSlug: "programming-sdlc", order: 4, duration: 20, xp: 25, tags: ["sdlc"], concepts: ["algorithms"] },
    // Module 8: Careers & Roadmap (2)
    { slug: "careers-in-cs", title: "Careers in Computer Science", description: "Software engineer, web dev, data science, AI, DevOps, security.", contentPath: `${C1}/08-careers-roadmap/01-careers-in-cs.mdx`, moduleSlug: "careers-roadmap", order: 1, duration: 25, xp: 30, tags: ["careers"], concepts: ["algorithms"] },
    { slug: "your-roadmap-lupalearn", title: "Your Roadmap Through LupaLearn", description: "Knowledge graph, modes, AI Tutor, Playground, progress, certifications.", contentPath: `${C1}/08-careers-roadmap/02-your-roadmap-through-lupalearn.mdx`, moduleSlug: "careers-roadmap", order: 2, duration: 25, xp: 35, tags: ["lupalearn"], concepts: ["algorithms"] },

    // ─── COURSE 2: Number Systems (18 lessons, 5 modules) ───
    // Module 1: Why Binary (3)
    { slug: "why-binary-not-decimal", title: "Why Don't Computers Use Decimal?", description: "Switches and electricity — why computers use binary.", contentPath: `${C2}/01-why-binary/01-why-binary-not-decimal.mdx`, moduleSlug: "why-binary", order: 1, duration: 20, xp: 25, tags: ["binary"], concepts: ["binary"] },
    { slug: "understanding-number-systems", title: "Understanding Number Systems", description: "Base/radix and positional notation.", contentPath: `${C2}/01-why-binary/02-understanding-number-systems.mdx`, moduleSlug: "why-binary", order: 2, duration: 20, xp: 25, tags: ["number-systems"], concepts: ["binary"] },
    { slug: "counting-in-binary", title: "Counting in Binary", description: "Binary digits, counting patterns, powers of two.", contentPath: `${C2}/01-why-binary/03-counting-in-binary.mdx`, moduleSlug: "why-binary", order: 3, duration: 20, xp: 30, tags: ["binary"], concepts: ["binary"] },
    // Module 2: Binary Numbers (5)
    { slug: "understanding-bits", title: "Understanding Bits", description: "What is a bit, physical representation.", contentPath: `${C2}/02-binary-numbers/01-understanding-bits.mdx`, moduleSlug: "binary-numbers", order: 1, duration: 15, xp: 20, tags: ["bits"], concepts: ["binary"] },
    { slug: "bytes-and-memory", title: "Bytes and Memory", description: "Storage units KB, MB, GB, TB.", contentPath: `${C2}/02-binary-numbers/02-bytes-and-memory.mdx`, moduleSlug: "binary-numbers", order: 2, duration: 15, xp: 25, tags: ["bytes"], concepts: ["binary"] },
    { slug: "binary-place-values", title: "Binary Place Values", description: "Reading binary with powers of two.", contentPath: `${C2}/02-binary-numbers/03-binary-place-values.mdx`, moduleSlug: "binary-numbers", order: 3, duration: 20, xp: 30, tags: ["binary"], concepts: ["binary"] },
    { slug: "decimal-to-binary", title: "Decimal to Binary Conversion", description: "Convert decimal to binary.", contentPath: `${C2}/02-binary-numbers/04-decimal-to-binary.mdx`, moduleSlug: "binary-numbers", order: 4, duration: 20, xp: 30, tags: ["conversion"], concepts: ["binary"] },
    { slug: "binary-to-decimal", title: "Binary to Decimal Conversion", description: "Convert binary to decimal.", contentPath: `${C2}/02-binary-numbers/05-binary-to-decimal.mdx`, moduleSlug: "binary-numbers", order: 5, duration: 20, xp: 30, tags: ["conversion"], concepts: ["binary"] },
    // Module 3: Other Number Systems (4)
    { slug: "octal-number-system", title: "Octal Number System", description: "Base-8, file permissions.", contentPath: `${C2}/03-other-number-systems/01-octal-number-system.mdx`, moduleSlug: "other-num-systems", order: 1, duration: 15, xp: 20, tags: ["octal"], concepts: ["binary"] },
    { slug: "hexadecimal-system", title: "Hexadecimal Number System", description: "Base-16, colors, memory addresses.", contentPath: `${C2}/03-other-number-systems/02-hexadecimal-system.mdx`, moduleSlug: "other-num-systems", order: 2, duration: 20, xp: 30, tags: ["hex"], concepts: ["binary"] },
    { slug: "binary-octal-conversion", title: "Binary to Octal Conversion", description: "Group by 3 method.", contentPath: `${C2}/03-other-number-systems/03-binary-octal-conversion.mdx`, moduleSlug: "other-num-systems", order: 3, duration: 15, xp: 25, tags: ["conversion"], concepts: ["binary"] },
    { slug: "binary-hex-conversion", title: "Binary to Hex Conversion", description: "Group by 4 method.", contentPath: `${C2}/03-other-number-systems/04-binary-hex-conversion.mdx`, moduleSlug: "other-num-systems", order: 4, duration: 15, xp: 25, tags: ["conversion"], concepts: ["binary"] },
    // Module 4: Binary Arithmetic (4)
    { slug: "binary-addition", title: "Binary Addition", description: "Add binary numbers with carry.", contentPath: `${C2}/04-binary-arithmetic/01-binary-addition.mdx`, moduleSlug: "binary-arithmetic", order: 1, duration: 20, xp: 30, tags: ["arithmetic"], concepts: ["binary"] },
    { slug: "binary-subtraction", title: "Binary Subtraction", description: "Subtract binary numbers with borrow.", contentPath: `${C2}/04-binary-arithmetic/02-binary-subtraction.mdx`, moduleSlug: "binary-arithmetic", order: 2, duration: 20, xp: 30, tags: ["arithmetic"], concepts: ["binary"] },
    { slug: "binary-multiplication", title: "Binary Multiplication", description: "Multiply binary numbers.", contentPath: `${C2}/04-binary-arithmetic/03-binary-multiplication.mdx`, moduleSlug: "binary-arithmetic", order: 3, duration: 15, xp: 25, tags: ["arithmetic"], concepts: ["binary"] },
    { slug: "binary-division", title: "Binary Division", description: "Divide binary numbers.", contentPath: `${C2}/04-binary-arithmetic/04-binary-division.mdx`, moduleSlug: "binary-arithmetic", order: 4, duration: 15, xp: 25, tags: ["arithmetic"], concepts: ["binary"] },
    // Module 5: Data Representation (2)
    { slug: "storing-text-ascii-unicode", title: "How Computers Store Text", description: "ASCII, Unicode, UTF-8.", contentPath: `${C2}/05-data-representation/01-storing-text.mdx`, moduleSlug: "data-rep", order: 1, duration: 20, xp: 30, tags: ["text", "encoding"], concepts: ["binary"] },
    { slug: "storing-images-audio-video", title: "Images, Audio & Video", description: "Pixels, samples, frames, compression.", contentPath: `${C2}/05-data-representation/02-storing-images-audio-video.mdx`, moduleSlug: "data-rep", order: 2, duration: 20, xp: 30, tags: ["media"], concepts: ["binary"] },

    // ─── COURSE 3: Data Representation (28 lessons, 7 modules) ───
    // Module 1: Introduction (4)
    { slug: "what-is-data-repr", title: "What Is Data?", description: "Analog vs digital, data representation basics.", contentPath: `${C3}/01-introduction/01-what-is-data.mdx`, moduleSlug: "intro-data-repr", order: 1, duration: 15, xp: 20, tags: ["data"], concepts: ["binary"] },
    { slug: "how-computers-see-world", title: "How Computers See the World", description: "Everything becomes binary.", contentPath: `${C3}/01-introduction/02-how-computers-see-world.mdx`, moduleSlug: "intro-data-repr", order: 2, duration: 15, xp: 20, tags: ["binary"], concepts: ["binary"] },
    { slug: "units-of-digital-info", title: "Units of Digital Information", description: "Bit, nibble, byte, KB, MB, GB, TB.", contentPath: `${C3}/01-introduction/03-units-of-digital-info.mdx`, moduleSlug: "intro-data-repr", order: 3, duration: 15, xp: 20, tags: ["units"], concepts: ["binary"] },
    { slug: "why-representation-matters", title: "Why Representation Matters", description: "Accuracy, storage, performance, compatibility.", contentPath: `${C3}/01-introduction/04-why-representation-matters.mdx`, moduleSlug: "intro-data-repr", order: 4, duration: 15, xp: 20, tags: ["representation"], concepts: ["binary"] },
    // Module 2: Numbers (5)
    { slug: "unsigned-integers", title: "Unsigned Integers", description: "Positive number representation and range.", contentPath: `${C3}/02-numbers/01-unsigned-integers.mdx`, moduleSlug: "repr-numbers", order: 1, duration: 20, xp: 30, tags: ["integers"], concepts: ["binary"] },
    { slug: "signed-integers", title: "Signed Integers", description: "Two's complement, sign-magnitude.", contentPath: `${C3}/02-numbers/02-signed-integers.mdx`, moduleSlug: "repr-numbers", order: 2, duration: 25, xp: 35, tags: ["integers"], concepts: ["binary"] },
    { slug: "integer-overflow", title: "Integer Overflow", description: "Real-world overflow examples.", contentPath: `${C3}/02-numbers/03-integer-overflow.mdx`, moduleSlug: "repr-numbers", order: 3, duration: 20, xp: 30, tags: ["overflow"], concepts: ["binary"] },
    { slug: "floating-point-numbers", title: "Floating Point Numbers", description: "IEEE-754 standard, precision.", contentPath: `${C3}/02-numbers/04-floating-point-numbers.mdx`, moduleSlug: "repr-numbers", order: 4, duration: 25, xp: 35, tags: ["float"], concepts: ["binary"] },
    { slug: "floating-point-errors", title: "Floating Point Errors", description: "Why 0.1+0.2≠0.3, precision handling.", contentPath: `${C3}/02-numbers/05-floating-point-errors.mdx`, moduleSlug: "repr-numbers", order: 5, duration: 20, xp: 30, tags: ["float"], concepts: ["binary"] },
    // Module 3: Text (4)
    { slug: "character-encoding-overview", title: "Character Encoding", description: "Why text needs encoding standards.", contentPath: `${C3}/03-text/01-character-encoding.mdx`, moduleSlug: "repr-text", order: 1, duration: 15, xp: 20, tags: ["encoding"], concepts: ["binary"] },
    { slug: "ascii-encoding", title: "ASCII", description: "7-bit ASCII table and limitations.", contentPath: `${C3}/03-text/02-ascii.mdx`, moduleSlug: "repr-text", order: 2, duration: 20, xp: 25, tags: ["ascii"], concepts: ["binary"] },
    { slug: "unicode-standard", title: "Unicode", description: "UTF-8, UTF-16, code points.", contentPath: `${C3}/03-text/03-unicode.mdx`, moduleSlug: "repr-text", order: 3, duration: 25, xp: 35, tags: ["unicode"], concepts: ["binary"] },
    { slug: "emojis-international", title: "Emojis & International Languages", description: "Emoji encoding, UTF-8 dominance.", contentPath: `${C3}/03-text/04-emojis-international.mdx`, moduleSlug: "repr-text", order: 4, duration: 20, xp: 25, tags: ["emoji"], concepts: ["binary"] },
    // Module 4: Images (5)
    { slug: "pixels-resolution", title: "Pixels and Resolution", description: "Pixel grids, resolution, image size calculations.", contentPath: `${C3}/04-images/01-pixels-resolution.mdx`, moduleSlug: "repr-images", order: 1, duration: 20, xp: 25, tags: ["pixels"], concepts: ["binary"] },
    { slug: "color-models", title: "Color Models", description: "RGB, RGBA, hex colors, color depth.", contentPath: `${C3}/04-images/02-color-models.mdx`, moduleSlug: "repr-images", order: 2, duration: 20, xp: 25, tags: ["color"], concepts: ["binary"] },
    { slug: "image-formats", title: "Image Formats", description: "PNG, JPEG, GIF, SVG, WebP.", contentPath: `${C3}/04-images/03-image-formats.mdx`, moduleSlug: "repr-images", order: 3, duration: 20, xp: 25, tags: ["formats"], concepts: ["binary"] },
    { slug: "image-compression", title: "Compression", description: "Lossless vs lossy, JPEG pipeline.", contentPath: `${C3}/04-images/04-compression.mdx`, moduleSlug: "repr-images", order: 4, duration: 20, xp: 25, tags: ["compression"], concepts: ["binary"] },
    { slug: "image-metadata", title: "Image Metadata", description: "EXIF, GPS data, privacy implications.", contentPath: `${C3}/04-images/05-metadata.mdx`, moduleSlug: "repr-images", order: 5, duration: 15, xp: 20, tags: ["metadata"], concepts: ["binary"] },
    // Module 5: Audio (4)
    { slug: "sound-as-waves", title: "Sound as Waves", description: "Frequency, amplitude, analog to digital.", contentPath: `${C3}/05-audio/01-sound-as-waves.mdx`, moduleSlug: "repr-audio", order: 1, duration: 20, xp: 25, tags: ["audio"], concepts: ["binary"] },
    { slug: "audio-sampling", title: "Sampling", description: "Sample rate, bit depth, Nyquist theorem.", contentPath: `${C3}/05-audio/02-audio-sampling.mdx`, moduleSlug: "repr-audio", order: 2, duration: 20, xp: 30, tags: ["audio"], concepts: ["binary"] },
    { slug: "audio-formats", title: "Audio Formats", description: "WAV, FLAC, MP3, AAC, OGG.", contentPath: `${C3}/05-audio/03-audio-formats.mdx`, moduleSlug: "repr-audio", order: 3, duration: 20, xp: 25, tags: ["audio"], concepts: ["binary"] },
    { slug: "audio-compression", title: "Audio Compression", description: "Psychoacoustic models, bitrate.", contentPath: `${C3}/05-audio/04-audio-compression.mdx`, moduleSlug: "repr-audio", order: 4, duration: 20, xp: 25, tags: ["audio"], concepts: ["binary"] },
    // Module 6: Video (4)
    { slug: "video-frames", title: "Video Frames", description: "Frame rate, keyframes, delta frames.", contentPath: `${C3}/06-video/01-video-frames.mdx`, moduleSlug: "repr-video", order: 1, duration: 20, xp: 25, tags: ["video"], concepts: ["binary"] },
    { slug: "video-compression", title: "Video Compression", description: "Keyframe/delta encoding, compression ratios.", contentPath: `${C3}/06-video/02-video-compression.mdx`, moduleSlug: "repr-video", order: 2, duration: 20, xp: 25, tags: ["video"], concepts: ["binary"] },
    { slug: "codecs-containers", title: "Codecs & Containers", description: "H.264, H.265, AV1, MP4, MKV.", contentPath: `${C3}/06-video/03-codecs-containers.mdx`, moduleSlug: "repr-video", order: 3, duration: 20, xp: 25, tags: ["video"], concepts: ["binary"] },
    { slug: "streaming-video", title: "Streaming Video", description: "Adaptive bitrate, buffering.", contentPath: `${C3}/06-video/04-streaming-video.mdx`, moduleSlug: "repr-video", order: 4, duration: 20, xp: 25, tags: ["video"], concepts: ["binary"] },
    // Module 7: Files (2)
    { slug: "file-systems", title: "File Systems", description: "NTFS, APFS, ext4, FAT32.", contentPath: `${C3}/07-files/01-file-systems.mdx`, moduleSlug: "files-storage", order: 1, duration: 15, xp: 20, tags: ["files"], concepts: ["binary"] },
    { slug: "how-oss-store-files", title: "How OSs Store Files", description: "Blocks, clusters, fragmentation.", contentPath: `${C3}/07-files/02-how-oss-store-files.mdx`, moduleSlug: "files-storage", order: 2, duration: 20, xp: 25, tags: ["storage"], concepts: ["binary"] },

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
