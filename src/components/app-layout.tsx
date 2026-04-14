"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Guitar, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"

type TabId = "home" | "repertoire" | "search" | "profile"

interface AppLayoutProps {
  children?: React.ReactNode
  activeTab?: TabId
}

const tabs = [
  { id: "home" as TabId, label: "ホーム", icon: Home, href: "/" },
  { id: "repertoire" as TabId, label: "レパートリー", icon: Guitar, href: "/repertoire" },
  { id: "search" as TabId, label: "曲を探す", icon: Search, href: "/songs" },
  { id: "profile" as TabId, label: "プロフィール", icon: User, href: "/profile" },
]

export function AppLayout({ children, activeTab = "home" }: AppLayoutProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { ensureProfile } = useProfile(user?.id)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Ensure profile exists on first load
  useEffect(() => {
    if (user) {
      ensureProfile(user)
    }
  }, [user, ensureProfile])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 flex h-14 items-center border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <img src="/icon-192.png" alt="Bluegrass GONG" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-semibold text-foreground">Bluegrass GONG</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-16 items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "fill-primary stroke-primary" : "fill-none"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
