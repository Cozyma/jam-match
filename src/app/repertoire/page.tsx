"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { SongSearchScreen } from "@/components/song-search-screen"
import { MyRepertoireScreen } from "@/components/my-repertoire-screen"
import { cn } from "@/lib/utils"

type Tab = "my" | "search"

export default function RepertoirePage() {
  const [tab, setTab] = useState<Tab>("my")

  return (
    <AppLayout activeTab="repertoire">
      {/* Tab Switcher */}
      <div className="shrink-0 flex border-b border-border bg-card">
        <button
          onClick={() => setTab("my")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            tab === "my"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          マイレパートリー
        </button>
        <button
          onClick={() => setTab("search")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            tab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          曲を探す
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {tab === "my" ? <MyRepertoireScreen /> : <SongSearchScreen />}
      </div>
    </AppLayout>
  )
}
