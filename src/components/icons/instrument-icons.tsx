interface IconProps {
  className?: string
  size?: number
}

export function GuitarIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 11.5A4.5 4.5 0 0 0 6 8a5 5 0 0 0-3 9 5 5 0 0 0 6 4 4.5 4.5 0 0 0 2-4.5" />
      <circle cx="8" cy="16" r="1.5" />
      <path d="m13 9 7-7" />
      <path d="M18 2h2v2" />
    </svg>
  )
}

export function BanjoIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="16" r="6" />
      <path d="m12.5 11.5 7.5-7.5" />
      <circle cx="21" cy="3" r="1.5" />
      <path d="m18 6 2-2" />
    </svg>
  )
}

export function MandolinIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 13A6 6 0 0 0 3 21a6 6 0 0 0 8-8Z" />
      <path d="m13 11 6-6" />
      <path d="M17 3a2 2 0 1 1 4 4" />
    </svg>
  )
}

export function FiddleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 11a3 3 0 0 0-3-2 4 4 0 0 0-2 6 4 4 0 0 0 5 4 3 3 0 0 0 2-3" />
      <path d="m12 9 6-6" />
      <path d="M22 2 2 22" />
    </svg>
  )
}

export function BassIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 20c-2 0-3-2-3-5 0-2 1.5-3 1.5-4S4 9 4 7c0-2 1.5-3 3-3h10c1.5 0 3 1 3 3 0 2-1.5 2-1.5 4s1.5 2 1.5 4c0 3-1 5-3 5Z" />
      <path d="M12 4V2" />
      <path d="M10 2h4" />
      <path d="M12 22v-2" />
    </svg>
  )
}

export function DobroIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 11.5A4.5 4.5 0 0 0 6 8a5 5 0 0 0-3 9 5 5 0 0 0 6 4 4.5 4.5 0 0 0 2-4.5" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="7" cy="17" r="1" />
      <path d="m13 9 7-7" />
      <path d="M18 2h2v2" />
    </svg>
  )
}

export function NoteIcon({ className, size = 24 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="18" r="3" />
      <path d="M12 18V4l7 3v4l-7-3" />
    </svg>
  )
}
