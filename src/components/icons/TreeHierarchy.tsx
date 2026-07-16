import type { SVGProps } from "react"

export function TreeHierarchy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="4" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="12" cy="20" r="2" />
      <circle cx="18" cy="20" r="2" />
      <path d="M12 6v2" />
      <path d="M7 14l-1 4" />
      <path d="M17 14l1 4" />
      <path d="M12 14v4" />
      <path d="M8 13l4-3" />
      <path d="M16 13l-4-3" />
    </svg>
  )
}
