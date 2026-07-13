export const SCHOOLS = [
  { number: 1, slug: "computer-science", title: "School of Computer Science", subtitle: "CS Fundamentals", icon: "cpu", color: "#00ff41" },
  { number: 2, slug: "programming-languages", title: "School of Programming Languages", subtitle: "50+ Languages", icon: "code", color: "#00f0ff" },
  { number: 3, slug: "web-development", title: "School of Web Development", subtitle: "Frontend & Backend", icon: "globe", color: "#ffb000" },
  { number: 4, slug: "mobile-development", title: "School of Mobile Development", subtitle: "Android & iOS", icon: "smartphone", color: "#ff00aa" },
  { number: 5, slug: "desktop-development", title: "School of Desktop Development", subtitle: "Desktop Apps", icon: "monitor", color: "#00aaff" },
  { number: 6, slug: "databases", title: "School of Databases", subtitle: "SQL & NoSQL", icon: "database", color: "#00ff41" },
  { number: 7, slug: "cloud-devops", title: "School of Cloud & DevOps", subtitle: "Infrastructure", icon: "cloud", color: "#00f0ff" },
  { number: 8, slug: "artificial-intelligence", title: "School of Artificial Intelligence", subtitle: "ML & AI", icon: "brain", color: "#ff00aa" },
  { number: 9, slug: "cybersecurity", title: "School of Cybersecurity", subtitle: "Security", icon: "shield", color: "#ff3355" },
  { number: 10, slug: "embedded-systems", title: "School of Embedded Systems", subtitle: "Hardware & Firmware", icon: "chip", color: "#ffb000" },
  { number: 11, slug: "vlsi-chip-design", title: "School of VLSI & Chip Design", subtitle: "Chip Design", icon: "circuit", color: "#00ff41" },
  { number: 12, slug: "robotics-iot", title: "School of Robotics & IoT", subtitle: "Robotics & IoT", icon: "bot", color: "#00f0ff" },
  { number: 13, slug: "computer-graphics", title: "School of Computer Graphics", subtitle: "Graphics & Rendering", icon: "image", color: "#ff00aa" },
  { number: 14, slug: "game-development", title: "School of Game Development", subtitle: "Game Dev", icon: "gamepad", color: "#ffb000" },
  { number: 15, slug: "blockchain-web3", title: "School of Blockchain & Web3", subtitle: "Blockchain", icon: "link", color: "#00f0ff" },
  { number: 16, slug: "cs-core", title: "School of Computer Science Core", subtitle: "Core CS", icon: "book", color: "#ff3355" },
  { number: 17, slug: "software-engineering", title: "School of Software Engineering", subtitle: "Software Engineering", icon: "building", color: "#00ff41" },
  { number: 18, slug: "career-development", title: "School of Career Development", subtitle: "Career Growth", icon: "briefcase", color: "#ffb000" },
  { number: 19, slug: "developer-tools", title: "School of Developer Tools", subtitle: "Tools & Workflow", icon: "wrench", color: "#00aaff" },
  { number: 20, slug: "emerging-technologies", title: "School of Emerging Technologies", subtitle: "Future Tech", icon: "sparkles", color: "#ff00aa" },
] as const

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { label: "Explore", href: "/explore", icon: "search" },
  { label: "Schools", href: "/learn", icon: "graduation-cap" },
  { label: "AI Roadmap", href: "/onboarding", icon: "wand" },
  { label: "Playground", href: "/playground", icon: "terminal" },
  { label: "AI Tutor", href: "/ai-tutor", icon: "bot" },
  { label: "Challenges", href: "/challenges", icon: "swords" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Certifications", href: "/certifications", icon: "award" },
  { label: "Community", href: "/community", icon: "users" },
  { label: "Analytics", href: "/analytics", icon: "chart-bar" },
  { label: "Career", href: "/career", icon: "briefcase" },
  { label: "Settings", href: "/settings", icon: "settings" },
] as const

export const ADMIN_NAV_ITEM = { label: "Admin", href: "/admin", icon: "shield" } as const

export const XP_PER_LEVEL = 500
export const MAX_STREAK_MULTIPLIER = 5

export const DIFFICULTY_COLORS = {
  beginner: "#00ff41",
  intermediate: "#ffb000",
  advanced: "#ff3355",
} as const

export const APP_NAME = "LupaLearn"
export const APP_TAGLINE = "learn. practice. build. grow."
