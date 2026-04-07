"use client"

import Link from "next/link"
import { ChevronRight, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRepertoire } from "@/hooks/use-repertoire"
import { useMyRooms } from "@/hooks/use-room"

export function HomeScreen() {
  const { user } = useAuth()
  const { repertoire } = useRepertoire(user?.id)
  const { rooms: myRooms } = useMyRooms(user?.id)

  const repertoireCount = repertoire.length

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          ブルーグラスジャムセッションを見つけよう
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <ActionCard
          icon="🎸"
          title="マイレパートリー"
          subtitle={`${repertoireCount}曲登録済み`}
          href="/repertoire"
        />
        <ActionCard
          icon="🚪"
          title="ルームに参加"
          subtitle="コードを入力"
          href="/room/join"
        />
        <ActionCard
          icon="＋"
          title="ルームを作成"
          subtitle="新しいセッションを始める"
          variant="primary"
          href="/room/create"
        />
      </div>

      {myRooms.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">参加中のルーム</h2>
          <div className="flex flex-col gap-2">
            {myRooms.map((rm) => {
              const room = (rm as any).rooms
              const expiresAt = room.expires_at ? new Date(room.expires_at) : null
              const hoursLeft = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))) : null
              return (
                <Link key={rm.id} href={`/room/${room.id}`}>
                  <Card className="cursor-pointer rounded-lg border-0 bg-card p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-primary">{room.code}</span>
                        {room.name && <span className="text-sm text-foreground">{room.name}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {hoursLeft !== null && (
                          <span className="inline-flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {hoursLeft}h
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface ActionCardProps {
  icon: string
  title: string
  subtitle: string
  variant?: "default" | "primary"
  href?: string
}

function ActionCard({ icon, title, subtitle, variant = "default", href }: ActionCardProps) {
  const isPrimary = variant === "primary"

  const content = (
    <Card
      className={`
        cursor-pointer transition-all duration-200
        hover:shadow-md active:scale-[0.98]
        rounded-lg p-4 shadow-sm border-0
        ${isPrimary
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-card text-card-foreground"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <div>
            <h2 className={`font-semibold text-base ${isPrimary ? "text-primary-foreground" : "text-foreground"}`}>
              {title}
            </h2>
            <p className={`text-sm ${isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {subtitle}
            </p>
          </div>
        </div>
        <ChevronRight className={`h-5 w-5 ${isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"}`} />
      </div>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}
