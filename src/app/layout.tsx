import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "LupaLearn — Master Computer Science",
  description:
    "A learning operating system where every concept becomes part of a living map of your knowledge. Interactive lessons, AI mentor, hands-on projects.",
  keywords: [
    "programming", "learn to code", "computer science",
    "interactive learning", "knowledge graph", "coding",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg text-text-primary`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
