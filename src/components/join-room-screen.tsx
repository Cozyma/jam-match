"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { Camera, ArrowLeft, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRoom } from "@/hooks/use-room"
import { Html5Qrcode } from "html5-qrcode"

export function JoinRoomScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { joinRoom } = useRoom()
  const [code, setCode] = useState("")
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isComplete = code.length === 6

  const startScanner = async () => {
    setScanning(true)
    setError(null)
    try {
      const scanner = new Html5Qrcode("qr-reader")
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          // QRコードから6文字の英数字を抽出
          const match = decodedText.match(/[A-Z2-9]{6}/i)
          if (match) {
            setCode(match[0].toUpperCase())
          } else {
            setCode(decodedText.slice(0, 6).toUpperCase())
          }
          stopScanner()
        },
        () => {},
      )
    } catch {
      setError("カメラを起動できませんでした")
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {}
      scannerRef.current = null
    }
    setScanning(false)
  }

  useEffect(() => {
    return () => { stopScanner() }
  }, [])

  const handleJoin = async () => {
    if (!isComplete || !user) return
    setJoining(true)
    setError(null)
    const { room, error: joinError } = await joinRoom(code, user.id)
    if (room) {
      router.push(`/room/${room.id}`)
    } else {
      setError("ルームが見つからないか、参加できませんでした")
      console.error('Join room error:', joinError)
    }
    setJoining(false)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-stone-800">ルームに参加</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-stone-800 mb-2">
              ルームコードを入力
            </h2>
            <p className="text-sm text-stone-500">
              主催者から共有されたコードを入力してください
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="w-11 h-14 text-xl font-mono font-bold border-stone-300 data-[active=true]:border-amber-700 data-[active=true]:ring-amber-700/20"
                />
                <InputOTPSlot
                  index={1}
                  className="w-11 h-14 text-xl font-mono font-bold border-stone-300 data-[active=true]:border-amber-700 data-[active=true]:ring-amber-700/20"
                />
                <InputOTPSlot
                  index={2}
                  className="w-11 h-14 text-xl font-mono font-bold border-stone-300 data-[active=true]:border-amber-700 data-[active=true]:ring-amber-700/20"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="text-stone-300" />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="w-11 h-14 text-xl font-mono font-bold border-stone-300 data-[active=true]:border-amber-700 data-[active=true]:ring-amber-700/20"
                />
                <InputOTPSlot
                  index={4}
                  className="w-11 h-14 text-xl font-mono font-bold border-stone-300 data-[active=true]:border-amber-700 data-[active=true]:ring-amber-700/20"
                />
                <InputOTPSlot
                  index={5}
                  className="w-11 h-14 text-xl font-mono font-bold border-stone-300 data-[active=true]:border-amber-700 data-[active=true]:ring-amber-700/20"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 w-full max-w-sm mb-8">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-sm text-stone-400">または</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* QR Scanner */}
          {scanning ? (
            <div className="w-full max-w-sm">
              <div className="relative rounded-lg overflow-hidden border border-stone-200">
                <div id="qr-reader" className="w-full" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white h-8 w-8"
                  onClick={stopScanner}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full max-w-sm h-12 border-stone-300 text-stone-700 hover:bg-stone-50 gap-2"
              onClick={startScanner}
            >
              <Camera className="h-5 w-5" />
              QRコードをスキャン
            </Button>
          )}
        </div>

        {/* Join Button */}
        <div className="pt-6">
          <Button
            onClick={handleJoin}
            disabled={!isComplete || joining}
            className="w-full h-12 bg-amber-700 hover:bg-amber-800 text-white text-base font-medium disabled:bg-stone-300 disabled:text-stone-500"
          >
            {joining ? "参加中..." : "参加する"}
          </Button>
        </div>
      </div>
    </div>
  )
}
