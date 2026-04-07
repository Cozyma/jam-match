"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SongMiniCard } from "@/components/song-mini-card"
import { useRoom, useRoomMembers } from "@/hooks/use-room"
import { useMatching } from "@/hooks/use-matching"
import type { MatchLevel, MatchedSong } from "@/hooks/use-matching"
import { useAuth } from "@/hooks/use-auth"

interface JamRoomScreenProps {
  roomId?: string
  roomCode?: string
  expiresAt?: string
}

function useRemainingTime(expiresAt: string | undefined) {
  const [remaining, setRemaining] = useState("")

  useEffect(() => {
    if (!expiresAt) return

    function update() {
      const diff = new Date(expiresAt!).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining("期限切れ")
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setRemaining(`残り ${hours}時間${minutes}分`)
    }

    update()
    const timer = setInterval(update, 60_000)
    return () => clearInterval(timer)
  }, [expiresAt])

  return remaining
}

const partIconMap: Record<string, string> = {
  guitar: "🎸",
  banjo: "🪕",
  mandolin: "🎸",
  fiddle: "🎻",
  bass: "🎸",
  dobro: "🎸",
  other: "🎵",
}

function mapMatchedSongToCard(song: MatchedSong) {
  // Count instruments
  const instrumentCounts = new Map<string, number>()
  for (const player of song.players) {
    const icon = partIconMap[player.part] || "🎵"
    instrumentCounts.set(icon, (instrumentCounts.get(icon) || 0) + 1)
  }
  const instruments = Array.from(instrumentCounts.entries()).map(([icon, count]) => ({ icon, count }))

  // Vocal summary
  const vocals = song.players
    .filter(p => p.vocal && p.vocal !== "none")
    .map(p => {
      if (p.vocal === "lead") return "Lead"
      if (p.vocal === "harmony_high") return "Har(H)"
      if (p.vocal === "harmony_low") return "Har(L)"
      return ""
    })
    .filter(Boolean)
  const vocalSummary = vocals.length > 0 ? vocals.join("+") : "Inst"

  // Proficiencies
  const profMap: Record<string, "ready" | "practice" | "learning"> = {
    ready: "ready",
    with_practice: "practice",
    learning: "learning",
  }
  const proficiencies = song.players.map(p => profMap[p.proficiency] || "learning")

  return {
    id: song.id,
    title: song.title,
    songKey: song.original_key || "-",
    instruments,
    vocalSummary,
    proficiencies: proficiencies as readonly ("ready" | "practice" | "learning")[],
    coverage: `${song.player_count}/${song.member_count}人`,
  }
}

export function JamRoomScreen({ roomId, roomCode, expiresAt }: JamRoomScreenProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { leaveRoom } = useRoom()
  const remainingTime = useRemainingTime(expiresAt)
  const [matchLevel, setMatchLevel] = useState<readonly string[]>(["normal"])
  const { members, loading: membersLoading } = useRoomMembers(roomId)
  const currentMatchLevel = (matchLevel[0] || "normal") as MatchLevel
  const { songs: matchedSongs, loading: matchingLoading } = useMatching(roomId, currentMatchLevel)

  const displayCode = roomCode || "------"

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[375px] flex-col bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-stone-600"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex flex-col items-center">
            <h1 className="text-base font-semibold text-stone-800">
              Room: {displayCode}
            </h1>
            <p className="text-xs text-stone-500">
              参加者: {members.length}人
              {remainingTime && (
                <span className="ml-2 inline-flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {remainingTime}
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-stone-600">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 pb-20 pt-4">
        {/* Match Toggle */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-stone-500">マッチレベル</p>
          <ToggleGroup
            value={matchLevel}
            onValueChange={(value) => value.length > 0 && setMatchLevel(value)}
            className="w-full rounded-lg border border-stone-200 bg-white p-1"
          >
            <ToggleGroupItem
              value="strict"
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-stone-600 data-[pressed]:bg-amber-700 data-[pressed]:text-white"
            >
              Strict
            </ToggleGroupItem>
            <ToggleGroupItem
              value="normal"
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-stone-600 data-[pressed]:bg-amber-700 data-[pressed]:text-white"
            >
              Normal
            </ToggleGroupItem>
            <ToggleGroupItem
              value="loose"
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-stone-600 data-[pressed]:bg-amber-700 data-[pressed]:text-white"
            >
              Loose
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Song List Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">
            {matchingLoading ? "読み込み中..." : `共通曲: ${matchedSongs.length}曲`}
          </h2>
        </div>

        {/* Song List */}
        <div className="flex flex-col gap-3">
          {matchedSongs.map((song) => (
            <SongMiniCard key={song.id} song={mapMatchedSongToCard(song)} />
          ))}
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="sticky bottom-0 z-10 border-t border-stone-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-stone-200 text-stone-700 hover:bg-stone-50"
          >
            <Users className="h-4 w-4" />
            メンバー
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={async () => {
              if (roomId && user) {
                await leaveRoom(roomId, user.id)
              }
              router.push("/")
            }}
          >
            退出
          </Button>
        </div>
      </footer>
    </div>
  )
}
