export interface CourseIdentity {
  slug: string
  title: string
  moduleCount: number
  lessonCount: number
  lanternColor: string
  lanternName: string
  iconComponent: string
  gradient: string
}

export const COURSES: CourseIdentity[] = [
  { slug: "computer-science", title: "Introduction to Computing", moduleCount: 8, lessonCount: 35, lanternColor: "#E8B84B", lanternName: "Warm Gold", iconComponent: "Sigma", gradient: "from-[#E8B84B]/10" },
  { slug: "number-systems", title: "Number Systems", moduleCount: 5, lessonCount: 18, lanternColor: "#C87D4B", lanternName: "Copper", iconComponent: "CodeBrackets", gradient: "from-[#C87D4B]/10" },
  { slug: "data-representation", title: "Data Representation", moduleCount: 7, lessonCount: 28, lanternColor: "#5BA0D9", lanternName: "Ice Blue", iconComponent: "ArrayStack", gradient: "from-[#5BA0D9]/10" },
  { slug: "logic-boolean-algebra", title: "Logic & Boolean Algebra", moduleCount: 6, lessonCount: 32, lanternColor: "#9B7FD4", lanternName: "Violet", iconComponent: "PuzzlePiece", gradient: "from-[#9B7FD4]/10" },
  { slug: "digital-electronics", title: "Digital Electronics", moduleCount: 8, lessonCount: 40, lanternColor: "#D4943A", lanternName: "Amber", iconComponent: "TreeHierarchy", gradient: "from-[#D4943A]/10" },
  { slug: "mathematics", title: "Mathematics for CS", moduleCount: 6, lessonCount: 9, lanternColor: "#45B7A0", lanternName: "Teal", iconComponent: "Sigma", gradient: "from-[#45B7A0]/10" },
  { slug: "programming-fundamentals", title: "Programming Fundamentals", moduleCount: 10, lessonCount: 45, lanternColor: "#E8B84B", lanternName: "Warm Gold", iconComponent: "CodeBrackets", gradient: "from-[#E8B84B]/10" },
  { slug: "problem-solving", title: "Problem Solving", moduleCount: 5, lessonCount: 2, lanternColor: "#5BA0D9", lanternName: "Ice Blue", iconComponent: "PuzzlePiece", gradient: "from-[#5BA0D9]/10" },
  { slug: "development-environment", title: "Development Environment", moduleCount: 5, lessonCount: 2, lanternColor: "#9B7FD4", lanternName: "Violet", iconComponent: "TerminalPrompt", gradient: "from-[#9B7FD4]/10" },
  { slug: "computer-ethics", title: "Computer Ethics", moduleCount: 5, lessonCount: 2, lanternColor: "#45B7A0", lanternName: "Teal", iconComponent: "Scales", gradient: "from-[#45B7A0]/10" },
]

export const VOLUME_INFO = {
  title: "Volume 1: Computer Engineering Foundations",
  description: "Master the core concepts that every computer engineer needs to know — from binary to operating systems.",
  totalLessons: 183,
  completedLessons: 0,
}
