app/page.tsx

+2
/
-36
"use client"

import { RoomCreatedScreen } from "@/components/room-created-screen"
import { JoinRoomScreen } from "@/components/join-room-screen"

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-4xl mx-auto">
        {/* Screen A: Room Created */}
        <div className="flex-1">
          <h2 className="text-sm font-medium text-stone-500 mb-2 px-2">
            Screen A: Room Created
          </h2>
          <div className="max-w-[375px] mx-auto bg-stone-50 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
            <RoomCreatedScreen 
              roomCode="JAM-A3F2"
              onEnterRoom={() => alert("Entering room...")}
            />
          </div>
        </div>

        {/* Screen B: Join Room */}
        <div className="flex-1">
          <h2 className="text-sm font-medium text-stone-500 mb-2 px-2">
            Screen B: Join Room
          </h2>
          <div className="max-w-[375px] mx-auto bg-stone-50 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
            <JoinRoomScreen
              onBack={() => alert("Going back...")}
              onJoin={(code) => alert(`Joining room: ${code}`)}
              onScanQR={() => alert("Opening QR scanner...")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
import { ProfileScreen } from "@/components/profile-screen"

export default function Home() {
  return <ProfileScreen />
}


components/profile-screen.tsx

+220
"use client"

import { useState } from "react"
import { Music, Home, Guitar, User, Pencil, LogOut, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
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

type TabId = "home" | "repertoire" | "profile"

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
  const [activeTab, setActiveTab] = useState<TabId>("profile")
  const [displayName, setDisplayName] = useState("田中太郎")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(displayName)
  const [mainPart, setMainPart] = useState("guitar")

  const tabs = [
    { id: "home" as TabId, label: "ホーム", icon: Home },
    { id: "repertoire" as TabId, label: "レパートリー", icon: Guitar },
    { id: "profile" as TabId, label: "プロフィール", icon: User },
  ]

  const handleSaveName = () => {
    setDisplayName(tempName)
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setTempName(displayName)
    setIsEditingName(false)
  }

  const currentInstrument = instruments.find((i) => i.value === mainPart)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Music className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">JamMatch</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face" alt="Profile" />
              <AvatarFallback className="bg-stone-200 text-lg font-medium text-stone-600">
                田中
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
              tanaka.taro@gmail.com
            </p>
          </div>

          {/* Main Part Setting */}
          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-foreground">
              メインパート
            </label>
            <Select value={mainPart} onValueChange={setMainPart}>
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

          {/* Stats Section */}
          <Card className="mt-6 border-stone-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">42</p>
                  <p className="text-sm text-muted-foreground">レパートリー</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">3</p>
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
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-16 items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "fill-primary stroke-primary" : "fill-none"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}