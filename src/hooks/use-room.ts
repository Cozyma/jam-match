"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Room = Database['public']['Tables']['rooms']['Row']
type RoomMember = Database['public']['Tables']['room_members']['Row']

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function useRoom() {
  const supabase = createClient()

  const createRoom = useCallback(async (ownerId: string, name?: string) => {
    const code = generateRoomCode()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        code,
        name: name || null,
        owner_id: ownerId,
        room_type: 'ephemeral',
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (error) console.error('Failed to create room:', error)

    if (room) {
      await supabase.from('room_members').insert({
        room_id: room.id,
        user_id: ownerId,
      })
    }

    return { room, error }
  }, [])

  const joinRoom = useCallback(async (code: string, userId: string) => {
    const { data: room, error: findError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (!room) return { room: null, error: findError || new Error('Room not found') }

    const { error: joinError } = await supabase
      .from('room_members')
      .insert({
        room_id: room.id,
        user_id: userId,
      })

    if (joinError) console.error('Failed to join room:', joinError)

    return { room, error: joinError }
  }, [])

  const leaveRoom = useCallback(async (roomId: string, userId: string) => {
    const { error } = await supabase
      .from('room_members')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId)

    if (error) console.error('Failed to leave room:', error)
    return { error }
  }, [])

  return { createRoom, joinRoom, leaveRoom }
}

export function useMyRooms(userId: string | undefined) {
  const [rooms, setRooms] = useState<(RoomMember & { rooms: Room })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    async function fetch() {
      const { data, error } = await supabase
        .from('room_members')
        .select('*, rooms(*)')
        .eq('user_id', userId!)
        .order('joined_at', { ascending: false })
      if (error) console.error('Failed to fetch my rooms:', error)
      if (data) {
        const active = (data as any[]).filter(d =>
          d.rooms && (!d.rooms.expires_at || new Date(d.rooms.expires_at) > new Date())
        )
        setRooms(active as any)
      }
      setLoading(false)
    }
    fetch()
  }, [userId])

  return { rooms, loading }
}

export function useRoomMembers(roomId: string | undefined) {
  const [members, setMembers] = useState<(RoomMember & { profiles: any })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!roomId) return

    async function fetch() {
      const { data, error } = await supabase
        .from('room_members')
        .select('*, profiles(*)')
        .eq('room_id', roomId!)
      if (error) console.error('Failed to fetch room members:', error)
      if (data) setMembers(data as any)
      setLoading(false)
    }
    fetch()

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_members',
        filter: `room_id=eq.${roomId}`,
      }, () => {
        fetch()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { members, loading }
}
