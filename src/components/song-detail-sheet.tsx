"use client"

import { Music } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/types/database"

type Song = Database["public"]["Tables"]["songs"]["Row"]

interface SongDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song: Song | null
}

export function SongDetailSheet({ open, onOpenChange, song }: SongDetailSheetProps) {
  if (!song) return null

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
          {/* コード進行 */}
          {song.chords && (
            <div>
              <h4 className="mb-1.5 text-sm font-semibold text-stone-700 flex items-center gap-1">
                <Music className="h-3.5 w-3.5" />
                コード進行
              </h4>
              <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
                <pre className="text-sm text-stone-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {song.chords}
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
