"use client"
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SongTag {
  id: string
  song_id: string
  tag_name: string
  created_by: string
}

interface UserTag {
  id: string
  user_id: string
  tag_name: string
}

// 曲タグ
export function useSongTags(songId: string | undefined) {
  const [tags, setTags] = useState<SongTag[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTags = useCallback(async () => {
    if (!songId) return
    const { data } = await supabase
      .from('song_tags')
      .select('*')
      .eq('song_id', songId)
      .order('tag_name')
    if (data) setTags(data)
    setLoading(false)
  }, [songId])

  useEffect(() => { fetchTags() }, [fetchTags])

  const addTag = useCallback(async (tagName: string, userId: string) => {
    if (!songId) return
    const trimmed = tagName.trim().toLowerCase()
    if (!trimmed) return
    const { error } = await supabase.from('song_tags').insert({
      song_id: songId,
      tag_name: trimmed,
      created_by: userId,
    })
    if (!error) fetchTags()
    return { error }
  }, [songId, fetchTags])

  const removeTag = useCallback(async (tagId: string) => {
    const { error } = await supabase.from('song_tags').delete().eq('id', tagId)
    if (!error) fetchTags()
    return { error }
  }, [fetchTags])

  return { tags, loading, addTag, removeTag, refetch: fetchTags }
}

// ユーザータグ
export function useUserTags(userId: string | undefined) {
  const [tags, setTags] = useState<UserTag[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTags = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('user_tags')
      .select('*')
      .eq('user_id', userId)
      .order('tag_name')
    if (data) setTags(data)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchTags() }, [fetchTags])

  const addTag = useCallback(async (tagName: string) => {
    if (!userId) return
    const trimmed = tagName.trim().toLowerCase()
    if (!trimmed) return
    const { error } = await supabase.from('user_tags').insert({
      user_id: userId,
      tag_name: trimmed,
    })
    if (!error) fetchTags()
    return { error }
  }, [userId, fetchTags])

  const removeTag = useCallback(async (tagId: string) => {
    const { error } = await supabase.from('user_tags').delete().eq('id', tagId)
    if (!error) fetchTags()
    return { error }
  }, [fetchTags])

  return { tags, loading, addTag, removeTag }
}

// 人気タグ一覧
export function usePopularTags() {
  const [tags, setTags] = useState<{ tag_name: string; count: number }[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('song_tags')
        .select('tag_name')
      if (data) {
        const counts = new Map<string, number>()
        for (const { tag_name } of data) {
          counts.set(tag_name, (counts.get(tag_name) || 0) + 1)
        }
        const sorted = Array.from(counts.entries())
          .map(([tag_name, count]) => ({ tag_name, count }))
          .sort((a, b) => b.count - a.count)
        setTags(sorted)
      }
    }
    fetch()
  }, [])

  return { tags }
}
