export interface Volume {
  id: string
  number: number
  slug: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  status: "active" | "coming-soon" | "planned"
  order: number
  categories: Category[]
}

export interface Category {
  id: string
  volumeId: string
  slug: string
  title: string
  description: string
  icon: string
  order: number
  modules: Module[]
}

export interface Module {
  id: string
  categoryId: string
  slug: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  slug: string
  title: string
  description: string
  contentPath: string
  contentType: "text" | "interactive" | "quiz" | "challenge" | "project"
  order: number
  duration: number
  xpReward: number
  difficulty: "beginner" | "intermediate" | "advanced"
  prerequisites: string[]
  tags: string[]
  completed?: boolean
  bookmarked?: boolean
}

export interface UserProgress {
  userId: string
  totalXp: number
  level: number
  streak: number
  lastActive: string
  lessonsCompleted: number
  quizzesPassed: number
  challengesSolved: number
  projectsSubmitted: number
}

export interface Achievement {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  xpReward: number
  unlocked: boolean
  unlockedAt?: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: "mcq" | "coding" | "true-false" | "fill-blank"
  options?: string[]
  answer: string
  explanation?: string
}

export interface Challenge {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  type: "daily" | "weekly" | "monthly" | "competition"
  starterCode?: string
  testCases: TestCase[]
  xpReward: number
  timeLimit?: number
}

export interface TestCase {
  input: string
  expected: string
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  template?: string
  volumeId?: string
}

export interface Certificate {
  id: string
  title: string
  type: "volume" | "skill" | "final-exam"
  issuedAt: string
  metadata: Record<string, unknown>
}

export interface Post {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  title: string
  content: string
  type: "discussion" | "blog" | "showcase"
  tags: string[]
  pinned: boolean
  createdAt: string
  commentCount: number
  likeCount: number
  liked?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
}

export interface TerminalTheme {
  background: string
  foreground: string
  cursor: string
  cursorAccent: string
  selectionBackground: string
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
}
