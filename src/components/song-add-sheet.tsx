"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertCircle } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import { createClient } from "@/lib/supabase/client"

interface SongAddSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onAdded: () => void
}

const KEYS = ["A", "Am", "B", "Bb", "Bm", "C", "D", "Dm", "E", "Em", "F", "G"]
const TEMPOS = [
  { value: "slow", label: "Slow" },
  { value: "medium", label: "Medium" },
  { value: "fast", label: "Fast" },
]

export function SongAddSheet({ open, onOpenChange, userId, onAdded }: SongAddSheetProps) {
  const [title, setTitle] = useState("")
  const [originalKey, setOriginalKey] = useState("")
  const [tempo, setTempo] = useState("")
  const [hasVocal, setHasVocal] = useState<boolean>(true)
  const [chords, setChords] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [similarSongs, setSimilarSongs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  // 類似曲チェック（タイトル入力中にリアルタイム）
  const checkSimilar = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSimilarSongs([])
      return
    }
    const { data } = await supabase
      .from("songs")
      .select("title")
      .ilike("title", `%${q}%`)
      .limit(5)
    if (data) {
      setSimilarSongs(data.map((s) => s.title))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => checkSimilar(title), 300)
    return () => clearTimeout(timer)
  }, [title, checkSimilar])

  // リセット
  useEffect(() => {
    if (open) {
      setTitle("")
      setOriginalKey("")
      setTempo("")
      setHasVocal(true)
      setChords("")
      setError(null)
      setSimilarSongs([])
    }
  }, [open])

  async function handleSubmit() {
    setError(null)
    const trimmed = title.trim()
    if (!trimmed) {
      setError("曲名を入力してください")
      return
    }

    // 完全一致チェック
    const { data: exact } = await supabase
      .from("songs")
      .select("id")
      .eq("title", trimmed)
      .maybeSingle()
    if (exact) {
      setError("同じ曲名が既に登録されています")
      return
    }

    setLoading(true)
    const { error: insertError } = await supabase.from("songs").insert({
      title: trimmed,
      original_key: originalKey || null,
      tempo: tempo || null,
      has_vocal: hasVocal,
      chords: chords || null,
      is_official: false,
      is_public_domain: false,
      created_by: userId,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    onAdded()
    onOpenChange(false)
  }

  const exactMatch = similarSongs.some(
    (s) => s.toLowerCase() === title.trim().toLowerCase()
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>曲を追加</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4">
          {/* タイトル */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="song-title">曲名 *</Label>
            <Input
              id="song-title"
              placeholder="曲名を入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {/* 類似曲警告 */}
            {similarSongs.length > 0 && title.trim().length >= 2 && (
              <div className={cn(
                "rounded-md border p-2 text-xs",
                exactMatch
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              )}>
                <div className="flex items-center gap-1 mb-1">
                  <AlertCircle className="h-3 w-3" />
                  <span className="font-medium">
                    {exactMatch ? "同名の曲が既に存在します" : "類似する曲があります"}
                  </span>
                </div>
                <ul className="ml-4 list-disc">
                  {similarSongs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Key / Tempo */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <Label>Key</Label>
              <Select value={originalKey} onValueChange={setOriginalKey}>
                <SelectTrigger className="bg-muted border-transparent">
                  <SelectValue placeholder="任意" />
                </SelectTrigger>
                <SelectContent>
                  {KEYS.map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label>テンポ</Label>
              <Select value={tempo} onValueChange={setTempo}>
                <SelectTrigger className="bg-muted border-transparent">
                  <SelectValue placeholder="任意" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPOS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 歌あり / インスト */}
          <div className="flex flex-col gap-2">
            <Label>タイプ</Label>
            <div className="flex gap-1">
              {[
                { value: true, label: "歌あり" },
                { value: false, label: "インスト" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setHasVocal(opt.value)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    hasVocal === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* コード進行（任意） */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="song-chords">コード進行（任意）</Label>
            <Input
              id="song-chords"
              placeholder="例: G - C - D - G"
              value={chords}
              onChange={(e) => setChords(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || exactMatch}
            className="w-full"
            size="lg"
          >
            追加する
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
