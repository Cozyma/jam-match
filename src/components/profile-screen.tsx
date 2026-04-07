"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, LogOut, Check, X } from "lucide-react"
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
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { useRepertoire } from "@/hooks/use-repertoire"
import { signOut } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/client"

const instruments = [
  { value: "guitar", label: "Guitar", icon: "🎸" },
  { value: "banjo", label: "Banjo", icon: "🪕" },
  { value: "mandolin", label: "Mandolin", icon: "🎻" },
  { value: "fiddle", label: "Fiddle", icon: "🎻" },
  { value: "bass", label: "Bass", icon: "🎸" },
  { value: "dobro", label: "Dobro", icon: "🎸" },
  { value: "other", label: "Other", icon: "🎵" },
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

  const supabase = createClient()

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
                <span>{currentInstrument?.icon}</span>
                <span>{currentInstrument?.label}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {instruments.map((instrument) => (
              <SelectItem key={instrument.value} value={instrument.value}>
                <span className="flex items-center gap-2">
                  <span>{instrument.icon}</span>
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
