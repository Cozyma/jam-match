"use client"

import { use, useEffect, useState } from "react"
import { JamRoomScreen } from "@/components/jam-room-screen"
import { createClient } from "@/lib/supabase/client"

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [roomCode, setRoomCode] = useState<string | undefined>()
  const [expiresAt, setExpiresAt] = useState<string | undefined>()
  const supabase = createClient()

  useEffect(() => {
    async function fetchRoom() {
      const { data } = await supabase
        .from('rooms')
        .select('code, expires_at')
        .eq('id', id)
        .single()
      if (data) {
        setRoomCode(data.code)
        if (data.expires_at) setExpiresAt(data.expires_at)
      }
    }
    fetchRoom()
  }, [id])

  return <JamRoomScreen roomId={id} roomCode={roomCode} expiresAt={expiresAt} />
}
