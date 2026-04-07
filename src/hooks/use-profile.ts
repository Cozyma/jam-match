"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    async function fetch() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single()
      if (error) console.error('Failed to fetch profile:', error)
      if (data) setProfile(data)
      setLoading(false)
    }
    fetch()
  }, [userId])

  const updateProfile = useCallback(async (updates: Partial<Pick<Profile, 'display_name' | 'main_part' | 'avatar_url' | 'area' | 'band_name'>>) => {
    if (!userId) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    if (error) console.error('Failed to update profile:', error)
    if (data) setProfile(data)
    return { data, error }
  }, [userId])

  const ensureProfile = useCallback(async (user: { id: string; email?: string; user_metadata?: any }) => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      const { data } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single()
      if (data) setProfile(data)
      return data
    }
    return existing
  }, [])

  return { profile, loading, updateProfile, ensureProfile }
}
