"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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

const partIcons: Record<string, string> = {
  guitar: "🎸",
  banjo: "🪕",
  mandolin: "🎸",
  fiddle: "🎻",
  bass: "🎸",
  dobro: "🎸",
  other: "🎵",
}

const proficiencyConfig = {
  ready: { label: "いつでもOK", dot: "bg-emerald-500" },
  with_practice: { label: "練習すればOK", dot: "bg-amber-500" },
  learning: { label: "挑戦中", dot: "bg-stone-400" },
} as const

export function MyRepertoireScreen() {
  const { user } = useAuth()
  const { repertoire, loading, updateRepertoire, removeRepertoire } = useRepertoire(user?.id)
  const { songs } = useSongs()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<{
    id: string
    songTitle: string
    songKey: string
    part: string
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
      part: entry.part,
      vocal: entry.vocal || "none",
      preferred_keys: entry.preferred_keys || [],
      proficiency: entry.proficiency,
    })
    setSheetOpen(true)
  }

  const handleUpdate = async (data: { part: string; vocal: string; preferred_keys: string[]; proficiency: string }) => {
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

  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 text-sm text-muted-foreground">
        {repertoire.length}曲 登録済み
      </div>

      <div className="flex-1 overflow-y-auto">
        {repertoire.map((entry, index) => {
          const song = songsMap.get(entry.song_id)
          const prof = proficiencyConfig[entry.proficiency as keyof typeof proficiencyConfig]

          return (
            <div key={entry.id}>
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
                onClick={() => handleEdit(entry)}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground">
                      {song?.title || "不明な曲"}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Key: {song?.original_key || "-"} / {song?.tempo || "-"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <span>{partIcons[entry.part] || "🎵"}</span>
                        {partLabels[entry.part] || entry.part}
                      </Badge>
                      {entry.vocal && entry.vocal !== "none" && (
                        <Badge variant="secondary" className="text-xs">
                          {entry.vocal === "lead" ? "Lead" : entry.vocal === "harmony_high" ? "Har(H)" : "Har(L)"}
                        </Badge>
                      )}
                      {prof && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <span className={cn("inline-block h-2 w-2 rounded-full", prof.dot)} />
                          {prof.label}
                        </span>
                      )}
                      {entry.preferred_keys && entry.preferred_keys.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Key: {entry.preferred_keys.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-8 w-8 shrink-0 text-muted-foreground hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRepertoire(entry.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">削除</span>
                  </Button>
                </div>
              </button>
              {index < repertoire.length - 1 && (
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
          onRegister={handleUpdate}
          mode="edit"
          initialValues={{
            part: editingEntry.part,
            vocal: editingEntry.vocal,
            preferred_keys: editingEntry.preferred_keys,
            proficiency: editingEntry.proficiency,
          }}
        />
      )}
    </div>
  )
}
