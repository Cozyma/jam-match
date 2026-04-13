"use client"

import { useState } from "react"
import { Music, Play, ExternalLink } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { chordsToNashville } from "@/lib/chord-utils"
import type { Database } from "@/types/database"

type Song = Database["public"]["Tables"]["songs"]["Row"]

const partLabels: Record<string, string> = {
  guitar: "guitar", banjo: "banjo", mandolin: "mandolin",
  fiddle: "fiddle", bass: "bass", dobro: "dobro",
}

interface SongDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song: Song | null
  userPart?: string | null
}

export function SongDetailSheet({ open, onOpenChange, song, userPart }: SongDetailSheetProps) {
  const [showNashville, setShowNashville] = useState(false)

  if (!song) return null

  const displayChords = song.chords
    ? showNashville ? chordsToNashville(song.chords, song.original_key) : song.chords
    : null

  const partLabel = userPart ? partLabels[userPart] || userPart : null
  const videoQuery = [song.title, partLabel, "bluegrass"].filter(Boolean).join(" ")
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery)}`

  const lyricsQuery = `${song.title} lyrics`
  const lyricsUrl = `https://www.google.com/search?q=${encodeURIComponent(lyricsQuery)}`

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-start justify-between gap-2">
            <SheetTitle className="text-lg">{song.title}</SheetTitle>
            <Badge
              variant="outline"
              className="shrink-0 border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
            >
              Key: {song.original_key || "-"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{song.tempo || "-"}</span>
            <span>/</span>
            <span>{song.main_instrument || "-"}</span>
            <span>/</span>
            <span>{song.has_vocal ? "歌あり" : "インスト"}</span>
            {song.is_public_domain && (
              <Badge variant="secondary" className="text-xs">PD</Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4">
          {/* 外部検索ボタン */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => window.open(videoUrl, "_blank")}
            >
              <Play className="mr-1.5 h-3.5 w-3.5" />
              動画検索{partLabel ? `（${partLabel}）` : ""}
            </Button>
            {!song.is_public_domain && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(lyricsUrl, "_blank")}
              >
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                歌詞検索
              </Button>
            )}
          </div>

          {/* コード進行 */}
          {displayChords && (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-1">
                  <Music className="h-3.5 w-3.5" />
                  コード進行
                </h4>
                <div className="flex rounded-md border border-stone-200 overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setShowNashville(false)}
                    className={cn(
                      "px-2.5 py-1 transition-colors",
                      !showNashville ? "bg-stone-800 text-white" : "bg-white text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    コード
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNashville(true)}
                    className={cn(
                      "px-2.5 py-1 transition-colors border-l border-stone-200",
                      showNashville ? "bg-stone-800 text-white" : "bg-white text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    度数
                  </button>
                </div>
              </div>
              <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                <pre className="text-sm text-stone-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {displayChords}
                </pre>
              </div>
            </div>
          )}

          {/* 歌詞（PD曲のみ） */}
          {song.is_public_domain && song.lyrics && (
            <div>
              <h4 className="mb-1.5 text-sm font-semibold text-stone-700">
                歌詞
              </h4>
              <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                <pre className="text-sm text-stone-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {song.lyrics}
                </pre>
              </div>
            </div>
          )}

          {/* コード・歌詞がない場合 */}
          {!song.chords && !song.lyrics && (
            <p className="text-sm text-muted-foreground text-center py-4">
              コード・歌詞データはまだ登録されていません
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
