"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRepertoire } from "@/hooks/use-repertoire"

export function HomeScreen() {
  const { user } = useAuth()
  const { repertoire } = useRepertoire(user?.id)

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
