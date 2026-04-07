"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

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

      {/* QR Code */}
      <Card className="bg-white border-stone-200 mb-6 p-4">
        <QRCodeSVG
          value={roomCode}
          size={160}
          level="M"
          bgColor="#ffffff"
          fgColor="#292524"
        />
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
