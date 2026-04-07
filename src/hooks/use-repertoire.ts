"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Repertoire = Database['public']['Tables']['user_repertoires']['Row']
type RepertoireInsert = Database['public']['Tables']['user_repertoires']['Insert']

export function useRepertoire(userId: string | undefined) {
  const [repertoire, setRepertoire] = useState<Repertoire[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    async function fetch() {
      const { data, error } = await supabase
        .from('user_repertoires')
        .select('*, songs(*)')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
      if (error) console.error('Failed to fetch repertoire:', error)
      if (data) setRepertoire(data as any)
      setLoading(false)
    }
    fetch()
  }, [userId])

  const addRepertoire = useCallback(async (item: Omit<RepertoireInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('user_repertoires')
      .insert(item)
      .select()
      .single()
    if (error) console.error('Failed to add repertoire:', error)
    if (data) {
      setRepertoire(prev => [data, ...prev])
    }
    return { data, error }
  }, [])

  const updateRepertoire = useCallback(async (id: string, item: Partial<Omit<RepertoireInsert, 'id' | 'user_id' | 'song_id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('user_repertoires')
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) console.error('Failed to update repertoire:', error)
    if (data) {
      setRepertoire(prev => prev.map(r => r.id === id ? data : r))
    }
    return { data, error }
  }, [])

  const removeRepertoire = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('user_repertoires')
      .delete()
      .eq('id', id)
    if (error) console.error('Failed to remove repertoire:', error)
    if (!error) {
      setRepertoire(prev => prev.filter(r => r.id !== id))
    }
    return { error }
  }, [])

  return { repertoire, loading, addRepertoire, updateRepertoire, removeRepertoire }
}
