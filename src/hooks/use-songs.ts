"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Song = Database['public']['Tables']['songs']['Row']

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchSongs = useCallback(async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('title')
    if (error) console.error('Failed to fetch songs:', error)
    if (data) setSongs(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  return { songs, loading, refetch: fetchSongs }
}
