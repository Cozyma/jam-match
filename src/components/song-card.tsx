"use client"

import { useState } from "react"
import { Star, ChevronDown, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { PartIcon } from "@/components/icons/part-icon"

type Proficiency = "ready" | "practice" | "learning"

interface MemberDetail {
  name: string
  instrument: string
  subParts: string[]
  proficiency: Proficiency
  vocalRole: string | null
  preferredKeys: string[]
}

interface InstrumentCount {
  part: string
  count: number
}

export interface SongCardData {
  id: string
  title: string
  songKey: string
  instruments: InstrumentCount[]
  vocalSummary: string
  proficiencies: readonly Proficiency[]
  coverage: string
  favoriteCount?: number
  members: MemberDetail[]
}

const proficiencyColors: Record<Proficiency, string> = {
  ready: "bg-emerald-500",
  practice: "bg-amber-500",
  learning: "bg-stone-400",
}

interface SongCardProps {
  song: SongCardData
  isPlayed?: boolean
  onTogglePlayed?: () => void
}

export function SongCard({ song, isPlayed, onTogglePlayed }: SongCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="gap-0 overflow-hidden border-stone-200 bg-white py-0 shadow-sm">
        <CollapsibleTrigger className="w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <div className="flex flex-col gap-1.5 p-3">
            {/* Top row: Title and Key */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1 min-w-0">
                {onTogglePlayed && (
                  <button
                    type="button"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTogglePlayed()
                    }}
                  >
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isPlayed
                          ? "fill-emerald-500 text-emerald-500"
                          : "text-stone-300 hover:text-stone-400"
                      )}
                    />
                  </button>
                )}
                {song.favoriteCount && song.favoriteCount > 0 ? (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-500" />
                ) : null}
                <h3 className={cn(
                  "text-sm font-semibold leading-tight truncate",
                  isPlayed ? "text-stone-400 line-through" : "text-stone-800"
                )}>
                  {song.title}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
              >
                Key: {song.songKey}
              </Badge>
            </div>

            {/* Bottom row: Instruments, Vocals, Proficiency, Coverage */}
            <div className="flex items-center justify-between text-sm text-stone-600">
              <div className="flex items-center gap-2">
                {song.instruments.map((inst, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <PartIcon part={inst.part} size="sm" />
                    <span className="text-xs text-stone-500">x{inst.count}</span>
                  </span>
                ))}
                <span className="text-xs text-stone-400">🎤{song.vocalSummary}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  {song.proficiencies.map((prof, idx) => (
                    <span
                      key={idx}
                      className={cn("inline-block h-2 w-2 rounded-full", proficiencyColors[prof])}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-stone-500">{song.coverage}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-stone-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-stone-200 bg-stone-50 px-3 py-2">
            <div className="flex flex-col gap-1.5">
              {song.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-16 truncate font-medium text-stone-700">
                      {member.name}
                    </span>
                    <PartIcon part={member.instrument} size="sm" />
                    {member.subParts.length > 0 && (
                      <span className="flex items-center gap-0.5 text-stone-400">
                        +{member.subParts.map(p => <PartIcon key={p} part={p} size="sm" />)}
                      </span>
                    )}
                    <span className={cn("inline-block h-2 w-2 rounded-full", proficiencyColors[member.proficiency])} />
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span className="text-center">
                      {member.vocalRole || "-"}
                    </span>
                    {member.preferredKeys.length > 0 && (
                      <span className="text-stone-400">
                        {member.preferredKeys.join(",")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
