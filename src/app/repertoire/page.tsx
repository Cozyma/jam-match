import { AppLayout } from "@/components/app-layout"
import { SongSearchScreen } from "@/components/song-search-screen"

export default function RepertoirePage() {
  return (
    <AppLayout activeTab="repertoire">
      <SongSearchScreen />
    </AppLayout>
  )
}
