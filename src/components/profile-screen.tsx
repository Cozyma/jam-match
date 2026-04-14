"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, LogOut, Check, X, Tag, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PartIcon } from "@/components/icons/part-icon"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { useRepertoire } from "@/hooks/use-repertoire"
import { signOut } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"
import { useUserTags } from "@/hooks/use-tags"

const instruments = [
  { value: "guitar", label: "Guitar" },
  { value: "banjo", label: "Banjo" },
  { value: "mandolin", label: "Mandolin" },
  { value: "fiddle", label: "Fiddle" },
  { value: "bass", label: "Bass" },
  { value: "dobro", label: "Dobro" },
  { value: "other", label: "Other" },
]

export function ProfileScreen() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, updateProfile } = useProfile(user?.id)
  const { repertoire } = useRepertoire(user?.id)
  const [roomCount, setRoomCount] = useState(0)

  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const [area, setArea] = useState("")
  const [bandName, setBandName] = useState("")
  const [newTag, setNewTag] = useState("")

  const supabase = createClient()
  const { tags: userTags, addTag: addUserTag, removeTag: removeUserTag } = useUserTags(user?.id)

  // Fetch room count
  useEffect(() => {
    if (!user?.id) return
    async function fetchRoomCount() {
      const { count } = await supabase
        .from('room_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
      setRoomCount(count || 0)
    }
    fetchRoomCount()
  }, [user?.id])

  // Sync local state with profile
  useEffect(() => {
    if (profile) {
      setTempName(profile.display_name || "")
      setArea(profile.area || "")
      setBandName(profile.band_name || "")
    }
  }, [profile])

  const displayName = profile?.display_name || ""
  const mainPart = profile?.main_part || "guitar"

  const handleSaveName = async () => {
    await updateProfile({ display_name: tempName })
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setTempName(displayName)
    setIsEditingName(false)
  }

  const handlePartChange = async (value: string) => {
    await updateProfile({ main_part: value })
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const currentInstrument = instruments.find((i) => i.value === mainPart)

  if (authLoading || profileLoading) {
    return <div className="px-4 py-6 text-center text-muted-foreground">読み込み中...</div>
  }

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
          <AvatarFallback className="bg-stone-200 text-lg font-medium text-stone-600">
            {displayName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Display Name */}
        <div className="mt-3 flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="h-8 w-32 text-center text-lg font-semibold"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-emerald-600"
                onClick={handleSaveName}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-stone-400"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className="text-lg font-semibold text-foreground">
                {displayName}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setIsEditingName(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Email */}
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.email || ""}
        </p>
      </div>

      {/* Main Part Setting */}
      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-foreground">
          メインパート
        </label>
        <Select value={mainPart} onValueChange={handlePartChange}>
          <SelectTrigger className="w-full bg-stone-100 border-stone-200">
            <SelectValue>
              <span className="flex items-center gap-2">
                <PartIcon part={mainPart} size="sm" />
                <span>{currentInstrument?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {instruments.map((instrument) => (
              <SelectItem key={instrument.value} value={instrument.value}>
                <span className="flex items-center gap-2">
                  <PartIcon part={instrument.value} size="sm" />
                  <span>{instrument.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Area */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-foreground">
          活動エリア
        </label>
        <Input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          onBlur={() => updateProfile({ area: area || null })}
          placeholder="例: 東京、名古屋"
          className="bg-stone-100 border-stone-200"
        />
      </div>

      {/* Band Name */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-foreground">
          バンド名
        </label>
        <Input
          value={bandName}
          onChange={(e) => setBandName(e.target.value)}
          onBlur={() => updateProfile({ band_name: bandName || null })}
          placeholder="例: Mountain Pickers"
          className="bg-stone-100 border-stone-200"
        />
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
          <Tag className="h-3.5 w-3.5" />
          タグ
        </label>
        <div className="flex flex-wrap gap-1.5">
          {userTags.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
              {t.tag_name}
              <button type="button" onClick={() => removeUserTag(t.id)} className="text-stone-400 hover:text-stone-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <form
            className="inline-flex items-center"
            onSubmit={(e) => {
              e.preventDefault()
              if (newTag.trim()) {
                addUserTag(newTag)
                setNewTag("")
              }
            }}
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="タグを追加"
              className="w-24 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs outline-none focus:border-primary focus:w-32 transition-all"
            />
            {newTag.trim() && (
              <button type="submit" className="ml-1 text-primary">
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">バンド名やコミュニティ名を追加できます</p>
      </div>

      {/* Stats Section */}
      <Card className="mt-6 border-stone-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{repertoire.length}</p>
              <p className="text-sm text-muted-foreground">レパートリー</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{roomCount}</p>
              <p className="text-sm text-muted-foreground">参加ルーム</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </div>
    </div>
  )
}
