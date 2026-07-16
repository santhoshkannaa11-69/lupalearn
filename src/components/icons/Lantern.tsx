import type { SVGProps } from "react"

export function Lantern(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3h8l2 4H6l2-4z" />
      <rect x="7" y="7" width="10" height="12" rx="1" />
      <path d="M7 19h10v2H7z" />
      <path d="M12 11v4" />
      <circle cx="12" cy="9" r="0.5" fill="currentColor" />
    </svg>
  )
}
