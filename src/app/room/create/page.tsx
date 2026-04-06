"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { RoomCreatedScreen } from "@/components/room-created-screen"
import { useAuth } from "@/hooks/use-auth"
import { useRoom } from "@/hooks/use-room"

export default function RoomCreatePage() {
  const { user, loading: authLoading } = useAuth()
  const { createRoom } = useRoom()
  const [roomCode, setRoomCode] = useState<string | undefined>()
  const [roomId, setRoomId] = useState<string | undefined>()
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!user || creating || roomId) return
    setCreating(true)
    createRoom(user.id).then(({ room }) => {
      if (room) {
        setRoomCode(room.code)
        setRoomId(room.id)
      }
      setCreating(false)
    })
  }, [user, creating, roomId, createRoom])

  if (authLoading || creating) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          ルームを作成中...
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <RoomCreatedScreen roomCode={roomCode} roomId={roomId} />
    </AppLayout>
  )
}
