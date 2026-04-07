"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePlayedSongs(roomId: string | undefined) {
  const [playedSongIds, setPlayedSongIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!roomId) return

    async function fetch() {
      const { data, error } = await supabase
        .from('room_played_songs')
        .select('song_id')
        .eq('room_id', roomId!)
      if (error) console.error('Failed to fetch played songs:', error)
      if (data) setPlayedSongIds(new Set(data.map(d => d.song_id)))
      setLoading(false)
    }
    fetch()

    const channel = supabase
      .channel(`played-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_played_songs',
        filter: `room_id=eq.${roomId}`,
      }, () => {
        fetch()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const markPlayed = useCallback(async (songId: string, userId: string) => {
    const { error } = await supabase
      .from('room_played_songs')
      .insert({ room_id: roomId!, song_id: songId, marked_by: userId })
    if (error) console.error('Failed to mark song as played:', error)
  }, [roomId])

  const unmarkPlayed = useCallback(async (songId: string) => {
    const { error } = await supabase
      .from('room_played_songs')
      .delete()
      .eq('room_id', roomId!)
      .eq('song_id', songId)
    if (error) console.error('Failed to unmark song:', error)
  }, [roomId])

  return { playedSongIds, loading, markPlayed, unmarkPlayed }
}
