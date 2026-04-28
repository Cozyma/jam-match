"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Correction {
  id: string
  song_id: string
  user_id: string
  body: string
  created_at: string | null
}

export function useCorrections(songId: string | undefined) {
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCorrections = useCallback(async () => {
    if (!songId) return
    const { data } = await supabase
      .from('song_corrections')
      .select('*')
      .eq('song_id', songId)
      .order('created_at', { ascending: false })
    if (data) setCorrections(data)
    setLoading(false)
  }, [songId])

  useEffect(() => { fetchCorrections() }, [fetchCorrections])

  const addCorrection = useCallback(async (body: string, userId: string) => {
    if (!songId) return
    const trimmed = body.trim()
    if (!trimmed) return
    const { error } = await supabase.from('song_corrections').insert({
      song_id: songId,
      user_id: userId,
      body: trimmed,
    })
    if (!error) fetchCorrections()
    return { error }
  }, [songId, fetchCorrections])

  const removeCorrection = useCallback(async (correctionId: string) => {
    const { error } = await supabase.from('song_corrections').delete().eq('id', correctionId)
    if (!error) fetchCorrections()
    return { error }
  }, [fetchCorrections])

  return { corrections, loading, addCorrection, removeCorrection, refetch: fetchCorrections }
}
