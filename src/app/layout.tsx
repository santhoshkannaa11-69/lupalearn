import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LupaLearn — AI-Powered Interactive Learning Platform",
  description:
    "Learn programming, AI, and software engineering through interactive lessons, live coding, AI mentoring, hands-on projects, and personalized learning roadmaps.",
  keywords: [
    "programming", "learn to code", "AI tutor", "coding platform",
    "computer science", "web development", "software engineering",
    "interactive learning", "coding challenges",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#0a0a0a] text-[#c0c0c0]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
