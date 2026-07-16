export interface CourseIdentity {
  slug: string
  title: string
  moduleCount: number
  lessonCount: number
  lanternColor: string
  lanternName: string
  icon: string
  gradient: string
}

export const COURSES: CourseIdentity[] = [
  { slug: "computer-science", title: "Introduction to Computing", moduleCount: 8, lessonCount: 35, lanternColor: "#E8B84B", lanternName: "Warm Gold", icon: "💻", gradient: "from-[#E8B84B]/10" },
  { slug: "mathematics", title: "Mathematics for CS", moduleCount: 6, lessonCount: 9, lanternColor: "#C87D4B", lanternName: "Copper", icon: "📐", gradient: "from-[#C87D4B]/10" },
  { slug: "programming-fundamentals", title: "Programming Fundamentals", moduleCount: 10, lessonCount: 45, lanternColor: "#E8B84B", lanternName: "Warm Gold", icon: "💻", gradient: "from-[#E8B84B]/10" },
  { slug: "problem-solving", title: "Problem Solving", moduleCount: 5, lessonCount: 2, lanternColor: "#5BA0D9", lanternName: "Ice Blue", icon: "🧩", gradient: "from-[#5BA0D9]/10" },
  { slug: "development-environment", title: "Development Environment", moduleCount: 5, lessonCount: 2, lanternColor: "#9B7FD4", lanternName: "Violet", icon: "🔧", gradient: "from-[#9B7FD4]/10" },
  { slug: "computer-ethics", title: "Computer Ethics", moduleCount: 5, lessonCount: 2, lanternColor: "#45B7A0", lanternName: "Teal", icon: "⚖️", gradient: "from-[#45B7A0]/10" },
]

export const VOLUME_INFO = {
  title: "Volume 1: Computer Engineering Foundations",
  description: "Master the core concepts that every computer engineer needs to know — from binary to operating systems.",
  totalLessons: 183,
  completedLessons: 0,
}
