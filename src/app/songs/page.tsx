"use client"

import { AppLayout } from "@/components/app-layout"
import { SongSearchScreen } from "@/components/song-search-screen"

export default function SongsPage() {
  return (
    <AppLayout activeTab="search">
      <SongSearchScreen />
    </AppLayout>
  )
}
