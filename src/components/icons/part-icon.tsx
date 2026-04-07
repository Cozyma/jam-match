import { cn } from "@/lib/utils"

const partConfig: Record<string, { label: string; bg: string; text: string }> = {
  guitar:   { label: "Gt", bg: "bg-amber-100",   text: "text-amber-800" },
  banjo:    { label: "Bj", bg: "bg-sky-100",      text: "text-sky-800" },
  mandolin: { label: "Md", bg: "bg-violet-100",   text: "text-violet-800" },
  fiddle:   { label: "Fd", bg: "bg-rose-100",     text: "text-rose-800" },
  bass:     { label: "Bs", bg: "bg-emerald-100",  text: "text-emerald-800" },
  dobro:    { label: "Db", bg: "bg-orange-100",   text: "text-orange-800" },
  other:    { label: "♪",  bg: "bg-stone-100",    text: "text-stone-600" },
}

interface PartIconProps {
  part: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeStyles = {
  sm: "h-5 w-5 text-[9px] rounded",
  md: "h-6 w-6 text-[10px] rounded",
  lg: "h-7 w-7 text-xs rounded-md",
} as const

export function PartIcon({ part, size = "md", className }: PartIconProps) {
  const config = partConfig[part] || partConfig.other
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold leading-none",
        sizeStyles[size],
        config.bg,
        config.text,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

export { partConfig }
