"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"

interface RoomCreatedScreenProps {
  roomCode?: string
  roomId?: string
  onEnterRoom?: () => void
}

export function RoomCreatedScreen({
  roomCode = "------",
  roomId,
  onEnterRoom
}: RoomCreatedScreenProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnterRoom = () => {
    if (onEnterRoom) {
      onEnterRoom()
    } else if (roomId) {
      router.push(`/room/${roomId}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8">
      {/* Success Title */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-amber-700" />
        </div>
        <h1 className="text-xl font-bold text-stone-800">
          ルームを作成しました！
        </h1>
      </div>

      {/* Room Code Display */}
      <Card className="w-full max-w-sm p-6 bg-white border-stone-200 mb-6">
        <div className="text-center">
          <p className="text-sm text-stone-500 mb-2">ルームコード</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-bold tracking-wider text-stone-800">
              {roomCode}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="border-stone-200 hover:bg-stone-50"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4 text-stone-500" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* QR Code Placeholder */}
      <Card className="w-48 h-48 bg-white border-stone-200 mb-6 p-4">
        <div className="w-full h-full bg-stone-100 rounded flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="5" y="5" width="25" height="25" fill="#292524" rx="2" />
            <rect x="10" y="10" width="15" height="15" fill="#fafaf9" rx="1" />
            <rect x="13" y="13" width="9" height="9" fill="#292524" rx="1" />
            <rect x="70" y="5" width="25" height="25" fill="#292524" rx="2" />
            <rect x="75" y="10" width="15" height="15" fill="#fafaf9" rx="1" />
            <rect x="78" y="13" width="9" height="9" fill="#292524" rx="1" />
            <rect x="5" y="70" width="25" height="25" fill="#292524" rx="2" />
            <rect x="10" y="75" width="15" height="15" fill="#fafaf9" rx="1" />
            <rect x="13" y="78" width="9" height="9" fill="#292524" rx="1" />
            <rect x="35" y="5" width="5" height="5" fill="#292524" />
            <rect x="45" y="5" width="5" height="5" fill="#292524" />
            <rect x="55" y="5" width="5" height="5" fill="#292524" />
            <rect x="35" y="15" width="5" height="5" fill="#292524" />
            <rect x="50" y="15" width="5" height="5" fill="#292524" />
            <rect x="60" y="15" width="5" height="5" fill="#292524" />
            <rect x="40" y="25" width="5" height="5" fill="#292524" />
            <rect x="55" y="25" width="5" height="5" fill="#292524" />
            <rect x="5" y="35" width="5" height="5" fill="#292524" />
            <rect x="15" y="35" width="5" height="5" fill="#292524" />
            <rect x="35" y="35" width="5" height="5" fill="#292524" />
            <rect x="55" y="35" width="5" height="5" fill="#292524" />
            <rect x="75" y="35" width="5" height="5" fill="#292524" />
            <rect x="45" y="50" width="5" height="5" fill="#292524" />
            <rect x="70" y="50" width="5" height="5" fill="#292524" />
            <rect x="35" y="70" width="5" height="5" fill="#292524" />
            <rect x="55" y="70" width="5" height="5" fill="#292524" />
            <rect x="75" y="70" width="5" height="5" fill="#292524" />
            <rect x="50" y="90" width="5" height="5" fill="#292524" />
            <rect x="80" y="90" width="5" height="5" fill="#292524" />
          </svg>
        </div>
      </Card>

      {/* Instruction Text */}
      <p className="text-sm text-stone-500 text-center mb-8 px-4">
        このコードまたはQRを共有してメンバーを招待しましょう
      </p>

      {/* Enter Room Button */}
      <Button
        onClick={handleEnterRoom}
        className="w-full max-w-sm bg-amber-700 hover:bg-amber-800 text-white h-12 text-base font-medium"
      >
        ルームに入る
      </Button>
    </div>
  )
}
