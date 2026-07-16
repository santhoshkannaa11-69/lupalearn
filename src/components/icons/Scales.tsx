import type { SVGProps } from "react"

export function Scales(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v20" />
      <path d="M4 8l8-4 8 4" />
      <path d="M4 16l8 4 8-4" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="20" cy="12" r="1" />
    </svg>
  )
}
