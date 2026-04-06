"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Proficiency = "ready" | "practice" | "learning"

interface MemberDetail {
  name: string
  instrument: string
  proficiency: Proficiency
  vocalRole: string | null
  preferredKeys: string[]
}

interface InstrumentCount {
  icon: string
  count: number
}

interface SongData {
  title: string
  songKey: string
  instruments: InstrumentCount[]
  vocalSummary: string
  proficiencies: readonly Proficiency[]
  coverage: string
  members: MemberDetail[]
}

const proficiencyColors: Record<Proficiency, string> = {
  ready: "bg-green-500",
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

function InstrumentIcon({ instrument }: { instrument: string }) {
  const icons: Record<string, string> = {
    guitar: "\uD83C\uDFB8",
    banjo: "\uD83E\uDE95",
    fiddle: "\uD83C\uDFBB",
    mandolin: "\uD83C\uDFB8",
    bass: "\uD83C\uDFB8",
  }
  return <span className="text-base">{icons[instrument] || "\uD83C\uDFB5"}</span>
}

interface SongCardProps {
  song: SongData
  defaultOpen?: boolean
}

export function SongCard({ song, defaultOpen = false }: SongCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="gap-0 overflow-hidden border-stone-200 bg-white py-0 shadow-sm">
        <CollapsibleTrigger className="w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <div className="flex flex-col gap-2 p-4">
            {/* Top row: Title and Key */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-stone-800">
                {song.title}
              </h3>
              <Badge
                variant="outline"
                className="shrink-0 border-amber-200 bg-amber-50 text-amber-700"
              >
                Key: {song.songKey}
              </Badge>
            </div>

            {/* Middle row: Instruments and Vocals */}
            <div className="flex items-center justify-between text-sm text-stone-600">
              <div className="flex items-center gap-2">
                {song.instruments.map((inst, idx) => (
                  <span key={idx} className="flex items-center gap-0.5">
                    <span>{inst.icon}</span>
                    <span className="text-xs text-stone-500">
                      x{inst.count}
                    </span>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-stone-500">
                <span>{"\uD83C\uDFA4"}</span>
                <span className="text-xs">{song.vocalSummary}</span>
              </div>
            </div>

            {/* Bottom row: Proficiency dots and Coverage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {song.proficiencies.map((prof, idx) => (
                  <ProficiencyDot key={idx} proficiency={prof} />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500">{song.coverage}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-stone-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-stone-200 bg-stone-50 px-4 py-3">
            <div className="flex flex-col gap-2">
              {song.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium text-stone-700">
                      {member.name}
                    </span>
                    <InstrumentIcon instrument={member.instrument} />
                    <ProficiencyDot proficiency={member.proficiency} />
                  </div>
                  <div className="flex items-center gap-3 text-stone-500">
                    <span className="w-16 text-center text-xs">
                      {member.vocalRole || "-"}
                    </span>
                    <span className="w-12 text-right text-xs">
                      {member.preferredKeys.join(",")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-3 flex items-center gap-4 border-t border-stone-200 pt-2 text-xs text-stone-400">
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                <span>Ready</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span>Practice</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-stone-400" />
                <span>Learning</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
