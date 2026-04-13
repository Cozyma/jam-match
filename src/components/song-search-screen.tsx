"use client"

import { useState } from "react"
import { Search, Check, Plus, FilePlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { SongRegisterSheet } from "@/components/song-register-sheet"
import { SongDetailSheet } from "@/components/song-detail-sheet"
import { SongAddSheet } from "@/components/song-add-sheet"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { useSongs } from "@/hooks/use-songs"
import { useRepertoire } from "@/hooks/use-repertoire"

type VocalFilter = "vocal" | "inst" | "all"

export function SongSearchScreen() {
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { songs, loading: songsLoading, refetch: refetchSongs } = useSongs()
  const { repertoire, addRepertoire } = useRepertoire(user?.id)

  const [searchQuery, setSearchQuery] = useState("")
  const [vocalFilter, setVocalFilter] = useState<VocalFilter>("all")
  const [keyFilter, setKeyFilter] = useState("")
  const [tempoFilter, setTempoFilter] = useState("")

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<{ id: string; title: string; key: string; hasVocal: boolean } | null>(null)
  const [detailSong, setDetailSong] = useState<typeof songs[number] | null>(null)
  const [addSheetOpen, setAddSheetOpen] = useState(false)

  const repertoireSongIds = new Set(repertoire.map(r => r.song_id))

  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKey = !keyFilter || keyFilter === "all-keys" || song.original_key === keyFilter
    const matchesTempo = !tempoFilter || tempoFilter === "all-tempo" || song.tempo === tempoFilter
    const matchesVocal =
      vocalFilter === "all" ||
      (vocalFilter === "vocal" && song.has_vocal === true) ||
      (vocalFilter === "inst" && song.has_vocal === false)
    return matchesSearch && matchesKey && matchesTempo && matchesVocal
  })

  const handleAddSong = (songId: string, title: string, key: string, hasVocal: boolean) => {
    setSelectedSong({ id: songId, title, key, hasVocal })
    setSheetOpen(true)
  }

  const handleRegister = async (data: { part: string; sub_parts: string[]; vocal: string; preferred_keys: string[]; proficiency: string }) => {
    if (!user || !selectedSong) return
    await addRepertoire({
      user_id: user.id,
      song_id: selectedSong.id,
      part: data.part,
      sub_parts: data.sub_parts,
      vocal: data.vocal,
      preferred_keys: data.preferred_keys,
      proficiency: data.proficiency,
    })
    setSheetOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters - sticky */}
      <div className="shrink-0 border-b border-border bg-card px-4 py-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="曲名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-muted border-transparent pl-9"
          />
        </div>

        {/* Filter Row 1 - Vocal Toggles */}
        <div className="mt-3 flex gap-1">
          {(["vocal", "inst", "all"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setVocalFilter(value)}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                vocalFilter === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {value === "vocal" ? "歌あり" : value === "inst" ? "インスト" : "All"}
            </button>
          ))}
        </div>

        {/* Filter Row 2 - Dropdowns */}
        <div className="mt-3 flex gap-2">
          <Select value={keyFilter} onValueChange={setKeyFilter}>
            <SelectTrigger className="flex-1 bg-muted border-transparent">
              <SelectValue placeholder="Key" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-keys">全てのKey</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="E">E</SelectItem>
              <SelectItem value="F">F</SelectItem>
              <SelectItem value="G">G</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tempoFilter} onValueChange={setTempoFilter}>
            <SelectTrigger className="flex-1 bg-muted border-transparent">
              <SelectValue placeholder="テンポ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-tempo">全てのテンポ</SelectItem>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count + New Song Button */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {songsLoading ? "読み込み中..." : `${filteredSongs.length}曲`}
          </span>
          <button
            type="button"
            onClick={() => setAddSheetOpen(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <FilePlus className="h-3.5 w-3.5" />
            曲を新規登録
          </button>
        </div>
      </div>

      {/* Results List - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {filteredSongs.map((song, index) => {
          const isAdded = repertoireSongIds.has(song.id)
          return (
            <div key={song.id}>
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => setDetailSong(song)}
                >
                  <h3 className="truncate font-medium text-foreground">
                    {song.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Key: {song.original_key || "-"} / {song.tempo || "-"} / {song.main_instrument || "-"}
                    {song.chords && " 🎵"}
                  </p>
                </button>
                <div className="ml-3">
                  {isAdded ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="text-emerald-600 hover:text-emerald-600"
                    >
                      <Check className="mr-1 h-4 w-4" />
                      登録済
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSong(song.id, song.title, song.original_key || "", song.has_vocal !== false)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      追加
                    </Button>
                  )}
                </div>
              </div>
              {index < filteredSongs.length - 1 && (
                <div className="mx-4 border-b border-border" />
              )}
            </div>
          )
        })}
      </div>

      {/* Song Add Sheet */}
      {user && (
        <SongAddSheet
          open={addSheetOpen}
          onOpenChange={setAddSheetOpen}
          userId={user.id}
          onAdded={refetchSongs}
        />
      )}

      {/* Song Detail Sheet */}
      <SongDetailSheet
        open={!!detailSong}
        onOpenChange={(open) => { if (!open) setDetailSong(null) }}
        song={detailSong}
        userPart={profile?.main_part}
        userId={user?.id}
        userRole={profile?.role}
        onUpdated={() => { setDetailSong(null); refetchSongs() }}
      />

      {/* Song Register Sheet */}
      {selectedSong && (
        <SongRegisterSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          songTitle={selectedSong.title}
          songKey={selectedSong.key}
          hasVocal={selectedSong.hasVocal}
          defaultPart={profile?.main_part || undefined}
          onRegister={handleRegister}
        />
      )}
    </div>
  )
}
