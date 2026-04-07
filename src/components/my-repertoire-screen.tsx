"use client"

import { useState, useMemo } from "react"
import { Star, Trash2, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PartIcon, partConfig } from "@/components/icons/part-icon"
import { SongRegisterSheet } from "@/components/song-register-sheet"
import { useAuth } from "@/hooks/use-auth"
import { useRepertoire } from "@/hooks/use-repertoire"
import { useSongs } from "@/hooks/use-songs"

const partLabels: Record<string, string> = {
  guitar: "Guitar",
  banjo: "Banjo",
  mandolin: "Mandolin",
  fiddle: "Fiddle",
  bass: "Bass",
  dobro: "Dobro",
  other: "Other",
}

const proficiencyLevels = [
  { value: "ready", label: "◎", dot: "bg-emerald-500", activeBg: "bg-emerald-50 border-emerald-500 text-emerald-700" },
  { value: "with_practice", label: "○", dot: "bg-amber-500", activeBg: "bg-amber-50 border-amber-500 text-amber-700" },
  { value: "learning", label: "△", dot: "bg-stone-400", activeBg: "bg-stone-100 border-stone-400 text-stone-600" },
] as const

export function MyRepertoireScreen() {
  const { user } = useAuth()
  const { repertoire, loading, updateRepertoire, removeRepertoire } = useRepertoire(user?.id)
  const { songs } = useSongs()

  // Filter & Sort
  const [profFilter, setProfFilter] = useState<string | null>(null)
  const [partFilter, setPartFilter] = useState<string | null>(null)
  const [favOnly, setFavOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"favorite" | "title" | "proficiency" | "date">("favorite")

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<{
    id: string
    songTitle: string
    songKey: string
    hasVocal: boolean
    part: string
    sub_parts: string[]
    vocal: string
    preferred_keys: string[]
    proficiency: string
  } | null>(null)

  const songsMap = new Map(songs.map(s => [s.id, s]))

  const handleEdit = (entry: typeof repertoire[number]) => {
    const song = songsMap.get(entry.song_id)
    setEditingEntry({
      id: entry.id,
      songTitle: song?.title || "",
      songKey: song?.original_key || "",
      hasVocal: song?.has_vocal !== false,
      part: entry.part,
      sub_parts: entry.sub_parts || [],
      vocal: entry.vocal || "none",
      preferred_keys: entry.preferred_keys || [],
      proficiency: entry.proficiency,
    })
    setSheetOpen(true)
  }

  const handleUpdate = async (data: { part: string; sub_parts: string[]; vocal: string; preferred_keys: string[]; proficiency: string }) => {
    if (!editingEntry) return
    await updateRepertoire(editingEntry.id, data)
    setSheetOpen(false)
    setEditingEntry(null)
  }

  if (loading) {
    return <div className="px-4 py-8 text-center text-sm text-muted-foreground">読み込み中...</div>
  }

  if (repertoire.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">まだレパートリーが登録されていません</p>
        <p className="mt-1 text-sm text-muted-foreground">「曲を探す」タブから曲を追加しましょう</p>
      </div>
    )
  }

  const profOrder: Record<string, number> = { ready: 0, with_practice: 1, learning: 2 }

  const filteredAndSorted = useMemo(() => {
    let list = [...repertoire]

    // Filters
    if (profFilter) list = list.filter(e => e.proficiency === profFilter)
    if (partFilter) list = list.filter(e => e.part === partFilter)
    if (favOnly) list = list.filter(e => e.is_favorite)

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "favorite":
          if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1
          return 0
        case "title": {
          const ta = songsMap.get(a.song_id)?.title || ""
          const tb = songsMap.get(b.song_id)?.title || ""
          return ta.localeCompare(tb)
        }
        case "proficiency":
          return (profOrder[a.proficiency] ?? 9) - (profOrder[b.proficiency] ?? 9)
        case "date":
          return (b.created_at || "").localeCompare(a.created_at || "")
        default:
          return 0
      }
    })

    return list
  }, [repertoire, profFilter, partFilter, favOnly, sortBy, songsMap])

  // パート選択肢（実際に使われているパートのみ）
  const usedParts = useMemo(() => {
    const parts = new Set(repertoire.map(e => e.part))
    return Array.from(parts).sort()
  }, [repertoire])

  const sortOptions = [
    { value: "favorite", label: "★" },
    { value: "title", label: "A-Z" },
    { value: "proficiency", label: "◎○△" },
    { value: "date", label: "新着" },
  ] as const

  return (
    <div className="flex flex-col">
      {/* Filter & Sort Bar */}
      <div className="border-b border-border bg-card px-4 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredAndSorted.length}/{repertoire.length}曲
          </span>
          {/* Sort */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  "px-2 py-0.5 text-xs rounded transition-colors",
                  sortBy === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Fav filter */}
          <button
            type="button"
            onClick={() => setFavOnly(!favOnly)}
            className={cn(
              "px-2 py-0.5 text-xs rounded border transition-colors",
              favOnly
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-transparent text-muted-foreground hover:bg-muted"
            )}
          >
            ★のみ
          </button>
          {/* Proficiency filter */}
          {proficiencyLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setProfFilter(profFilter === level.value ? null : level.value)}
              className={cn(
                "px-2 py-0.5 text-xs rounded border transition-colors",
                profFilter === level.value
                  ? level.activeBg
                  : "border-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              {level.label}
            </button>
          ))}
          {/* Part filter */}
          {usedParts.map((part) => (
            <button
              key={part}
              type="button"
              onClick={() => setPartFilter(partFilter === part ? null : part)}
              className={cn(
                "rounded border transition-colors",
                partFilter === part
                  ? "border-stone-500"
                  : "border-transparent"
              )}
            >
              <PartIcon part={part} size="sm" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredAndSorted.map((entry, index) => {
          const song = songsMap.get(entry.song_id)

          const vocalLabel = entry.vocal === "lead" ? "Lead" : entry.vocal === "harmony_high" ? "Har(H)" : entry.vocal === "harmony_low" ? "Har(L)" : null

          return (
            <div key={entry.id}>
              <div className="px-4 py-2.5">
                {/* Row 1: star + title + key + delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="shrink-0 text-muted-foreground hover:text-amber-500 transition-colors"
                    onClick={() => updateRepertoire(entry.id, { is_favorite: !entry.is_favorite })}
                  >
                    <Star className={cn("h-3.5 w-3.5", entry.is_favorite && "fill-amber-500 text-amber-500")} />
                  </button>
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left truncate font-medium text-sm text-foreground hover:opacity-80 transition-opacity"
                    onClick={() => handleEdit(entry)}
                  >
                    {song?.title || "不明な曲"}
                  </button>
                  <span className="shrink-0 text-xs text-muted-foreground">{song?.original_key || "-"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-red-600"
                    onClick={() => removeRepertoire(entry.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {/* Row 2: part + vocal + proficiency */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    <PartIcon part={entry.part} size="sm" />
                    <span>{partLabels[entry.part] || entry.part}</span>
                    {entry.sub_parts && entry.sub_parts.length > 0 && (
                      <>
                        <span className="text-stone-300">+</span>
                        {entry.sub_parts.map(p => <PartIcon key={p} part={p} size="sm" />)}
                      </>
                    )}
                    {vocalLabel && ` / ${vocalLabel}`}
                  </span>
                  <div className="ml-auto flex gap-0.5">
                    {proficiencyLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        className={cn(
                          "rounded px-2.5 py-0.5 text-xs font-medium transition-all",
                          entry.proficiency === level.value
                            ? level.activeBg
                            : "text-muted-foreground/50 hover:text-muted-foreground"
                        )}
                        onClick={() => {
                          if (entry.proficiency !== level.value) {
                            updateRepertoire(entry.id, { proficiency: level.value })
                          }
                        }}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {index < filteredAndSorted.length - 1 && (
                <div className="mx-4 border-b border-border" />
              )}
            </div>
          )
        })}
      </div>

      {editingEntry && (
        <SongRegisterSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          songTitle={editingEntry.songTitle}
          songKey={editingEntry.songKey}
          hasVocal={editingEntry.hasVocal}
          onRegister={handleUpdate}
          mode="edit"
          initialValues={{
            part: editingEntry.part,
            sub_parts: editingEntry.sub_parts,
            vocal: editingEntry.vocal,
            preferred_keys: editingEntry.preferred_keys,
            proficiency: editingEntry.proficiency,
          }}
        />
      )}
    </div>
  )
}
