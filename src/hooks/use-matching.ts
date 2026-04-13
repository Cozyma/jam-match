"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type MatchLevel = 'strict' | 'normal' | 'loose'

interface MatchedSong {
  id: string
  title: string
  original_key: string
  has_vocal: boolean
  chords: string | null
  player_count: number
  member_count: number
  favorite_count: number
  players: {
    user_id: string
    display_name: string
    part: string
    sub_parts: string[]
    vocal: string
    proficiency: string
    preferred_keys: string[]
    is_favorite: boolean
  }[]
}

export type { MatchedSong, MatchLevel }

export function useMatching(roomId: string | undefined, matchLevel: MatchLevel) {
  const [songs, setSongs] = useState<MatchedSong[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!roomId) return

    async function fetchMatches() {
      setLoading(true)

      const { data: members } = await supabase
        .from('room_members')
        .select('user_id')
        .eq('room_id', roomId!)

      if (!members || members.length === 0) {
        setSongs([])
        setLoading(false)
        return
      }

      const memberIds = members.map(m => m.user_id)
      const memberCount = memberIds.length

      let proficiencyFilter: string[]
      switch (matchLevel) {
        case 'strict':
          proficiencyFilter = ['ready']
          break
        case 'normal':
          proficiencyFilter = ['ready', 'with_practice']
          break
        case 'loose':
          proficiencyFilter = ['ready', 'with_practice', 'learning']
          break
      }

      const { data: repertoires } = await supabase
        .from('user_repertoires')
        .select('*, songs(*), profiles!inner(display_name)')
        .in('user_id', memberIds)
        .in('proficiency', proficiencyFilter)

      if (!repertoires) {
        setSongs([])
        setLoading(false)
        return
      }

      const songMap = new Map<string, MatchedSong>()

      for (const rep of repertoires as any[]) {
        const song = rep.songs
        if (!song) continue

        if (!songMap.has(song.id)) {
          songMap.set(song.id, {
            id: song.id,
            title: song.title,
            original_key: song.original_key,
            has_vocal: song.has_vocal,
            chords: song.chords,
            player_count: 0,
            member_count: memberCount,
            favorite_count: 0,
            players: [],
          })
        }

        const matched = songMap.get(song.id)!
        if (!matched.players.find(p => p.user_id === rep.user_id)) {
          matched.player_count++
          if (rep.is_favorite) matched.favorite_count++
          matched.players.push({
            user_id: rep.user_id,
            display_name: rep.profiles?.display_name || 'Unknown',
            part: rep.part,
            sub_parts: rep.sub_parts || [],
            vocal: rep.vocal,
            proficiency: rep.proficiency,
            preferred_keys: rep.preferred_keys || [],
            is_favorite: rep.is_favorite ?? false,
          })
        }
      }

      let result = Array.from(songMap.values())
      if (matchLevel !== 'loose') {
        result = result.filter(s => s.player_count === memberCount)
      }

      result.sort((a, b) => {
        if (b.player_count !== a.player_count) return b.player_count - a.player_count
        if (b.favorite_count !== a.favorite_count) return b.favorite_count - a.favorite_count
        return a.title.localeCompare(b.title)
      })

      setSongs(result)
      setLoading(false)
    }

    fetchMatches()
  }, [roomId, matchLevel])

  return { songs, loading }
}
