"use client"

import { useState } from "react"
import { Music, Play, ExternalLink, Pencil, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { chordsToNashville } from "@/lib/chord-utils"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type Song = Database["public"]["Tables"]["songs"]["Row"]

const partLabels: Record<string, string> = {
  guitar: "guitar", banjo: "banjo", mandolin: "mandolin",
  fiddle: "fiddle", bass: "bass", dobro: "dobro",
}

const KEYS = ["A", "Am", "B", "Bb", "Bm", "C", "D", "Dm", "E", "Em", "F", "G"]

interface SongDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song: Song | null
  userPart?: string | null
  userId?: string | null
  userRole?: string | null
  onUpdated?: () => void
}

export function SongDetailSheet({ open, onOpenChange, song, userPart, userId, userRole, onUpdated }: SongDetailSheetProps) {
  const [showNashville, setShowNashville] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editChords, setEditChords] = useState("")
  const [editKey, setEditKey] = useState("")
  const [editTempo, setEditTempo] = useState("")
  const [saving, setSaving] = useState(false)

  if (!song) return null

  const canEdit = userId && (userId === song.created_by || userRole === "moderator")
  const canDelete = canEdit && !song.is_official

  const displayChords = song.chords
    ? showNashville ? chordsToNashville(song.chords, song.original_key) : song.chords
    : null

  const partLabel = userPart ? partLabels[userPart] || userPart : null
  const videoQuery = [song.title, partLabel, "bluegrass"].filter(Boolean).join(" ")
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery)}`
  const lyricsQuery = `${song.title} lyrics`
  const lyricsUrl = `https://www.google.com/search?q=${encodeURIComponent(lyricsQuery)}`

  const songId = song.id

  function startEdit() {
    setEditChords(song!.chords || "")
    setEditKey(song!.original_key || "")
    setEditTempo(song!.tempo || "")
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("songs").update({
      chords: editChords || null,
      original_key: editKey || null,
      tempo: editTempo || null,
    }).eq("id", songId)
    setSaving(false)
    setEditing(false)
    onUpdated?.()
  }

  async function handleDelete() {
    if (!confirm("この曲を削除しますか？")) return
    const supabase = createClient()
    await supabase.from("songs").delete().eq("id", songId)
    onOpenChange(false)
    onUpdated?.()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) setEditing(false); onOpenChange(o) }}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pr-8">
          <SheetTitle className="text-lg">{song.title}</SheetTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
            >
              Key: {song.original_key || "-"}
            </Badge>
            <span>{song.tempo || "-"}</span>
            <span>/</span>
            <span>{song.main_instrument || "-"}</span>
            <span>/</span>
            <span>{song.has_vocal ? "歌あり" : "インスト"}</span>
            {song.is_public_domain && (
              <Badge variant="secondary" className="text-xs">PD</Badge>
            )}
            {!song.is_official && (
              <Badge variant="outline" className="text-xs border-stone-300">ユーザー追加</Badge>
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

          {/* 編集モード */}
          {editing ? (
            <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <Label className="text-xs">Key</Label>
                  <Select value={editKey} onValueChange={setEditKey}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Key" /></SelectTrigger>
                    <SelectContent>
                      {KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <Label className="text-xs">テンポ</Label>
                  <Select value={editTempo} onValueChange={setEditTempo}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="テンポ" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">コード進行</Label>
                <Input
                  value={editChords}
                  onChange={(e) => setEditChords(e.target.value)}
                  placeholder="例: G - C - D - G"
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1">保存</Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="flex-1">キャンセル</Button>
              </div>
            </div>
          ) : (
            <>
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
                  <h4 className="mb-1.5 text-sm font-semibold text-stone-700">歌詞</h4>
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

              {/* 編集・削除ボタン */}
              {canEdit && (
                <div className="flex gap-2 pt-2 border-t border-stone-200">
                  <Button variant="outline" size="sm" onClick={startEdit} className="flex-1">
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    編集
                  </Button>
                  {canDelete && (
                    <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      削除
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
