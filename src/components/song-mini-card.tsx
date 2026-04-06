"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Proficiency = "ready" | "practice" | "learning"

interface InstrumentCount {
  icon: string
  count: number
}

interface SongMiniCardData {
  id: string
  title: string
  songKey: string
  instruments: InstrumentCount[]
  vocalSummary: string
  proficiencies: readonly Proficiency[]
  coverage: string
}

const proficiencyColors: Record<Proficiency, string> = {
  ready: "bg-emerald-500",
  practice: "bg-amber-500",
  learning: "bg-stone-400",
}

function ProficiencyDot({ proficiency }: { proficiency: Proficiency }) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full",
        proficiencyColors[proficiency]
      )}
      aria-label={proficiency}
    />
  )
}

interface SongMiniCardProps {
  song: SongMiniCardData
}

export function SongMiniCard({ song }: SongMiniCardProps) {
  return (
    <Card className="gap-0 border-stone-200 bg-white p-3 shadow-sm">
      {/* Top row: Title and Key */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-tight text-stone-800">
          {song.title}
        </h3>
        <Badge
          variant="outline"
          className="shrink-0 border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
        >
          Key: {song.songKey}
        </Badge>
      </div>

      {/* Middle row: Instruments and Vocals */}
      <div className="mt-2 flex items-center justify-between text-sm text-stone-600">
        <div className="flex items-center gap-2">
          {song.instruments.map((inst, idx) => (
            <span key={idx} className="flex items-center gap-0.5">
              <span className="text-sm">{inst.icon}</span>
              <span className="text-xs text-stone-500">x{inst.count}</span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-stone-500">
          <span className="text-sm">{"\uD83C\uDFA4"}</span>
          <span className="text-xs">{song.vocalSummary}</span>
        </div>
      </div>

      {/* Bottom row: Proficiency dots and Coverage */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {song.proficiencies.map((prof, idx) => (
            <ProficiencyDot key={idx} proficiency={prof} />
          ))}
        </div>
        <span className="text-xs font-medium text-stone-500">
          {song.coverage}
        </span>
      </div>
    </Card>
  )
}
